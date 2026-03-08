// @libsql/client is imported dynamically to avoid bundling Node.js-only
// modules (node:stream, node:async_hooks) into the Cloudflare Worker.

type QueryRow = Record<string, unknown>;

interface DatabaseAdapter {
  execute: (sql: string, params?: unknown[]) => Promise<{
    rows: QueryRow[];
    rowsAffected: number;
  }>;
}

let db: DatabaseAdapter | null = null;
let dbPromise: Promise<DatabaseAdapter | null> | null = null;

export async function getDb(): Promise<DatabaseAdapter | null> {
  if (db) {
    return db;
  }

  if (!dbPromise) {
    dbPromise = createDefaultDb();
  }

  db = await dbPromise;
  return db;
}

export function setDb(database: DatabaseAdapter | null) {
  db = database;
  dbPromise = Promise.resolve(database);
}

async function createDefaultDb(): Promise<DatabaseAdapter | null> {
  // In production (Cloudflare Workers), always use D1 binding
  const cloudflareDb = await createCloudflareDb();
  if (cloudflareDb) {
    console.log('[db] Using Cloudflare D1 database');
    return cloudflareDb;
  }

  console.log('[db] Cloudflare D1 not available, trying local database...');

  // Local dev fallback — dynamically import @libsql/client via new Function
  // to completely hide it from static analysis by Next.js and esbuild
  if (typeof process === 'undefined') {
    console.log('[db] process is undefined, cannot use local database');
    return null;
  }

  try {
    const dynamicImport = new Function('specifier', 'return import(specifier)');
    const { createClient } = await dynamicImport('@libsql/client');

    const url = process.env.DATABASE_URL || 'file:local.db';
    const authToken = process.env.DATABASE_AUTH_TOKEN || undefined;
    console.log(`[db] Creating libsql client with url=${url}`);
    const client = createClient({ url, authToken });

    await applyMigrations(client, url);
    console.log('[db] Local database initialized successfully');

    return {
      async execute(sql: string, params: unknown[] = []) {
        const result = await client.execute({
          sql,
          args: params as any[],
        });

        return {
          rows: result.rows as QueryRow[],
          rowsAffected: Number(result.rowsAffected ?? 0),
        };
      },
    };
  } catch (err) {
    console.error('[db] Failed to initialize local database:', err);
    return null;
  }
}

async function createCloudflareDb(): Promise<DatabaseAdapter | null> {
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare');
    const context = await getCloudflareContext();
    const env = (context?.env || {}) as Record<string, any>;
    const d1 = env.DB;

    if (!d1) {
      console.log('[db] No D1 binding found in Cloudflare context');
      return null;
    }

    return {
      async execute(sql: string, params: unknown[] = []) {
        const statement = d1.prepare(sql).bind(...params);

        if (isReadQuery(sql)) {
          const result = await statement.all();
          return {
            rows: (result.results || []) as QueryRow[],
            rowsAffected: Number(result.meta?.changes ?? 0),
          };
        }

        const result = await statement.run();
        return {
          rows: [],
          rowsAffected: Number(result.meta?.changes ?? 0),
        };
      },
    };
  } catch {
    return null;
  }
}

async function applyMigrations(client: any, url: string) {
  if (!url.startsWith('file:')) {
    console.log(`[db] Skipping migrations for non-file database: ${url}`);
    return;
  }

  const fs = await import('node:fs/promises');
  const path = await import('node:path');

  console.log('[db] Applying migrations...');

  await client.execute(`
    CREATE TABLE IF NOT EXISTS _lanternell_migrations (
      name TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL
    )
  `);

  const migrationsDir = path.join(process.cwd(), 'migrations');
  let migrationFiles: string[];
  try {
    migrationFiles = (await fs.readdir(migrationsDir))
      .filter((file) => file.endsWith('.sql'))
      .sort();
    console.log(`[db] Found ${migrationFiles.length} migration files`);
  } catch (err) {
    console.error(`[db] Failed to read migrations directory: ${migrationsDir}`, err);
    return;
  }

  for (const file of migrationFiles) {
    const existing = await client.execute({
      sql: 'SELECT name FROM _lanternell_migrations WHERE name = ? LIMIT 1',
      args: [file],
    });

    if (existing.rows.length > 0) {
      continue;
    }

    const migrationSql = await fs.readFile(path.join(migrationsDir, file), 'utf8');
    const statements = splitSqlStatements(migrationSql);

    if (statements.length > 0) {
      await client.batch(statements, 'write');
    }

    await client.execute({
      sql: 'INSERT INTO _lanternell_migrations (name, applied_at) VALUES (?, ?)',
      args: [file, new Date().toISOString()],
    });
  }
}

function splitSqlStatements(sql: string) {
  return sql
    .split(/;\s*(?:\r?\n|$)/)
    .map((statement) => statement.replace(/^\s*--.*$/gm, '').trim())
    .filter(Boolean);
}

function isReadQuery(sql: string) {
  const normalized = sql.trim().toLowerCase();
  return (
    normalized.startsWith('select') ||
    normalized.startsWith('with') ||
    normalized.startsWith('pragma')
  );
}

// Type-safe query helper
export async function query<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = []
): Promise<T[]> {
  const database = await getDb();
  if (!database) {
    console.warn('Database not initialized, returning empty array');
    return [];
  }

  const result = await database.execute(sql, params);
  return result.rows as T[];
}

export async function queryOne<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = []
): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] || null;
}

export async function execute(
  sql: string,
  params: unknown[] = []
): Promise<{ rowsAffected: number }> {
  const database = await getDb();
  if (!database) {
    console.warn('Database not initialized, returning 0 rows affected');
    return { rowsAffected: 0 };
  }

  const result = await database.execute(sql, params);
  return { rowsAffected: result.rowsAffected };
}

// ID generation utilities
export function generateId(prefix: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  return `${prefix}_${timestamp}${random}`;
}

export function generateSessionToken(): string {
  const array = new Uint8Array(32);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

// Hash utilities
export async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Date utilities
export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

export function isExpired(date: Date): boolean {
  return date.getTime() < Date.now();
}

export function toISOString(date: Date): string {
  return date.toISOString();
}
