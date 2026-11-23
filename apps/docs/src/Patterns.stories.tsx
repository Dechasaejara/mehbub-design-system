import type { Meta, StoryObj } from "@storybook/react";
import type { ReactNode } from "react";
import { AgencyProvider, Avatar, Badge, Inline, InlineMessage, Stack, Tag } from "@dechasaejara/react";
import { ClientAlphaTheme } from "@dechasaejara/brand-client-alpha";

const meta: Meta = { title: "Components/Patterns", tags: ["autodocs"] };
export default meta;
type Story = StoryObj;
const frame = (children: ReactNode) => <AgencyProvider theme={ClientAlphaTheme}><div style={{ display: "grid", gap: 24, padding: 24, maxWidth: 560 }}>{children}</div></AgencyProvider>;

export const IdentityAndStatus: Story = {
  render: () => frame(<>
    <Inline gap={3}><Avatar name="Amina Yusuf" size="lg" /><Stack gap={1}><strong>Amina Yusuf <Badge value={3} tone="info" /></strong><span className="agency-muted">Product designer</span></Stack><Tag tone="green">Active</Tag></Inline>
    <Inline gap={2}><Tag>Design system</Tag><Tag tone="blue">Review</Tag><Tag tone="amber">Needs approval</Tag><Tag tone="red">Blocked</Tag></Inline>
  </>)
};
export const Messages: Story = {
  render: () => frame(<Stack gap={2}>
    <InlineMessage title="Changes saved" tone="success">Your brand tokens are up to date.</InlineMessage>
    <InlineMessage title="Review required" tone="warning">Two changes need approval before release.</InlineMessage>
    <InlineMessage title="Could not publish" tone="error">Check the package registry permissions and try again.</InlineMessage>
  </Stack>)
};
export const LayoutPrimitives: Story = {
  render: () => frame(<Stack gap={4}><strong>Vertical stack</strong><Inline gap={2}><Tag>One</Tag><Tag>Two</Tag><Tag>Three</Tag></Inline><InlineMessage>Use Stack and Inline to build token-spaced layouts.</InlineMessage></Stack>)
};
