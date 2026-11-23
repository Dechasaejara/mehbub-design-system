import fs from "node:fs";
import path from "node:path";
const packages = [];
for (const dir of fs.readdirSync("packages", { withFileTypes: true }).filter((entry) => entry.isDirectory())) {
  const file = path.join("packages", dir.name, "package.json");
  if (!fs.existsSync(file)) continue;
  const pkg = JSON.parse(fs.readFileSync(file, "utf8"));
  packages.push({ name: pkg.name, files: pkg.files ?? [], scripts: Object.keys(pkg.scripts ?? {}) });
}
const report = { generatedAt: new Date().toISOString(), packages, docsBuilt: fs.existsSync("apps/docs/storybook-static/index.html") };
fs.mkdirSync("artifacts", { recursive: true });
fs.writeFileSync("artifacts/build-report.json", JSON.stringify(report, null, 2) + "\n");
console.log("Wrote artifacts/build-report.json");
