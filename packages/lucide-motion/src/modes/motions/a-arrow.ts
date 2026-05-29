import { matchPathDOneOf, type Motion } from "../compose";

/**
 * Arrow paths in `a-arrow-up` and `a-arrow-down` — the two strokes
 * (head + shaft) of the small directional arrow next to the letter
 * A. The arrow glides in its named direction (per iconName) while
 * the letter A stamps separately via `typewriterStamp`.
 *
 * Place this BEFORE `typewriterStamp` in the compose list so the
 * arrow paths are claimed by the glide; the letter strokes fall
 * through to the stamp.
 */
const ARROW_DIRECTION: Record<string, number> = {
  "a-arrow-up": -1.5,
  "a-arrow-down": 1.5,
};

const A_ARROW_DS = [
  "m14 11 4-4 4 4", // up head
  "m14 12 4 4 4-4", // down head
  "M18 16V7", // shaft (shared by up + down)
];

export const aArrow: Motion = {
  matches: matchPathDOneOf(...A_ARROW_DS),
  factory: (ctx) => {
    const dy = ARROW_DIRECTION[ctx.iconName] ?? 0;
    return {
      rest: { y: 0 },
      active: {
        y: [0, dy, 0],
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
