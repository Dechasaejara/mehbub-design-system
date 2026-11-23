import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import { Avatar, Badge, Button, Card, Inline, InlineMessage, Input, Stack } from "./components";

describe("Button accessibility and states", () => {
  it("renders a native button with a safe default type and variant class", () => {
    const html = renderToStaticMarkup(<Button variant="secondary">Save</Button>);
    expect(html).toContain('type="button"');
    expect(html).toContain('class="agency-button agency-button--secondary agency-button--md"');
    expect(html).toContain(">Save</button>");
  });

  it("keeps disabled and loading states unavailable and announces busy status", () => {
    const disabled = renderToStaticMarkup(<Button disabled>Save</Button>);
    expect(disabled).toContain("disabled=");
    const loading = renderToStaticMarkup(<Button loading>Submit order</Button>);
    expect(loading).toContain('aria-busy="true"');
    expect(loading).toContain("disabled=");
    expect(loading).toContain("Loading");
  });

  it("allows an explicit submit type and preserves its accessible name", () => {
    const html = renderToStaticMarkup(<Button type="submit" aria-label="Save profile">Save</Button>);
    expect(html).toContain('type="submit"');
    expect(html).toContain('aria-label="Save profile"');
  });
});

describe("Input accessibility", () => {
  it("associates its visible label and hint with the input", () => {
    const html = renderToStaticMarkup(<Input id="email" label="Email address" hint="Use your work email" />);
    expect(html).toContain('<label class="agency-label" for="email">Email address</label>');
    expect(html).toContain('id="email"');
    expect(html).toContain('aria-describedby="email-hint"');
    expect(html).toContain('id="email-hint"');
  });

  it("announces errors, marks invalid input, and retains caller descriptions", () => {
    const html = renderToStaticMarkup(<Input id="email" aria-describedby="privacy-note" label="Email address" hint="Will not be shared" error="Enter a valid email" />);
    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain('aria-describedby="privacy-note email-error"');
    expect(html).toContain('id="email-error" role="alert"');
    expect(html).not.toContain('id="email-hint"');
  });

  it("supports caller-provided accessible names when a visible label is not appropriate", () => {
    const html = renderToStaticMarkup(<Input aria-label="Search components" placeholder="Search" />);
    expect(html).toContain('aria-label="Search components"');
    expect(html).toContain('placeholder="Search"');
  });
});

describe("Card", () => {
  it("renders its content in the card section", () => {
    const html = renderToStaticMarkup(<Card aria-label="Account summary">Balance</Card>);
    expect(html).toContain('<section class="agency-card" aria-label="Account summary">Balance</section>');
  });
});

describe("content, feedback, and layout components", () => {
  it("gives avatars an accessible name and supports decorative use", () => {
    const fallback = renderToStaticMarkup(<Avatar name="Amina Yusuf" />);
    expect(fallback).toContain('role="img" aria-label="Amina Yusuf"');
    expect(fallback).toContain(">AY</span>");
    const decorative = renderToStaticMarkup(<Avatar name="Amina Yusuf" decorative />);
    expect(decorative).toContain('aria-hidden="true"');
    expect(decorative).not.toContain('aria-label="Amina Yusuf"');
  });

  it("renders a count badge and a named status dot", () => {
    const count = renderToStaticMarkup(<Badge value={120} max={99} tone="danger" />);
    expect(count).toContain(">99+</span>");
    const dot = renderToStaticMarkup(<Badge dot label="3 unread notifications" tone="info" />);
    expect(dot).toContain('aria-label="3 unread notifications"');
    expect(dot).toContain("agency-badge-dot");
  });

  it("uses status semantics for messages and alert semantics for errors", () => {
    const info = renderToStaticMarkup(<InlineMessage title="Saved">Changes are ready.</InlineMessage>);
    expect(info).toContain('role="status" aria-live="polite"');
    expect(info).toContain("Changes are ready.");
    const error = renderToStaticMarkup(<InlineMessage tone="error">Publishing failed.</InlineMessage>);
    expect(error).toContain('role="alert"');
  });

  it("renders token-spaced layout primitives", () => {
    const vertical = renderToStaticMarkup(<Stack gap={4}><span>A</span><span>B</span></Stack>);
    expect(vertical).toContain("agency-stack");
    expect(vertical).toContain("--agency-space-4");
    const horizontal = renderToStaticMarkup(<Inline wrap={false}><span>A</span><span>B</span></Inline>);
    expect(horizontal).toContain("agency-inline");
    expect(horizontal).not.toContain("agency-inline--wrap");
  });
});