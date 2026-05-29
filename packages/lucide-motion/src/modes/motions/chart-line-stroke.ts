import { matchPathDOneOf, type Motion } from "../compose";

/**
 * Single-stroke data lines across the chart family — `chart-line`'s
 * zig-zag, `chart-spline`'s curve, `chart-area`'s closed mountain
 * polygon, and `chart-no-axes-combined`'s scalloped top line.
 *
 * Tier 2 data motion — the line/curve plots in left-to-right as a
 * real draw-in (the canonical chart action is "data renders along
 * its axis"). Implemented as a `strokeDashoffset` sweep over the
 * measured `ctx.pathLength`, mirroring the badge-modifier-reveal
 * pattern: `strokeDasharray` is snapped to the path length so the
 * offset animation reads as a clean reveal, then both attrs are
 * cleared via `transitionEnd` so the resting stroke stays solid and
 * seam-free, matching Lucide's static SVG visually.
 *
 * The plot completes at `t = 0.7` and holds drawn for the remaining
 * 30% of the cycle — the axes' opacity breath continues underneath so
 * the icon stays alive after the line lands. Opacity fades in early
 * (`[0, 0, 1]` over `[0, 0.05, 0.25]`) so the stroke isn't invisibly
 * snapped at frame 0.
 *
 * `chart-area`'s polygon is closed (`...z`); `strokeDashoffset`
 * sweep on a closed path traces along the outline from the start
 * point and reads as the area outline drawing in. The fill is
 * `none` on Lucide icons, so there's no body to dim — just the
 * outline reveal.
 *
 * Works for both `<path>` (all four entries) because `getTotalLength()`
 * is defined on all SVGGeometryElements.
 */
const LINE_STROKE_PATHS = [
  // chart-line — zig-zag connecting four points
  "m19 9-5 5-4-4-3 3",
  // chart-spline — smooth cubic curve
  "M7 16c.5-2 1.5-7 4-7 2 0 2 3 4 3 2.5 0 4.5-5 5-7",
  // chart-area — closed polygon underneath the line
  "M7 11.207a.5.5 0 0 1 .146-.353l2-2a.5.5 0 0 1 .708 0l3.292 3.292a.5.5 0 0 0 .708 0l4.292-4.292a.5.5 0 0 1 .854.353V16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1z",
  // chart-no-axes-combined — top scalloped line
  "m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15",
];

export const chartLineStroke: Motion = {
  matches: matchPathDOneOf(...LINE_STROKE_PATHS),
  factory: (ctx) => ({
    rest: {
      strokeDasharray: 0,
      strokeDashoffset: 0,
      opacity: 1,
    },
    active: {
      strokeDasharray: ctx.pathLength,
      strokeDashoffset: [ctx.pathLength, 0, 0],
      opacity: [0, 1, 1],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay,
        repeat: ctx.repeat,
        // Snap the dash size so the draw-in reads as a clean offset sweep.
        strokeDasharray: { duration: 0 },
        // Plot completes at t = 0.7, then holds drawn through the axes breath.
        strokeDashoffset: {
          inherit: true,
          ease: "easeOut",
          times: [0, 0.7, 1],
        },
        opacity: {
          inherit: true,
          ease: "easeOut",
          times: [0, 0.2, 1],
        },
      },
      transitionEnd: {
        strokeDasharray: 0,
        strokeDashoffset: 0,
      },
    },
  }),
};
