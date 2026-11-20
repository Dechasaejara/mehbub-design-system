# Contributing

## Branches and pull requests

Use `feat/`, `fix/`, `docs/`, or `chore/` branch prefixes. Keep pull requests focused and include screenshots for visual changes.

## Component checklist

- Semantic HTML on web and accessible labels/states.
- No hardcoded client brand values in shared components.
- Token-driven colors, typography, spacing, and radii.
- Typed props and documented variants.
- Keyboard/focus behavior on web.
- Native behavior implemented using React Native primitives.
- Tests for meaningful behavior.
- Storybook story for web components.
- Changeset for publishable package changes.

## Changesets

Run `pnpm changeset` and select the affected packages. Use patch for fixes, minor for backward-compatible features, and major for breaking API changes.
