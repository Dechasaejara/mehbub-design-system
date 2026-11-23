"use client";

import { useMemo, useState } from "react";
import { AgencyProvider, Avatar, Badge, Button, Card, Inline, InlineMessage, Input, Stack, Tag } from "@dechasaejara/react";
import { ClientAlphaTheme } from "@dechasaejara/brand-client-alpha";
import { ClientBetaTheme } from "@dechasaejara/brand-client-beta";
import type { AgencyTheme, ThemeMode } from "@dechasaejara/themes";

const brands: { id: string; name: string; industry: string; status: string; version: string; theme: AgencyTheme }[] = [
  { id: "alpha", name: "Northstar Health", industry: "Healthcare", status: "Live", version: "1.4.2", theme: ClientAlphaTheme },
  { id: "beta", name: "Fieldnote Coffee", industry: "Hospitality", status: "In review", version: "0.8.0", theme: ClientBetaTheme }
];

export default function DashboardPage() {
  const [activeId, setActiveId] = useState(brands[0].id);
  const [mode, setMode] = useState<ThemeMode>("light");
  const [query, setQuery] = useState("");
  const [showCreateGuide, setShowCreateGuide] = useState(false);
  const activeBrand = brands.find((brand) => brand.id === activeId) ?? brands[0];
  const filteredBrands = useMemo(() => brands.filter((brand) =>
    `${brand.name} ${brand.industry} ${brand.status}`.toLowerCase().includes(query.toLowerCase())
  ), [query]);

  return (
    <AgencyProvider theme={activeBrand.theme} mode={mode}>
      <div className="dashboard-shell">
        <aside className="sidebar">
          <a className="brand-lockup" href="#overview" aria-label="Mehubub Design Platform home">
            <span className="brand-mark">m</span><span>mehubub<span className="lockup-light">/studio</span></span>
          </a>
          <p className="nav-caption">WORKSPACE</p>
          <nav aria-label="Main navigation" className="main-nav">
            <a className="nav-item nav-item-active" href="#overview"><span aria-hidden="true">◫</span> Overview</a>
            <a className="nav-item" href="#brands"><span aria-hidden="true">◈</span> Brand library <span className="nav-count">02</span></a>
            <a className="nav-item" href="/buttons"><span aria-hidden="true">▦</span> Components</a>
            <a className="nav-item" href="/playground"><span aria-hidden="true">◇</span> Playground</a>
            <a className="nav-item" href="#tokens"><span aria-hidden="true">◉</span> Design tokens</a>
          </nav>
          <div className="sidebar-bottom">
            <div className="workspace-card"><span className="workspace-avatar">M</span><span><strong>Mehubub Studio</strong><small>Agency workspace</small></span><span aria-hidden="true">⌄</span></div>
            <span className="sidebar-footnote">Design platform <span>v0.1.0</span></span>
          </div>
        </aside>

        <main id="overview" className="dashboard-main">
          <header className="topbar">
            <div className="breadcrumb"><span>Workspace</span><span aria-hidden="true">/</span><strong>Overview</strong></div>
            <div className="topbar-actions">
              <span className="status-dot" aria-hidden="true" /> <span className="sync-label">All changes synced</span>
              <button className="avatar-button" type="button" aria-label="Account menu">D</button>
            </div>
          </header>

          <div className="content-wrap">
            <section className="page-heading">
              <div><p className="eyebrow">MONDAY, NOVEMBER 23</p><h1>Your design workspace</h1><p className="page-subtitle">Keep every client experience consistent, on brand, and moving forward.</p></div>
              <Button onClick={() => setShowCreateGuide((open) => !open)} aria-expanded={showCreateGuide}>＋ New brand</Button>
            </section>

            {showCreateGuide && <aside className="create-guide" aria-labelledby="create-guide-title">
              <div><strong id="create-guide-title">Start a client brand</strong><p>Generate an isolated token draft, then add its theme package and review the tokens before publishing.</p><code>pnpm generate:theme client-name</code></div>
              <Button variant="ghost" size="sm" onClick={() => setShowCreateGuide(false)} aria-label="Close brand creation guide">Close</Button>
            </aside>}

            <section className="metric-grid" aria-label="Workspace summary">
              <Card className="metric-card"><span className="metric-label">Client brands</span><strong className="metric-value">02</strong><span className="metric-foot"><span className="metric-positive">↑ 1</span> this quarter</span><span className="metric-icon">◈</span></Card>
              <Card className="metric-card"><span className="metric-label">Published packages</span><strong className="metric-value">08</strong><span className="metric-foot">Across all brands</span><span className="metric-icon">▣</span></Card>
              <Card className="metric-card"><span className="metric-label">Pending review</span><strong className="metric-value">03</strong><span className="metric-foot">Ready for your attention</span><span className="metric-icon metric-icon-warm">◷</span></Card>
              <Card className="metric-card"><span className="metric-label">Latest release</span><strong className="metric-value metric-release">v1.4.2</strong><span className="metric-foot">Published 2 days ago</span><span className="metric-icon metric-icon-green">✓</span></Card>
            </section>

            <section className="section-block" id="brands" aria-labelledby="brands-title">
              <div className="section-heading"><div><h2 id="brands-title">Client brands</h2><p>Your brand systems, all in one place.</p></div><a className="text-link" href="#brand-list">View all brands <span aria-hidden="true">→</span></a></div>
              <div className="brand-grid">
                {filteredBrands.map((brand) => <button key={brand.id} type="button" className={`brand-card ${brand.id === activeId ? "brand-card-selected" : ""}`} aria-pressed={brand.id === activeId} onClick={() => setActiveId(brand.id)}>
                  <span className="brand-card-top"><span className="brand-monogram" style={{ backgroundColor: brand.theme.colors.primary, color: brand.theme.colors.onPrimary }}>{brand.name.slice(0, 1)}</span><span className={`pill ${brand.status === "Live" ? "pill-live" : "pill-review"}`}>{brand.status}</span><span className="brand-menu" aria-hidden="true">···</span></span>
                  <strong className="brand-name">{brand.name}</strong><span className="brand-industry">{brand.industry}</span>
                  <span className="swatch-row" aria-label={`${brand.name} palette`}>
                    {[brand.theme.colors.primary, brand.theme.colors.surface, brand.theme.colors.text, brand.theme.colors.border].map((color) => <span className="color-swatch" key={color} style={{ backgroundColor: color }} />)}
                    <span className="swatch-label">+ semantic tokens</span>
                  </span>
                  <span className="brand-card-bottom"><span>Package version</span><strong>{brand.version}</strong></span>
                </button>)}
                {filteredBrands.length === 0 && <p className="empty-state">No brands match “{query}”. Try another search.</p>}
              </div>
            </section>

            <section className="lower-grid">
              <Card className="preview-panel" id="components">
                <div className="section-heading preview-heading"><div><p className="eyebrow">LIVE PREVIEW</p><h2>{activeBrand.name} design system</h2><p>Preview the brand theme across shared components.</p></div>
                  <div className="mode-switch" role="group" aria-label="Preview color mode">
                    <button type="button" aria-pressed={mode === "light"} onClick={() => setMode("light")}>☀ <span>Light</span></button>
                    <button type="button" aria-pressed={mode === "dark"} onClick={() => setMode("dark")}>◐ <span>Dark</span></button>
                  </div>
                </div>
                <div className="showcase-grid">
                  <section className="component-sample" aria-labelledby="sample-actions"><p className="demo-label" id="sample-actions">ACTIONS</p><div className="demo-controls"><Button size="sm">Primary action</Button><Button size="sm" variant="secondary">Secondary</Button><Button size="sm" variant="ghost">Quiet action</Button></div></section>
                  <section className="component-sample" aria-labelledby="sample-form"><p className="demo-label" id="sample-form">FORM FIELD</p><Input label="Project name" placeholder="e.g. Brand refresh" hint="Choose a short, clear name." /></section>
                  <section className="component-sample" aria-labelledby="sample-identity"><p className="demo-label" id="sample-identity">IDENTITY & STATUS</p><Stack gap={3}><Inline gap={2}><Avatar name="Amina Yusuf" /><Stack gap={1}><strong className="sample-name">Amina Yusuf <Badge value={3} tone="info" /></strong><span className="sample-caption">Product designer</span></Stack></Inline><Inline gap={2}><Tag tone="green">Active</Tag><Tag tone="blue">Design review</Tag><Tag tone="amber">Needs approval</Tag></Inline></Stack></section>
                  <section className="component-sample" aria-labelledby="sample-feedback"><p className="demo-label" id="sample-feedback">INLINE FEEDBACK</p><Stack gap={2}><InlineMessage title="Tokens saved" tone="success">Your brand updates are ready.</InlineMessage><InlineMessage title="Review needed" tone="warning">One change needs approval.</InlineMessage></Stack></section>
                  <section className="component-sample component-sample-wide" aria-labelledby="sample-layout"><p className="demo-label" id="sample-layout">TOKEN-SPACED LAYOUT</p><Inline gap={3}><Tag>Stack</Tag><span className="sample-caption">Vertical flow</span><span className="sample-caption">+</span><Tag>Inline</Tag><span className="sample-caption">Horizontal flow</span><Badge dot label="Layout tokens active" tone="success" /></Inline></section>
                  <div className="demo-footer"><span className="demo-label">ACTIVE BRAND</span><strong>{activeBrand.name}</strong><span className="mode-tag">{mode} mode</span></div>
                </div>              </Card>

              <Card className="token-panel" id="tokens">
                <div className="section-heading"><div><p className="eyebrow">FOUNDATIONS</p><h2>Brand tokens</h2><p>Semantic values for {activeBrand.name}.</p></div><a className="icon-link" href="#brand-list" aria-label="Browse brand tokens">↗</a></div>
                <dl className="token-list">
                  <div><dt><span className="token-color" style={{ background: activeBrand.theme.colors.primary }} />Primary</dt><dd>{activeBrand.theme.colors.primary}</dd></div>
                  <div><dt><span className="token-color" style={{ background: activeBrand.theme.colors.surface }} />Surface</dt><dd>{activeBrand.theme.colors.surface}</dd></div>
                  <div><dt><span className="token-color" style={{ background: activeBrand.theme.colors.text }} />Text</dt><dd>{activeBrand.theme.colors.text}</dd></div>
                  <div><dt><span className="token-color token-radius" />Radius / large</dt><dd>{activeBrand.theme.radius.lg}</dd></div>
                  <div><dt><span className="token-space" />Spacing / 4</dt><dd>{activeBrand.theme.spacing?.[4] ?? "16px"}</dd></div>
                </dl>
              </Card>
            </section>

            <section className="brand-list-section" id="brand-list" aria-labelledby="brand-list-title">
              <div className="section-heading"><div><h2 id="brand-list-title">Recent brands</h2><p>Quick access to your client workspaces.</p></div><div className="search-wrap"><Input aria-label="Search brands" placeholder="Search brands…" value={query} onChange={(event) => setQuery(event.target.value)} /></div></div>
              <div className="table-wrap"><table><thead><tr><th scope="col">Brand</th><th scope="col">Industry</th><th scope="col">Status</th><th scope="col">Version</th><th scope="col"><span className="sr-only">Select brand</span></th></tr></thead>
                <tbody>{filteredBrands.map((brand) => <tr key={brand.id}><td><span className="table-brand"><span className="table-dot" style={{ background: brand.theme.colors.primary }} />{brand.name}</span></td><td>{brand.industry}</td><td><span className={`pill ${brand.status === "Live" ? "pill-live" : "pill-review"}`}>{brand.status}</span></td><td>{brand.version}</td><td><button className="row-action" type="button" onClick={() => { setActiveId(brand.id); document.getElementById("components")?.scrollIntoView({ behavior: "smooth" }); }}>Preview <span aria-hidden="true">→</span></button></td></tr>)}</tbody>
              </table></div>
            </section>
            <footer className="page-footer"><span>Mehubub Design Platform <span aria-hidden="true">·</span> Internal preview with sample data</span><a href="#overview">Back to top ↑</a></footer>
          </div>
        </main>
      </div>
    </AgencyProvider>
  );
}
