import { matchPathDOneOf, type Motion } from "../compose";
import type { ModeContext } from "../types";

/**
 * `settings-2` — two horizontal sliders, each a track + a knob. Per-
 * knob x-translate sliding lookup. Tracks stay still (subtle opacity
 * dim for cohesion).
 *
 * Real-life referent: dragging a slider knob along its track. The
 * upper knob at (7, 7) sits at the left of its track (which spans
 * x=10..19) and slides right toward the centre; the lower knob at
 * (17, 17) sits at the right of its track (x=5..14) and slides
 * left. They mirror each other.
 */
const KNOB_X_DELTA: Record<string, number> = {
  "7,7": 2,
  "17,17": -2,
};

function isSliderKnob(ctx: ModeContext): boolean {
  if (ctx.pathTag !== "circle") return false;
  if (String(ctx.pathAttrs.r) !== "3") return false;
  return `${ctx.pathAttrs.cx},${ctx.pathAttrs.cy}` in KNOB_X_DELTA;
}

export const settings2Knob: Motion = {
  matches: isSliderKnob,
  factory: (ctx) => {
    const dx = KNOB_X_DELTA[`${ctx.pathAttrs.cx},${ctx.pathAttrs.cy}`] ?? 0;
    return {
      rest: { x: 0 },
      active: {
        x: [0, dx, 0],
        transition: {
          duration: ctx.duration,
          delay: ctx.delay,
          repeat: ctx.repeat,
          ease: "easeInOut",
          times: [0, 0.4, 1],
        },
      },
    };
  },
};

const SLIDER_TRACK_DS = ["M14 17H5", "M19 7h-9"];

export const settings2Track: Motion = {
  matches: matchPathDOneOf(...SLIDER_TRACK_DS),
  factory: (ctx) => ({
    rest: { opacity: 1 },
    active: {
      opacity: [1, 0.7, 1],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay,
        repeat: ctx.repeat,
        ease: "easeInOut",
        times: [0, 0.4, 1],
      },
    },
  }),
};
