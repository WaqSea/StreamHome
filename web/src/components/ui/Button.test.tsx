import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./Button";

describe("button motion contract", () => {
  it("uses scale and lift hover motion without hover color replacement", () => {
    render(<Button>Continue</Button>);
    const className = screen.getByRole("button", { name: "Continue" }).className;
    expect(className).toContain("hover:scale-[1.04]");
    expect(className).toContain("hover:-translate-y-0.5");
    expect(className).not.toContain("hover:bg-");
    expect(className).not.toContain("hover:text-");
  });
});
