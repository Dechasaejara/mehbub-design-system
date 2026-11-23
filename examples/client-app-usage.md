# Client application integration examples

## Next.js / React

```tsx
import { AgencyProvider, Button } from "@dechasaejara/react";
import "@dechasaejara/react/styles.css";
import { ClientAlphaTheme } from "@dechasaejara/brand-client-alpha";

export default function Page() {
  return <AgencyProvider theme={ClientAlphaTheme}><Button>Continue</Button></AgencyProvider>;
}
```

## React Native / Expo

```tsx
import { AgencyNativeProvider, Button } from "@dechasaejara/react-native";
import { ClientAlphaNativeTheme } from "@dechasaejara/brand-client-alpha/native";

export default function Screen() {
  return <AgencyNativeProvider theme={ClientAlphaNativeTheme}><Button title="Continue" /></AgencyNativeProvider>;
}
```
