import type { Motion } from "../compose";
import type { ModeContext } from "../types";

/**
 * Scatter-plot data points in `chart-scatter` — five filled
 * `<circle>` elements with `r=".5"` scattered across the plot. The L-
 * axes path is handled separately by `chartAxes`.
 *
 * Tier 2 data motion — each dot is one data observation; a wave of
 * "fresh observation" travels through them in Lucide draw order
 * (which roughly samples across the plot area). Each dot briefly
 * scales down and dims, then springs back. The visual reads as the
 * scatter populating one point at a time.
 *
 * Uniform `scale` is safe — the dots are radius-half and rotationally
 * symmetric, so any pivot gives the same visual. The signature uses
 * default centre pivot.
 *
 * Closed cycle per principle 4.
 */
export const chartScatterDot: Motion = {
  matches: (ctx: ModeContext) =>
    ctx.pathTag === "circle" && String(ctx.pathAttrs.r) === ".5",
  factory: (ctx) => ({
    rest: { scale: 1, opacity: 1 },
    active: {
      scale: [1, 0.4, 1, 1],
      opacity: [1, 0.3, 1, 1],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        repeat: ctx.repeat,
        scale: {
          inherit: true,
          ease: "easeInOut",
          times: [0, 0.25, 0.55, 1],
        },
        opacity: {
          inherit: true,
          ease: "easeInOut",
          times: [0, 0.25, 0.55, 1],
        },
      },
    },
  }),
};
