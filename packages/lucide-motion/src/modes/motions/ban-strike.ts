import { matchPathD, type Motion } from "../compose";
import type { ModeContext } from "../types";

/**
 * `ban` — a prohibition sign: a steady ring with a diagonal slash
 * struck through it. The ring holds its ground with a single firm
 * attention pulse (a slight uniform contraction + dim, in place around
 * its own centre — it never translates, so it reads as "staying put").
 * The slash strikes through: it draws in along its length, completing
 * at the ring's pulse apex, the decisive "no" gesture.
 *
 * `banRing` exports `BAN_RING_KEYFRAMES` so the slash can inherit the
 * uniform `scale` and stay phase-locked with the ring (principle 2).
 * Uniform scale is safe to inherit on the 45° diagonal slash — it
 * preserves orientation (no flattening).
 *
 * The slash draw-in uses `strokeDashoffset` against the measured
 * `ctx.pathLength`, cleared on `transitionEnd` so rest is dash-free
 * (the `src/modes/draw.ts` pattern).
 */
const BAN_SLASH_D = "M4.929 4.929 19.07 19.071";

export const BAN_RING_KEYFRAMES = {
  scale: [1, 0.96, 1],
  opacity: [1, 0.85, 1],
  times: [0, 0.4, 1],
};

const isBanRing = (ctx: ModeContext): boolean =>
  ctx.pathTag === "circle" &&
  String(ctx.pathAttrs.cx) === "12" &&
  String(ctx.pathAttrs.cy) === "12" &&
  String(ctx.pathAttrs.r) === "10";

export const banRing: Motion = {
  matches: isBanRing,
  factory: (ctx) => ({
    rest: { scale: 1, opacity: 1 },
    active: {
      scale: BAN_RING_KEYFRAMES.scale,
      opacity: BAN_RING_KEYFRAMES.opacity,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay,
        repeat: ctx.repeat,
        ease: "easeInOut",
        times: BAN_RING_KEYFRAMES.times,
      },
    },
  }),
};

export const banSlashStrike: Motion = {
  matches: matchPathD(BAN_SLASH_D),
  factory: (ctx) => ({
    rest: { strokeDasharray: 0, strokeDashoffset: 0, opacity: 1, scale: 1 },
    active: {
      strokeDasharray: ctx.pathLength,
      strokeDashoffset: [ctx.pathLength, 0],
      opacity: [0, 1],
      scale: BAN_RING_KEYFRAMES.scale,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay,
        repeat: ctx.repeat,
        strokeDasharray: { duration: 0 },
        strokeDashoffset: { inherit: true, ease: "easeOut", times: [0, 0.4] },
        opacity: { inherit: true, ease: "easeOut", times: [0, 0.1] },
        scale: { inherit: true, ease: "easeInOut", times: BAN_RING_KEYFRAMES.times },
      },
      transitionEnd: { strokeDasharray: 0, strokeDashoffset: 0 },
    },
  }),
};
