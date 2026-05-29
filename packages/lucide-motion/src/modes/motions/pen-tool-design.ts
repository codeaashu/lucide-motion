import type { Variants } from "motion/react";
import { matchAnyPath, type Motion } from "../compose";
import type { ModeContext } from "../types";

/**
 * `pen-tool` — the bezier-pen design tool (distinct from the writing
 * pen). Anatomy: a triangle body with a tangent line crossing it, a
 * "nib handle" diamond at the lower-right, and an anchor point
 * (circle) at (11, 11).
 *
 * Real-life referent: a vector-illustration pen tool's anchor point
 * being selected. Anchor pulses; nib handle wobbles a hair as if
 * being adjusted; body + tangent dim for cohesion.
 *
 * matchAnyPath with per-element dispatch — every element gets a
 * variant, so there's no draw-fallback warning.
 */
const NIB_DIAMOND_D =
  "M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z";

const COMMON_TIMES = [0, 0.4, 1];

function makeAnchorVariants(ctx: ModeContext): Variants {
  return {
    rest: { scale: 1, opacity: 1, transformOrigin: "11px 11px" },
    active: {
      scale: [1, 0.55, 1],
      opacity: [1, 0.5, 1],
      transformOrigin: "11px 11px",
      transition: {
        duration: ctx.duration,
        delay: ctx.delay,
        repeat: ctx.repeat,
        scale: { inherit: true, ease: "easeInOut", times: COMMON_TIMES },
        opacity: { inherit: true, ease: "easeInOut", times: COMMON_TIMES },
      },
    },
  };
}

function makeNibVariants(ctx: ModeContext): Variants {
  return {
    rest: {
      rotate: 0,
      opacity: 1,
      transformOrigin: "50% 50%",
      transformBox: "fill-box",
    },
    active: {
      rotate: [0, -6, 4, 0],
      opacity: [1, 0.8, 1, 1],
      transformOrigin: "50% 50%",
      transformBox: "fill-box",
      transition: {
        duration: ctx.duration,
        delay: ctx.delay,
        repeat: ctx.repeat,
        rotate: {
          inherit: true,
          ease: "easeInOut",
          times: [0, 0.3, 0.6, 1],
        },
        opacity: {
          inherit: true,
          ease: "easeInOut",
          times: [0, 0.3, 0.6, 1],
        },
      },
    },
  };
}

function makeBodyVariants(ctx: ModeContext): Variants {
  return {
    rest: { opacity: 1 },
    active: {
      opacity: [1, 0.7, 1],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay,
        repeat: ctx.repeat,
        ease: "easeInOut",
        times: COMMON_TIMES,
      },
    },
  };
}

export const penToolDesign: Motion = {
  matches: matchAnyPath,
  factory: (ctx) => {
    if (ctx.pathTag === "circle") return makeAnchorVariants(ctx);
    if (String(ctx.pathAttrs.d) === NIB_DIAMOND_D) return makeNibVariants(ctx);
    return makeBodyVariants(ctx);
  },
};
