import { matchPathDOneOf, type Motion } from "../compose";
import { PEN_WRITE_KEYFRAMES } from "./pen-write";

/**
 * The ruler portion of `pencil-ruler` — four paths Lucide draws to
 * form a measuring tool (two rounded corners + two tick marks).
 * The pencil itself is already handled by `penWrite` + `penEraserTip`.
 *
 * Phase-locked opacity dim to `PEN_WRITE_KEYFRAMES.times` — the
 * ruler catches light as the pencil wobbles, reading as one
 * cohesive drafting gesture.
 */
const RULER_PATHS = [
  "M13 7 8.7 2.7a2.41 2.41 0 0 0-3.4 0L2.7 5.3a2.41 2.41 0 0 0 0 3.4L7 13",
  "m8 6 2-2",
  "m18 16 2-2",
  "m17 11 4.3 4.3c.94.94.94 2.46 0 3.4l-2.6 2.6c-.94.94-2.46.94-3.4 0L11 17",
];

export const pencilRulerTool: Motion = {
  matches: matchPathDOneOf(...RULER_PATHS),
  factory: (ctx) => ({
    rest: { opacity: 1 },
    active: {
      opacity: [1, 0.7, 1, 0.85, 1],
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
