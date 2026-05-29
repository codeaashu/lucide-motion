import { matchPathDOneOf, type Motion } from "../compose";

/**
 * Smile + cheek dots payload in `scan-face`. Lucide draws the
 * smile as `M8 14s1.5 2 4 2 4-2 4-2` and the two cheek dots as
 * `M9 9h.01` and `M15 9h.01`.
 *
 * **Real-life referent — face acknowledged.** When face-recognition
 * scanners lock onto a face, the canonical feedback is a brief
 * wink: the dots dim briefly (eyes closing in acknowledgement) and
 * the smile holds. Reads as "face detected, scan complete."
 *
 * The dots opacity-dip together at the lock-on midpoint
 * (`opacity: [1, 0.3, 1]` over `times: [0, 0.5, 1]`). The smile
 * stays steady at full opacity — the face is calm while the eyes
 * acknowledge.
 *
 * Stays fully visible (no draw-in). Matched purely by `d` so the
 * smile and dots get their own behaviours; the smile motion is
 * effectively a no-op (rest = active) so it just stays put while
 * the dots wink.
 */
const SMILE_D = "M8 14s1.5 2 4 2 4-2 4-2";
const CHEEK_DOT_PATHS = ["M9 9h.01", "M15 9h.01"];

const matchCheekDots = matchPathDOneOf(...CHEEK_DOT_PATHS);
const matchSmile = matchPathDOneOf(SMILE_D);

export const scanFaceCheekDots: Motion = {
  matches: matchCheekDots,
  factory: (ctx) => ({
    rest: { opacity: 1 },
    active: {
      opacity: [1, 0.2, 1],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay,
        repeat: ctx.repeat,
        ease: "easeInOut",
        times: [0, 0.5, 1],
      },
    },
  }),
};

export const scanFaceSmile: Motion = {
  matches: matchSmile,
  factory: (ctx) => ({
    rest: { opacity: 1 },
    active: {
      opacity: [1, 0.85, 1],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay,
        repeat: ctx.repeat,
        ease: "easeInOut",
        times: [0, 0.5, 1],
      },
    },
  }),
};
