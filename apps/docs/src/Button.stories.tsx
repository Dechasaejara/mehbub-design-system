import type { Meta, StoryObj } from "@storybook/react";
import type { ReactNode } from "react";
import { AgencyProvider, Button } from "@dechasaejara/react";
import { ClientAlphaTheme } from "@dechasaejara/brand-client-alpha";

const meta: Meta<typeof Button> = {
  title: "Foundation/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Use Button for actions. Choose a variant by emphasis, keep a visible label, and use `type=\"submit\"` only for form submission. Loading disables activation and announces the busy state."
      }
    }
  }
};
export default meta;
type Story = StoryObj<typeof Button>;
const withBrand = (button: ReactNode) => <AgencyProvider theme={ClientAlphaTheme} style={{ padding: 24 }}>{button}</AgencyProvider>;

export const Primary: Story = { render: args => withBrand(<Button {...args}>Get started</Button>) };
export const Secondary: Story = { render: args => withBrand(<Button {...args} variant="secondary">Learn more</Button>) };
export const Ghost: Story = { render: args => withBrand(<Button {...args} variant="ghost">View details</Button>) };
export const Loading: Story = { render: args => withBrand(<Button {...args} loading>Save changes</Button>) };
export const Disabled: Story = { render: args => withBrand(<Button {...args} disabled>Unavailable</Button>) };
export const DarkMode: Story = { render: args => <AgencyProvider theme={ClientAlphaTheme} mode="dark" style={{ padding: 24 }}><Button {...args}>Dark theme</Button></AgencyProvider> };
