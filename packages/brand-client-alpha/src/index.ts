import type { AgencyTheme } from "@agency/themes";

    export const ClientAlphaTheme: AgencyTheme = {
  "name": "Client Alpha",
  "colors": {
    "primary": "#183B61",
    "onPrimary": "#FFFFFF",
    "background": "#FFFFFF",
    "surface": "#F3F6FA",
    "text": "#15283D",
    "muted": "#60748A",
    "border": "#D9E2EC",
    "danger": "#B42318",
    "success": "#16805D"
  },
  "typography": {
    "fontFamily": "Inter, system-ui, sans-serif",
    "headingFamily": "Inter, system-ui, sans-serif"
  },
  "radius": {
    "sm": "4px",
    "md": "8px",
    "lg": "12px",
    "pill": "9999px"
  }
} as const;
