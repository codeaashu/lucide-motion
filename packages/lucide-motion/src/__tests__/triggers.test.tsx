// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Heart from "../generated/heart";
import Bell from "../generated/bell";

const state = (c: HTMLElement) =>
  c.querySelector("svg")!.getAttribute("data-motion-state");

describe("trigger state machine", () => {
  it("trigger=mount plays on first paint", () => {
    // Long duration so the draw is still in flight when we read the state.
    const { container } = render(<Heart trigger="mount" duration={1} />);
    expect(state(container)).toBe("drawing");
  });

  it("trigger=mount under reduced motion does not play", () => {
    const { container } = render(
      <Heart trigger="mount" reducedMotion="always" duration={1} />
    );
    expect(state(container)).toBe("resting");
  });

  it("does not replay when trigger is switched to mount after first paint", () => {
    // First paint with trigger=hover → no mount fire.
    const { container, rerender } = render(
      <Heart trigger="hover" duration={1} />
    );
    expect(state(container)).toBe("resting");

    // Switching into mount later must NOT replay — the mount moment passed.
    rerender(<Heart trigger="mount" duration={1} />);
    expect(state(container)).toBe("resting");
  });

  it("trigger=click plays on click", async () => {
    const user = userEvent.setup();
    const { container } = render(<Bell trigger="click" duration={1} />);
    expect(state(container)).toBe("resting");
    await user.click(container.querySelector("svg")!);
    expect(state(container)).toBe("drawing");
  });

  it("trigger=click plays on keyboard activation", async () => {
    const user = userEvent.setup();
    const { container } = render(<Bell trigger="click" duration={1} />);
    const svg = container.querySelector("svg")!;
    svg.focus();
    await user.keyboard("{Enter}");
    expect(state(container)).toBe("drawing");
  });
});
