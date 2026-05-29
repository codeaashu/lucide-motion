import { matchPathDOneOf, type Motion } from "../compose";
import type { ModeContext } from "../types";

/**
 * Network connection lines + node circles in `chart-network`. Lucide
 * draws three short stroke segments connecting three `r=2` nodes
 * inside the L-axes frame.
 *
 * Tier 2 data motion — the network rests fully visible; a packet of
 * activity travels through it. Connection lines briefly dim and the
 * nodes pulse with a small uniform contraction, sequenced left-to-
 * right by Lucide path order so the eye reads a signal hopping from
 * source node to destination node.
 *
 * Split into two motion exports because connection lines and nodes
 * benefit from different keyframe shapes — lines do a sharper dim
 * (signal in flight), nodes do a slower scale pulse (node activates).
 *
 * Closed cycle per principle 4; no `transitionEnd` cleanup needed.
 */
const CONNECTION_PATHS = [
  "m13.11 7.664 1.78 2.672",
  "m14.162 12.788-3.324 1.424",
  "m20 4-6.06 1.515",
];

export const chartNetworkLink: Motion = {
  matches: matchPathDOneOf(...CONNECTION_PATHS),
  factory: (ctx) => ({
    rest: { opacity: 1, scale: 1 },
    active: {
      opacity: [1, 0.25, 1, 1],
      scale: [1, 0.9, 1, 1],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        repeat: ctx.repeat,
        opacity: {
          inherit: true,
          ease: "easeInOut",
          times: [0, 0.25, 0.55, 1],
        },
        scale: {
          inherit: true,
          ease: "easeInOut",
          times: [0, 0.25, 0.55, 1],
        },
      },
    },
  }),
};

export const chartNetworkNode: Motion = {
  matches: (ctx: ModeContext) =>
    ctx.pathTag === "circle" && String(ctx.pathAttrs.r) === "2",
  factory: (ctx) => ({
    rest: { scale: 1, opacity: 1 },
    active: {
      scale: [1, 0.7, 1, 1],
      opacity: [1, 0.5, 1, 1],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        repeat: ctx.repeat,
        scale: {
          inherit: true,
          ease: "easeInOut",
          times: [0, 0.32, 0.65, 1],
        },
        opacity: {
          inherit: true,
          ease: "easeInOut",
          times: [0, 0.32, 0.65, 1],
        },
      },
    },
  }),
};
