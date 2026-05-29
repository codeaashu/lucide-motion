import type { Easing } from "motion/react";
import type { Motion } from "../compose";

/**
 * The `bell-electric` host body — the dome circle (cx=9, cy=9, r=7) plus
 * the base rect (the bell's foot, x=4, y=16, w=10, h=6, rx=2). Modeled
 * as a high-frequency low-amplitude buzz rather than the pendulum rock
 * of a hanging bell: an electric bell vibrates rapidly in place from
 * internal current, settling fast, instead of swinging from a mount.
 *
 * The dome itself is rotationally symmetric so the visible rotation
 * reads on the base rect and on the other family paths (signal arcs,
 * button, spark) that inherit these keyframes via the host-coupling
 * pattern.
 *
 * Pivot: the signature sets `transformOrigin` to `"9px 9px"` (the dome's
 * own center) so the bell pulses around itself and the signal arcs at
 * radii 7 and 11 from that point scale cleanly outward.
 */
/**
 * Rotate + time + per-segment ease keyframes for the bell-electric
 * body's buzz. Exported so other bell-electric motions (signal arcs,
 * button, center spark) can rotate in sync with the host body instead
 * of floating statically while the bell underneath vibrates.
 */
export const BELL_ELECTRIC_BODY_KEYFRAMES: {
  rotate: number[];
  times: number[];
  ease: Easing[];
} = {
  rotate: [0, -4, 4, -3, 2.5, -2, 1.5, -0.8, 0],
  times: [0, 0.06, 0.14, 0.24, 0.36, 0.5, 0.66, 0.83, 1],
  ease: [
    "easeOut",
    "easeInOut",
    "easeInOut",
    "easeInOut",
    "easeInOut",
    "easeInOut",
    "easeInOut",
    "easeInOut",
  ],
};

export const bellElectricBody: Motion = {
  matches: (ctx) => {
    if (
      ctx.pathTag === "circle" &&
      String(ctx.pathAttrs.cx) === "9" &&
      String(ctx.pathAttrs.cy) === "9" &&
      String(ctx.pathAttrs.r) === "7"
    ) {
      return true;
    }
    if (
      ctx.pathTag === "rect" &&
      String(ctx.pathAttrs.x) === "4" &&
      String(ctx.pathAttrs.y) === "16" &&
      String(ctx.pathAttrs.width) === "10" &&
      String(ctx.pathAttrs.height) === "6" &&
      String(ctx.pathAttrs.rx) === "2"
    ) {
      return true;
    }
    return false;
  },
  factory: (ctx) => ({
    rest: { rotate: 0 },
    active: {
      rotate: BELL_ELECTRIC_BODY_KEYFRAMES.rotate,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        times: BELL_ELECTRIC_BODY_KEYFRAMES.times,
        ease: BELL_ELECTRIC_BODY_KEYFRAMES.ease,
        repeat: ctx.repeat,
      },
    },
  }),
};
