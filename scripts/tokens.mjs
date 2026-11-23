#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const mode = process.argv[2] ?? "build";
const brands = fs.readdirSync(path.join(root, "packages"), { withFileTypes: true })
  .filter(entry => entry.isDirectory() && entry.name.startsWith("brand-"))
  .map(entry => path.join(root, "packages", entry.name, "brand.tokens.json"))
  .filter(file => fs.existsSync(file));
const requiredColors = ["primary", "onPrimary", "background", "surface", "text", "muted", "border"];
const hex = /^#[\da-f]{6}$/i;
const issues = [];

function record(value) { return value !== null && typeof value === "object" && !Array.isArray(value); }
function requireRecord(value, label, file) {
  if (!record(value)) { issues.push(`${file}: ${label} must be an object`); return false; }
  return true;
}
function requireString(value, label, file) {
  if (typeof value !== "string" || !value.trim()) issues.push(`${file}: ${label} must be a non-empty string`);
}
function validateTokens(file) {
  let data;
  try { data = JSON.parse(fs.readFileSync(file, "utf8")); }
  catch (error) { issues.push(`${path.relative(root, file)}: invalid JSON (${error.message})`); return null; }
  const relative = path.relative(root, file);
  const rootKeys = ["name", "colors", "modes", "typography", "spacing", "radius", "shadows", "components"];
  for (const key of Object.keys(data)) if (!rootKeys.includes(key)) issues.push(`${relative}: unsupported top-level property ${key}`);
  requireString(data.name, "name", relative);
  if (requireRecord(data.colors, "colors", relative)) {
    for (const key of requiredColors) if (!(key in data.colors)) issues.push(`${relative}: colors.${key} is required`);
    for (const key of Object.keys(data.colors)) if (![...requiredColors, "danger", "success"].includes(key)) issues.push(`${relative}: unsupported color role colors.${key}`);
    for (const [key, value] of Object.entries(data.colors)) if (typeof value !== "string" || !hex.test(value)) issues.push(`${relative}: colors.${key} must be a six-digit hex color`);
  }
  if (requireRecord(data.typography, "typography", relative)) requireString(data.typography.fontFamily, "typography.fontFamily", relative);
  if (requireRecord(data.radius, "radius", relative)) {
    for (const key of ["sm", "md", "lg", "pill"]) requireString(data.radius[key], `radius.${key}`, relative);
  }
  if (data.spacing !== undefined && requireRecord(data.spacing, "spacing", relative)) {
    for (const [key, value] of Object.entries(data.spacing)) if (!(typeof value === "number" && Number.isFinite(value) && value >= 0) && !(typeof value === "string" && value.trim())) issues.push(`${relative}: spacing.${key} must be a non-negative number or non-empty string`);
  }
  if (data.modes !== undefined && requireRecord(data.modes, "modes", relative)) {
    for (const [modeName, colors] of Object.entries(data.modes)) {
      if (!["light", "dark"].includes(modeName)) issues.push(`${relative}: unsupported color mode ${modeName}`);
      if (!requireRecord(colors, `modes.${modeName}`, relative)) continue;
      for (const [key, value] of Object.entries(colors)) if (!requiredColors.includes(key) && !["danger", "success"].includes(key)) issues.push(`${relative}: modes.${modeName}.${key} is not a supported color role`);
      for (const [key, value] of Object.entries(colors)) if (typeof value !== "string" || !hex.test(value)) issues.push(`${relative}: modes.${modeName}.${key} must be a six-digit hex color`);
    }
  }
  if (data.shadows !== undefined && requireRecord(data.shadows, "shadows", relative)) {
    for (const [name, shadow] of Object.entries(data.shadows)) {
      if (!requireRecord(shadow, `shadows.${name}`, relative)) continue;
      if (typeof shadow.color !== "string" || !hex.test(shadow.color)) issues.push(`${relative}: shadows.${name}.color must be a six-digit hex color`);
      for (const key of ["offsetX", "offsetY", "blur", "opacity"]) if (typeof shadow[key] !== "number" || !Number.isFinite(shadow[key])) issues.push(`${relative}: shadows.${name}.${key} must be a finite number`);
      if (shadow.spread !== undefined && (typeof shadow.spread !== "number" || !Number.isFinite(shadow.spread))) issues.push(`${relative}: shadows.${name}.spread must be a finite number`);
      if (typeof shadow.opacity === "number" && (shadow.opacity < 0 || shadow.opacity > 1)) issues.push(`${relative}: shadows.${name}.opacity must be between 0 and 1`);
    }
  }
  return issues.some(issue => issue.startsWith(`${relative}:`)) ? null : data;
}
function kebab(value) { return value.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`).replace(/[^a-zA-Z0-9-]+/g, "-").toLowerCase(); }
function flatten(value, prefix = [], out = {}) {
  for (const [key, child] of Object.entries(value)) {
    const next = [...prefix, kebab(key)];
    if (record(child)) flatten(child, next, out);
    else out[next.join("-")] = child;
  }
  return out;
}

const parsed = brands.map(file => [file, validateTokens(file)]);
if (!brands.length) issues.push("No packages/brand-*/brand.tokens.json files found.");
if (issues.length) {
  console.error(`Token validation failed (${issues.length} issue${issues.length === 1 ? "" : "s"}):`);
  for (const issue of issues) console.error(`  - ${issue}`);
  process.exit(1);
}
console.log(`Validated ${parsed.length} brand token file${parsed.length === 1 ? "" : "s"}.`);
if (mode === "validate" || mode === "--check") process.exit(0);
if (mode !== "build") { console.error("Usage: node scripts/tokens.mjs [validate|build]"); process.exit(1); }

for (const [file, tokens] of parsed) {
  const output = path.join(path.dirname(file), "generated");
  fs.mkdirSync(output, { recursive: true });
  const flat = flatten(tokens);
  const css = `:root {\n${Object.entries(flat).map(([key, value]) => `  --brand-${key}: ${typeof value === "number" ? value : String(value)};`).join("\n")}\n}\n`;
  const ts = `// Generated from ../brand.tokens.json. Do not edit by hand.\nexport const brandTokens = ${JSON.stringify(tokens, null, 2)} as const;\nexport type BrandTokens = typeof brandTokens;\n`;
  const native = `// Generated from ../brand.tokens.json. Do not edit by hand.\nexport const brandTokens = ${JSON.stringify(tokens, null, 2)} as const;\nexport const nativeColors = brandTokens.colors;\nexport const nativeSpacing = brandTokens.spacing ?? {};\nexport const nativeRadius = brandTokens.radius;\n`;
  fs.writeFileSync(path.join(output, "tokens.css"), css);
  fs.writeFileSync(path.join(output, "tokens.ts"), ts);
  fs.writeFileSync(path.join(output, "tokens.native.ts"), native);
  console.log(`Generated CSS, TypeScript, and React Native tokens in ${path.relative(root, output)}`);
}
