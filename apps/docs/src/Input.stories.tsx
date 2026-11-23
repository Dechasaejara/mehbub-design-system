import type { Meta, StoryObj } from "@storybook/react";
import type { ReactNode } from "react";
import { AgencyProvider, Input } from "@dechasaejara/react";
import { ClientAlphaTheme } from "@dechasaejara/brand-client-alpha";

const meta: Meta<typeof Input> = {
  title: "Forms/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Prefer a visible label. Use hint for persistent instructions and error for validation feedback. The input associates its message with `aria-describedby`, exposes invalid state, and announces errors."
      }
    }
  }
};
export default meta;
type Story = StoryObj<typeof Input>;
const frame = (input: ReactNode) => <AgencyProvider theme={ClientAlphaTheme} style={{ padding: 24, maxWidth: 420 }}>{input}</AgencyProvider>;

export const Default: Story = { render: args => frame(<Input {...args} id="email" label="Email address" placeholder="name@example.com" />) };
export const WithHint: Story = { render: args => frame(<Input {...args} id="email-hint" label="Work email" hint="We use this for your account only." placeholder="name@company.com" />) };
export const Invalid: Story = { render: args => frame(<Input {...args} id="email-error" label="Email address" error="Enter a valid email address." defaultValue="not-an-email" />) };
