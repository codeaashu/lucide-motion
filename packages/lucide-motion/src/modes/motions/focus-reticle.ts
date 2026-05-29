import { type Motion } from "../compose";
import type { ModeContext } from "../types";

/**
 * Autofocus reticle for the `focus` icon. Lucide draws the reticle
 * as a `<circle cx=12 cy=12 r=3>` at the icon centre.
 *
 * **Real-life referent — camera autofocus convergence.** The
 * canonical autofocus gesture: the reticle pulses inward as the
 * lens hunts, locks tighter when acquisition completes, then
 * releases. Stays visible the entire cycle.
 *
 * Stronger contraction than the brackets — `scale [1, 0.55, 0.55,
 * 0.8, 1]` over the same `times` as `SCAN_CORNERS_KEYFRAMES` so
 * the lock-on hold reads as "focus locked in" — the reticle
 * pinches deeper and stays pinched while the brackets hold their
 * lock. Opacity dips harder during the hold to suggest the lens
 * iris closing.
 *
 * Scaling around the signature pivot `(12, 12)` which IS the
 * reticle's own centre — perfect in-place pinch, no translation.
 */
const matchReticle = (ctx: ModeContext): boolean =>
  ctx.pathTag === "circle" &&
  String(ctx.pathAttrs.cx) === "12" &&
  String(ctx.pathAttrs.cy) === "12" &&
  String(ctx.pathAttrs.r) === "3";

export const focusReticle: Motion = {
  matches: matchReticle,
  factory: (ctx) => ({
    rest: { scale: 1, opacity: 1 },
    active: {
      scale: [1, 0.55, 0.55, 0.8, 1],
      opacity: [1, 0.6, 0.6, 0.85, 1],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay,
        repeat: ctx.repeat,
        ease: "easeInOut",
        times: [0, 0.2, 0.5, 0.75, 1],
        scale: { inherit: true, ease: "easeInOut", times: [0, 0.2, 0.5, 0.75, 1] },
        opacity: {
          inherit: true,
          ease: "easeInOut",
          times: [0, 0.2, 0.5, 0.75, 1],
        },
      },
    },
  }),
};

