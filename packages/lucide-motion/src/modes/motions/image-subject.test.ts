import { describe, expect, it } from "vitest";
import type { ModeContext } from "../types";
import image from "../signatures/image";

type TestNode = [tag: string, attrs: Record<string, string | number>];

function ctx(iconName: string, index: number, [pathTag, pathAttrs]: TestNode): ModeContext {
  return {
    iconName,
    index,
    pathTag,
    pathAttrs,
    duration: 1,
    delay: 0,
    stagger: 0,
    easing: "easeInOut",
    repeat: 0,
    pathLength: 100,
  };
}

describe("image subject — Round 2 baseline", () => {
  it("standalone image: sun pulses, mountain dims, frame dips", () => {
    const sun = image.factory(
      ctx("image", 1, ["circle", { cx: "9", cy: "9", r: "2" }])
    ).active as Record<string, unknown>;
    const sunScale = sun.scale as number[];
    expect(sunScale[0]).toBe(1);
    expect(sunScale[sunScale.length - 1]).toBe(1);
    expect(sun.transformOrigin).toBe("9px 9px");

    const mountain = image.factory(
      ctx("image", 2, [
        "path",
        { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" },
      ])
    ).active as Record<string, unknown>;
    const mountainOpacity = mountain.opacity as number[];
    expect(mountainOpacity[0]).toBe(1);
    expect(mountainOpacity[mountainOpacity.length - 1]).toBe(1);

    const frame = image.factory(
      ctx("image", 0, [
        "rect",
        { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2" },
      ])
    ).active as Record<string, unknown>;
    expect("strokeDasharray" in frame).toBe(false);
    const frameScale = frame.scale as number[];
    expect(frameScale[0]).toBe(1);
    expect(frameScale[frameScale.length - 1]).toBe(1);
  });
});
