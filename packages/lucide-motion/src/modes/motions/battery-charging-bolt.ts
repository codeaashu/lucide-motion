import { matchPathD, type Motion } from "../compose";

/**
 * Battery-charging lightning bolt. It represents incoming current, so
 * it stays visible and flashes/jolts in place as current runs through
 * the cell. No stroke-on reveal: this is an electrical pulse, not a
 * drawing animation.
 */
const BATTERY_CHARGING_BOLT_D = "m11 7-3 5h4l-3 5";

export const batteryChargingBolt: Motion = {
  matches: matchPathD(BATTERY_CHARGING_BOLT_D),
  factory: (ctx) => ({
    rest: {
      scale: 1,
      opacity: 1,
      y: 0,
      transformBox: "view-box",
      transformOrigin: "10px 12px",
    },
    active: {
      scale: [1, 0.82, 1, 0.9, 1],
      opacity: [1, 0.28, 1, 0.48, 1],
      y: [0, -0.35, 0, 0.2, 0],
      transformBox: "view-box",
      transformOrigin: "10px 12px",
      transition: {
        duration: ctx.duration,
        delay: ctx.delay,
        repeat: ctx.repeat,
        scale: {
          inherit: true,
          ease: "easeInOut",
          times: [0, 0.16, 0.34, 0.62, 1],
        },
        opacity: {
          inherit: true,
          ease: "easeInOut",
          times: [0, 0.16, 0.34, 0.62, 1],
        },
        y: {
          inherit: true,
          ease: "easeInOut",
          times: [0, 0.16, 0.34, 0.62, 1],
        },
      },
    },
  }),
};
