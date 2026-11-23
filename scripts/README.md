# Agency Toolkit Scripts

## Deploy a design-system release

From a feature branch, run `pnpm run deploy:design-system`. The script stages only Changesets, packages, dashboard/docs app source, docs, README, and scripts; excludes `.turbo` logs and unrelated files; pushes the branch; creates and merges the code PR after checks; merges the Changesets release PR; and waits for package publishing to finish. It requires GitHub CLI (`winget install --id GitHub.cli --exact`, then `gh auth login`) and asks for `DEPLOY` before pushing. If GitHub pauses the publish job for the `package-release` environment, approve it in Actions when prompted. The script will not bypass that environment approval.


Drop the `scripts/` folder into the root of your agency design-platform monorepo.

These scripts help developers:
- initialize an existing React, Next.js, or Expo / React Native app;
- install the appropriate agency packages;
- generate a theme provider and integration notes;
- diagnose common integration problems;
- scaffold a new client brand package.

## Requirements

- Node.js 20+
- npm, pnpm, or yarn
- Access to your private package registry if the packages are private/published

## Add scripts to the platform repository

Copy this folder into your monorepo, then add these scripts to the root `package.json`:

```json
{
  "scripts": {
    "agency:init": "node scripts/init.mjs",
    "agency:doctor": "node scripts/doctor.mjs",
    "agency:create-client": "node scripts/create-client.mjs"
  }
}
```

Run from the root of a client application:

```bash
node /path/to/agency-design-platform/scripts/init.mjs
```

Or copy the scripts into the client project and run:

```bash
node scripts/init.mjs
```

## Registry authentication

For GitHub Packages, add this to the consuming project's `.npmrc`:

```ini
@agency:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

Set `NODE_AUTH_TOKEN` in your shell or CI secrets. Never paste a token into a committed file.

## Supported integration modes

- **React:** creates `src/theme/AgencyProvider.tsx` and a setup guide.
- **Next.js App Router:** creates `src/app/providers.tsx` (or `app/providers.tsx`) and a setup guide. You still add the provider to the root layout so the script does not overwrite an existing layout.
- **Expo / React Native:** creates `src/theme/AgencyProvider.tsx` and a setup guide. You still wrap the app root with the provider.

The script deliberately does not overwrite existing files. If a target file already exists, it writes a `.agency-example` alternative.

## Important

The generated code assumes the published packages expose the APIs in this repository starter:
- `@dechasaejara/react`: `AgencyProvider`, `Button`, `Card`, `Input`, and `styles.css`
- `@dechasaejara/react-native`: `AgencyNativeProvider`, `Button`, `Card`, `Input`
- `@dechasaejara/brand-<client-slug>`: `Client<PascalSlug>Theme` and `./native` export

Confirm the exported theme names and package versions match your actual published packages before using this in production. The current starter's brand package naming/export conventions should be standardized before the first release.
