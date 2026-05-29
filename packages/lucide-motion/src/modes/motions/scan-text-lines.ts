import { matchPathDOneOf, type Motion } from "../compose";

/**
 * The three text lines in `scan-text` — `M7 8h8` (top), `M7 12h10`
 * (middle), `M7 16h6` (bottom). Horizontal strokes at three rows.
 *
 * **Real-life referent — OCR scanning lines top to bottom.** Each
 * line in turn briefly dims as the scanner reads it, then snaps
 * back. The wave moves top → bottom across the three rows. Lucide
 * orders the lines top-to-bottom (`y = 8, 12, 16`) so `ctx.index`
 * already encodes reading order; per-line stagger gives the
 * cascade.
 *
 * Stays fully visible (no draw-in). Each line dims with `opacity:
 * [1, 0.3, 1]` over `times: [0, 0.5, 1]` and a `0.12` per-line
 * stagger so the read sweep is visible at any duration ≥ 0.7s.
 */
const SCAN_TEXT_LINE_PATHS = ["M7 8h8", "M7 12h10", "M7 16h6"];

export const scanTextLines: Motion = {
  matches: matchPathDOneOf(...SCAN_TEXT_LINE_PATHS),
  factory: (ctx) => ({
    rest: { opacity: 1 },
    active: {
      opacity: [1, 0.3, 1],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * 0.12,
        repeat: ctx.repeat,
        ease: "easeInOut",
        times: [0, 0.5, 1],
      },
    },
  }),
};
