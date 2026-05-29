import { matchPathD, type Motion } from "../compose";
import { PEN_WRITE_KEYFRAMES } from "./pen-write";

/**
 * The horizontal underline at y=21 in `pen-line` and `pencil-line` —
 * the mark the pen has just drawn on the page. Matches the exact
 * shared d `M13 21h8`.
 *
 * Opacity dim phase-locked to the pen wobble apex (the line "refreshes"
 * as the pen writes). No transform → no pivot concern.
 *
 * NOTE: this `d` could in principle be matched by `chartBarsHorizontal`
 * (regex on `^M[\d.]+ [\d.]+[hH]`), but `chartBarsHorizontal` is only
 * imported by chart signatures so there's no collision in pen-line /
 * pencil-line.
 */
const PEN_UNDERLINE_D = "M13 21h8";

export const penLineStroke: Motion = {
  matches: matchPathD(PEN_UNDERLINE_D),
  factory: (ctx) => ({
    rest: { opacity: 1 },
    active: {
      opacity: [1, 0.5, 1, 0.78, 1],
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
