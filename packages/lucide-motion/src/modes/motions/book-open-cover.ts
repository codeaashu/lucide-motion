import { matchPathDOneOf, type Motion } from "../compose";

/**
 * Open-book covers — the two-page outline shared by `book-open`,
 * `book-open-text`, and `book-open-check`. Distinct anatomy from
 * the closed-book `bookBody`: the open variants depict a book lying
 * flat with two pages spread, so the gesture is a gentle scale dip
 * + opacity dim that reads as "the book is open and being read."
 *
 * Spine line (`M12 7v14` / `M12 21V7`) is matched separately so it
 * can phase-lock its own opacity without affecting the cover scale.
 *
 * Exports `BOOK_OPEN_COVER_KEYFRAMES` for the family modifier-reveal
 * to inherit.
 */
const BOOK_OPEN_COVER_PATHS = [
  "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
  "M22 6V4a1 1 0 0 0-1-1h-5a4 4 0 0 0-4 4 4 4 0 0 0-4-4H3a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h6a3 3 0 0 1 3 3 3 3 0 0 1 3-3h6a1 1 0 0 0 1-1v-1.3",
];

const BOOK_OPEN_SPINE_PATHS = ["M12 7v14", "M12 21V7"];

export const BOOK_OPEN_COVER_KEYFRAMES = {
  scale: [1, 0.97, 1],
  opacity: [1, 0.85, 1],
  times: [0, 0.4, 1],
};

export const bookOpenCover: Motion = {
  matches: matchPathDOneOf(...BOOK_OPEN_COVER_PATHS),
  factory: (ctx) => ({
    rest: { scale: 1, opacity: 1 },
    active: {
      scale: BOOK_OPEN_COVER_KEYFRAMES.scale,
      opacity: BOOK_OPEN_COVER_KEYFRAMES.opacity,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay,
        repeat: ctx.repeat,
        scale: {
          inherit: true,
          ease: "easeInOut",
          times: BOOK_OPEN_COVER_KEYFRAMES.times,
        },
        opacity: {
          inherit: true,
          ease: "easeInOut",
          times: BOOK_OPEN_COVER_KEYFRAMES.times,
        },
      },
    },
  }),
};

export const bookOpenSpine: Motion = {
  matches: matchPathDOneOf(...BOOK_OPEN_SPINE_PATHS),
  factory: (ctx) => ({
    rest: { opacity: 1 },
    active: {
      opacity: [1, 0.6, 1],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay,
        repeat: ctx.repeat,
        ease: "easeInOut",
        times: BOOK_OPEN_COVER_KEYFRAMES.times,
      },
    },
  }),
};
