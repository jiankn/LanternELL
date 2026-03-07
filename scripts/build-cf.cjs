/**
 * build-cf.cjs — Build & Deploy LanternELL to Cloudflare Workers via OpenNext.
 * 
 * Patches @libsql workerd export conditions on Windows before build/deploy.
 */
const { execSync } = require("child_process");
const { readFileSync, writeFileSync, existsSync } = require("fs");
const { join } = require("path");

function run(cmd) {
  console.log(">", cmd);
  execSync(cmd, { stdio: "inherit" });
}

function patchWorkerdConditions(pkgPath) {
  if (!existsSync(pkgPath)) return null;
  const raw = readFileSync(pkgPath, "utf-8");
  const pkg = JSON.parse(raw);
  let changed = false;
  if (pkg.exports) {
    for (const v of Object.values(pkg.exports)) {
      if (v && typeof v === "object" && "workerd" in v) {
        delete v.workerd;
        changed = true;
      }
    }
  }
  if (changed) {
    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    console.log("patched", pkgPath);
    return raw;
  }
  return null;
}

const pkgPaths = [
  join("node_modules", "@libsql", "client", "package.json"),
  join("node_modules", "@libsql", "isomorphic-ws", "package.json"),
];

const backups = [];
for (const p of pkgPaths) {
  const original = patchWorkerdConditions(p);
  if (original) backups.push({ path: p, original });
}

try {
  // Build: next build + opennext bundle -> .open-next/
  run("npx @opennextjs/cloudflare build --dangerouslyUseUnsupportedNextVersion");
  console.log("build done\n");

  // Deploy: populate R2 cache + wrangler deploy
  // Use opennextjs-cloudflare deploy directly (not wrangler deploy which re-detects OpenNext)
  run("npx @opennextjs/cloudflare deploy");
  console.log("\ndeploy done!");
} catch (e) {
  console.error("failed:", e.message);
  process.exit(1);
} finally {
  for (const { path: p, original } of backups) writeFileSync(p, original);
  if (backups.length) console.log("restored", backups.length, "source pkg(s)");
}
