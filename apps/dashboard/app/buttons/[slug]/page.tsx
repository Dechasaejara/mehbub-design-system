import Link from "next/link";
import { notFound } from "next/navigation";
import { AgencyProvider, Button, Card, Inline, InlineMessage, Stack, Tag } from "@dechasaejara/react";
import { ClientAlphaTheme } from "@dechasaejara/brand-client-alpha";
import { WorkspaceRoute } from "../../_components/WorkspaceRoute";

const details = {
  primary: { name: "Primary button", variant: "primary" as const, description: "Use for the most important action in a view. Keep one primary action in a local group whenever possible." },
  secondary: { name: "Secondary button", variant: "secondary" as const, description: "Use for a useful alternative action that supports the primary action." },
  ghost: { name: "Ghost button", variant: "ghost" as const, description: "Use for low-emphasis actions in compact areas, toolbars, and text-adjacent controls." }
};

export function generateStaticParams() { return Object.keys(details).map((slug) => ({ slug })); }

export default async function ButtonDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = details[slug as keyof typeof details];
  if (!detail) notFound();
  return <AgencyProvider theme={ClientAlphaTheme}>
    <WorkspaceRoute title={detail.name} eyebrow="COMPONENT LIBRARY / BUTTONS" description={detail.description} actions={<Link className="route-back-link" href="/buttons">← All buttons</Link>}>
      <div className="detail-layout">
        <div className="detail-main-column">
          <Card className="detail-preview-card"><div className="detail-section-heading"><div><Tag tone="green">Stable</Tag><h2>Preview</h2><p>Default, size, and state examples.</p></div><Link className="text-link" href="/playground">Customize in playground →</Link></div>
            <div className="detail-preview-stage"><Button variant={detail.variant}>Continue</Button><Button variant={detail.variant} size="sm">Small action</Button><Button variant={detail.variant} size="lg">Large action</Button><Button variant={detail.variant} disabled>Unavailable</Button><Button variant={detail.variant} loading>Saving</Button></div>
          </Card>
          <Card className="detail-guidance"><h2>Usage guidance</h2><Stack gap={3}><Inline><span className="guidance-mark guidance-good">✓</span><span>Use a concise label that says what happens after activation.</span></Inline><Inline><span className="guidance-mark guidance-good">✓</span><span>Use the native button element for actions and provide a visible focus ring.</span></Inline><Inline><span className="guidance-mark guidance-caution">!</span><span>Avoid multiple primary buttons in one action group.</span></Inline></Stack></Card>
          <InlineMessage title="Loading state" tone="info">Loading disables the button and exposes <code>aria-busy</code>. Keep the control in place while the action is running.</InlineMessage>
        </div>
        <aside className="detail-side-column">
          <Card className="detail-meta"><h2>Component details</h2><dl><div><dt>Package</dt><dd>@dechasaejara/react</dd></div><div><dt>Version</dt><dd>0.1.0</dd></div><div><dt>Platform</dt><dd>Web</dd></div><div><dt>Accessibility</dt><dd><Tag tone="green">Native semantics</Tag></dd></div></dl></Card>
          <Card className="detail-meta"><h2>Available props</h2><dl><div><dt>variant</dt><dd>primary · secondary · ghost</dd></div><div><dt>size</dt><dd>sm · md · lg</dd></div><div><dt>loading</dt><dd>boolean</dd></div><div><dt>disabled</dt><dd>boolean</dd></div></dl></Card>
        </aside>
      </div>
    </WorkspaceRoute>
  </AgencyProvider>;
}