# Client application integration examples

## Next.js / React

```tsx
import { AgencyProvider, Button } from "@agency/react";
import "@agency/react/styles.css";
import { ClientAlphaTheme } from "@agency/brand-client-alpha";

export default function Page() {
  return <AgencyProvider theme={ClientAlphaTheme}><Button>Continue</Button></AgencyProvider>;
}
```

## React Native / Expo

```tsx
import { AgencyNativeProvider, Button } from "@agency/react-native";
import { ClientAlphaNativeTheme } from "@agency/brand-client-alpha/native";

export default function Screen() {
  return <AgencyNativeProvider theme={ClientAlphaNativeTheme}><Button title="Continue" /></AgencyNativeProvider>;
}
```
