// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Heart from "../generated/heart";
import Bell from "../generated/bell";
import { MotionIconConfig, PARENT_HOVER_ATTR } from "../engine";

const state = (root: ParentNode) =>
  root.querySelector("svg")!.getAttribute("data-motion-state");

describe("parent-hover trigger", () => {
  it("plays when the [data-motion-icon-group] ancestor is hovered", () => {
    const { container } = render(
      <div {...{ [PARENT_HOVER_ATTR]: true }}>
        <Bell trigger="parent-hover" duration={1} />
      </div>
    );
    const group = container.querySelector(`[${PARENT_HOVER_ATTR}]`)!;
    expect(state(container)).toBe("resting");
    fireEvent.mouseEnter(group);
    expect(state(container)).toBe("drawing");
  });

  it("onLeave='snap' returns to rest when the ancestor hover ends", () => {
    const { container } = render(
      <div {...{ [PARENT_HOVER_ATTR]: true }}>
        <Bell trigger="parent-hover" onLeave="snap" duration={1} />
      </div>
    );
    const group = container.querySelector(`[${PARENT_HOVER_ATTR}]`)!;
    fireEvent.mouseEnter(group);
    expect(state(container)).toBe("drawing");
    fireEvent.mouseLeave(group);
    expect(state(container)).toBe("resting");
  });
});

describe("reduced motion", () => {
  it("suppresses the hover animation entirely", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Heart trigger="hover" reducedMotion="always" duration={1} />
    );
    const svg = container.querySelector("svg")!;
    await user.hover(svg);
    expect(svg.getAttribute("data-motion-state")).toBe("resting");
  });
});

describe("MotionIconConfig", () => {
  it("applies a provider default trigger to descendants", () => {
    const { container } = render(
      <MotionIconConfig trigger="mount" duration={1}>
        <Heart />
      </MotionIconConfig>
    );
    expect(state(container)).toBe("drawing");
  });

  it("lets a per-icon prop override the provider", () => {
    const { container } = render(
      <MotionIconConfig trigger="mount" duration={1}>
        <Heart trigger="hover" />
      </MotionIconConfig>
    );
    // Per-icon trigger=hover wins → no mount fire.
    expect(state(container)).toBe("resting");
  });
});
