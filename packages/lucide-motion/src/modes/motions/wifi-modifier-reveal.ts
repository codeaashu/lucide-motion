import type { Motion } from "../compose";
import { WIFI_SIGNAL_KEYFRAMES } from "./wifi-signal-wave";

/**
 * Wifi-family fallback reveal for state and utility badges: the off
 * slash, cog teeth, pen body, and sync arrows. These are not the radio
 * waves themselves, so they reveal quietly with pathLength + opacity
 * while sharing the wifi emission rhythm.
 *
 * The off slash completes at the full-signal peak (after the outer
 * wave has animated in) and uses an opacity pulse for continuous
 * kinetic life without distorting or moving the strike-through.
 *
 * Place this after `wifiSignalWave` and `wifiSignalSource`; it is the
 * greedy path fallback for whatever remains.
 */
const OFF_SLASH_D = "m2 2 20 20";
const BADGE_OPACITY = [0, 0, 1, 0.74, 1];
const BADGE_TIMES = [0, 0.24, WIFI_SIGNAL_KEYFRAMES.fullSignalPeak, 0.86, 1];

export const wifiModifierReveal: Motion = {
  matches: (ctx) => ctx.pathTag === "path",
  factory: (ctx) => {
    const isOffSlash = String(ctx.pathAttrs.d) === OFF_SLASH_D;
    const delay = isOffSlash ? ctx.delay : ctx.delay + ctx.index * ctx.stagger;

    const L = ctx.pathLength;
    return {
      rest: {
        strokeDasharray: 0,
        strokeDashoffset: 0,
        opacity: 1,
      },
      active: {
        strokeDasharray: L,
        // Mirror the original [0, 0, 1, 1, 1] reveal: hidden, hidden,
        // drawn, drawn, drawn.
        strokeDashoffset: [L, L, 0, 0, 0],
        opacity: BADGE_OPACITY,
        transition: {
          duration: ctx.duration,
          delay,
          repeat: ctx.repeat,
          strokeDasharray: { duration: 0 },
          strokeDashoffset: {
            inherit: true,
            ease: "easeOut",
            times: BADGE_TIMES,
          },
          opacity: {
            inherit: true,
            ease: "easeOut",
            times: BADGE_TIMES,
          },
        },
        transitionEnd: { strokeDasharray: 0, strokeDashoffset: 0 },
      },
    };
  },
};

/**
 * Circle counterpart for `wifi-cog`'s gear hub. Circles do not use
 * pathLength; the hub fades in at the same full-signal badge peak and
 * keeps a small opacity pulse for kinetic life.
 */
export const wifiCircleReveal: Motion = {
  matches: (ctx) =>
    ctx.pathTag === "circle" &&
    String(ctx.pathAttrs.cx) === "18" &&
    String(ctx.pathAttrs.cy) === "18" &&
    String(ctx.pathAttrs.r) === "3",
  factory: (ctx) => ({
    rest: { opacity: 1 },
    active: {
      opacity: BADGE_OPACITY,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        repeat: ctx.repeat,
        opacity: {
          inherit: true,
          ease: "easeOut",
          times: BADGE_TIMES,
        },
      },
    },
  }),
};
