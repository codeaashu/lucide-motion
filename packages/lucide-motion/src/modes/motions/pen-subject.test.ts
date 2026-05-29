import { beforeEach, describe, expect, it, vi } from "vitest";
import { __resetComposeWarnings } from "../compose";
import type { Mode, ModeContext } from "../types";
import pen from "../signatures/pen";
import pencil from "../signatures/pencil";
import penLine from "../signatures/pen-line";
import pencilLine from "../signatures/pencil-line";
import folderPen from "../signatures/folder-pen";

type TestNode = [tag: string, attrs: Record<string, string | number>];

/**
 * Round-2 pen subject consistency. Every pen body across every pen-
 * bearing signature must resolve to the `penWrite` wobble (`rotate`
 * keyframes ending at 0, `transformOrigin: "50% 50%"`, NO
 * `strokeDasharray`).
 */
const STANDALONE_PEN_D =
  "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z";

const penVariants: Array<{
  iconName: string;
  signature: Mode;
  body: TestNode;
}> = [
  { iconName: "pen", signature: pen, body: ["path", { d: STANDALONE_PEN_D }] },
  { iconName: "pencil", signature: pencil, body: ["path", { d: STANDALONE_PEN_D }] },
  { iconName: "pen-line", signature: penLine, body: ["path", { d: STANDALONE_PEN_D }] },
  { iconName: "pencil-line", signature: pencilLine, body: ["path", { d: STANDALONE_PEN_D }] },
  {
    iconName: "folder-pen",
    signature: folderPen,
    body: [
      "path",
      {
        d: "M11.378 13.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z",
      },
    ],
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

describe("pen subject — Round 2 consistency", () => {
  beforeEach(() => {
    __resetComposeWarnings();
  });

  it("every pen body resolves to the penWrite wobble", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    for (const variant of penVariants) {
      const resolved = variant.signature.factory(
        ctx(variant.iconName, 0, variant.body)
      );
      const active = resolved.active as Record<string, unknown>;

      expect(
        "strokeDasharray" in active,
        `${variant.iconName} pen body fell through to a draw-on; penWrite must claim it first`
      ).toBe(false);

      const rotate = active.rotate as number[] | undefined;
      expect(
        Array.isArray(rotate) && rotate[0] === 0 && rotate[rotate.length - 1] === 0,
        `${variant.iconName} pen body should wobble (rotate closed cycle); got ${JSON.stringify(rotate)}`
      ).toBe(true);

      expect(active.transformOrigin).toBe("50% 50%");
    }

    expect(warnSpy).not.toHaveBeenCalled();
  });
});
