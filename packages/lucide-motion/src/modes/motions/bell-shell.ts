import type { Easing } from "motion/react";
import { matchPathDOneOf, type Motion } from "../compose";

/**
 * The Lucide bell's main shell — the bell-shaped body that hangs from the
 * top mount. Modeled as a constrained pendulum: modest amplitude (12°
 * peak), damped oscillation, ~3.5 visible swings, settles cleanly. The
 * clapper inside is the visual focus during a ring; the shell is the
 * supporting frame.
 *
 * Lucide reshapes the shell across variants to leave room for whatever
 * modifier the variant carries (plus, minus, check, dot, slash, etc.).
 * Every known shell variation goes through the same rocking physics —
 * this list is the registry of "what counts as a bell shell." Adding a
 * new bell variant means appending its shell `d` string here.
 */
/**
 * Rotate + time + per-segment ease keyframes for the bell shell's
 * damped pendulum. Exported so other bell-family motions (modifier
 * reveals, sound waves, notification dot) can rock in sync with the
 * shell instead of floating statically over a swinging icon.
 *
 * Pattern: an internal motion imports these constants and feeds them
 * into motion's per-value `transition` with `inherit: true` so its
 * other animated properties (pathLength, opacity, scale) keep their
 * own independent timing while still inheriting duration / delay /
 * repeat from the parent transition.
 */
export const BELL_SHELL_KEYFRAMES: {
  rotate: number[];
  times: number[];
  ease: Easing[];
} = {
  rotate: [0, -12, 9, -6, 4, -2, 1, 0],
  times: [0, 0.1, 0.24, 0.38, 0.52, 0.66, 0.8, 1.0],
  ease: [
    "easeOut",
    "easeInOut",
    "easeInOut",
    "easeInOut",
    "easeInOut",
    "easeInOut",
    "easeInOut",
  ],
};

const SHELL_PATHS = [
  // bell + bell-ring (identical shell d)
  "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
  // bell-check (two parts — upper arc + lower opening; both rock together)
  "M16.8607 4.4824A6 6 0 0 0 6 8C6 12.499 4.589 13.956 3.262 15.326",
  "M3.262 15.326A1 1 0 0 0 4 17H20A1 1 0 0 0 20.74 15.327C20.209 14.779 19.665 14.218 19.203 13.454",
  // bell-dot (modified to leave room for the dot)
  "M11.68 2.009A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673c-.824-.85-1.678-1.731-2.21-3.348",
  // bell-minus
  "M16.243 3.757A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673A9.4 9.4 0 0 1 18.667 12",
  // bell-off (two parts — split by the slash)
  "M17 17H4a1 1 0 0 1-.74-1.673C4.59 13.956 6 12.499 6 8a6 6 0 0 1 .258-1.742",
  "M8.668 3.01A6 6 0 0 1 18 8c0 2.687.77 4.653 1.707 6.05",
  // bell-plus
  "M20.002 14.464a9 9 0 0 0 .738.863A1 1 0 0 1 20 17H4a1 1 0 0 1-.74-1.673C4.59 13.956 6 12.499 6 8a6 6 0 0 1 8.75-5.332",
];

export const bellShell: Motion = {
  matches: matchPathDOneOf(...SHELL_PATHS),
  factory: (ctx) => ({
    rest: { rotate: 0 },
    active: {
      rotate: BELL_SHELL_KEYFRAMES.rotate,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        times: BELL_SHELL_KEYFRAMES.times,
        ease: BELL_SHELL_KEYFRAMES.ease,
        repeat: ctx.repeat,
      },
    },
  }),
};
