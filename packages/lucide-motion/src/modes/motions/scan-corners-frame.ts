import { matchPathDOneOf, type Motion } from "../compose";

/**
 * Scan / focus / fullscreen corner brackets — the host motion for
 * the 11 icons built around Lucide's four-corner viewfinder frame
 * (`scan`, `focus`, `fullscreen`, `scan-{barcode,eye,face,heart,
 * line,qr-code,search,text}`).
 *
 * Every host icon contains the same four short L-shaped corner
 * paths at the viewfinder corners — top-left, top-right, bottom-
 * right, bottom-left. Match them by their literal `d` strings.
 *
 * **Real-life referent — viewfinder locking onto a subject.** The
 * canonical scanner / autofocus / capture-frame gesture: the four
 * brackets contract slightly inward toward the centre, hold the
 * lock briefly, then release back to rest. Combined with a phase-
 * locked opacity dim that reads as the scanner "doing work,"
 * payloads inside the frame (face, heart, QR rect, text lines)
 * appear AS the frame acquires its target.
 *
 * Mechanics. Uniform `scale: [1, 0.94, 0.94, 1]` + opacity `[1,
 * 0.85, 0.85, 1]` over `times: [0, 0.2, 0.5, 1]`. The signature
 * pivots at `"12px 12px"` (icon centre) so the four corners pinch
 * inward symmetrically.
 *
 * ViewBox safety. Scale contracts (principle 3); the farthest
 * corner endpoint sits at ~3 units from icon centre, contracted to
 * ~0.94 × 3 = ~2.82 — well inside the viewBox at any cycle frame.
 *
 * Sub-icons inherit BOTH scale and opacity via the family modifier-
 * reveal (principle 2) — payloads pinch with the brackets so the
 * lock-on reads as one cohesive gesture.
 *
 * Exports `SCAN_CORNERS_KEYFRAMES` so the family modifier-reveal
 * can inherit both curves directly.
 *
 * Closed cycle: every keyframe array starts AND ends at the rest
 * value (principle 4).
 */
const SCAN_CORNERS_PATHS = [
  "M3 7V5a2 2 0 0 1 2-2h2", // top-left
  "M17 3h2a2 2 0 0 1 2 2v2", // top-right
  "M21 17v2a2 2 0 0 1-2 2h-2", // bottom-right
  "M7 21H5a2 2 0 0 1-2-2v-2", // bottom-left
];

const matchCorners = matchPathDOneOf(...SCAN_CORNERS_PATHS);

export const SCAN_CORNERS_KEYFRAMES = {
  // Lock-on contraction toward icon centre.
  scale: [1, 0.94, 0.94, 1],
  // Phase-locked dim while the scanner "works."
  opacity: [1, 0.85, 0.85, 1],
  times: [0, 0.2, 0.5, 1],
};

export const scanCornersFrame: Motion = {
  matches: matchCorners,
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
