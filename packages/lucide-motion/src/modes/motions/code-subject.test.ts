import { beforeEach, describe, expect, it, vi } from "vitest";
import { __resetComposeWarnings } from "../compose";
import type { Mode, ModeContext } from "../types";
import code from "../signatures/code";
import codeXml from "../signatures/code-xml";
import folderCode from "../signatures/folder-code";
import messageCircleCode from "../signatures/message-circle-code";
import messageSquareCode from "../signatures/message-square-code";
import searchCode from "../signatures/search-code";

type TestNode = [tag: string, attrs: Record<string, string | number>];

/**
 * Round-2 code subject consistency. Every chevron across every code-
 * bearing signature must resolve to the `codeSymbol` pinch (`x`
 * translate ending at 0, NO `strokeDasharray`), with the left
 * bracket translating positively and the right bracket negatively.
 */
const codeVariants: Array<{
  iconName: string;
  signature: Mode;
  left: TestNode;
  right: TestNode;
}> = [
  {
    iconName: "code",
    signature: code,
    left: ["path", { d: "m8 6-6 6 6 6" }],
    right: ["path", { d: "m16 18 6-6-6-6" }],
  },
  {
    iconName: "code-xml",
    signature: codeXml,
    left: ["path", { d: "m6 8-4 4 4 4" }],
    right: ["path", { d: "m18 16 4-4-4-4" }],
  },
  {
    iconName: "folder-code",
    signature: folderCode,
    left: ["path", { d: "M10 10.5 8 13l2 2.5" }],
    right: ["path", { d: "m14 10.5 2 2.5-2 2.5" }],
  },
  {
    iconName: "message-circle-code",
    signature: messageCircleCode,
    left: ["path", { d: "m10 9-3 3 3 3" }],
    right: ["path", { d: "m14 15 3-3-3-3" }],
  },
  {
    iconName: "message-square-code",
    signature: messageSquareCode,
    left: ["path", { d: "m10 8-3 3 3 3" }],
    right: ["path", { d: "m14 14 3-3-3-3" }],
  },
  {
    iconName: "search-code",
    signature: searchCode,
    left: ["path", { d: "M9 8.5 7 11l2 2.5" }],
    right: ["path", { d: "m13 13.5 2-2.5-2-2.5" }],
  },
];

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

describe("code subject — Round 2 consistency", () => {
  beforeEach(() => {
    __resetComposeWarnings();
  });

  it("chevrons pinch inward across every code-bearing signature", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    for (const variant of codeVariants) {
      const leftActive = variant.signature.factory(
        ctx(variant.iconName, 0, variant.left)
      ).active as Record<string, unknown>;
      expect(
        "strokeDasharray" in leftActive,
        `${variant.iconName} left chevron fell through; codeSymbol must claim it first`
      ).toBe(false);
      const leftX = leftActive.x as number[];
      expect(leftX[0]).toBe(0);
      expect(leftX[leftX.length - 1]).toBe(0);
      expect(leftX[1]).toBeGreaterThan(0);

      const rightActive = variant.signature.factory(
        ctx(variant.iconName, 1, variant.right)
      ).active as Record<string, unknown>;
      expect(
        "strokeDasharray" in rightActive,
        `${variant.iconName} right chevron fell through; codeSymbol must claim it first`
      ).toBe(false);
      const rightX = rightActive.x as number[];
      expect(rightX[0]).toBe(0);
      expect(rightX[rightX.length - 1]).toBe(0);
      expect(rightX[1]).toBeLessThan(0);
    }

    expect(warnSpy).not.toHaveBeenCalled();
  });
});
