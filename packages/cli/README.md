# Mehubub Design CLI

Install the CLI from GitHub Packages and run it with `pnpm exec agency` (or `npx agency` when your registry setup supports it). The package scope follows the GitHub owner, `@dechasaejara`; Mehubub is the product name.

```sh
pnpm add -D @dechasaejara/cli
pnpm exec agency --help
```

## Workflows

### Integrate a project

Run from the root of a React, Next.js, Expo, or React Native app. `init` detects the framework, brand dependency, and package manager. It installs missing packages, configures GitHub Packages in `.npmrc`, creates the provider, imports global CSS in the right place, and wires `AppProviders` into a standard Next.js App Router root layout. It preserves provider files and reports when a nonstandard layout needs manual attention.

```sh
agency init --brand client-alpha --dry-run
agency init --framework next --brand client-alpha --version 0.1.1
agency init --framework expo --brand client-alpha
```

For private GitHub Packages, provide `NODE_AUTH_TOKEN` in the shell/CI environment. The CLI can also read that variable from the app's `.env.local` or `.env` for the install subprocess without printing it. Never commit the token.

Use `--version <semver>` to upgrade already-installed packages. Use `--skip-install` when packages are managed separately, or `--dry-run` to preview package and file changes.

### Diagnose integration

```sh
agency doctor
```

Checks installed UI packages, the global stylesheet import, registry configuration, and whether the registry token is available to the current process.

### Find and add components

```sh
agency components
agency components --json
agency add Button
agency add Input --out src/components/EmailField.example.tsx
```

The `add` command writes a small component usage example. It refuses to replace an existing file unless `--force` is passed.

### Scaffold a brand package

```sh
agency create-client --name client-greenfield
agency create-client --name client-greenfield --dir packages --force
```

The scaffold includes semantic tokens, TypeScript exports, and package metadata. In a monorepo, add its folder to `pnpm-workspace.yaml`, then run `pnpm install` and build it before publishing.

## Command reference

| Command | Purpose |
| --- | --- |
| `agency init` | Install integration packages and create provider/style setup files |
| `agency doctor` | Report common setup issues |
| `agency components` | List supported React components |
| `agency add <component>` | Write an import and usage example |
| `agency create-client --name <slug>` | Create a client brand package scaffold |

All commands support `agency --help`; the published CLI version is available with `agency --version`.
