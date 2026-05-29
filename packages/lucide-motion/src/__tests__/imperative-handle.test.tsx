// @vitest-environment jsdom
import { createRef } from "react";
import { describe, expect, it, vi, afterEach } from "vitest";
import { act, render } from "@testing-library/react";
import Rocket from "../generated/rocket";
import type { MotionIconHandle } from "../engine";

afterEach(() => vi.restoreAllMocks());

describe("imperative handle (trigger=manual)", () => {
  it("exposes play/reset/node, with node pointing at the rendered svg", () => {
    const ref = createRef<MotionIconHandle>();
    const { container } = render(<Rocket trigger="manual" ref={ref} />);
    expect(typeof ref.current?.play).toBe("function");
    expect(typeof ref.current?.reset).toBe("function");
    expect(ref.current?.node).toBe(container.querySelector("svg"));
  });

  it("play()/reset() run without throwing under normal motion", () => {
    const ref = createRef<MotionIconHandle>();
    render(<Rocket trigger="manual" ref={ref} />);
    expect(() => act(() => ref.current?.play())).not.toThrow();
    expect(() => act(() => ref.current?.reset())).not.toThrow();
  });

  it("play()/reset() are silent no-ops under reduced motion", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const ref = createRef<MotionIconHandle>();
    const { container } = render(
      <Rocket trigger="manual" reducedMotion="always" ref={ref} />
    );

    act(() => {
      ref.current?.play();
      ref.current?.reset();
    });

    // No motion "no component is using these animation controls" warning,
    // and the icon stays resting.
    const motionControlsWarning = warn.mock.calls.some((args) =>
      args.some(
        (a) => typeof a === "string" && a.includes("animation controls")
      )
    );
    expect(motionControlsWarning).toBe(false);
    expect(container.querySelector("svg")).toHaveAttribute(
      "data-motion-state",
      "resting"
    );
  });
});
