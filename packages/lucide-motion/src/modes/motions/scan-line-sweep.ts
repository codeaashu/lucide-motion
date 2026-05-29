import { matchPathD, type Motion } from "../compose";
import { SCAN_CORNERS_KEYFRAMES } from "./scan-corners-frame";

/**
 * The horizontal scan line in `scan-line` — `M7 12h10`. Spans the
 * viewfinder at y = 12.
 *
 * **Real-life referent — laser scan line sweeping across the
 * subject.** The canonical document-scanner / barcode-reader
 * gesture: a horizontal beam translates vertically up then down
 * across the viewfinder, scanning the contents row by row.
 *
 * Bobs `y: [0, -4, 4, 0]` over `times: [0, 0.3, 0.7, 1]` — the
 * line is at y = 12 at rest, rises to y = 8 (just below the top
 * brackets at y = 5), drops to y = 16 (just above the bottom
 * brackets at y = 19), then settles back to centre. Stays fully
 * visible (no draw-in) — it's the icon's defining payload.
 *
 * Inherits `SCAN_CORNERS_KEYFRAMES.opacity` so the line dims with
 * the lock-on and reads as cohesive scanning. Does NOT inherit
 * scale — the bespoke `y` sweep IS the kinetic life; layering the
 * corners' uniform scale on top would shrink the line off-axis.
 *
 * Closed cycle: `y` returns to 0.
 */
const SCAN_LINE_D = "M7 12h10";

export const scanLineSweep: Motion = {
  matches: matchPathD(SCAN_LINE_D),
  factory: (ctx) => ({
    rest: { y: 0, opacity: 1 },
    active: {
      y: [0, -4, 4, 0],
      opacity: SCAN_CORNERS_KEYFRAMES.opacity,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay,
        repeat: ctx.repeat,
        y: { inherit: true, ease: "easeInOut", times: [0, 0.3, 0.7, 1] },
        opacity: {
          inherit: true,
          ease: "easeInOut",
          times: SCAN_CORNERS_KEYFRAMES.times,
        },
      },
    },
  }),
};
