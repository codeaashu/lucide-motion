import { matchPathDOneOf, type Motion } from "../compose";

/**
 * The arc-plus-corner-arrowhead anatomy in `rotate-cw`, `rotate-ccw`,
 * and `rotate-ccw-key`. Treated as one rigid pointer because the arc
 * body and its arrowhead tip are physically inseparable — the
 * assembly rotates together as the "rotation gesture" of the icon.
 *
 * **Real-life motion**: the rotate icon depicts the canonical
 * "rotate by 90°" action found in image editors and selection
 * tools. We honour that by swinging the wheel a quarter turn in
 * the named direction, holding briefly, and easing back to rest.
 *
 * Two constraints shape the curve:
 *
 * 1. **Corner arrowheads sit outside the inscribed circle.** The
 *    arrowhead vertices (e.g. `(21, 3)` in rotate-cw, `(3, 3)` in
 *    rotate-ccw) sit at radius √(9² + 9²) ≈ 12.73 from (12, 12) —
 *    outside the inscribed circle of the 24×24 viewBox. Naïve
 *    rotation pushes the cap past the edge at intermediate angles
 *    (~45° from rest puts the tip at y ≈ -0.7, where SVG's default
 *    `overflow: hidden` slices the cap off).
 * 2. **Scale ≤ 1 per principle 3.** Contraction-only.
 *
 * Solution mirrors `refreshArcCycle`: pinch to 0.85 first (cap
 * envelope ≈ 0.85 × 13.45 ≈ 11.43 from centre — comfortably inside
 * the inscribed circle of radius 12), perform the ±90° swing while
 * contracted, return to upright still contracted, then release back
 * to rest. Differs from refresh in the angle — refresh completes
 * one full 360° revolution to signal "cycle done," rotate swings a
 * quarter turn forward and back to signal "demonstrate rotation by
 * 90°."
 *
 * **Direction encoding via icon name**: `rotate-cw` rotates +90
 * (clockwise). `rotate-ccw` and `rotate-ccw-key` rotate -90.
 *
 * Exports `ROTATE_ARC_KEYFRAMES` so the wildcard
 * `rotateBodyInherit` (used by `rotate-ccw-key`'s key components)
 * can travel with the wheel and share a synchronized kinetic peak.
 */
export const ROTATE_ARC_KEYFRAMES: {
  scale: number[];
  rotateMagnitude: number[];
  times: number[];
} = {
  // 1 → 0.85 (pinch in) → 0.85 (held forward) → 0.85 (held back) → 1 (release).
  scale: [1, 0.85, 0.85, 0.85, 1],
  // 0 (rest) → 0 (pinch finishes) → 1 (apex, multiplied by direction) → 0 (back upright) → 0 (rest).
  rotateMagnitude: [0, 0, 1, 0, 0],
  times: [0, 0.15, 0.5, 0.85, 1],
};

const ARC_PATHS = [
  // rotate-cw — arc + corner arrowhead.
  "M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8",
  "M21 3v5h-5",
  // rotate-ccw — arc + corner arrowhead. Lucide ships both 9.75 and
  // 9.74 variants of the small curve radius (rotate-ccw vs
  // rotate-ccw-key); list both so the same motion drives the arc in
  // either icon.
  "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
  "M3 12a9 9 0 1 0 9-9 9.74 9.74 0 0 0-6.74 2.74L3 8",
  "M3 3v5h5",
];

export const rotateArcCycle: Motion = {
  matches: matchPathDOneOf(...ARC_PATHS),
  factory: (ctx) => {
    const direction = ctx.iconName.includes("ccw") ? -1 : 1;
    const apex = 90 * direction;
    return {
      rest: { scale: 1, rotate: 0 },
      active: {
        scale: ROTATE_ARC_KEYFRAMES.scale,
        rotate: ROTATE_ARC_KEYFRAMES.rotateMagnitude.map((m) => m * apex),
        transition: {
          duration: ctx.duration,
          delay: ctx.delay + ctx.index * ctx.stagger,
          repeat: ctx.repeat,
          scale: {
            inherit: true,
            ease: "easeInOut",
            times: ROTATE_ARC_KEYFRAMES.times,
          },
          rotate: {
            inherit: true,
            ease: "easeInOut",
            times: ROTATE_ARC_KEYFRAMES.times,
          },
        },
      },
    };
  },
};
