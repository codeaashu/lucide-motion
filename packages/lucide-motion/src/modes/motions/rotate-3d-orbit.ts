import { matchAnyPath, type Motion } from "../compose";

/**
 * `rotate-3d` — two perpendicular orbital ellipses plus a small
 * arrowhead, suggesting a sphere of rotation. Unlike its 2D
 * siblings (`rotate-cw`, `rotate-ccw`, `rotate-*-square`) which
 * demonstrate a quarter-turn orientation change, the 3D variant
 * depicts continuous spatial rotation — the two perpendicular
 * orbits sweeping past each other.
 *
 * **Real-life motion**: a single counter-clockwise 360° revolution
 * of the whole icon, eased in/out. Full revolution (rather than
 * the family's quarter-turn) reads as "spinning in three dimensions"
 * because the two orbital ellipses interchange positions through
 * the cycle, sketching the 3D-rotation gesture in 2D.
 *
 * All path vertices sit at radii ≤ 9.86 from (12, 12) —
 * comfortably inside the inscribed circle of the 24×24 viewBox —
 * so no contraction is needed at any angle of the revolution.
 */
export const rotate3dOrbit: Motion = {
  matches: matchAnyPath,
  factory: (ctx) => ({
    rest: { rotate: 0 },
    active: {
      // Explicit `[0, -360]` keyframes (rather than a scalar `-360`)
      // so each hover replays from 0 — a single-value target the
      // same as the current value would skip the animation on
      // subsequent triggers once rotate already sits at -360.
      // Counter-clockwise reads with the icon's arrowhead, which
      // points ccw out of the lower orbital ellipse.
      rotate: [0, -360],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        ease: "easeInOut",
        repeat: ctx.repeat,
      },
    },
  }),
};
