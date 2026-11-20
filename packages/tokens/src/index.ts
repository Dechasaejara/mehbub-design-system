export const primitiveTokens = {
  color: {
    white: "#FFFFFF",
    black: "#111111",
    slate950: "#0B1220",
    slate900: "#111827",
    slate700: "#334155",
    slate500: "#64748B",
    slate200: "#E2E8F0",
    slate100: "#F1F5F9",
    blue600: "#2563EB",
    green600: "#16A34A",
    amber600: "#D97706",
    red600: "#DC2626"
  },
  spacing: { 0: "0px", 1: "4px", 2: "8px", 3: "12px", 4: "16px", 5: "20px", 6: "24px", 8: "32px", 10: "40px", 12: "48px" },
  radius: { none: "0px", sm: "4px", md: "8px", lg: "12px", xl: "16px", full: "9999px" },
  typography: { fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif", fontSize: { sm: "14px", md: "16px", lg: "18px", xl: "24px", "2xl": "32px" } }
} as const;

export type PrimitiveTokens = typeof primitiveTokens;
