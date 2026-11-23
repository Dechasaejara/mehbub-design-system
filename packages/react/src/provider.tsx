"use client";

import React, { createContext, useContext, useMemo } from "react";
import { defaultTheme, resolveTheme, themeToCssVariables, type AgencyTheme, type ThemeMode } from "@dechasaejara/themes";

const ThemeContext = createContext<AgencyTheme>(defaultTheme);

export function AgencyProvider({
  theme = defaultTheme,
  mode = "light",
  style,
  children
}: {
  theme?: AgencyTheme;
  mode?: ThemeMode;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const resolvedTheme = useMemo(() => resolveTheme(theme, mode), [theme, mode]);
  const variables = useMemo(() => themeToCssVariables(theme, mode), [theme, mode]);
  return (
    <ThemeContext.Provider value={resolvedTheme}>
      <div className="agency-root" data-color-mode={mode} style={{ ...variables, ...style } as React.CSSProperties}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useAgencyTheme() {
  return useContext(ThemeContext);
}
