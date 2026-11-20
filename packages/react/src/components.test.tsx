import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import { Button } from "./components";

describe("Button", () => {
  it("renders its label and variant class", () => {
    const html = renderToStaticMarkup(<Button variant="secondary">Save</Button>);
    expect(html).toContain("Save");
    expect(html).toContain("agency-button--secondary");
  });
});
