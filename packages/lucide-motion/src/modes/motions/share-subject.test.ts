import { describe, expect, it } from "vitest";
import type { ModeContext } from "../types";
import share from "../signatures/share";
import share2 from "../signatures/share-2";
import messageSquareShare from "../signatures/message-square-share";

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

describe("share subject — Round 2 baseline", () => {
  it("standalone share: arrow shaft + head lift up out of box", () => {
    const shaft = share.factory(
      ctx("share", 0, ["path", { d: "M12 2v13" }])
    ).active as Record<string, unknown>;
    const head = share.factory(
      ctx("share", 1, ["path", { d: "m16 6-4-4-4 4" }])
    ).active as Record<string, unknown>;
    for (const arrow of [shaft, head]) {
      const y = arrow.y as number[];
      expect(y[0]).toBe(0);
      expect(y[y.length - 1]).toBe(0);
      expect(y[1]).toBeLessThan(0);
    }
  });

  it("share-2: source node pulses, links shimmer, destinations pulse", () => {
    const sourceNode = share2.factory(
      ctx("share-2", 1, ["circle", { cx: "6", cy: "12", r: "3" }])
    ).active as Record<string, unknown>;
    const sourceScale = sourceNode.scale as number[];
    expect(sourceScale[0]).toBe(1);
    expect(sourceScale[sourceScale.length - 1]).toBe(1);
    expect(sourceNode.transformOrigin).toBe("6px 12px");

    const link = share2.factory(
      ctx("share-2", 3, [
        "line",
        { x1: "8.59", x2: "15.42", y1: "13.51", y2: "17.49" },
      ])
    ).active as Record<string, unknown>;
    const linkOpacity = link.opacity as number[];
    expect(linkOpacity[0]).toBe(1);
    expect(linkOpacity[linkOpacity.length - 1]).toBe(1);
  });

  it("message-square-share: external arrow nudges up-right (kept its bespoke motion)", () => {
    const arrow = messageSquareShare.factory(
      ctx("message-square-share", 1, ["path", { d: "m16 9 6-6" }])
    ).active as Record<string, unknown>;
    expect("strokeDasharray" in arrow).toBe(false);
    const y = arrow.y as number[];
    expect(y[0]).toBe(0);
    expect(y[y.length - 1]).toBe(0);
  });
});
