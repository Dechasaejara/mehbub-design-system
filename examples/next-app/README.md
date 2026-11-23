# Next.js consumer example

This is a small App Router project that imports the local `@dechasaejara/react` and `@dechasaejara/brand-client-alpha` workspace packages. It demonstrates global stylesheet setup, a client theme provider, light/dark switching, and components.

From the monorepo root:

```sh
pnpm install --frozen-lockfile
pnpm --filter @dechasaejara/example-next-app dev
```

Then open `http://localhost:3000`. To verify a production build, run `pnpm --filter @dechasaejara/example-next-app build`.

For a separate private consumer project, use package versions instead of `workspace:*`, configure the `@dechasaejara` GitHub Packages registry in `.npmrc`, and set `NODE_AUTH_TOKEN` in your shell. The design system packages are published under the GitHub owner scope; Mehubub is the product name.
