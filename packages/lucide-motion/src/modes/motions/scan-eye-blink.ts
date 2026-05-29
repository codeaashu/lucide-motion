import { matchPathD, type Motion } from "../compose";
import type { ModeContext } from "../types";
import { EYE_BLINK_KEYFRAMES } from "./eye-blink";

/**
 * Eye payload in `scan-eye`. Lucide draws it as a small pupil
 * `<circle cx=12 cy=12 r=1>` plus the eyelid arc `M18.944 12.33a1 1
 * 0 0 0 0-.66 7.5 7.5 0 0 0-13.888 0 1 1 0 0 0 0 .66 7.5 7.5 0 0 0
 * 13.888 0`.
 *
 * **Real-life referent — eye blinking.** Reuses the canonical eye-
 * blink primitive (`EYE_BLINK_KEYFRAMES.scaleY = [1, 0.1, 1]`) but
 * matches scan-eye's smaller geometry (r = 1 pupil instead of the
 * base eye's r = 3). The blink fires at the brackets' lock-on
 * midpoint so the eye blinks AS the scanner acquires.
 *
 * Pivot is the signature `transformOrigin "12px 12px"` — the eye's
 * own centre. scaleY around its centre collapses the eye to a
 * sliver and snaps back. Stays fully visible (no draw-in).
 */
const SCAN_EYE_ARC_D =
  "M18.944 12.33a1 1 0 0 0 0-.66 7.5 7.5 0 0 0-13.888 0 1 1 0 0 0 0 .66 7.5 7.5 0 0 0 13.888 0";

const matchScanEyeArc = matchPathD(SCAN_EYE_ARC_D);

const matchScanEyePupil = (ctx: ModeContext): boolean =>
  ctx.pathTag === "circle" &&
  String(ctx.pathAttrs.cx) === "12" &&
  String(ctx.pathAttrs.cy) === "12" &&
  String(ctx.pathAttrs.r) === "1";

export const scanEyeBlink: Motion = {
  matches: (ctx) => matchScanEyeArc(ctx) || matchScanEyePupil(ctx),
  factory: (ctx) => ({
    rest: { scaleY: 1 },
    active: {
      scaleY: EYE_BLINK_KEYFRAMES.scaleY,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay,
        repeat: ctx.repeat,
        ease: "easeInOut",
        times: EYE_BLINK_KEYFRAMES.times,
      },
    },
  }),
};
