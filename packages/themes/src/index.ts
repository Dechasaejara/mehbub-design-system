export type AgencyTheme = {
  name: string;
  colors: {
    primary: string;
    onPrimary: string;
    background: string;
    surface: string;
    text: string;
    muted: string;
    border: string;
    danger?: string;
    success?: string;
  };
  typography: { fontFamily: string; headingFamily?: string };
  radius: { sm: string; md: string; lg: string; pill: string };
};

export const defaultTheme: AgencyTheme = {
  name: "Agency Default",
  colors: {
    primary: "#2563EB", onPrimary: "#FFFFFF", background: "#FFFFFF",
    surface: "#F8FAFC", text: "#0F172A", muted: "#64748B",
    border: "#E2E8F0", danger: "#DC2626", success: "#16A34A"
  },
  typography: { fontFamily: "Inter, system-ui, sans-serif" },
  radius: { sm: "4px", md: "8px", lg: "12px", pill: "9999px" }
};

export function themeToCssVariables(theme: AgencyTheme): Record<string, string> {
  return {
    "--agency-color-primary": theme.colors.primary,
    "--agency-color-on-primary": theme.colors.onPrimary,
    "--agency-color-background": theme.colors.background,
    "--agency-color-surface": theme.colors.surface,
    "--agency-color-text": theme.colors.text,
    "--agency-color-muted": theme.colors.muted,
    "--agency-color-border": theme.colors.border,
    "--agency-font-family": theme.typography.fontFamily,
    "--agency-radius-sm": theme.radius.sm,
    "--agency-radius-md": theme.radius.md,
    "--agency-radius-lg": theme.radius.lg,
    "--agency-radius-pill": theme.radius.pill
  };
}
