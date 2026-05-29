import { describe, expect, it } from "vitest";
import type { Mode, ModeContext } from "../types";
import arrowUp from "../signatures/arrow-up";
import arrowDown from "../signatures/arrow-down";
import arrowLeft from "../signatures/arrow-left";
import arrowRight from "../signatures/arrow-right";
import arrowUpRight from "../signatures/arrow-up-right";
import arrowUpLeft from "../signatures/arrow-up-left";
import arrowDownRight from "../signatures/arrow-down-right";
import arrowDownLeft from "../signatures/arrow-down-left";
import moveUp from "../signatures/move-up";
import moveDown from "../signatures/move-down";
import moveLeft from "../signatures/move-left";
import moveRight from "../signatures/move-right";

/**
 * Round-2 arrow subject consistency. Every arrow / move icon glides
 * in its named direction (closed cycle: x and y bookend at 0; peak
 * sign matches the direction).
 */
const arrowVariants: Array<{
  iconName: string;
  signature: Mode;
  expectedSign: { x: number; y: number };
}> = [
  { iconName: "arrow-up", signature: arrowUp, expectedSign: { x: 0, y: -1 } },
  { iconName: "arrow-down", signature: arrowDown, expectedSign: { x: 0, y: 1 } },
  { iconName: "arrow-left", signature: arrowLeft, expectedSign: { x: -1, y: 0 } },
  { iconName: "arrow-right", signature: arrowRight, expectedSign: { x: 1, y: 0 } },
  { iconName: "arrow-up-right", signature: arrowUpRight, expectedSign: { x: 1, y: -1 } },
  { iconName: "arrow-up-left", signature: arrowUpLeft, expectedSign: { x: -1, y: -1 } },
  { iconName: "arrow-down-right", signature: arrowDownRight, expectedSign: { x: 1, y: 1 } },
  { iconName: "arrow-down-left", signature: arrowDownLeft, expectedSign: { x: -1, y: 1 } },
  { iconName: "move-up", signature: moveUp, expectedSign: { x: 0, y: -1 } },
  { iconName: "move-down", signature: moveDown, expectedSign: { x: 0, y: 1 } },
  { iconName: "move-left", signature: moveLeft, expectedSign: { x: -1, y: 0 } },
  { iconName: "move-right", signature: moveRight, expectedSign: { x: 1, y: 0 } },
];

function ctx(iconName: string): ModeContext {
  return {
    iconName,
    index: 0,
    pathTag: "path",
    pathAttrs: { d: "M0 0h1" },
    duration: 1,
    delay: 0,
    stagger: 0,
    easing: "easeOut",
    repeat: 0,
    pathLength: 100,
  };
}

function sign(value: number): number {
  if (value > 0) return 1;
  if (value < 0) return -1;
  return 0;
}

describe("arrow subject — Round 2 consistency", () => {
  it("every arrow glides in its named direction with a closed cycle", () => {
    for (const variant of arrowVariants) {
      const active = variant.signature.factory(ctx(variant.iconName))
        .active as Record<string, unknown>;
      const x = active.x as number[];
      const y = active.y as number[];

      expect(x[0]).toBe(0);
      expect(x[x.length - 1]).toBe(0);
      expect(y[0]).toBe(0);
      expect(y[y.length - 1]).toBe(0);

      expect(sign(x[1])).toBe(variant.expectedSign.x);
      expect(sign(y[1])).toBe(variant.expectedSign.y);
    }
  });
});
