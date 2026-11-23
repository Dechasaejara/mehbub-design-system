import fs from "node:fs";
import path from "node:path";
const name = process.argv[2];
if (!name || !/^[A-Z][A-Za-z0-9]*$/.test(name)) { console.error("Usage: pnpm generate:component Button"); process.exit(1); }
const dir = path.resolve("packages/react/src/components");
const target = path.join(dir, `${name}.tsx`);
if (fs.existsSync(target)) { console.error(`Refusing to overwrite ${target}`); process.exit(1); }
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(target, `import React from "react";\n\nexport type ${name}Props = React.HTMLAttributes<HTMLDivElement>;\n\nexport function ${name}({ children, ...props }: ${name}Props) {\n  return <div {...props}>{children}</div>;\n}\n`);
console.log(`Created ${target}. Export it from packages/react/src/index.ts when ready.`);
