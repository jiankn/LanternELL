/**
 * build-cf.cjs — Build + Deploy for OpenNext on Cloudflare (Windows compatible).
 * 
 * Workaround: OpenNext on Windows fails to copy workerd-specific files
 * (web.js, web.mjs) for @libsql/client and @libsql/isomorphic-ws.
 * This script patches the missing files after build, then deploys.
 * 
 * Usage:
 *   node scripts/build-cf.cjs          # build + deploy
 *   node scripts/build-cf.cjs build    # build only
 *   node scripts/build-cf.cjs deploy   # deploy only (assumes build done)
 */
const { execSync } = require("child_process");
const { readFileSync, writeFileSync, existsSync, copyFileSync, renameSync, readdirSync, statSync } = require("fs");
const { join, dirname } = require("path");

function run(cmd) {
  console.log(">", cmd);
  execSync(cmd, { stdio: "inherit" });
}

function patchPkgJson(pkgPath) {
  if (!existsSync(pkgPath)) return;
  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
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
  }
}

function copyMissing(srcDir, destDir) {
  if (!existsSync(srcDir) || !existsSync(destDir)) return;
  for (const f of readdirSync(srcDir)) {
    const src = join(srcDir, f);
    const dest = join(destDir, f);
    if (statSync(src).isFile() && !existsSync(dest)) {
      copyFileSync(src, dest);
      console.log("copied", f, "->", destDir);
    }
  }
}

function fixWorkerNext() {
  const base = join(".worker-next", ".next", "standalone", "node_modules");

  // Copy missing files
  copyMissing(
    join("node_modules", "@libsql", "client", "lib-esm"),
    join(base, "@libsql", "client", "lib-esm")
  );
  copyMissing(
    join("node_modules", "@libsql", "isomorphic-ws"),
    join(base, "@libsql", "isomorphic-ws")
  );

  // Remove workerd conditions from package.json
  patchPkgJson(join(base, "@libsql", "client", "package.json"));
  patchPkgJson(join(base, "@libsql", "isomorphic-ws", "package.json"));
}

// Also patch source node_modules for opennextjs-cloudflare build
function patchSourcePkgs() {
  const pkgs = [
    join("node_modules", "@libsql", "client", "package.json"),
    join("node_modules", "@libsql", "isomorphic-ws", "package.json"),
  ];
  const backups = [];
  for (const p of pkgs) {
    if (!existsSync(p)) continue;
    const raw = readFileSync(p, "utf-8");
    backups.push({ path: p, raw });
    patchPkgJson(p);
  }
  return backups;
}

function restorePkgs(backups) {
  for (const { path: p, raw } of backups) writeFileSync(p, raw);
  if (backups.length) console.log("restored", backups.length, "source pkg(s)");
}

const mode = process.argv[2] || "all";

try {
  if (mode === "build" || mode === "all") {
    const backups = patchSourcePkgs();
    try {
      run("npx @opennextjs/cloudflare build --dangerouslyUseUnsupportedNextVersion");
      console.log("build done");
    } finally {
      restorePkgs(backups);
    }
  }

  if (mode === "deploy" || mode === "all") {
    fixWorkerNext();
    // Temporarily hide open-next.config.ts so wrangler doesn't re-trigger OpenNext build
    const cfgSrc = "open-next.config.ts";
    const cfgBak = "open-next.config.ts.bak";
    if (existsSync(cfgSrc)) renameSync(cfgSrc, cfgBak);
    try {
      run("npx wrangler deploy");
      console.log("deploy done");
    } finally {
      if (existsSync(cfgBak)) renameSync(cfgBak, cfgSrc);
    }
  }
} catch (e) {
  console.error("failed:", e.message);
  // Restore open-next.config.ts if it was renamed
  if (existsSync("open-next.config.ts.bak")) {
    renameSync("open-next.config.ts.bak", "open-next.config.ts");
  }
  process.exit(1);
}
