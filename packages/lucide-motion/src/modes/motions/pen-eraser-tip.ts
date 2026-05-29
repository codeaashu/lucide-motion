import { matchPathD, type Motion } from "../compose";
import { PEN_WRITE_KEYFRAMES } from "./pen-write";

/**
 * The small diagonal ferrule stroke `m15 5 4 4` at the eraser end
 * of `pencil` and `pencil-line` (also present in `pencil-off`'s
 * fragments but the off variant is handled separately).
 *
 * Phase-locked opacity dim — the ferrule reads as "the metal band
 * catching light" while the pen wobbles through its writing stroke.
 */
const PEN_ERASER_D = "m15 5 4 4";

export const penEraserTip: Motion = {
  matches: matchPathD(PEN_ERASER_D),
  factory: (ctx) => ({
    rest: { opacity: 1 },
    active: {
      opacity: [1, 0.65, 1, 0.82, 1],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay,
        repeat: ctx.repeat,
        ease: "easeInOut",
        times: PEN_WRITE_KEYFRAMES.times,
      },
    },
  }),
};
