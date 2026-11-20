# Architecture and boundaries

## Package dependency direction

- `tokens` has no runtime dependency on platform packages.
- `themes` defines the semantic theme contract and CSS-variable mapping.
- `react` depends on `themes`; it does not depend on client brand packages.
- `react-native` depends on `themes`; it renders using native primitives.
- `brand-*` packages depend on `themes` and export brand configuration.
- Client applications depend on the packages and brand package they are authorized to use.

## Client isolation

A client brand package should contain only that client's approved brand configuration and distributable assets. Keep confidential client source code and unreleased assets in a separate private repository or access-controlled package. Do not place client secrets in tokens or public package metadata.

## Theme contract

The `AgencyTheme` interface is the semantic contract. Components consume roles such as `primary`, `surface`, `text`, and `border`, not named brand colors such as `navy500` or `clientAlphaBlue`.

## Platform parity

Web and native packages should expose equivalent concepts and variant names where appropriate. They are not required to share identical markup or styling internals. Platform-specific patterns should remain idiomatic and accessible.

## Dashboard security

The dashboard in this starter is a UI shell with sample data. Before production, implement authentication, role-based authorization, tenant/client scoping, audit events, secure asset storage, and server-side validation.
