import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';

const client = createClient({ url: 'file:local.db' });

const sql = readFileSync('migrations/seed_blog_posts.sql', 'utf8');
const statements = sql
  .split(/;\s*(?:\r?\n|$)/)
  .map(s => s.replace(/^\s*--.*$/gm, '').trim())
  .filter(s => s.length > 0 && !s.startsWith('--'));

console.log(`Found ${statements.length} INSERT statements`);

for (let i = 0; i < statements.length; i++) {
  try {
    await client.execute(statements[i]);
    console.log(`OK: statement ${i + 1}`);
  } catch (e) {
    console.error(`ERR statement ${i + 1}: ${e.message}`);
  }
}

const result = await client.execute("SELECT COUNT(*) as cnt FROM blog_posts WHERE status = 'published'");
console.log(`\nTotal published blog posts: ${result.rows[0].cnt}`);

const titles = await client.execute("SELECT title FROM blog_posts WHERE status = 'published' ORDER BY published_at DESC");
for (const row of titles.rows) {
  console.log(`  - ${row.title}`);
}
