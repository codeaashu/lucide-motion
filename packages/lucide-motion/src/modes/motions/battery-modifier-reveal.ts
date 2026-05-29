import { matchAnyPath, type Motion } from "../compose";
import { BATTERY_CASE_KEYFRAMES } from "./battery-case";

/**
 * Battery-family in-cell state markers: plus and warning strokes.
 * They stay fully visible and animate like UI indicators mounted
 * inside the battery: plus does a press/rebound pulse; warning blinks
 * like a low-voltage alert LED. No `pathLength` reveal.
 *
 * Place this last in the compose list; `matchAnyPath` is greedy.
 */
export const batteryModifierReveal: Motion = {
  matches: matchAnyPath,
  factory: (ctx) => {
    const isWarning = ctx.iconName === "battery-warning";

    return {
      rest: {
        scale: 1,
        opacity: 1,
        transformBox: "fill-box",
        transformOrigin: "center",
      },
      active: {
        scale: isWarning ? [1, 0.84, 1, 0.9, 1] : [1, 0.86, 1, 0.94, 1],
        opacity: isWarning ? [1, 0.18, 1, 0.35, 1] : [1, 0.5, 1, 0.78, 1],
        transformBox: "fill-box",
        transformOrigin: "center",
        transition: {
          duration: ctx.duration,
          delay: ctx.delay,
          repeat: ctx.repeat,
          scale: {
            inherit: true,
            ease: "easeInOut",
            times: [0, 0.18, BATTERY_CASE_KEYFRAMES.powerPeak, 0.84, 1],
          },
          opacity: {
            inherit: true,
            ease: "easeInOut",
            times: [0, 0.18, BATTERY_CASE_KEYFRAMES.powerPeak, 0.84, 1],
          },
        },
      },
    };
  },
};
