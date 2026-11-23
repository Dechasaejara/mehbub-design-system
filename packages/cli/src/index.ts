#!/usr/bin/env node
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";

const scope = "@dechasaejara";
const componentCatalog = ["Button", "Card", "Input", "Avatar", "Badge", "Tag", "InlineMessage", "Stack", "Inline"];
const argv = process.argv.slice(2);
const command = argv[0] ?? "help";
const positional = argv.slice(1).filter(value => !value.startsWith("--"));
const flags = new Map<string, string | true>();
for (let i = 1; i < argv.length; i++) {
  const arg = argv[i];
  if (!arg.startsWith("--")) continue;
  const [key, ...rest] = arg.slice(2).split("=");
  const value = rest.length ? rest.join("=") : argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : true;
  flags.set(key, value);
}
const flag = (key: string, fallback = "") => String(flags.get(key) ?? fallback);
const enabled = (key: string) => flags.has(key) && flags.get(key) !== "false";
const title = (slug: string) => slug.split(/[^a-z0-9]+/i).filter(Boolean).map(word => word[0].toUpperCase() + word.slice(1)).join("");
const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const exists = async (path: string) => access(path).then(() => true, () => false);

function help() {
  console.log(`Mehubub Design CLI\n\nCommands:\n  agency init [--framework next|react|expo] [--brand client-alpha] [--version 0.1.0] [--dry-run]\n  agency doctor                           Check integration and suggest fixes\n  agency components [--json]              List available components\n  agency add <component> [--out path]     Generate a usage example\n  agency create-client --name <slug> [--dir path] [--force]\n  agency --version\n\nExamples:\n  agency init --framework next --brand client-alpha\n  agency add Button --out src/components/BrandButton.example.tsx\n  agency doctor`);
}

function run(pm: string, args: string[], dryRun: boolean) {
  console.log(`$ ${pm} ${args.join(" ")}`);
  if (dryRun) return;
  const result = spawnSync(pm, args, { stdio: "inherit", shell: process.platform === "win32" });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${pm} exited with status ${result.status ?? "unknown"}.`);
}

async function init() {
  const framework = flag("framework", "next").toLowerCase();
  if (!["next", "react", "expo", "react-native"].includes(framework)) throw new Error("--framework must be next, react, expo, or react-native.");
  const brand = slugify(flag("brand", "client-alpha"));
  if (!brand) throw new Error("--brand must contain letters or numbers.");
  const version = flag("version", "0.1.0");
  const native = framework === "expo" || framework === "react-native";
  const packages = native ? [`${scope}/react-native`, `${scope}/brand-${brand}`] : [`${scope}/react`, `${scope}/brand-${brand}`];
  const root = process.cwd();
  const pm = await exists(join(root, "pnpm-lock.yaml")) ? "pnpm" : await exists(join(root, "yarn.lock")) ? "yarn" : "npm";
  const installArgs = pm === "pnpm" ? ["add", ...packages.map(name => `${name}@${version}`)] : pm === "yarn" ? ["add", ...packages.map(name => `${name}@${version}`)] : ["install", ...packages.map(name => `${name}@${version}`)];
  const dryRun = enabled("dry-run");
  run(pm, installArgs, dryRun);

  const themeName = `Client${title(brand)}${native ? "Native" : ""}Theme`;
  const uiPackage = native ? `${scope}/react-native` : `${scope}/react`;
  const provider = native
    ? `import React from "react";\nimport { AgencyNativeProvider } from "${uiPackage}";\nimport { ${themeName} } from "${scope}/brand-${brand}/native";\n\nexport function AppProviders({ children }: { children: React.ReactNode }) {\n  return <AgencyNativeProvider theme={${themeName}}>{children}</AgencyNativeProvider>;\n}\n`
    : `${framework === "next" ? '"use client";\n\n' : ""}import React from "react";\nimport { AgencyProvider } from "${uiPackage}";\nimport { ${themeName} } from "${scope}/brand-${brand}";\n\nexport function AppProviders({ children }: { children: React.ReactNode }) {\n  return <AgencyProvider theme={${themeName}}>{children}</AgencyProvider>;\n}\n`;
  const appDir = await exists(join(root, "src/app")) ? "src/app" : "app";
  const providerPath = framework === "next" ? join(appDir, "providers.tsx") : join("src", "theme", "AgencyProvider.tsx");
  const outputs: Array<[string, string]> = [[providerPath, provider]];
  if (!native) {
    const cssPath = framework === "next" ? join(appDir, "globals.css") : await exists(join(root, "src/index.css")) ? "src/index.css" : "src/mehubub.css";
    const cssImport = `@import "${scope}/react/styles.css";\n`;
    if (await exists(join(root, cssPath))) {
      const current = await readFile(join(root, cssPath), "utf8");
      if (!current.includes(cssImport.trim())) outputs.push([cssPath, `${current.trimEnd()}\n\n${cssImport}`]);
    } else outputs.push([cssPath, cssImport]);
  }
  const guide = `# Mehubub Design System setup\n\nFramework: ${framework}\nBrand package: \`${scope}/brand-${brand}\`\n\n1. ${framework === "next" ? `Import \"${scope}/react/styles.css\" in \`${appDir}/layout.tsx\` and wrap its children with \`<AppProviders>\`. The provider file is \`${providerPath}\`.` : `Wrap your application root with \`AppProviders\` from \`${providerPath}\`.`}\n2. Import components from \`${uiPackage}\`.\n3. Keep your GitHub Packages token in \`NODE_AUTH_TOKEN\`; do not commit it.\n`;
  outputs.push(["MEHUBUB-SETUP.md", guide]);
  for (const [relative, content] of outputs) {
    const target = resolve(root, relative);
    if (await exists(target)) {
      if (relative.endsWith(".css") && !dryRun) { await writeFile(target, content); console.log(`Updated ${relative}`); continue; }
      console.log(`Skipped existing file: ${relative}`);
      continue;
    }
    if (!dryRun) { await mkdir(dirname(target), { recursive: true }); await writeFile(target, content); }
    console.log(`${dryRun ? "Would create" : "Created"} ${relative}`);
  }
  console.log(dryRun ? "Dry run complete. Remove --dry-run to apply." : "Setup complete. Follow MEHUBUB-SETUP.md to connect the provider.");
}

async function doctor() {
  const root = process.cwd();
  const problems: string[] = [];
  let pkg: Record<string, any> = {};
  try { pkg = JSON.parse(await readFile(join(root, "package.json"), "utf8")); } catch { problems.push("No readable package.json found. Run this from the project root."); }
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  const names = Object.keys(deps ?? {});
  const web = names.includes(`${scope}/react`);
  const native = names.includes(`${scope}/react-native`);
  if (!web && !native) problems.push(`Install ${scope}/react or ${scope}/react-native with agency init.`);
  if (web) {
    const cssFiles = ["src/index.css", "src/app/globals.css", "app/globals.css", "src/mehubub.css"];
    let found = false;
    for (const file of cssFiles) if (await exists(join(root, file)) && (await readFile(join(root, file), "utf8")).includes(`${scope}/react/styles.css`)) found = true;
    if (!found) problems.push(`Import ${scope}/react/styles.css in your global stylesheet.`);
  }
  if (!await exists(join(root, ".npmrc"))) problems.push("No .npmrc found. Configure the @dechasaejara GitHub Packages registry.");
  if (!process.env.NODE_AUTH_TOKEN) problems.push("NODE_AUTH_TOKEN is not set in this shell (needed for private packages/CI).");
  if (problems.length) { console.log(`Found ${problems.length} setup item${problems.length === 1 ? "" : "s"}:`); problems.forEach((problem, i) => console.log(`  ${i + 1}. ${problem}`)); process.exitCode = 1; }
  else console.log("All integration checks passed.");
}

async function addComponent() {
  const rawName = positional[0];
  const component = componentCatalog.find(name => name.toLowerCase() === rawName?.toLowerCase());
  if (!component) throw new Error(`Choose a component: ${componentCatalog.join(", ")}.`);
  const output = resolve(process.cwd(), flag("out", `src/components/${component}.example.tsx`));
  if (await exists(output) && !enabled("force")) throw new Error(`${output} already exists. Choose --out or pass --force to replace it.`);
  const examples: Record<string, string> = {
    Button: '<Button variant="primary">Save changes</Button>',
    Card: '<Card><h2>Account details</h2><p>Manage your profile.</p></Card>',
    Input: '<Input id="email" label="Email address" type="email" autoComplete="email" />',
    Avatar: '<Avatar name="Amina Yusuf" />',
    Badge: '<Badge value={3} tone="info" />',
    Tag: '<Tag tone="green">Active</Tag>',
    InlineMessage: '<InlineMessage title="Changes saved" tone="success">Your profile is up to date.</InlineMessage>',
    Stack: '<Stack gap={4}><h2>Section title</h2><p>Related content.</p></Stack>',
    Inline: '<Inline gap={2}><Button>Cancel</Button><Button variant="primary">Save</Button></Inline>',
  };
  const snippet = `import { ${component} } from "${scope}/react";\n\nexport function Example() {\n  return ${examples[component]};\n}\n`;
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, snippet);
  console.log(`Created ${output}`);
}

async function createClient() {
  const name = slugify(flag("name", positional[0] ?? ""));
  if (!name) throw new Error("Usage: agency create-client --name client-name [--dir packages] [--force]");
  const target = resolve(process.cwd(), flag("dir", "packages"), `brand-${name}`);
  if (await exists(target) && !enabled("force")) throw new Error(`Refusing to overwrite ${target}; pass --force to replace files.`);
  const pascal = title(name);
  const tokens = { name: pascal, colors: { primary: "#245B8F", onPrimary: "#FFFFFF", background: "#FFFFFF", surface: "#F5F7FA", text: "#142235", muted: "#64748B", border: "#DCE3EA" }, typography: { fontFamily: "Inter, system-ui, sans-serif" }, radius: { sm: "4px", md: "8px", lg: "12px", pill: "9999px" } };
  const files: Array<[string, string]> = [["brand.tokens.json", JSON.stringify(tokens, null, 2) + "\n"], ["package.json", JSON.stringify({ name: `${scope}/brand-${name}`, version: "0.1.0", type: "module", main: "./dist/index.js", types: "./dist/index.d.ts", exports: { ".": { types: "./dist/index.d.ts", import: "./dist/index.js" }, "./native": { types: "./dist/native.d.ts", import: "./dist/native.js" } }, scripts: { build: "tsc -p tsconfig.json", typecheck: "tsc -p tsconfig.json --noEmit" }, dependencies: { "@dechasaejara/themes": "workspace:*" }, devDependencies: { typescript: "^5.7.2" }, publishConfig: { registry: "https://npm.pkg.github.com" } }, null, 2) + "\n"], ["tsconfig.json", JSON.stringify({ extends: "../../tsconfig.base.json", compilerOptions: { outDir: "dist", rootDir: "src" }, include: ["src"] }, null, 2) + "\n"], ["src/index.ts", `import type { AgencyTheme } from "${scope}/themes";\n\nexport const Client${pascal}Theme: AgencyTheme = ${JSON.stringify(tokens, null, 2)};\n`], ["src/native.ts", `export { Client${pascal}Theme as Client${pascal}NativeTheme } from "./index.js";\n`]];
  for (const [relative, content] of files) { const path = join(target, relative); await mkdir(dirname(path), { recursive: true }); await writeFile(path, content); }
  console.log(`Created ${target}. Add the package to pnpm-workspace.yaml, then run pnpm install and build.`);
}

try {
  if (command === "--version" || command === "-v") console.log("0.1.0");
  else if (command === "help" || command === "--help" || command === "-h") help();
  else if (command === "init") await init();
  else if (command === "doctor") await doctor();
  else if (command === "components") {
    if (enabled("json")) console.log(JSON.stringify(componentCatalog, null, 2));
    else console.log(`Available components:\n${componentCatalog.map(name => `  ${name}`).join("\n")}\n\nGenerate an example with: agency add <component>`);
  } else if (command === "add") await addComponent();
  else if (command === "create-client") await createClient();
  else throw new Error(`Unknown command "${command}". Run agency --help for usage.`);
} catch (error) {
  console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
