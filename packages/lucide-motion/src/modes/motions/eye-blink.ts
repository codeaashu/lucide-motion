import { matchPathDOneOf, type Motion } from "../compose";
import type { ModeContext } from "../types";

/**
 * Quick blink — collapse vertically to a sliver, then snap back open.
 *
 * Matches every known eye-body path across the family so the eye shell
 * blinks but state-modifier overlays (slash, plus, minus, check, dot)
 * fall through to {@link eyeModifierReveal} — same pattern as
 * `heart-beat` + `heart-modifier-reveal` and `bell-shell` +
 * `bell-modifier-reveal`. Adding a new eye variant means appending its
 * body `d` string(s) to {@link EYE_BODY_PATHS} or extending the inline
 * circle predicate.
 *
 * Exports `EYE_BLINK_KEYFRAMES` so modifier-reveal motions can inherit
 * the scaleY collapse via per-value `inherit: true` transitions and stay
 * anchored to the blinking shell.
 */
export const EYE_BLINK_KEYFRAMES = {
  scaleY: [1, 0.1, 1],
  times: [0, 0.5, 1],
};

const EYE_BODY_PATHS = [
  // `eye` — outer almond (whole, uncut).
  "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
  // `eye-off` — upper-right almond arc (split by the slash).
  "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",
  // `eye-off` — pupil arc rendered as a partial path (the slash bisects
  // the original circle so Lucide redraws it as an open arc).
  "M14.084 14.158a3 3 0 0 1-4.242-4.242",
  // `eye-off` — lower-left almond arc (split by the slash).
  "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",
];

const matchEyePath = matchPathDOneOf(...EYE_BODY_PATHS);

const matchEyePupilCircle = (ctx: ModeContext): boolean =>
  ctx.pathTag === "circle" &&
  String(ctx.pathAttrs.cx) === "12" &&
  String(ctx.pathAttrs.cy) === "12" &&
  String(ctx.pathAttrs.r) === "3";

export const eyeBlink: Motion = {
  matches: (ctx) => matchEyePath(ctx) || matchEyePupilCircle(ctx),
  factory: (ctx) => ({
    rest: { scaleY: 1 },
    active: {
      scaleY: EYE_BLINK_KEYFRAMES.scaleY,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        ease: ctx.easing,
        times: EYE_BLINK_KEYFRAMES.times,
        repeat: ctx.repeat,
      },
    },
  }),
};
