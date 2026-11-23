import Link from "next/link";
import { AgencyProvider, Button, Card, Tag } from "@dechasaejara/react";
import { ClientAlphaTheme } from "@dechasaejara/brand-client-alpha";
import { WorkspaceRoute } from "../_components/WorkspaceRoute";

const variants = [
  { slug: "primary", name: "Primary", description: "For the main action on a page or within a section.", className: "agency-button--primary", tone: "green" as const },
  { slug: "secondary", name: "Secondary", description: "For supporting actions that sit beside a primary action.", className: "agency-button--secondary", tone: "blue" as const },
  { slug: "ghost", name: "Ghost", description: "For low-emphasis actions where a filled button would add visual weight.", className: "agency-button--ghost", tone: "neutral" as const }
];

export default function ButtonsPage() {
  return <AgencyProvider theme={ClientAlphaTheme}>
    <WorkspaceRoute title="Buttons" eyebrow="COMPONENT LIBRARY / ACTIONS" description="Clear, consistent actions for every part of the product." actions={<Link className="route-primary-link" href="/playground">Open playground <span aria-hidden="true">↗</span></Link>}>
      <div className="catalog-toolbar"><div><strong>3 variants</strong><span> · Button v0.1.0</span></div><span className="catalog-help">Choose a variant to view usage and states.</span></div>
      <div className="button-catalog">
        {variants.map((variant) => <Card className="catalog-card" key={variant.slug}>
          <div className="catalog-card-heading"><div><Tag tone={variant.tone}>{variant.name}</Tag><h2>{variant.name}</h2><p>{variant.description}</p></div><span className="catalog-arrow" aria-hidden="true">↗</span></div>
          <div className="catalog-sample" aria-label={`${variant.name} button example`}><Button variant={variant.slug as "primary" | "secondary" | "ghost"}>Continue</Button><Button variant={variant.slug as "primary" | "secondary" | "ghost"} size="sm">Small</Button></div>
          <div className="catalog-card-footer"><span>Web · React</span><Link href={`/buttons/${variant.slug}`}>View details <span aria-hidden="true">→</span></Link></div>
        </Card>)}
      </div>
      <section className="catalog-note"><strong>Good button labels describe the result.</strong><p>Use a short verb phrase like “Save changes” or “Invite teammate”. Choose the primary variant for one main action and keep nearby actions secondary or ghost.</p></section>
    </WorkspaceRoute>
  </AgencyProvider>;
}
