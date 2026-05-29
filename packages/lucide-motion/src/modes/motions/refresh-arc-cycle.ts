import { matchPathDOneOf, type Motion } from "../compose";

/**
 * The refresh icon's structural anatomy — two partial arcs forming a
 * loop around the icon centre, plus the L-shaped tick marks at each
 * arc's end that serve as the directional arrowheads. Treated as one
 * rigid wheel because that's exactly what they are physically: the
 * arrows are inseparable from their arc bodies, and the assembly
 * rotates as a single mechanism.
 *
 * **Real-life motion**: a refresh button mechanically rotates the
 * wheel one full revolution in the named direction — that's the
 * canonical iOS / Android / macOS refresh feedback, and what users
 * already expect when they see a refresh icon animate. We honour
 * that here with an actual physical rotation, not a draw-in cycle.
 *
 * Two constraints shape the curve:
 *
 * 1. **The corner ticks live outside the inscribed circle.** Lucide
 *    places the tick endpoints at (21, 3), (3, 21), (3, 3), (16, 16)
 *    etc. — radius √(9² + 9²) ≈ 12.73 from (12, 12). Rotating those
 *    around the icon centre carries them past the 24×24 viewBox at
 *    intermediate angles (≈ x=25.7 at θ=45° once strokeWidth is in,
 *    plus extra for the round caps). A naïve full rotation slices the
 *    cap envelope at runtime.
 *
 * 2. **Principle 3 says scale ≤ 1.** So we can't outscale our way
 *    *up* past the constraint; the only option is to contract *down*
 *    enough that the rotated envelope stays inside.
 *
 * The cycle therefore reads as a mechanical wind-up: scale contracts
 * to 0.85 first (the wheel "pulls in" before turning), the full 360°
 * rotation happens while contracted (corner cap envelope ≈ 0.85 ×
 * 13.45 ≈ 11.43 from centre — comfortably inside the inscribed
 * circle of radius 12), and then scale expands back to 1 (the wheel
 * "releases" into its rest state). Same shape as a key turning in a
 * lock: press in, rotate, release.
 *
 * **Direction encoding via icon name**: `refresh-cw` and
 * `refresh-cw-off` rotate +360 (clockwise). The `-ccw` variants
 * rotate -360 (counter-clockwise). The arrows visibly travel in the
 * direction their arrowheads already point at rest.
 *
 * **Why one motion for arcs AND ticks**: anatomically, each
 * arrow-arc-plus-its-arrowhead is one rigid body — splitting them
 * across separate motions would let the arc-body and its own
 * arrowhead drift apart mid-spin, which would read as broken
 * geometry rather than a turning wheel. The two arrows DO rotate
 * together (one rigid wheel), so the same motion drives every arc
 * and every tick.
 *
 * Exports `REFRESH_ARC_KEYFRAMES` so the centre dot and the off-
 * slash can inherit the same scale rhythm and share a synchronized
 * kinetic peak with the spin.
 */
export const REFRESH_ARC_KEYFRAMES: {
  scale: number[];
  times: number[];
} = {
  // 1 → 0.85 (pinch in) → 0.85 (held while spinning) → 1 (release out).
  // The hold while rotating is what keeps the cap envelope inside the
  // viewBox at every angle of the revolution.
  scale: [1, 0.85, 0.85, 1],
  times: [0, 0.15, 0.85, 1],
};

const ARC_AND_TICK_PATHS = [
  // refresh-cw: top arc (bottom-left → top-right) + top-right tick.
  "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",
  "M21 3v5h-5",
  // refresh-cw: bottom arc (top-right → bottom-left) + bottom-left tick.
  "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",
  "M8 16H3v5",
  // refresh-ccw: top arc (top-right → top-left) + top-left tick. Also
  // used in refresh-ccw-dot.
  "M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
  "M3 3v5h5",
  // refresh-ccw: bottom arc + bottom-right tick.
  "M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16",
  "M16 16h5v5",
  // refresh-cw-off: four arc fragments where the slash cuts through
  // the original cw arcs. Tick marks are shared with refresh-cw.
  "M21 8L18.74 5.74A9.75 9.75 0 0 0 12 3C11 3 10.03 3.16 9.13 3.47",
  "M3 12C3 9.51 4 7.26 5.64 5.64",
  "m3 16 2.26 2.26A9.75 9.75 0 0 0 12 21c2.49 0 4.74-1 6.36-2.64",
  "M21 12c0 1-.16 1.97-.47 2.87",
];

export const refreshArcCycle: Motion = {
  matches: matchPathDOneOf(...ARC_AND_TICK_PATHS),
  factory: (ctx) => {
    // Direction comes from the icon name — `refresh-ccw` and
    // `refresh-ccw-dot` rotate the wheel counter-clockwise. The
    // `-off` variant follows the base direction (cw here).
    const direction = ctx.iconName.includes("ccw") ? -1 : 1;
    return {
      rest: { scale: 1, rotate: 0 },
      active: {
        scale: REFRESH_ARC_KEYFRAMES.scale,
        // Holds at 0 during the pinch-in (so the contraction isn't
        // visually muddled by an already-rotating wheel), spins one
        // full revolution while contracted, holds at 360 ≡ 0 during
        // the release-out (the wheel has come back to its rest
        // orientation, only the scale is recovering).
        rotate: [0, 0, 360 * direction, 360 * direction],
        transition: {
          duration: ctx.duration,
          delay: ctx.delay + ctx.index * ctx.stagger,
          repeat: ctx.repeat,
          scale: {
            inherit: true,
            ease: "easeInOut",
            times: REFRESH_ARC_KEYFRAMES.times,
          },
          rotate: {
            inherit: true,
            ease: "easeInOut",
            times: REFRESH_ARC_KEYFRAMES.times,
          },
        },
      },
    };
  },
};
