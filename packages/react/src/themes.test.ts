import { describe, expect, it } from "vitest";
import { defaultTheme, resolveTheme, themeToCssVariables, type AgencyTheme } from "@dechasaejara/themes";

const brand: AgencyTheme = {
  ...defaultTheme,
  name: "Isolated test brand",
  colors: { ...defaultTheme.colors, primary: "#123456" },
  modes: { dark: { background: "#101010", text: "#F0F0F0" } },
  spacing: { 2: "9px" },
  shadows: { sm: { color: "#000000", offsetX: 0, offsetY: 2, blur: 4, opacity: 0.2 } }
};

describe("theme resolution", () => {
  it("applies a brand dark palette without mutating its light colors", () => {
    const dark = resolveTheme(brand, "dark");
    expect(dark.colors.background).toBe("#101010");
    expect(dark.colors.primary).toBe(defaultTheme.modes?.dark?.primary);
    expect(resolveTheme(brand).colors.background).toBe(defaultTheme.colors.background);
    expect(brand.colors.background).toBe(defaultTheme.colors.background);
  });

  it("exports scoped CSS variables for spacing, shadows, and mode colors", () => {
    const variables = themeToCssVariables(brand, "dark");
    expect(variables["--agency-color-background"]).toBe("#101010");
    expect(variables["--agency-space-2"]).toBe("9px");
    expect(variables["--agency-shadow-sm"]).toContain("rgba(0, 0, 0, 0.2)");
  });
});
