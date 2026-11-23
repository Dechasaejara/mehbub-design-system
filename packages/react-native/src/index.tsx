import React, { createContext, useContext, useMemo } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, type ViewProps, type TextInputProps } from "react-native";
import { defaultTheme, resolveTheme, type AgencyTheme, type ThemeMode } from "@dechasaejara/themes";

const ThemeContext = createContext<AgencyTheme>(defaultTheme);

export function AgencyNativeProvider({ theme = defaultTheme, mode = "light", children, style }: { theme?: AgencyTheme; mode?: ThemeMode; children: React.ReactNode; style?: ViewProps["style"] }) {
  const resolved = useMemo(() => resolveTheme(theme, mode), [theme, mode]);
  return <ThemeContext.Provider value={resolved}><View style={[{ flex: 1, backgroundColor: resolved.colors.background }, style]}>{children}</View></ThemeContext.Provider>;
}
export function useAgencyNativeTheme() { return useContext(ThemeContext); }

function radiusValue(value: string, fallback = 0): number { const parsed = Number.parseFloat(value); return Number.isFinite(parsed) ? parsed : fallback; }
function shadowStyle(theme: AgencyTheme, name: string) {
  const shadow = theme.shadows?.[name];
  return shadow ? {
    shadowColor: shadow.color,
    shadowOffset: { width: shadow.offsetX, height: shadow.offsetY },
    shadowOpacity: shadow.opacity,
    shadowRadius: shadow.blur,
    elevation: Math.max(1, Math.round(shadow.blur / 2))
  } : {};
}

export function Card({ children, style, ...props }: ViewProps) {
  const theme = useAgencyNativeTheme();
  const spacing = theme.spacing?.[4] ?? 16;
  const padding = theme.components?.card?.padding ?? spacing;
  return <View style={[styles.card, { padding: typeof padding === "number" ? padding : radiusValue(padding), backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderRadius: radiusValue(theme.components?.card?.radius ?? theme.radius.lg, radiusValue(theme.radius.lg, 12)) }, shadowStyle(theme, "sm"), style]} {...props}>{children}</View>;
}

export function Button({ title, onPress, disabled = false }: { title: string; onPress?: () => void; disabled?: boolean }) {
  const theme = useAgencyNativeTheme();
  const button = theme.components?.button;
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ disabled }} onPress={onPress} disabled={disabled}
      style={({ pressed }) => [styles.button, { backgroundColor: theme.colors.primary, borderRadius: radiusValue(button?.radius ?? theme.radius.md, radiusValue(theme.radius.md, 8)), paddingHorizontal: radiusValue(button?.paddingX ?? "18px"), paddingVertical: radiusValue(button?.paddingY ?? "12px"), opacity: disabled ? 0.5 : pressed ? 0.8 : 1 }]}>
      <Text style={{ color: theme.colors.onPrimary, fontWeight: "600" }}>{title}</Text>
    </Pressable>
  );
}

export function Input({ placeholder, ...props }: TextInputProps) {
  const theme = useAgencyNativeTheme();
  const input = theme.components?.input;
  return <TextInput placeholder={placeholder} placeholderTextColor={theme.colors.muted}
    accessibilityLabel={props.accessibilityLabel ?? placeholder}
    style={[styles.input, { color: theme.colors.text, backgroundColor: theme.colors.background, borderColor: theme.colors.border, borderRadius: radiusValue(input?.radius ?? theme.radius.md, radiusValue(theme.radius.md, 8)), paddingHorizontal: radiusValue(input?.paddingX ?? "12px"), paddingVertical: radiusValue(input?.paddingY ?? "10px") }, props.style]} {...props} />;
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, marginVertical: 8 },
  button: { minHeight: 44, alignItems: "center", justifyContent: "center" },
  input: { minHeight: 44, borderWidth: 1 }
});
