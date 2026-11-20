import type { Meta, StoryObj } from "@storybook/react";
import { AgencyProvider, Button } from "@agency/react";
import { ClientAlphaTheme } from "@agency/brand-client-alpha";

const meta: Meta<typeof Button> = { title: "Foundation/Button", component: Button };
export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = { render: args => <AgencyProvider theme={ClientAlphaTheme}><Button {...args}>Get started</Button></AgencyProvider> };
export const Secondary: Story = { render: args => <AgencyProvider theme={ClientAlphaTheme}><Button {...args} variant="secondary">Learn more</Button></AgencyProvider> };
