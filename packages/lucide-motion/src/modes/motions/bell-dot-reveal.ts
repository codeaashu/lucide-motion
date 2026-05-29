import type { Motion } from "../compose";
import { BELL_SHELL_KEYFRAMES } from "./bell-shell";

/**
 * Notification-dot reveal for `bell-dot`. The dot is a `<circle>`
 * element so `pathLength` doesn't apply — this is the circle-equivalent
 * of the bell-family modifier reveal: scale + opacity for the reveal,
 * plus the host `bellShell` rotation so the dot rocks with the bell
 * instead of floating statically over a swinging icon. Same timing as
 * `bellModifierReveal` so the two read as consistent draw-ins across
 * path-based and circle-based modifiers.
 *
 * Matched by the circle's geometry (cx=18, cy=5, r=3). If Lucide ever
 * reshapes the dot, this falls through to the bell-family wildcard and
 * the dev warning surfaces it.
 */
export const bellDotReveal: Motion = {
  matches: (ctx) =>
    ctx.pathTag === "circle" &&
    String(ctx.pathAttrs.cx) === "18" &&
    String(ctx.pathAttrs.cy) === "5" &&
    String(ctx.pathAttrs.r) === "3",
  factory: (ctx) => ({
    rest: { opacity: 1, scale: 1, rotate: 0 },
    active: {
      scale: [0, 0, 1],
      opacity: [0, 0, 1],
      rotate: BELL_SHELL_KEYFRAMES.rotate,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        repeat: ctx.repeat,
        scale: { inherit: true, ease: "easeOut", times: [0, 0.2, 0.55] },
        opacity: { inherit: true, ease: "easeOut", times: [0, 0.2, 0.55] },
        rotate: {
          inherit: true,
          ease: BELL_SHELL_KEYFRAMES.ease,
          times: BELL_SHELL_KEYFRAMES.times,
        },
      },
    },
  }),
};
