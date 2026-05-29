import { beforeEach, describe, expect, it, vi } from "vitest";
import { __resetComposeWarnings } from "../compose";
import type { Mode, ModeContext } from "../types";
import lock from "../signatures/lock";
import lockOpen from "../signatures/lock-open";
import lockKeyhole from "../signatures/lock-keyhole";
import lockKeyholeOpen from "../signatures/lock-keyhole-open";
import folderLock from "../signatures/folder-lock";
import messageSquareLock from "../signatures/message-square-lock";

type TestNode = [tag: string, attrs: Record<string, string | number>];

/**
 * Round-2 lock subject consistency. Every lock element across every
 * lock-bearing signature must resolve to the lock motion (`y`
 * translate for shackle, `opacity` dim for body, `scale` dip for the
 * keyhole) — NEVER the family modifier-reveal's `strokeDasharray`
 * draw-on.
 */
const lockVariants: Array<{
  iconName: string;
  signature: Mode;
  shackle: TestNode;
  body: TestNode;
}> = [
  {
    iconName: "lock",
    signature: lock,
    shackle: ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4" }],
    body: ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2" }],
  },
  {
    iconName: "lock-open",
    signature: lockOpen,
    shackle: ["path", { d: "M7 11V7a5 5 0 0 1 9.9-1" }],
    body: ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2" }],
  },
  {
    iconName: "lock-keyhole",
    signature: lockKeyhole,
    shackle: ["path", { d: "M7 10V7a5 5 0 0 1 10 0v3" }],
    body: ["rect", { x: "3", y: "10", width: "18", height: "12", rx: "2" }],
  },
  {
    iconName: "lock-keyhole-open",
    signature: lockKeyholeOpen,
    shackle: ["path", { d: "M7 10V7a5 5 0 0 1 9.33-2.5" }],
    body: ["rect", { width: "18", height: "12", x: "3", y: "10", rx: "2" }],
  },
  {
    iconName: "folder-lock",
    signature: folderLock,
    shackle: ["path", { d: "M20 17v-2a2 2 0 1 0-4 0v2" }],
    body: ["rect", { width: "8", height: "5", x: "14", y: "17", rx: "1" }],
  },
  {
    iconName: "message-square-lock",
    signature: messageSquareLock,
    shackle: ["path", { d: "M20 15v-2a2 2 0 0 0-4 0v2" }],
    body: ["rect", { x: "14", y: "15", width: "8", height: "5", rx: "1" }],
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

describe("lock subject — Round 2 consistency", () => {
  beforeEach(() => {
    __resetComposeWarnings();
  });

  it("shackle translates and body dims across every lock-bearing signature", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    for (const variant of lockVariants) {
      const shackleResolved = variant.signature.factory(
        ctx(variant.iconName, 0, variant.shackle)
      );
      const shackleActive = shackleResolved.active as Record<string, unknown>;
      expect(
        "strokeDasharray" in shackleActive,
        `${variant.iconName} shackle fell through to a draw-on; lockShackle must claim it first`
      ).toBe(false);
      const y = shackleActive.y as number[] | undefined;
      expect(
        Array.isArray(y) && y[0] === 0 && y[y.length - 1] === 0,
        `${variant.iconName} shackle should translate y (closed cycle); got ${JSON.stringify(y)}`
      ).toBe(true);

      const bodyResolved = variant.signature.factory(
        ctx(variant.iconName, 1, variant.body)
      );
      const bodyActive = bodyResolved.active as Record<string, unknown>;
      expect(
        "strokeDasharray" in bodyActive,
        `${variant.iconName} body fell through to a draw-on; lockBody must claim it first`
      ).toBe(false);
    }

    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("keyhole dot scales in lock-keyhole variants", () => {
    const keyhole: TestNode = ["circle", { cx: "12", cy: "16", r: "1" }];
    for (const sig of [lockKeyhole, lockKeyholeOpen]) {
      const resolved = sig.factory(ctx("lock-keyhole", 0, keyhole));
      const active = resolved.active as Record<string, unknown>;
      const scale = active.scale as number[] | undefined;
      expect(Array.isArray(scale) && scale[0] === 1 && scale[scale.length - 1] === 1).toBe(true);
    }
  });
});
