import { matchPathDOneOf, type Motion } from "../compose";
import { REFRESH_ARC_KEYFRAMES } from "./refresh-arc-cycle";

/**
 * Wifi-sync's paired arrows — Tier 2 sync-loop motion. The four
 * disjoint paths form one rigid sync wheel, so they share the same
 * badge-center pivot and counter-clockwise pinch-then-spin rhythm as
 * the refresh-ccw family instead of spinning independently around
 * their own bounds.
 */
const WIFI_SYNC_ARROW_PATHS = [
  "M11.965 10.105v4L13.5 12.5a5 5 0 0 1 8 1.5",
  "M11.965 14.105h4",
  "M17.965 18.105h4L20.43 19.71a5 5 0 0 1-8-1.5",
  "M21.965 22.105v-4",
];

const WIFI_SYNC_ARROW_PIVOT = "16.965px 16.105px";

export const WIFI_SYNC_ARROW_KEYFRAMES = {
  // Same timing shape as refresh-ccw. The smaller badge sits near the
  // right/bottom viewBox edges, so it contracts slightly more than
  // refresh's 0.85 while the wheel is rotating.
  scale: [1, 0.78, 0.78, 1],
  rotate: [0, 0, -360, -360],
  times: REFRESH_ARC_KEYFRAMES.times,
};

export const wifiSyncArrows: Motion = {
  matches: matchPathDOneOf(...WIFI_SYNC_ARROW_PATHS),
  factory: (ctx) => ({
    rest: {
      scale: 1,
      rotate: 0,
      transformBox: "view-box",
      transformOrigin: WIFI_SYNC_ARROW_PIVOT,
    },
    active: {
      scale: WIFI_SYNC_ARROW_KEYFRAMES.scale,
      rotate: WIFI_SYNC_ARROW_KEYFRAMES.rotate,
      transformBox: "view-box",
      transformOrigin: WIFI_SYNC_ARROW_PIVOT,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay,
        repeat: ctx.repeat,
        scale: {
          inherit: true,
          ease: "easeInOut",
          times: WIFI_SYNC_ARROW_KEYFRAMES.times,
        },
        rotate: {
          inherit: true,
          ease: "easeInOut",
          times: WIFI_SYNC_ARROW_KEYFRAMES.times,
        },
      },
    },
  }),
};
