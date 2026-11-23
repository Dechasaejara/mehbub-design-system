# Repository audit

Audit date: 2026-11-23

## Scope

Reviewed the root package and workspace configuration, package and app manifests, TypeScript configurations, package source and exports, helper scripts, lockfile importers, Changesets configuration, npm registry configuration, existing GitHub Actions, README and architecture documentation. Existing local edits to `.npmrc`, `apps/dashboard/package.json`, and `packages/react/package.json` were present before implementation and are treated as intended direction.

## Findings

### Architecture and dependencies

- The repository has nine packages (`tokens`, `themes`, `react`, `react-native`, `icons`, `utils`, `cli`, and two client brands), plus `dashboard` and Storybook docs apps.
- pnpm 9 workspace and Turborepo 2 are present. Package internals use `workspace:*` for themes/tokens dependencies.
- Scope drift exists: the working-tree edits select `@mehubub`, while the other manifests, source imports, docs, generators, lockfile and existing `.npmrc` configuration use `@agency`. This makes the dashboard imports/dependencies and package resolution inconsistent.
- React's working-tree manifest has no scripts or `exports`, omits CSS from its `files` allowlist, and omits its existing peer/runtime/dev dependencies. Its source imports `@dechasaejara/themes`.
- Most packages emit declarations through the shared TS config, but publishable package `files` allowlists are missing, and several packages have no typecheck/test/lint scripts. `@dechasaejara/cli` has a `bin` entry but no `exports` and no `files` allowlist.
- `@dechasaejara/themes` has a runtime dependency on `@dechasaejara/tokens` in its manifest, though the inspected theme source does not import tokens. This should be removed unless the implementation begins consuming tokens.
- Package versions are mostly `0.1.0`; React's local edit sets `1.0.0`, an unexplained release jump that would also conflict with existing lockfile state.

### Automation and delivery

- Root scripts exist for common Turbo commands, Changesets, and `doctor`, `init`, and `create-client`; component/theme/docs generators and package/workspace validators are absent.
- CI uses `--no-frozen-lockfile`, only runs build/test, and lacks explicit lint/typecheck/exports/report checks. Release workflow installs frozen, but triggers for pull requests as well as main pushes at the workflow level; its Changesets action is otherwise conditionally publishing only on main. The workflow currently grants write permissions to all jobs and has no protected environment approval gate.
- No independent docs deployment workflow exists. Existing deployment behavior does not explicitly address docs/playground/client deployment boundaries.
- `.npmrc` scope and auth configuration disagree with the uncommitted scope edit. Credentials are environment-based in the tracked version; no committed token was found in the reviewed config.

### Product and onboarding

- `scripts/init.mjs`, `doctor.mjs`, and two client scaffolding paths are present. Input validation and cross-platform execution could be improved; the CLI currently writes into a directory without validating slug/framework or guarding existing files.
- No `@mehbub/create-app` package exists; onboarding must not claim that `pnpm dlx @mehbub/create-app` works.
- Existing README/examples have inconsistent brand export names (`clientAlphaTheme` vs actual `ClientAlphaTheme`) and should be corrected.
- Theme contract currently covers colors, typography family and radii. Spacing, shadows, light/dark mode, component variants and brand-specific assets are not modeled consistently.
- Storybook is configured as a documentation app. No docs build/deployment action is present.

### Verification and security

- One React component test file exists; no broad test suite is evident.
- Existing `dist`, `.next`, and Turbo cache files are generated artifacts and do not prove the current working-tree manifests build correctly.
- Frozen-lockfile validation is currently expected to fail after the local manifest edits because lockfile importers retain `@agency` dependency names.
- Dashboard docs explicitly identify missing authentication, tenant isolation, audit logging, and persistence; it is a UI shell, not safe for real client data.
- GitHub Actions use major-version action tags and should retain least-privilege job permissions. Publishing requires repository/package access configuration that cannot be confirmed from this local checkout.

## Planned implementation direction

Honor the current local scope change by consistently using `@dechasaejara/*` for publishable packages and registry setup, restore React's missing package metadata and scripts, update lockfile via pnpm when possible, add validation/generation helpers, harden CI/release job boundaries, document actual onboarding and remaining GitHub-side configuration, then run the requested local verification. No production publish will be run.
