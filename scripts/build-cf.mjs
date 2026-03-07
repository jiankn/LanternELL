/**
 * build-cf.mjs — Patches @libsql/client workerd export conditions
 * before OpenNext build, then restores them after.
 */
import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const PATCHES = [
  {
    name: '@libsql/client',
    pkgPath: join('node_modules', '@libsql', 'client', 'package.json'),
    condition: 'workerd',
  },
  {
    name: '@libsql/isomorphic-ws',
    pkgPath: join('node_modules', '@libsql', 'isomorphic-ws', 'package.json'),
    condition: 'workerd',
  },
];

const backups = new Map();

function patchPackages() {
  for (const { name, pkgPath, condition } of PATCHES) {
    if (!existsSync(pkgPath)) {
      console.log(`skip: ${name} not found`);
      continue;
    }
    const raw = readFileSync(pkgPath, 'utf-8');
    backups.set(pkgPath, raw);
    const pkg = JSON.parse(raw);
    let patched = false;
    if (pkg.exports) {
      for (const [key, val] of Object.entries(pkg.exports)) {
        if (val && typeof val === 'object' && condition in val) {
          delete val[condition];
          patched = true;
        }
      }
    }
    if (patched) {
      writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
      console.log(`patched ${name} — removed "${condition}" conditions`);
    }
  }
}

function restorePackages() {
  for (const [pkgPath, raw] of backups) {
    writeFileSync(pkgPath, raw);
  }
  if (backups.size > 0) console.log(`restored ${backups.size} package(s)`);
}

function run(cmd) {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

try {
  patchPackages();
  run('npx @opennextjs/cloudflare build');
  console.log('build complete');
} catch (err) {
  console.error('build failed:', err.message);
  process.exit(1);
} finally {
  restorePackages();
}
