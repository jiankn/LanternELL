import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@libsql/client';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const db = createClient({ url: 'file:local.db' });

async function main() {
    console.log('Applying seed_products.sql...');
    const seedSql = fs.readFileSync(path.join(ROOT, 'migrations', 'seed_products.sql'), 'utf-8');

    // Simple split by semicolon. (Warning: fails if semicolon inside strings!)
    const statements = seedSql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);

    let success = 0;
    for (const stmt of statements) {
        try {
            await db.execute(stmt);
            success++;
        } catch (e) {
            console.error('Error executing statement:', stmt.substring(0, 50) + '...', e.message);
        }
    }
    console.log(`Successfully executed ${success}/${statements.length} statements.`);
}

main().catch(console.error);
