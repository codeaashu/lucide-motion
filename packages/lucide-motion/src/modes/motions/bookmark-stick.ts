import { matchPathDOneOf, type Motion } from "../compose";

/**
 * `bookmark` family host — a bookmark pressed into the page. It sticks
 * in (a downward `y` push), gives a tiny rebound, then settles. The
 * push is `easeOut` so it lands decisively, the way a ribbon marker
 * drops between pages and catches.
 *
 * Anchorless `y` translate — no pivot dependency. The bookmark's lower
 * corners sit at y≈20; a +1.4 push lands them at ≈21.4, inside the
 * 24×24 viewBox with stroke radius to spare.
 *
 * Matches the bookmark body across the family: the base shape, plus the
 * two body fragments `bookmark-off` splits the shape into around its
 * slash (`matchPathDOneOf`). The state markers (`-check`, `-minus`,
 * `-plus`, `-x`) and the `-off` slash fall through to
 * `bookmarkModifierReveal`.
 *
 * Exports `BOOKMARK_STICK_KEYFRAMES` so the family modifier-reveal can
 * inherit the same `y` and `times` — every marker rides the bookmark
 * down as it sticks in (principle 2 — host coupling).
 */
export const BOOKMARK_STICK_KEYFRAMES = {
  y: [0, 1.4, -0.3, 0],
  times: [0, 0.35, 0.7, 1],
};

const BOOKMARK_BODY_DS = [
  // base bookmark + -check / -minus / -plus / -x share this body
  "M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z",
  // bookmark-off splits the body into two fragments around the slash
  "M19 19v1a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5",
  "M8.656 3H17a2 2 0 0 1 2 2v8.344",
];

export const bookmarkStick: Motion = {
  matches: matchPathDOneOf(...BOOKMARK_BODY_DS),
  factory: (ctx) => ({
    rest: { y: 0 },
    active: {
      y: BOOKMARK_STICK_KEYFRAMES.y,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay,
        repeat: ctx.repeat,
        ease: "easeOut",
        times: BOOKMARK_STICK_KEYFRAMES.times,
      },
    },
  }),
};
