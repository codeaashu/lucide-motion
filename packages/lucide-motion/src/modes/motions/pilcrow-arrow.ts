import { matchPathDOneOf, type Motion } from "../compose";

/**
 * Arrow paths in `pilcrow-left` and `pilcrow-right` — each variant
 * has two strokes (shaft + arrowhead) of a directional arrow
 * pointing the way the pilcrow text flows. Glides x in its named
 * direction while the pilcrow strokes stamp separately via
 * `typewriterStamp`.
 *
 * Place this BEFORE `typewriterStamp` in the compose list.
 */
const ARROW_X_DIRECTION: Record<string, number> = {
  "pilcrow-left": -1.5,
  "pilcrow-right": 1.5,
};

const PILCROW_ARROW_DS = [
  // pilcrow-left
  "M22 18H2l4-4",
  "m6 22-4-4",
  // pilcrow-right
  "m18 14 4 4H2",
  "m22 18-4 4",
];

export const pilcrowArrow: Motion = {
  matches: matchPathDOneOf(...PILCROW_ARROW_DS),
  factory: (ctx) => {
    const dx = ARROW_X_DIRECTION[ctx.iconName] ?? 0;
    return {
      rest: { x: 0 },
      active: {
        x: [0, dx, 0],
        transition: {
          duration: ctx.duration,
          delay: ctx.delay,
          repeat: ctx.repeat,
          ease: "easeOut",
          times: [0, 0.4, 1],
        },
      },
    };
  },
};
