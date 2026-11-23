// Generated from ../brand.tokens.json. Do not edit by hand.
export const brandTokens = {
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
  },
  "modes": {
    "dark": {
      "primary": "#9CC7F0",
      "onPrimary": "#10243A",
      "background": "#0E1B2A",
      "surface": "#182B40",
      "text": "#F2F6FA",
      "muted": "#B1C0CF",
      "border": "#30465D",
      "danger": "#FF9B91",
      "success": "#73D1A9"
    }
  },
  "spacing": {
    "1": "4px",
    "2": "8px",
    "3": "12px",
    "4": "16px",
    "6": "24px",
    "8": "32px"
  },
  "shadows": {
    "sm": {
      "color": "#0F172A",
      "offsetX": 0,
      "offsetY": 1,
      "blur": 2,
      "spread": 0,
      "opacity": 0.1
    },
    "md": {
      "color": "#0F172A",
      "offsetX": 0,
      "offsetY": 4,
      "blur": 12,
      "spread": 0,
      "opacity": 0.16
    }
  },
  "components": {
    "button": {
      "radius": "8px",
      "paddingX": "16px",
      "paddingY": "10px",
      "fontWeight": 600
    },
    "card": {
      "radius": "12px",
      "padding": "16px"
    },
    "input": {
      "radius": "8px",
      "paddingX": "12px",
      "paddingY": "10px"
    }
  }
} as const;
export type BrandTokens = typeof brandTokens;
