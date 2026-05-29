import { beforeEach, describe, expect, it, vi } from "vitest";
import { __resetComposeWarnings } from "../compose";
import type { Mode, ModeContext } from "../types";
import battery from "../signatures/battery";
import batteryCharging from "../signatures/battery-charging";
import batteryFull from "../signatures/battery-full";
import batteryLow from "../signatures/battery-low";
import batteryMedium from "../signatures/battery-medium";
import batteryPlus from "../signatures/battery-plus";
import batteryWarning from "../signatures/battery-warning";
import {
  BATTERY_CELL_KEYFRAMES,
  batteryCellFill,
} from "./battery-cell-fill";

type TestNode = [tag: string, attrs: Record<string, string | number>];

const variants: Array<{
  iconName: string;
  signature: Mode;
  nodes: TestNode[];
}> = [
  {
    iconName: "battery",
    signature: battery,
    nodes: [
      ["path", { d: "M 22 14 L 22 10" }],
      ["rect", { x: "2", y: "6", width: "16", height: "12", rx: "2" }],
    ],
  },
  {
    iconName: "battery-low",
    signature: batteryLow,
    nodes: [
      ["path", { d: "M22 14v-4" }],
      ["path", { d: "M6 14v-4" }],
      ["rect", { x: "2", y: "6", width: "16", height: "12", rx: "2" }],
    ],
  },
  {
    iconName: "battery-medium",
    signature: batteryMedium,
    nodes: [
      ["path", { d: "M10 14v-4" }],
      ["path", { d: "M22 14v-4" }],
      ["path", { d: "M6 14v-4" }],
      ["rect", { x: "2", y: "6", width: "16", height: "12", rx: "2" }],
    ],
  },
  {
    iconName: "battery-full",
    signature: batteryFull,
    nodes: [
      ["path", { d: "M10 10v4" }],
      ["path", { d: "M14 10v4" }],
      ["path", { d: "M22 14v-4" }],
      ["path", { d: "M6 10v4" }],
      ["rect", { x: "2", y: "6", width: "16", height: "12", rx: "2" }],
    ],
  },
  {
    iconName: "battery-charging",
    signature: batteryCharging,
    nodes: [
      ["path", { d: "m11 7-3 5h4l-3 5" }],
      [
        "path",
        { d: "M14.856 6H16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.935" },
      ],
      ["path", { d: "M22 14v-4" }],
      [
        "path",
        { d: "M5.14 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2.936" },
      ],
    ],
  },
  {
    iconName: "battery-plus",
    signature: batteryPlus,
    nodes: [
      ["path", { d: "M10 9v6" }],
      [
        "path",
        { d: "M12.543 6H16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3.605" },
      ],
      ["path", { d: "M22 14v-4" }],
      ["path", { d: "M7 12h6" }],
      [
        "path",
        { d: "M7.606 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.606" },
      ],
    ],
  },
  {
    iconName: "battery-warning",
    signature: batteryWarning,
    nodes: [
      ["path", { d: "M10 17h.01" }],
      ["path", { d: "M10 7v6" }],
      ["path", { d: "M14 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2" }],
      ["path", { d: "M22 14v-4" }],
      ["path", { d: "M6 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2" }],
    ],
  },
];

function ctx(iconName: string, index: number, [pathTag, pathAttrs]: TestNode): ModeContext {
  return {
    iconName,
    index,
    pathTag,
    pathAttrs,
    duration: 1.1,
    delay: 0,
    stagger: 0,
    easing: "easeOut",
    repeat: 0,
    pathLength: 100,
  };
}

describe("battery family signatures", () => {
  beforeEach(() => {
    __resetComposeWarnings();
  });

  it("matches every node in every battery variant without draw-on fallback", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    for (const variant of variants) {
      variant.nodes.forEach((node, index) => {
        const resolved = variant.signature.factory(
          ctx(variant.iconName, index, node)
        );
        // Draw mode's fingerprint is `strokeDasharray` on the active variant;
        // a bespoke battery motion must not produce it.
        expect(
          "strokeDasharray" in (resolved.active as Record<string, unknown>)
        ).toBe(false);
      });
    }

    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("ripples charge cells from their own bottom baseline", () => {
    const variants = batteryCellFill.factory(
      ctx("battery-full", 1, ["path", { d: "M14 10v4" }])
    );

    expect(variants.rest).toMatchObject({
      scaleY: 1,
      opacity: 1,
      transformBox: "view-box",
      transformOrigin: "14px 14px",
    });
    expect(variants.active).toMatchObject({
      scaleY: BATTERY_CELL_KEYFRAMES.scaleY,
      opacity: BATTERY_CELL_KEYFRAMES.opacity,
      transformBox: "view-box",
      transformOrigin: "14px 14px",
    });
  });
});
