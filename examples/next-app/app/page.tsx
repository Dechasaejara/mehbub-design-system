import { Avatar, Badge, Button, Card, Inline, Input, InlineMessage, Stack, Tag } from "@dechasaejara/react";

export default function HomePage() {
  return (
    <main className="demo-page">
      <section className="demo-intro">
        <p className="eyebrow">MEHUBUB · CLIENT ALPHA</p>
        <h1>A real project, using the system</h1>
        <p>This Next.js App Router example consumes the React components, CSS, theme provider, and brand package from the workspace.</p>
        <Inline gap={2}>
          <Button>Get started</Button>
          <Button variant="secondary">View documentation</Button>
        </Inline>
      </section>

      <section className="demo-grid" aria-label="Component examples">
        <Card>
          <Stack gap={3}>
            <h2>Account overview</h2>
            <Inline gap={2}><Avatar name="Amina Yusuf" /><div><strong>Amina Yusuf</strong><div className="muted">Product designer</div></div><Badge value={3} tone="info" /></Inline>
            <Inline gap={2}><Tag tone="green">Active</Tag><Tag tone="blue">Design team</Tag></Inline>
            <Input label="Work email" type="email" defaultValue="amina@example.com" />
            <InlineMessage title="All changes saved" tone="success">Your profile is up to date.</InlineMessage>
          </Stack>
        </Card>
        <Card>
          <Stack gap={3}>
            <h2>Use it in your app</h2>
            <p>Install the React package and an approved brand package, import the stylesheet once, then wrap the application with the matching theme provider.</p>
            <pre><code>{`pnpm add @dechasaejara/react @dechasaejara/brand-client-alpha`}</code></pre>
            <Button variant="ghost">Explore components</Button>
          </Stack>
        </Card>
      </section>
    </main>
  );
}
