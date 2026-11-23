import type { ReactNode } from "react";

export function WorkspaceRoute({ title, eyebrow, description, actions, children }: { title: string; eyebrow: string; description: string; actions?: ReactNode; children: ReactNode }) {
  return <div className="dashboard-shell">
    <aside className="sidebar">
      <a className="brand-lockup" href="/" aria-label="Mehubub Design Platform home"><span className="brand-mark">m</span><span>mehubub<span className="lockup-light">/studio</span></span></a>
      <p className="nav-caption">WORKSPACE</p>
      <nav aria-label="Main navigation" className="main-nav">
        <a className="nav-item" href="/"><span aria-hidden="true">◫</span> Overview</a>
        <a className="nav-item" href="/#brands"><span aria-hidden="true">◈</span> Brand library <span className="nav-count">02</span></a>
        <a className="nav-item nav-item-active" href="/buttons"><span aria-hidden="true">▦</span> Components</a>
        <a className="nav-item" href="/playground"><span aria-hidden="true">◇</span> Playground</a>
        <a className="nav-item" href="/#tokens"><span aria-hidden="true">◉</span> Design tokens</a>
      </nav>
      <div className="sidebar-bottom"><div className="workspace-card"><span className="workspace-avatar">M</span><span><strong>Mehubub Studio</strong><small>Agency workspace</small></span><span aria-hidden="true">⌄</span></div><span className="sidebar-footnote">Design platform <span>v0.1.0</span></span></div>
    </aside>
    <main className="dashboard-main">
      <header className="topbar"><div className="breadcrumb"><a href="/">Workspace</a><span aria-hidden="true">/</span><strong>{title}</strong></div><div className="topbar-actions"><span className="status-dot" aria-hidden="true" /><span className="sync-label">Preview workspace</span><span className="avatar-button">D</span></div></header>
      <div className="content-wrap route-content">
        <header className="route-header"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="page-subtitle">{description}</p></div>{actions}</header>
        {children}
      </div>
    </main>
  </div>;
}
