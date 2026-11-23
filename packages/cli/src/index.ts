#!/usr/bin/env node
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";

const scope = "@dechasaejara";
const packageMetadata = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8")) as { version: string };
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
  console.log(`Mehubub Design CLI\n\nCommands:\n  agency init [--framework next|react|expo] [--brand client-alpha] [--version latest]\n              [--skip-install] [--dry-run]\n  agency doctor                           Check integration and suggest fixes\n  agency components [--json]              List available components\n  agency add <component> [--out path]     Generate a usage example\n  agency create-client --name <slug> [--dir path] [--force]\n  agency --version\n\nExamples:\n  agency init --brand client-alpha --dry-run\n  agency init --framework next --brand client-alpha --version 0.1.1\n  agency add Button --out src/components/BrandButton.example.tsx\n  agency doctor`);
}

function run(pm: string, args: string[], dryRun: boolean, env: NodeJS.ProcessEnv = process.env) {
  console.log(`$ ${pm} ${args.join(" ")}`);
  if (dryRun) return;
  const result = spawnSync(pm, args, { stdio: "inherit", shell: process.platform === "win32", env });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${pm} exited with status ${result.status ?? "unknown"}.`);
}

async function loadInstallEnvironment(root: string) {
  if (process.env.NODE_AUTH_TOKEN) return process.env;
  for (const file of [".env.local", ".env"]) {
    const path = join(root, file);
    if (!await exists(path)) continue;
    const contents = await readFile(path, "utf8");
    const match = contents.match(/^\s*(?:export\s+)?NODE_AUTH_TOKEN\s*=\s*(.*?)\s*$/m);
    if (!match) continue;
    const token = match[1].replace(/^(['"])(.*)\1$/, "$2");
    if (token && !token.startsWith("$")) {
      console.log(`Using NODE_AUTH_TOKEN from ${file} for package installation (value hidden).`);
      return { ...process.env, NODE_AUTH_TOKEN: token };
    }
  }
  return process.env;
}

function updateCssImport(css: string, importLine: string) {
  if (css.includes(importLine.trim())) return css;
  const imports = [...css.matchAll(/^\s*@import\s+[^;]+;\s*/gm)];
  const insertion = imports.length ? imports.at(-1)!.index! + imports.at(-1)![0].length : 0;
  return `${css.slice(0, insertion)}${importLine}${css.slice(insertion)}`;
}

function updateNextLayout(source: string) {
  if (source.includes("<AppProviders>") || source.includes("<AppProviders ")) return { source, changed: false, reason: "AppProviders is already connected" };
  const body = /(<body\b[^>]*>)([\s\S]*?)(<\/body>)/m.exec(source);
  if (body) {
    if (!body[2].includes("{children}")) return { source, changed: false, reason: "Could not find {children} inside the root body" };
    const wrapped = body[2].replace("{children}", "<AppProviders>{children}</AppProviders>");
    source = `${source.slice(0, body.index)}${body[1]}${wrapped}${body[3]}${source.slice(body.index + body[0].length)}`;
  } else if (source.includes("{children}")) source = source.replace("{children}", "<AppProviders>{children}</AppProviders>");
  else return { source, changed: false, reason: "Could not find a root {children} slot" };

  if (!source.includes('from "./providers"') && !source.includes("from './providers'")) {
    const importLines = [...source.matchAll(/^import .*?;\s*$/gm)];
    const insertion = importLines.length ? importLines.at(-1)!.index! + importLines.at(-1)![0].length : 0;
    source = `${source.slice(0, insertion)}import { AppProviders } from "./providers";\n${source.slice(insertion)}`;
  }
  return { source, changed: true, reason: "Connected AppProviders around the root children" };
}

async function initSmart() {
  const root = process.cwd();
  let pkg: Record<string, any>;
  try { pkg = JSON.parse(await readFile(join(root, "package.json"), "utf8")); }
  catch { throw new Error("Run `agency init` from your app root; no readable package.json was found."); }
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  const detected = deps.expo ? "expo" : deps["react-native"] ? "react-native" : deps.next ? "next" : "react";
  const framework = flag("framework", detected).toLowerCase();
  if (!["next", "react", "expo", "react-native"].includes(framework)) throw new Error("--framework must be next, react, expo, or react-native.");
  const currentBrand = Object.keys(deps).find(name => name.startsWith(`${scope}/brand-`));
  const brand = slugify(flag("brand", currentBrand?.slice(`${scope}/brand-`.length) ?? "client-alpha"));
  if (!brand) throw new Error("--brand must contain letters or numbers.");
  const version = flag("version", "latest");
  if (!/^(latest|\*|\^?\d+\.\d+\.\d+(?:-[a-z0-9.-]+)?)$/i.test(version)) throw new Error("--version must be latest or a semver version (optionally prefixed with ^).");
  const native = framework === "expo" || framework === "react-native";
  const packages = native ? [`${scope}/react-native`, `${scope}/brand-${brand}`] : [`${scope}/react`, `${scope}/brand-${brand}`];
  const declaredManager = String(pkg.packageManager ?? "").split("@")[0];
  const hasPnpm = await exists(join(root, "pnpm-lock.yaml"));
  const hasYarn = await exists(join(root, "yarn.lock"));
  const hasNpm = await exists(join(root, "package-lock.json"));
  const pm = declaredManager || (hasPnpm ? "pnpm" : hasYarn ? "yarn" : "npm");
  if (!["pnpm", "npm", "yarn"].includes(pm)) throw new Error(`Unsupported package manager declaration: ${pm}.`);
  if (hasPnpm && hasNpm) console.warn("Found both pnpm-lock.yaml and package-lock.json; using pnpm and leaving both lockfiles untouched except for pnpm's normal update.");
  const currentDeps = { ...pkg.dependencies, ...pkg.devDependencies };
  const packagesToInstall = packages.filter(name => {
    const existing = currentDeps[name];
    if (!existing) return true;
    return version !== "latest" && existing.replace(/^[~^]/, "") !== version;
  });
  const dryRun = enabled("dry-run");
  const npmrcPath = ".npmrc";
  const registryLine = `${scope}:registry=https://npm.pkg.github.com`;
  const authLine = "//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}";
  const npmrcExists = await exists(join(root, npmrcPath));
  const currentNpmrc = npmrcExists ? await readFile(join(root, npmrcPath), "utf8") : "";
  const additions = [!currentNpmrc.includes(registryLine) ? registryLine : "", !currentNpmrc.includes("//npm.pkg.github.com/:_authToken=") ? authLine : ""].filter(Boolean);
  const updatedNpmrc = additions.length ? `${currentNpmrc.trimEnd()}${currentNpmrc.trim() ? "\n" : ""}${additions.join("\n")}\n` : currentNpmrc;
  if (!dryRun && updatedNpmrc !== currentNpmrc) {
    await writeFile(join(root, npmrcPath), updatedNpmrc);
    console.log(`${npmrcExists ? "Updated" : "Created"} ${npmrcPath} before package installation`);
  }
  if (enabled("skip-install")) console.log("Skipping package installation (--skip-install).");
  else if (!packagesToInstall.length) console.log("Design-system packages are already declared at the requested version; skipping installation.");
  else {
    const specs = packagesToInstall.map(name => `${name}@${version}`);
    const installArgs = pm === "npm" ? ["install", ...specs] : ["add", ...specs];
    const env = await loadInstallEnvironment(root);
    if (!env.NODE_AUTH_TOKEN) console.warn("NODE_AUTH_TOKEN is not set. Private GitHub Packages installs need a token with read:packages.");
    run(pm, installArgs, dryRun, env);
  }

  const brandName = brand.replace(/^client-/, "");
  const themeName = `Client${title(brandName)}${native ? "Native" : ""}Theme`;
  const uiPackage = native ? `${scope}/react-native` : `${scope}/react`;
  const provider = native
    ? `import React from "react";\nimport { AgencyNativeProvider } from "${uiPackage}";\nimport { ${themeName} } from "${scope}/brand-${brand}/native";\n\nexport function AppProviders({ children }: { children: React.ReactNode }) {\n  return <AgencyNativeProvider theme={${themeName}}>{children}</AgencyNativeProvider>;\n}\n`
    : `${framework === "next" ? '"use client";\n\n' : ""}import React from "react";\nimport { AgencyProvider } from "${uiPackage}";\nimport { ${themeName} } from "${scope}/brand-${brand}";\n\nexport function AppProviders({ children }: { children: React.ReactNode }) {\n  return <AgencyProvider theme={${themeName}}>{children}</AgencyProvider>;\n}\n`;
  const appDir = await exists(join(root, "src/app")) ? "src/app" : "app";
  const providerPath = framework === "next" ? join(appDir, "providers.tsx") : join("src", "theme", "AgencyProvider.tsx");
  const outputs: Array<{ path: string; content: string; action: "create" | "update" | "preserve" }> = [];
  outputs.push({ path: npmrcPath, content: updatedNpmrc, action: updatedNpmrc === currentNpmrc ? "preserve" : npmrcExists ? "update" : "create" });
  outputs.push(await exists(join(root, providerPath))
    ? { path: providerPath, content: "", action: "preserve" }
    : { path: providerPath, content: provider, action: "create" });

  let layoutNotice = "";
  if (!native) {
    const cssPath = framework === "next" ? join(appDir, "globals.css") : await exists(join(root, "src/index.css")) ? "src/index.css" : "src/mehubub.css";
    const cssImport = `@import "${scope}/react/styles.css";\n`;
    if (await exists(join(root, cssPath))) {
      const current = await readFile(join(root, cssPath), "utf8");
      const updated = updateCssImport(current, cssImport);
      outputs.push({ path: cssPath, content: updated, action: updated === current ? "preserve" : "update" });
    } else outputs.push({ path: cssPath, content: cssImport, action: "create" });

    if (framework === "next") {
      const layoutPath = join(appDir, "layout.tsx");
      if (await exists(join(root, layoutPath))) {
        const current = await readFile(join(root, layoutPath), "utf8");
        const updated = updateNextLayout(current);
        layoutNotice = updated.reason;
        outputs.push({ path: layoutPath, content: updated.source, action: updated.changed ? "update" : "preserve" });
      } else layoutNotice = `No ${layoutPath} found; wrap the root layout children with AppProviders manually.`;
    }
  }

  const cssPath = framework === "next" ? join(appDir, "globals.css") : "global stylesheet";
  const guide = `# Mehubub Design System setup\n\nFramework: ${framework}\nBrand package: \`${scope}/brand-${brand}\`\n\nThe CLI connects \`AppProviders\` to the root layout when it finds a safe children slot. ${layoutNotice}\n\n- Provider: \`${providerPath}\`\n- Stylesheet: \`${cssPath}\`\n- UI package: \`${uiPackage}\`\n\nImport components from \`${uiPackage}\`. For fresh installs, set \`NODE_AUTH_TOKEN\` to a GitHub token with package read access. Never commit the token.\n`;
  const guidePath = "MEHUBUB-SETUP.md";
  outputs.push(await exists(join(root, guidePath))
    ? { path: guidePath, content: "", action: "preserve" }
    : { path: guidePath, content: guide, action: "create" });

  for (const item of outputs) {
    if (dryRun) console.log(item.action === "create" ? `Would create ${item.path}` : item.action === "update" ? `Would update ${item.path}` : `No change ${item.path}`);
    else if (item.action === "create" || item.action === "update") {
      const target = resolve(root, item.path);
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, item.content);
      console.log(`${item.action === "create" ? "Created" : "Updated"} ${item.path}`);
    } else console.log(`Preserved ${item.path}`);
  }
  if (layoutNotice.startsWith("Could not") || layoutNotice.startsWith("No app")) console.warn(layoutNotice);
  console.log(dryRun ? "Dry run complete. Remove --dry-run to apply." : "Setup complete. Your app is wired to the design system.");
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
    const appDir = await exists(join(root, "src/app")) ? "src/app" : "app";
    const cssFiles = ["src/index.css", "src/app/globals.css", "app/globals.css", "src/mehubub.css"];
    let found = false;
    for (const file of cssFiles) if (await exists(join(root, file)) && (await readFile(join(root, file), "utf8")).includes(`${scope}/react/styles.css`)) found = true;
    if (!found) problems.push(`Import ${scope}/react/styles.css in your global stylesheet.`);
    if (deps.next) {
      const provider = join(root, appDir, "providers.tsx");
      const layout = join(root, appDir, "layout.tsx");
      if (!await exists(provider)) problems.push(`Missing ${appDir}/providers.tsx. Run agency init to generate the theme provider.`);
      else if (!(await readFile(provider, "utf8")).includes("AgencyProvider")) problems.push(`${appDir}/providers.tsx does not appear to export the design-system provider.`);
      if (!await exists(layout) || !(await readFile(layout, "utf8")).includes("AppProviders")) problems.push(`Connect AppProviders in ${appDir}/layout.tsx.`);
    }
    const installedProvider = join(root, "node_modules", "@dechasaejara", "react", "dist", "provider.js");
    if (await exists(installedProvider) && (await readFile(installedProvider, "utf8")).includes("@mehubub/themes")) {
      problems.push(`Installed @dechasaejara/react contains an old @mehubub/themes import. Upgrade to a corrected package release with agency init --version <version>.`);
    }
  }
  if (!await exists(join(root, ".npmrc"))) problems.push("No .npmrc found. Run agency init to configure the @dechasaejara GitHub Packages registry.");
  else if (!(await readFile(join(root, ".npmrc"), "utf8")).includes(`${scope}:registry=https://npm.pkg.github.com`)) problems.push(`Add ${scope}:registry=https://npm.pkg.github.com to .npmrc.`);
  if (!(await loadInstallEnvironment(root)).NODE_AUTH_TOKEN) problems.push("NODE_AUTH_TOKEN is not set in the environment or .env.local/.env (needed for a fresh private package install).");
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
  const pascal = title(name.replace(/^client-/, ""));
  const tokens = { name: pascal, colors: { primary: "#245B8F", onPrimary: "#FFFFFF", background: "#FFFFFF", surface: "#F5F7FA", text: "#142235", muted: "#64748B", border: "#DCE3EA" }, typography: { fontFamily: "Inter, system-ui, sans-serif" }, radius: { sm: "4px", md: "8px", lg: "12px", pill: "9999px" } };
  const files: Array<[string, string]> = [["brand.tokens.json", JSON.stringify(tokens, null, 2) + "\n"], ["package.json", JSON.stringify({ name: `${scope}/brand-${name}`, version: "0.1.0", type: "module", main: "./dist/index.js", types: "./dist/index.d.ts", exports: { ".": { types: "./dist/index.d.ts", import: "./dist/index.js" }, "./native": { types: "./dist/native.d.ts", import: "./dist/native.js" } }, scripts: { build: "tsc -p tsconfig.json", typecheck: "tsc -p tsconfig.json --noEmit" }, dependencies: { "@dechasaejara/themes": "workspace:*" }, devDependencies: { typescript: "^5.7.2" }, publishConfig: { registry: "https://npm.pkg.github.com" } }, null, 2) + "\n"], ["tsconfig.json", JSON.stringify({ extends: "../../tsconfig.base.json", compilerOptions: { outDir: "dist", rootDir: "src" }, include: ["src"] }, null, 2) + "\n"], ["src/index.ts", `import type { AgencyTheme } from "${scope}/themes";\n\nexport const Client${pascal}Theme: AgencyTheme = ${JSON.stringify(tokens, null, 2)};\n`], ["src/native.ts", `export { Client${pascal}Theme as Client${pascal}NativeTheme } from "./index.js";\n`]];
  for (const [relative, content] of files) { const path = join(target, relative); await mkdir(dirname(path), { recursive: true }); await writeFile(path, content); }
  console.log(`Created ${target}. Add the package to pnpm-workspace.yaml, then run pnpm install and build.`);
}

try {
  if (command === "--version" || command === "-v") console.log(packageMetadata.version);
  else if (command === "help" || command === "--help" || command === "-h") help();
  else if (command === "init") await initSmart();
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
