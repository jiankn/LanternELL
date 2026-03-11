const { execSync } = require('child_process');

try {
    const listJsonStr = execSync('npx wrangler r2 object list lanternell-files-prod --prefix="samples/"', {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe']
    });
    console.log(listJsonStr);
} catch (e) {
    if (e.stdout) console.log(e.stdout.toString());
    if (e.stderr) console.error(e.stderr.toString());
}
