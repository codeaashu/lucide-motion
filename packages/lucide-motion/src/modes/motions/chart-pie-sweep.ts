import { matchPathDOneOf, type Motion } from "../compose";

/**
 * Pie wedge + outer arc in `chart-pie`. Lucide draws the chart as two
 * paths: the upper-right quadrant wedge (a closed sub-shape that
 * registers as "the highlighted slice") and the remaining 3/4 arc that
 * forms the rest of the pie.
 *
 * Tier 2 data motion — the pie rests at its full closed shape; both
 * paths contract uniformly toward the icon centre and dim briefly,
 * then spring back, with the wedge leading the arc so the eye reads
 * the slice as the focused data segment refreshing first. The
 * signature uses the default centre pivot (`"12px 12px"`) so the
 * uniform scale operates around the pie's geometric centre.
 *
 * Per-path stagger via `ctx.index` (Lucide writes wedge first, arc
 * second).
 *
 * Closed cycle per principle 4; no cleanup needed.
 */
const PIE_PATHS = [
  // Upper-right quadrant wedge
  "M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z",
  // Remaining 3/4 arc
  "M21.21 15.89A10 10 0 1 1 8 2.83",
];

export const chartPieSweep: Motion = {
  matches: matchPathDOneOf(...PIE_PATHS),
  factory: (ctx) => ({
    rest: { scale: 1, opacity: 1 },
    active: {
      scale: [1, 0.88, 1, 1],
      opacity: [1, 0.55, 1, 1],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        repeat: ctx.repeat,
        scale: {
          inherit: true,
          ease: "easeInOut",
          times: [0, 0.3, 0.65, 1],
        },
        opacity: {
          inherit: true,
          ease: "easeInOut",
          times: [0, 0.3, 0.65, 1],
        },
      },
    },
  }),
};
