import fs from "node:fs";
import path from "node:path";
const slug = (process.argv[2] ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
if (!slug) { console.error("Usage: pnpm generate:theme brand-name"); process.exit(1); }
const target = path.resolve("packages", `brand-${slug}`);
if (fs.existsSync(target)) { console.error(`Refusing to overwrite ${target}`); process.exit(1); }
fs.mkdirSync(target, { recursive: false });
fs.writeFileSync(path.join(target, "brand.tokens.json"), JSON.stringify({ name: slug, colors: { primary: "#245B8F", onPrimary: "#FFFFFF", background: "#FFFFFF", surface: "#F5F7FA", text: "#142235", muted: "#64748B", border: "#DCE3EA" }, typography: { fontFamily: "Inter, system-ui, sans-serif" }, radius: { sm: "4px", md: "8px", lg: "12px", pill: "9999px" } }, null, 2) + "\n");
fs.writeFileSync(path.join(target, "README.md"), `# ${slug} brand tokens\n\nEdit brand.tokens.json, create a package manifest and theme entry point, then run pnpm install.\n`);
console.log(`Created ${target}. Register the new theme package before importing it.`);
