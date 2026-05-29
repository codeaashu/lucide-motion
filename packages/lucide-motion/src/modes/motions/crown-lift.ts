import { matchAnyPath, type Motion } from "../compose";

/**
 * `crown` — a jewelled crown raised in coronation. The band lifts up
 * as if being placed on a head, then settles back down with a small
 * overshoot; the jewels dim at the apex so they read as catching the
 * light during the lift.
 *
 * The crown's three points are all part of a single `<path>`, so they
 * can't rise independently — the whole band lifts as one. A `y`
 * translate is anchorless (no pivot dependency), and contraction
 * isn't relevant here since translate never exceeds the viewBox:
 * the top point sits at y≈3.27 and lifts to ≈2.07, still inside the
 * 24×24 frame with stroke radius to spare.
 *
 * The base line (`M5 21h14`) is the surface the crown rests on — it
 * stays planted but shares a faint opacity dip so it doesn't read as
 * detached from the lift (principle 2 — cohesion).
 *
 * `matchAnyPath` (this is the only motion in `crown`'s compose list);
 * the factory branches on the base-line `d`.
 */
const CROWN_BASE_LINE_D = "M5 21h14";

export const crownLift: Motion = {
  matches: matchAnyPath,
  factory: (ctx) => {
    if (String(ctx.pathAttrs.d) === CROWN_BASE_LINE_D) {
      return {
        rest: { opacity: 1 },
        active: {
          opacity: [1, 0.92, 1],
          transition: {
            duration: ctx.duration,
            delay: ctx.delay,
            repeat: ctx.repeat,
            ease: "easeInOut",
            times: [0, 0.3, 1],
          },
        },
      };
    }
    return {
      rest: { y: 0, opacity: 1 },
      active: {
        y: [0, -1.2, 0.4, 0],
        opacity: [1, 0.85, 1, 1],
        transition: {
          duration: ctx.duration,
          delay: ctx.delay,
          repeat: ctx.repeat,
          ease: "easeInOut",
          times: [0, 0.3, 0.65, 1],
        },
      },
    };
  },
};
