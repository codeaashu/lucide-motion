import { type Motion } from "../compose";
import type { ModeContext } from "../types";
import { SCAN_CORNERS_KEYFRAMES } from "./scan-corners-frame";

/**
 * Inner content rect for the `fullscreen` icon. Lucide draws it as
 * `<rect x=7 y=8 width=10 height=8 rx=1>` — a small framed area
 * centred at (12, 12).
 *
 * **Real-life referent — content being framed for full-screen.**
 * The rect represents the content that the brackets are framing.
 * It pinches in lockstep with the brackets so the icon reads as a
 * single "framing" gesture rather than the brackets moving over a
 * static rectangle.
 *
 * Inherits `SCAN_CORNERS_KEYFRAMES.scale` and `.opacity` directly —
 * uniform contraction around the signature pivot (12, 12), which is
 * also the rect's own centre. Stays fully visible at rest.
 */
const matchInnerRect = (ctx: ModeContext): boolean =>
  ctx.pathTag === "rect" &&
  String(ctx.pathAttrs.x) === "7" &&
  String(ctx.pathAttrs.y) === "8" &&
  String(ctx.pathAttrs.width) === "10" &&
  String(ctx.pathAttrs.height) === "8";

export const fullscreenInnerRect: Motion = {
  matches: matchInnerRect,
  factory: (ctx) => ({
    rest: { scale: 1, opacity: 1 },
    active: {
      scale: SCAN_CORNERS_KEYFRAMES.scale,
      opacity: SCAN_CORNERS_KEYFRAMES.opacity,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay,
        repeat: ctx.repeat,
        ease: "easeInOut",
        times: SCAN_CORNERS_KEYFRAMES.times,
      },
    },
  }),
};
