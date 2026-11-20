#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const checks = [];
const check = (label, ok, detail = "") => checks.push({ label, ok, detail });
const exists = p => fs.existsSync(path.join(root, p));

let pkg = {};
try { pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8")); }
catch { check("package.json", false, "Run from a project root containing package.json."); }

check("package.json", exists("package.json"));
check("Agency integration guide", exists("AGENCY-DESIGN-SYSTEM.md"), "Run agency:init to generate it.");
check("Theme provider", exists("src/theme/AgencyProvider.tsx") || exists("src/theme/AgencyProvider.tsx.agency-example"), "Expected src/theme/AgencyProvider.tsx.");
check("Registry config", exists(".npmrc"), "Private GitHub Packages usually needs .npmrc.");
check("Registry token", Boolean(process.env.NODE_AUTH_TOKEN), "If packages are private, set NODE_AUTH_TOKEN in your environment.");
const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
const agencyDeps = Object.keys(deps).filter(k => k.startsWith("@agency/"));
check("Agency packages installed", agencyDeps.length > 0, "No @agency/* dependencies found in package.json.");

const web = Boolean(deps["@agency/react"]);
const native = Boolean(deps["@agency/react-native"]);
if (web) {
  const css = ["src/index.css", "src/app/globals.css", "src/agency-design-system.css", "app/globals.css"].some(p => exists(p) && fs.readFileSync(path.join(root, p), "utf8").includes("@agency/react/styles.css"));
  check("Web CSS import", css, "Import @agency/react/styles.css in your global stylesheet.");
}
if (native) check("Native package detected", true, "@agency/react-native is installed.");

let failed = 0;
console.log("\nAgency Design System — diagnostics\n");
for (const item of checks) {
  console.log(`${item.ok ? "PASS" : "WARN"}  ${item.label}${item.detail ? ` — ${item.detail}` : ""}`);
  if (!item.ok) failed++;
}
console.log(`\n${checks.length - failed}/${checks.length} checks passed.`);
if (failed) process.exitCode = 1;
