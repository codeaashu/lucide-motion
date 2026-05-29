import { matchPathDOneOf, type Motion } from "../compose";

/**
 * The zap lightning-bolt — sits at rest position, briefly jolts
 * downward at the strike moment, then flickers through the multi-
 * flash after-glow before settling at residual brightness.
 *
 * **Real-life motion**: a lightning strike produces a sharp impact
 * that visibly displaces things briefly before they settle. The
 * bolt itself doesn't translate into the frame from somewhere
 * else — it appears at its position with a flash, and the impact
 * is a small downward jolt. Render only what's actually there:
 * a quick `y` kick paired with the opacity flash.
 *
 * **Cycle shape** (over `ctx.duration`):
 * - 0 → 0.06: bolt jolts down (y = 0 → 1) at the moment of strike;
 *   opacity holds at 1 (peak flash).
 * - 0.06 → 0.15: bolt springs back to rest (y = 1 → 0); opacity
 *   dips to 0.15 (the dark trough right after the strike).
 * - 0.15 → 0.30: opacity flashes back to 1 (secondary peak).
 * - 0.30 → 0.50: opacity dips to 0.4.
 * - 0.50 → 1: opacity settles back to 1.
 *
 * Jolt amplitude is 1 viewBox unit — small enough that the bolt's
 * bottom cap (originally at y=22.83 with strokeWidth/2) lands at
 * y=23.83, safely inside the 24×24 viewBox. The motion reads as a
 * compact impact rather than a translation across the frame.
 *
 * **Why this and not a descent**: pre-frame translation reads as
 * a glitch — the eye can't track a fast slide across the icon's
 * height, so the bolt appears to teleport. A small in-place jolt
 * keeps the bolt where it is at rest, which is where the viewer
 * already expects it, and gives them a single localised movement
 * synced to the flash. Matches how real lightning hits: brief
 * displacement at impact, not a long slow drop.
 *
 * Matches the full zap bolt path AND the three fragments in
 * `zap-off` where the slash splits the bolt — every fragment
 * jolts together so the broken bolt strikes as one.
 *
 * Exports `ZAP_KEYFRAMES` so the family modifier-reveal can pin
 * its own scale dip to the same flash schedule.
 */
export const ZAP_KEYFRAMES: {
  y: number[];
  opacity: number[];
  times: number[];
} = {
  y: [0, 1, 0, 0, 0, 0],
  opacity: [1, 1, 0.15, 1, 0.4, 1],
  times: [0, 0.06, 0.15, 0.30, 0.50, 1],
};

const BOLT_PATHS = [
  // Full zap bolt
  "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
  // zap-off: three fragments where the slash splits the original bolt
  "M10.513 4.856 13.12 2.17a.5.5 0 0 1 .86.46l-1.377 4.317",
  "M15.656 10H20a1 1 0 0 1 .78 1.63l-1.72 1.773",
  "M16.273 16.273 10.88 21.83a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14H4a1 1 0 0 1-.78-1.63l4.507-4.643",
];

export const zapStrike: Motion = {
  matches: matchPathDOneOf(...BOLT_PATHS),
  factory: (ctx) => ({
    rest: { y: 0, opacity: 1 },
    active: {
      y: ZAP_KEYFRAMES.y,
      opacity: ZAP_KEYFRAMES.opacity,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        repeat: ctx.repeat,
        // easeOut on the jolt — the kick happens fast, then the
        // spring back decelerates as the bolt settles.
        y: { inherit: true, ease: "easeOut", times: ZAP_KEYFRAMES.times },
        // Linear opacity keeps the flash peaks crisp.
        opacity: { inherit: true, ease: "linear", times: ZAP_KEYFRAMES.times },
      },
    },
  }),
};
