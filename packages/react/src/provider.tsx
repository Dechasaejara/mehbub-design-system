"use client";

import React, { createContext, useContext, useMemo } from "react";
import { defaultTheme, themeToCssVariables, type AgencyTheme } from "@agency/themes";

const ThemeContext = createContext<AgencyTheme>(defaultTheme);

export function AgencyProvider({ theme = defaultTheme, children }: { theme?: AgencyTheme; children: React.ReactNode }) {
  const variables = useMemo(() => themeToCssVariables(theme), [theme]);
  return (
    <ThemeContext.Provider value={theme}>
      <div className="agency-root" style={variables as React.CSSProperties}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useAgencyTheme() {
  return useContext(ThemeContext);
}
