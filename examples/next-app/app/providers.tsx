"use client";

import { useState } from "react";
import { AgencyProvider, Button } from "@dechasaejara/react";
import { ClientAlphaTheme } from "@dechasaejara/brand-client-alpha";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<"light" | "dark">("light");

  return (
    <AgencyProvider theme={ClientAlphaTheme} mode={mode}>
      <div className="demo-toolbar">
        <span>Client Alpha theme</span>
        <Button variant="secondary" onClick={() => setMode(value => value === "light" ? "dark" : "light")}>
          Switch to {mode === "light" ? "dark" : "light"} mode
        </Button>
      </div>
      {children}
    </AgencyProvider>
  );
}
