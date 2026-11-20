import React, { createContext, useContext } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, type ViewProps, type TextInputProps } from "react-native";
import { defaultTheme, type AgencyTheme } from "@agency/themes";

const ThemeContext = createContext<AgencyTheme>(defaultTheme);

export function AgencyNativeProvider({ theme = defaultTheme, children }: { theme?: AgencyTheme; children: React.ReactNode }) {
  return <ThemeContext.Provider value={theme}><View style={{ flex: 1, backgroundColor: theme.colors.background }}>{children}</View></ThemeContext.Provider>;
}
export function useAgencyNativeTheme() { return useContext(ThemeContext); }

export function Card({ children, style, ...props }: ViewProps) {
  const theme = useAgencyNativeTheme();
  return <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderRadius: Number.parseInt(theme.radius.lg, 10) || 12 }, style]} {...props}>{children}</View>;
}

export function Button({ title, onPress, disabled = false }: { title: string; onPress?: () => void; disabled?: boolean }) {
  const theme = useAgencyNativeTheme();
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ disabled }} onPress={onPress} disabled={disabled}
      style={({ pressed }) => [styles.button, { backgroundColor: theme.colors.primary, opacity: disabled ? 0.5 : pressed ? 0.8 : 1 }]}>
      <Text style={{ color: theme.colors.onPrimary, fontWeight: "600" }}>{title}</Text>
    </Pressable>
  );
}

export function Input({ placeholder, ...props }: TextInputProps) {
  const theme = useAgencyNativeTheme();
  return <TextInput placeholder={placeholder} placeholderTextColor={theme.colors.muted}
    accessibilityLabel={props.accessibilityLabel ?? placeholder}
    style={[styles.input, { color: theme.colors.text, backgroundColor: theme.colors.background, borderColor: theme.colors.border }, props.style]} {...props} />;
}

const styles = StyleSheet.create({
  card: { padding: 16, borderWidth: 1, marginVertical: 8 },
  button: { minHeight: 44, paddingHorizontal: 18, paddingVertical: 12, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  input: { minHeight: 44, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 }
});
