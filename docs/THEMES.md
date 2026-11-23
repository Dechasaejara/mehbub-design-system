# Multi-brand theme authoring

Themes are package-local data. A provider receives a theme object and resolves its mode into a fresh object, so one brand's overrides do not mutate shared defaults or another brand's configuration.

## Theme contract

Each theme defines semantic colors, typography, and corner radii. Optional fields add spacing tokens, portable shadow values, component-level style tokens, and partial dark-mode color overrides. Missing dark-mode roles inherit the platform default dark palette.

```ts
import { AgencyProvider } from "@dechasaejara/react";
import { ClientAlphaTheme } from "@dechasaejara/brand-client-alpha";

<AgencyProvider theme={ClientAlphaTheme} mode="dark">
  <Application />
</AgencyProvider>
```

Use `mode="light"` or `mode="dark"` explicitly. Put client-wide style overrides on the provider's `style` prop or use your own class on content inside it; the provider keeps CSS variables scoped to its own root.

## Brand overrides

Keep overrides inside the brand package. Do not mutate `defaultTheme`, import one client's token object into another brand, or add client-specific colors to shared component source. React Native uses the same semantic theme and mode contract while mapping spacing, radii, and shadow primitives to native styles.

The examples in `packages/brand-client-alpha/brand.tokens.json` and `packages/brand-client-beta/brand.tokens.json` show colors, typography, spacing, radii, shadows, component tokens, and dark palettes. Edit both the JSON source and matching TypeScript export together.

## Adding a token

1. Add the token to `AgencyTheme` in `packages/themes/src/index.ts`.
2. Provide a default value and an optional CSS variable mapping.
3. Apply the token in the web and native components where the concept exists.
4. Add it to brand token JSON and TypeScript exports as needed.
5. Add a test for default behavior and client override behavior.
6. Build and validate package exports before adding a Changeset.
