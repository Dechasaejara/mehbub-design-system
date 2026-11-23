"use client";

import { useState } from "react";
import { AgencyProvider, Button, Card, Inline, Input, Tag } from "@dechasaejara/react";
import { ClientAlphaTheme } from "@dechasaejara/brand-client-alpha";
import { ClientBetaTheme } from "@dechasaejara/brand-client-beta";
import type { ThemeMode } from "@dechasaejara/themes";
import { WorkspaceRoute } from "../_components/WorkspaceRoute";

const themes = {
  northstar: { name: "Northstar Health", theme: ClientAlphaTheme },
  fieldnote: { name: "Fieldnote Coffee", theme: ClientBetaTheme }
};

export default function ButtonPlaygroundPage() {
  const [brand, setBrand] = useState<keyof typeof themes>("northstar");
  const [mode, setMode] = useState<ThemeMode>("light");
  const [variant, setVariant] = useState<"primary" | "secondary" | "ghost">("primary");
  const [size, setSize] = useState<"sm" | "md" | "lg">("md");
  const [label, setLabel] = useState("Save changes");
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const selectedTheme = themes[brand];
  const code = `<Button variant="${variant}" size="${size}"${disabled ? " disabled" : ""}${loading ? " loading" : ""}>${label || "Button label"}</Button>`;

  return <WorkspaceRoute title="Playground" eyebrow="COMPONENTS / INTERACTIVE PREVIEW" description="Adjust button props and brand settings to preview the result." actions={<Tag tone="blue">Changes are local</Tag>}>
    <div className="playground-layout">
      <Card className="playground-controls"><div className="detail-section-heading"><div><h2>Button properties</h2><p>Changes update the preview immediately.</p></div></div>
        <div className="playground-field"><label htmlFor="playground-brand">Client brand</label><select id="playground-brand" value={brand} onChange={(event) => setBrand(event.target.value as keyof typeof themes)}><option value="northstar">Northstar Health</option><option value="fieldnote">Fieldnote Coffee</option></select></div>
        <div className="playground-field"><span>Color mode</span><div className="playground-segmented" role="group" aria-label="Color mode"><button type="button" aria-pressed={mode === "light"} onClick={() => setMode("light")}>Light</button><button type="button" aria-pressed={mode === "dark"} onClick={() => setMode("dark")}>Dark</button></div></div>
        <div className="playground-field"><label htmlFor="playground-variant">Variant</label><select id="playground-variant" value={variant} onChange={(event) => setVariant(event.target.value as typeof variant)}><option value="primary">Primary</option><option value="secondary">Secondary</option><option value="ghost">Ghost</option></select></div>
        <div className="playground-field"><label htmlFor="playground-size">Size</label><select id="playground-size" value={size} onChange={(event) => setSize(event.target.value as typeof size)}><option value="sm">Small</option><option value="md">Medium</option><option value="lg">Large</option></select></div>
        <div className="playground-field"><Input label="Button label" value={label} onChange={(event) => setLabel(event.target.value)} maxLength={48} hint="Use a clear action phrase." /></div>
        <label className="playground-check"><input type="checkbox" checked={disabled} onChange={(event) => setDisabled(event.target.checked)} /> Disabled</label>
        <label className="playground-check"><input type="checkbox" checked={loading} onChange={(event) => setLoading(event.target.checked)} /> Loading</label>
      </Card>
      <div className="playground-preview-column">
        <Card className="playground-preview"><div className="detail-section-heading"><div><p className="eyebrow">LIVE PREVIEW</p><h2>{selectedTheme.name}</h2><p>{mode} mode · {variant} · {size}</p></div><span className="preview-color-dot" style={{ background: selectedTheme.theme.colors.primary }} /></div>
          <AgencyProvider theme={selectedTheme.theme} mode={mode} style={{ minHeight: 220, display: "grid", placeItems: "center", borderRadius: 10, marginTop: 18, padding: 24 }}><Button variant={variant} size={size} disabled={disabled} loading={loading}>{label || "Button label"}</Button></AgencyProvider>
          <div className="preview-state-row"><Inline gap={2}><Tag tone={disabled ? "amber" : "green"}>{disabled ? "Disabled" : "Enabled"}</Tag><Tag tone={loading ? "blue" : "neutral"}>{loading ? "Loading" : "Idle"}</Tag></Inline></div>
        </Card>
        <Card className="playground-code"><div className="detail-section-heading"><div><h2>React usage</h2><p>Copy this pattern into your app.</p></div><span className="code-language">TSX</span></div><pre><code>{code}</code></pre></Card>
      </div>
    </div>
  </WorkspaceRoute>;
}
