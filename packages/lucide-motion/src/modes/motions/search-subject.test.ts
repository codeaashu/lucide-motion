import { describe, expect, it } from "vitest";
import type { Mode, ModeContext } from "../types";
import search from "../signatures/search";
import searchCheck from "../signatures/search-check";
import searchCode from "../signatures/search-code";
import scanSearch from "../signatures/scan-search";
import mailSearch from "../signatures/mail-search";
import folderSearch from "../signatures/folder-search";
import folderSearch2 from "../signatures/folder-search-2";

type TestNode = [tag: string, attrs: Record<string, string | number>];

/**
 * Round-2 search subject consistency. Every loupe element across
 * every signed search-bearing signature must resolve to `searchLoupe`
 * (rotate keyframes ending at 0, NO `strokeDasharray`).
 */
const searchVariants: Array<{
  iconName: string;
  signature: Mode;
  loupe: TestNode;
  handle: TestNode;
}> = [
  {
    iconName: "search",
    signature: search,
    loupe: ["circle", { cx: "11", cy: "11", r: "8" }],
    handle: ["path", { d: "m21 21-4.34-4.34" }],
  },
  {
    iconName: "search-check",
    signature: searchCheck,
    loupe: ["circle", { cx: "11", cy: "11", r: "8" }],
    handle: ["path", { d: "m21 21-4.3-4.3" }],
  },
  {
    iconName: "search-code",
    signature: searchCode,
    loupe: ["circle", { cx: "11", cy: "11", r: "8" }],
    handle: ["path", { d: "m21 21-4.3-4.3" }],
  },
  {
    iconName: "scan-search",
    signature: scanSearch,
    loupe: ["circle", { cx: "12", cy: "12", r: "3" }],
    handle: ["path", { d: "m16 16-1.9-1.9" }],
  },
  {
    iconName: "mail-search",
    signature: mailSearch,
    loupe: ["circle", { cx: "18", cy: "18", r: "3" }],
    handle: ["path", { d: "m22 22-1.5-1.5" }],
  },
  {
    iconName: "folder-search",
    signature: folderSearch,
    loupe: ["circle", { cx: "17", cy: "17", r: "3" }],
    handle: ["path", { d: "m21 21-1.9-1.9" }],
  },
  {
    iconName: "folder-search-2",
    signature: folderSearch2,
    loupe: ["circle", { cx: "11.5", cy: "12.5", r: "2.5" }],
    handle: ["path", { d: "M13.3 14.3 15 16" }],
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

describe("search subject — Round 2 consistency", () => {
  it("every loupe + handle wobbles via searchLoupe across every signed composite", () => {
    for (const variant of searchVariants) {
      for (const node of [variant.loupe, variant.handle]) {
        const active = variant.signature.factory(ctx(variant.iconName, 0, node))
          .active as Record<string, unknown>;
        expect(
          "strokeDasharray" in active,
          `${variant.iconName} loupe element ${JSON.stringify(node)} fell through; searchLoupe must claim it first`
        ).toBe(false);
        const rotate = active.rotate as number[] | undefined;
        expect(
          Array.isArray(rotate) && rotate[0] === 0 && rotate[rotate.length - 1] === 0,
          `${variant.iconName} loupe element should wobble (rotate closed cycle); got ${JSON.stringify(rotate)}`
        ).toBe(true);
      }
    }
  });
});
