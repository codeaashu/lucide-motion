import { matchPathDOneOf, type Motion } from "../compose";

/**
 * The three barcode bars in `scan-barcode` — `M8 7v10`, `M12 7v10`,
 * `M17 7v10`. Vertical strokes spanning the viewfinder.
 *
 * **Real-life referent — barcode reader scanning across bars.**
 * Each bar in turn briefly dims and contracts vertically as the
 * laser pass touches it, then springs back. The wave moves left →
 * right across the three bars, mimicking a hand-scanner sweep.
 *
 * Each bar lifts its dim at a different phase of the cycle.
 * Lucide's path order is left-to-right (`x = 8, 12, 17`) so
 * `ctx.index` already encodes scan order. Per-bar stagger gives
 * the cascade without changing `times`.
 *
 * Stays fully visible (no draw-in) — the bars ARE the icon's
 * primary payload. `scaleY: [1, 0.65, 1]` from the baseline (`y =
 * 17`) makes each bar appear to "fall away" briefly as it's read.
 * Inherits `SCAN_CORNERS_KEYFRAMES.opacity` for cohesion with the
 * frame lock-on; the bar's own opacity dip lays on top via the
 * scaleY contraction visual.
 *
 * Signature must override `transformOrigin` to `"12px 17px"` (the
 * bars' shared baseline) so each bar contracts toward its own
 * bottom rather than the icon centre.
 *
 * Closed cycle: `scaleY` returns to 1.
 */
const SCAN_BARCODE_BAR_PATHS = ["M8 7v10", "M12 7v10", "M17 7v10"];

export const scanBarcodeBars: Motion = {
  matches: matchPathDOneOf(...SCAN_BARCODE_BAR_PATHS),
  factory: (ctx) => ({
    rest: { scaleY: 1, opacity: 1 },
    active: {
      scaleY: [1, 0.55, 1],
      opacity: [1, 0.4, 1],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * 0.12,
        repeat: ctx.repeat,
        ease: "easeInOut",
        times: [0, 0.4, 1],
      },
    },
  }),
};
