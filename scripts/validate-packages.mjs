import fs from "node:fs";
import path from "node:path";
let failures = 0;
for (const dir of fs.readdirSync("packages", { withFileTypes: true }).filter((entry) => entry.isDirectory())) {
  const root = path.join("packages", dir.name);
  const file = path.join(root, "package.json");
  if (!fs.existsSync(file)) continue;
  const pkg = JSON.parse(fs.readFileSync(file, "utf8"));
  if (pkg.private) continue;
  if (!pkg.exports || !pkg.files?.length || !pkg.scripts?.build) { console.error(`Invalid publish metadata: ${pkg.name}`); failures++; continue; }
  for (const [key, value] of Object.entries(pkg.exports)) {
    for (const target of typeof value === "string" ? [value] : Object.values(value)) {
      if (typeof target === "string" && !fs.existsSync(path.join(root, target))) { console.error(`${pkg.name} export ${key} points to missing ${target}`); failures++; }
    }
  }
}
if (failures) process.exit(1);
console.log("All publishable package exports resolve to files.");
