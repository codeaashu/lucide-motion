import { beforeEach, describe, expect, it, vi } from "vitest";
import { __resetComposeWarnings } from "../compose";
import type { Mode, ModeContext } from "../types";
import cog from "../signatures/cog";
import settings from "../signatures/settings";
import cloudCog from "../signatures/cloud-cog";
import monitorCog from "../signatures/monitor-cog";
import wifiCog from "../signatures/wifi-cog";

type TestNode = [tag: string, attrs: Record<string, string | number>];

/**
 * Round-2 subject consistency test. Every cog element across every
 * cog-bearing signature must resolve to `cogGear`'s rotation — not to
 * the family's modifier-reveal draw-on. The fingerprint of a real
 * rotation is `rotate` ending at 360 in the active variant; the
 * fingerprint of a draw-on is `strokeDasharray`. Asserting the
 * absence of `strokeDasharray` and the presence of `rotate: 360`
 * proves the cog teeth are claimed by the subject motion before any
 * family wildcard.
 */
const cogVariants: Array<{
  iconName: string;
  signature: Mode;
  cogNodes: TestNode[];
}> = [
  {
    iconName: "cog",
    signature: cog,
    cogNodes: [
      ["path", { d: "M11 10.27 7 3.34" }],
      ["path", { d: "M14 12h8" }],
      ["circle", { cx: "12", cy: "12", r: "2" }],
      ["circle", { cx: "12", cy: "12", r: "8" }],
    ],
  },
  {
    iconName: "cloud-cog",
    signature: cloudCog,
    cogNodes: [
      ["path", { d: "m14.772 15.852.923-.383" }],
      ["path", { d: "M13.148 19.772a3 3 0 1 0-2.296-5.544l-.383-.923" }],
    ],
  },
  {
    iconName: "wifi-cog",
    signature: wifiCog,
    cogNodes: [
      ["path", { d: "m16.852 15.228-.383-.923" }],
      ["circle", { cx: "18", cy: "18", r: "3" }],
    ],
  },
  {
    iconName: "monitor-cog",
    signature: monitorCog,
    cogNodes: [
      ["path", { d: "m14.305 7.53.923-.382" }],
      ["circle", { cx: "18", cy: "6", r: "3" }],
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

describe("cog subject — Round 2 consistency", () => {
  beforeEach(() => {
    __resetComposeWarnings();
  });

  it("every cog element resolves to a rotation, never a family draw-on", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    for (const variant of cogVariants) {
      variant.cogNodes.forEach((node, index) => {
        const resolved = variant.signature.factory(
          ctx(variant.iconName, index, node)
        );
        const active = resolved.active as Record<string, unknown>;

        expect(
          "strokeDasharray" in active,
          `${variant.iconName} cog node ${JSON.stringify(node)} fell through to a draw-on; cogGear must claim it first`
        ).toBe(false);

        const rotate = active.rotate as number[] | undefined;
        expect(
          Array.isArray(rotate) && rotate[rotate.length - 1] === 360,
          `${variant.iconName} cog node ${JSON.stringify(node)} should rotate to 360 via cogGear (got ${JSON.stringify(rotate)})`
        ).toBe(true);
      });
    }

    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("settings icon rotates as one piece", () => {
    const settingsNodes: TestNode[] = [
      [
        "path",
        {
          d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
        },
      ],
      ["circle", { cx: "12", cy: "12", r: "3" }],
    ];

    settingsNodes.forEach((node, index) => {
      const resolved = settings.factory(ctx("settings", index, node));
      const active = resolved.active as Record<string, unknown>;
      const rotate = active.rotate as number[] | undefined;
      expect(Array.isArray(rotate) && rotate[rotate.length - 1] === 360).toBe(
        true
      );
    });
  });
});
