import { AgencyProvider, Button, Card } from "@agency/react";
import { ClientAlphaTheme } from "@agency/brand-client-alpha";

const clients = [
  { name: "Client Alpha", industry: "Corporate", preset: "Corporate", version: "0.1.0", color: "#183B61" },
  { name: "Client Beta", industry: "Hospitality", preset: "Warm editorial", version: "0.1.0", color: "#9B603D" }
];

export default function DashboardPage() {
  return <AgencyProvider theme={ClientAlphaTheme}>
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 32 }}>
      <p style={{ color: "#64748B", fontSize: 13 }}>AGENCY WORKSPACE / DESIGN PLATFORM</p>
      <h1>Brand workspace</h1>
      <p style={{ color: "#64748B" }}>Manage client brand configurations and approved design-system versions.</p>
      <div style={{ display: "flex", gap: 12, margin: "24px 0" }}>
        <Button>New client brand</Button><Button variant="secondary">Browse components</Button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 16 }}>
        {clients.map(client => <Card key={client.name}>
          <div style={{ height: 10, borderRadius: 8, background: client.color }} />
          <h2>{client.name}</h2><p>{client.industry}</p>
          <p style={{ color: "#64748B", fontSize: 13 }}>Preset: {client.preset}</p>
          <p style={{ color: "#64748B", fontSize: 13 }}>Platform version: {client.version}</p>
        </Card>)}
      </div>
      <p style={{ marginTop: 32, color: "#64748B", fontSize: 13 }}>Starter UI only. Add authentication, role-based access, audit logging and persistence before exposing this dashboard or storing client data.</p>
    </main>
  </AgencyProvider>;
}
