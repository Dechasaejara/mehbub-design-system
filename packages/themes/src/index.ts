export type ColorTokens = {
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

export type ThemeMode = "light" | "dark";
export type ThemeShadow = { color: string; offsetX: number; offsetY: number; blur: number; spread?: number; opacity: number };
export type ThemeColors = ColorTokens;

export type AgencyTheme = {
  name: string;
  colors: ColorTokens;
  modes?: Partial<Record<ThemeMode, Partial<ColorTokens>>>;
  typography: { fontFamily: string; headingFamily?: string };
  spacing?: Record<string, number | string>;
  radius: { sm: string; md: string; lg: string; pill: string };
  shadows?: Record<string, ThemeShadow>;
  components?: {
    button?: { radius?: string; paddingX?: string; paddingY?: string; fontWeight?: number };
    card?: { radius?: string; padding?: string };
    input?: { radius?: string; paddingX?: string; paddingY?: string };
  };
};

export const defaultTheme: AgencyTheme = {
  name: "Agency Default",
  colors: {
    primary: "#2563EB", onPrimary: "#FFFFFF", background: "#FFFFFF",
    surface: "#F8FAFC", text: "#0F172A", muted: "#64748B",
    border: "#E2E8F0", danger: "#DC2626", success: "#16A34A"
  },
  modes: {
    dark: {
      primary: "#93C5FD", onPrimary: "#0F172A", background: "#0F172A",
      surface: "#1E293B", text: "#F8FAFC", muted: "#CBD5E1",
      border: "#334155", danger: "#FCA5A5", success: "#86EFAC"
    }
  },
  typography: { fontFamily: "Inter, system-ui, sans-serif" },
  spacing: { 0: "0px", 1: "4px", 2: "8px", 3: "12px", 4: "16px", 6: "24px", 8: "32px" },
  radius: { sm: "4px", md: "8px", lg: "12px", pill: "9999px" },
  shadows: {
    sm: { color: "#0F172A", offsetX: 0, offsetY: 1, blur: 2, spread: 0, opacity: 0.08 },
    md: { color: "#0F172A", offsetX: 0, offsetY: 4, blur: 12, spread: 0, opacity: 0.12 }
  },
  components: {
    button: { radius: "var(--agency-radius-md)", paddingX: "16px", paddingY: "10px", fontWeight: 600 },
    card: { radius: "var(--agency-radius-lg)", padding: "16px" },
    input: { radius: "var(--agency-radius-md)", paddingX: "12px", paddingY: "10px" }
  }
};

export function resolveTheme(theme: AgencyTheme, mode: ThemeMode = "light"): AgencyTheme {
  const modeColors = mode === "dark" ? (defaultTheme.modes?.dark ?? {}) : {};
  const brandMode = mode === "dark" ? theme.modes?.dark : undefined;
  return { ...defaultTheme, ...theme, colors: { ...defaultTheme.colors, ...theme.colors, ...modeColors, ...brandMode }, modes: theme.modes };
}

function shadowToCss(shadow: ThemeShadow): string {
  const alpha = Math.max(0, Math.min(1, shadow.opacity));
  const rgb = /^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(shadow.color);
  const color = rgb ? `rgba(${parseInt(rgb[1], 16)}, ${parseInt(rgb[2], 16)}, ${parseInt(rgb[3], 16)}, ${alpha})` : shadow.color;
  return `${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blur}px ${shadow.spread ?? 0}px ${color}`;
}

export function themeToCssVariables(theme: AgencyTheme, mode: ThemeMode = "light"): Record<string, string> {
  const resolved = resolveTheme(theme, mode);
  const variables: Record<string, string> = {
    "--agency-color-primary": resolved.colors.primary,
    "--agency-color-on-primary": resolved.colors.onPrimary,
    "--agency-color-background": resolved.colors.background,
    "--agency-color-surface": resolved.colors.surface,
    "--agency-color-text": resolved.colors.text,
    "--agency-color-muted": resolved.colors.muted,
    "--agency-color-border": resolved.colors.border,
    "--agency-color-danger": resolved.colors.danger ?? "#DC2626",
    "--agency-color-success": resolved.colors.success ?? "#16A34A",
    "--agency-font-family": resolved.typography.fontFamily,
    "--agency-font-heading-family": resolved.typography.headingFamily ?? resolved.typography.fontFamily,
    "--agency-radius-sm": resolved.radius.sm,
    "--agency-radius-md": resolved.radius.md,
    "--agency-radius-lg": resolved.radius.lg,
    "--agency-radius-pill": resolved.radius.pill
  };
  for (const [key, value] of Object.entries(resolved.spacing ?? {})) variables[`--agency-space-${key}`] = typeof value === "number" ? `${value}px` : value;
  for (const [key, value] of Object.entries(resolved.shadows ?? {})) variables[`--agency-shadow-${key}`] = shadowToCss(value);
  for (const [name, value] of Object.entries(resolved.components ?? {})) {
    for (const [key, token] of Object.entries(value ?? {})) variables[`--agency-${name}-${key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)}`] = String(token);
  }
  return variables;
}
