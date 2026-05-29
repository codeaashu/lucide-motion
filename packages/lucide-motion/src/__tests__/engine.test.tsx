// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Heart from "../generated/heart";

describe("engine render smoke", () => {
  it("renders an svg with Lucide-parity attributes", () => {
    const { container } = render(<Heart size={32} data-testid="heart" />);
    const svg = container.querySelector("svg")!;
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("width", "32");
    expect(svg).toHaveAttribute("height", "32");
    expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
    expect(svg).toHaveAttribute("stroke", "currentColor");
    expect(svg).toHaveAttribute("data-motion-state", "resting");
    // The heart path is rendered.
    expect(svg.querySelector("path")).toBeInTheDocument();
  });

  it("forwards data-* and className", () => {
    render(<Heart className="text-rose-500" data-testid="heart" />);
    const svg = screen.getByTestId("heart");
    expect(svg).toHaveClass("text-rose-500");
  });
});
