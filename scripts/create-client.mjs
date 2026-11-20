#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const read = name => {
  const arg = args.find(x => x.startsWith(`--${name}=`));
  return arg ? arg.split("=").slice(1).join("=") : undefined;
};
const slug = (read("name") || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
if (!slug) {
  console.error("Usage: node scripts/create-client.mjs --name=client-name [--preset=corporate]");
  process.exit(1);
}
const preset = read("preset") || "corporate";
const target = path.join(process.cwd(), "packages", `brand-${slug}`);
if (fs.existsSync(target)) {
  console.error(`Refusing to overwrite existing directory: ${target}`);
  process.exit(1);
}
const pascal = slug.split("-").map(s => s[0].toUpperCase() + s.slice(1)).join("");
const tokens = {
  name: pascal,
  colors: {
    primary: "#245B8F", onPrimary: "#FFFFFF", background: "#FFFFFF",
    surface: "#F5F7FA", text: "#142235", muted: "#64748B", border: "#DCE3EA"
  },
  typography: { fontFamily: "Inter, system-ui, sans-serif" },
  radius: { sm: "4px", md: "8px", lg: "12px", pill: "9999px" }
};
fs.mkdirSync(path.join(target, "src"), { recursive: true });
fs.writeFileSync(path.join(target, "brand.tokens.json"), JSON.stringify(tokens, null, 2));
fs.writeFileSync(path.join(target, "package.json"), JSON.stringify({
  name: `@agency/brand-${slug}`, version: "0.1.0", type: "module",
  main: "./dist/index.js", types: "./dist/index.d.ts",
  exports: { ".": { types: "./dist/index.d.ts", import: "./dist/index.js" }, "./native": { types: "./dist/native.d.ts", import: "./dist/native.js" } },
  scripts: { build: "tsc -p tsconfig.json" },
  dependencies: { "@agency/themes": "workspace:*" },
  devDependencies: { typescript: "^5.7.2" }
}, null, 2));
fs.writeFileSync(path.join(target, "tsconfig.json"), JSON.stringify({
  extends: "../../tsconfig.base.json",
  compilerOptions: { outDir: "dist", rootDir: "src" }, include: ["src"]
}, null, 2));
fs.writeFileSync(path.join(target, "src/index.ts"), `import type { AgencyTheme } from "@agency/themes";\n\nexport const Client${pascal}Theme: AgencyTheme = ${JSON.stringify(tokens, null, 2)};\n`);
fs.writeFileSync(path.join(target, "src/native.ts"), `export { Client${pascal}Theme as Client${pascal}NativeTheme } from "./index.js";\n`);
console.log(`Created ${path.relative(process.cwd(), target)} using preset "${preset}".`);
console.log("Review brand.tokens.json and ensure package exports match your platform's theme API before publishing.");
