#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { spawnSync } from "node:child_process";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q, fallback = "") => new Promise(resolve => rl.question(`${q}${fallback ? ` [${fallback}]` : ""}: `, a => resolve(a.trim() || fallback)));
const pascal = value => value.split(/[^a-zA-Z0-9]+/).filter(Boolean).map(s => s[0].toUpperCase() + s.slice(1)).join("");
const safeSlug = value => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const writeSafe = (file, content) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const target = fs.existsSync(file) ? `${file}.agency-example` : file;
  fs.writeFileSync(target, content);
  console.log(`  created ${path.relative(process.cwd(), target)}`);
};
const run = (cmd, args) => {
  console.log(`\n> ${cmd} ${args.join(" ")}`);
  const result = spawnSync(cmd, args, { stdio: "inherit", shell: process.platform === "win32" });
  if (result.status !== 0) throw new Error(`${cmd} failed. Install packages manually if needed.`);
};
const root = process.cwd();
const packageFile = path.join(root, "package.json");
if (!fs.existsSync(packageFile)) {
  console.error("No package.json found. Run this from the root of your React/Next.js/Expo project.");
  process.exit(1);
}
let pkg = JSON.parse(fs.readFileSync(packageFile, "utf8"));

try {
  console.log("\nAgency Design Platform â€” project initializer\n");
  const framework = (await ask("Framework (react / next / expo)", "next")).toLowerCase();
  if (!["react", "next", "expo", "react-native"].includes(framework)) throw new Error("Choose react, next, expo, or react-native.");
  const client = safeSlug(await ask("Client brand slug (e.g. client-alpha)", "client-alpha"));
  const version = await ask("Package version (semver or latest)", "latest");
  const scope = await ask("Package scope", "@dechasaejara");
  const brandPackage = `${scope}/brand-${client}`;
  const web = framework === "react" || framework === "next";
  const native = !web;
  const packageNames = web ? [`${scope}/react`, `${scope}/themes`, brandPackage] : [`${scope}/react-native`, `${scope}/themes`, brandPackage];
  const packageSpec = packageNames.map(name => `${name}@${version}`);

  const manager = fs.existsSync(path.join(root, "pnpm-lock.yaml")) ? "pnpm"
    : fs.existsSync(path.join(root, "yarn.lock")) ? "yarn" : "npm";
  const installArgs = manager === "yarn" ? ["add", ...packageSpec] : ["install", ...packageSpec];
  run(manager, installArgs);

  const themeName = `Client${pascal(client)}${native ? "Native" : ""}Theme`;
  const providerName = native ? "AgencyNativeProvider" : "AgencyProvider";
  const packageName = native ? `${scope}/react-native` : `${scope}/react`;
  const providerDir = path.join(root, "src", "theme");
  const providerPath = path.join(providerDir, "AgencyProvider.tsx");

  const clientDirective = framework === "next" ? '"use client";\n\n' : "";
  const providerCode = native
    ? `${clientDirective}import React from "react";\nimport { AgencyNativeProvider } from "${packageName}";\nimport { ${themeName} } from "${brandPackage}/native";\n\nexport function AppProviders({ children }: { children: React.ReactNode }) {\n  return <AgencyNativeProvider theme={${themeName}}>{children}</AgencyNativeProvider>;\n}\n`
    : `${clientDirective}import React from "react";\nimport { AgencyProvider } from "${packageName}";\nimport { ${themeName} } from "${brandPackage}";\n\nexport function AppProviders({ children }: { children: React.ReactNode }) {\n  return <AgencyProvider theme={${themeName}}>{children}</AgencyProvider>;\n}\n`;
  writeSafe(providerPath, providerCode);

  let guide = `# Agency Design System Integration\n\nFramework: **${framework}**  \nBrand package: \`${brandPackage}\`  \nProvider file: \`src/theme/AgencyProvider.tsx\`\n\n## Next steps\n\n`;
  if (framework === "next") {
    const appDir = fs.existsSync(path.join(root, "src/app")) ? "src/app" : "app";
    guide += `1. Import \`@${scope.replace(/^@/, "")}/react/styles.css\` (normally \`@dechasaejara/react/styles.css\`) in \`${appDir}/layout.tsx\`.\n2. Import \`AppProviders\` from \`@/theme/AgencyProvider\` (adjust the path alias if needed).\n3. Wrap the layout's \`{children}\` with \`<AppProviders>{children}</AppProviders>\`.\n4. Keep the root layout as a Server Component; the generated provider module should be marked \`\"use client\";\` if required by your React/Next.js version. Add that directive at the top of the provider file.\n`;
  } else if (framework === "react") {
    guide += "1. Import `@dechasaejara/react/styles.css` once in your application entry file.\n2. Wrap your root component with `AppProviders` from `src/theme/AgencyProvider.tsx`.\n";
  } else {
    guide += "1. Wrap your Expo root component (often `App.tsx` or the root layout) with `AppProviders`.\n2. Use components from `@dechasaejara/react-native`; do not import the web CSS package.\n";
  }
  guide += `\n## Example component imports\n\n${native ? `\`\`\`tsx\nimport { Button, Card, Input } from "${scope}/react-native";\n\`\`\`` : `\`\`\`tsx\nimport { Button, Card, Input } from "${scope}/react";\n\`\`\``}\n\n## Notes\n- Existing files are never overwritten; review any \`.agency-example\` files.\n- Verify the exported theme name in your installed brand package.\n- Keep \`NODE_AUTH_TOKEN\` in environment/CI secrets, never in Git.\n`;
  writeSafe(path.join(root, "AGENCY-DESIGN-SYSTEM.md"), guide);

  if (web) {
    const cssLine = `@import "${scope}/react/styles.css";\n`;
    const cssTarget = fs.existsSync(path.join(root, "src", "index.css")) ? path.join(root, "src", "index.css")
      : fs.existsSync(path.join(root, "src", "app", "globals.css")) ? path.join(root, "src", "app", "globals.css")
      : path.join(root, "src", "agency-design-system.css");
    if (!fs.existsSync(cssTarget)) writeSafe(cssTarget, cssLine);
    else console.log(`  note: add ${cssLine.trim()} to ${path.relative(root, cssTarget)}`);
  }
  console.log("\nInitialization files generated. Follow AGENCY-DESIGN-SYSTEM.md to connect the provider to your app root.");
} catch (error) {
  console.error(`\nInitialization stopped: ${error.message}`);
  process.exitCode = 1;
} finally {
  rl.close();
}
