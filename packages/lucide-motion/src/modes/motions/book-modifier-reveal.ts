import { matchAnyPath, type Motion } from "../compose";
import { BOOK_BODY_KEYFRAMES } from "./book-body";

/**
 * Book-family wildcard reveal — catches every non-body path in
 * book-* variants: state markers (`+`, `−`, `✓`, `×`, `!`, arrows,
 * `?`), payload glyphs (typography in book-a / book-text / book-type
 * / book-audio, headphones arc, user torso, bookmark, heart),
 * subject payloads NOT covered by their Round-2 motions (book-key's
 * key shape).
 *
 * Subjects WITH Round-2 motions (image, search, lock) are claimed
 * earlier in their respective signatures' compose lists.
 *
 * Dasharray draw-in + opacity reveal completing at the body's
 * settle apex (`t = 0.4`). Inherits `y` from `BOOK_BODY_KEYFRAMES`
 * so the marker bobs with the book.
 *
 * Cleared via `transitionEnd` so the resting DOM is dash-free.
 *
 * Place LAST in the compose list — `matchAnyPath` is greedy.
 */
export const bookModifierReveal: Motion = {
  matches: matchAnyPath,
  factory: (ctx) => ({
    rest: {
      strokeDasharray: 0,
      strokeDashoffset: 0,
      opacity: 1,
      y: 0,
    },
    active: {
      strokeDasharray: ctx.pathLength,
      strokeDashoffset: [ctx.pathLength, ctx.pathLength, 0],
      opacity: [0, 0, 1],
      y: BOOK_BODY_KEYFRAMES.y,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        repeat: ctx.repeat,
        strokeDasharray: { duration: 0 },
        strokeDashoffset: {
          inherit: true,
          ease: "easeOut",
          times: [0, 0.15, 0.4],
        },
        opacity: { inherit: true, ease: "easeOut", times: [0, 0.15, 0.4] },
        y: {
          inherit: true,
          ease: "easeInOut",
          times: BOOK_BODY_KEYFRAMES.times,
        },
      },
      transitionEnd: {
        strokeDasharray: 0,
        strokeDashoffset: 0,
      },
    },
  }),
};
