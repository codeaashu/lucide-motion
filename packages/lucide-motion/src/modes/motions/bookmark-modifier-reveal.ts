import { matchAnyPath, type Motion } from "../compose";
import { BOOKMARK_STICK_KEYFRAMES } from "./bookmark-stick";

/**
 * Bookmark-family wildcard reveal — draws each state marker on as the
 * bookmark sticks into the page, then rides the bookmark's `y` bob so
 * the marker stays anchored to the moving shape (principle 2).
 *
 * Catches whatever's left after `bookmarkStick` claims the body:
 * `bookmark-check`'s tick, `bookmark-minus`'s line, `bookmark-plus`'s
 * cross strokes, `bookmark-x`'s strokes, and `bookmark-off`'s diagonal
 * slash.
 *
 * The reveal animates `strokeDashoffset` against the measured
 * `ctx.pathLength` and clears the dash attrs on `transitionEnd` so the
 * resting stroke stays solid and seam-free, matching Lucide's static
 * SVG visually (the canonical pattern in `src/modes/draw.ts`; works for `<path>` and
 * `<line>` alike). The strike completes at `t = 0.4` — the moment the
 * bookmark reaches its deepest push — so the marker stamps in as the
 * bookmark seats.
 *
 * `y` piggybacks on `BOOKMARK_STICK_KEYFRAMES` so the marker translates
 * down with the bookmark. Translate carries no orientation, so it's
 * safe to inherit directly for every marker shape (orthogonal `+`/`−`,
 * diagonal `×`/slash, the check tick).
 *
 * Place LAST in the compose list — `matchAnyPath` is greedy.
 */
export const bookmarkModifierReveal: Motion = {
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
      y: BOOKMARK_STICK_KEYFRAMES.y,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        repeat: ctx.repeat,
        strokeDasharray: { duration: 0 },
        strokeDashoffset: { inherit: true, ease: "easeOut", times: [0, 0.15, 0.4] },
        opacity: { inherit: true, ease: "easeOut", times: [0, 0.15, 0.4] },
        y: { inherit: true, ease: "easeOut", times: BOOKMARK_STICK_KEYFRAMES.times },
      },
      transitionEnd: {
        strokeDasharray: 0,
        strokeDashoffset: 0,
      },
    },
  }),
};
