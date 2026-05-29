import { matchPathDOneOf, type Motion } from "../compose";
import { REFRESH_ARC_KEYFRAMES } from "./refresh-arc-cycle";

/**
 * Cloud-sync's paired arrows — Tier 2 sync-loop motion. The four
 * disjoint paths (two curved arcs + two L-shaped arrowheads) form one
 * rigid sync wheel that sits inside the cloud body, so they share the
 * same badge-center pivot and counter-clockwise pinch-then-spin
 * rhythm as the refresh-ccw family. Routing them through
 * `cloudModifierReveal` would draw the wheel in as a static badge
 * rather than rotating it — same anti-pattern as the original
 * wifi-sync fix.
 */
const CLOUD_SYNC_ARROW_PATHS = [
  "m17 18-1.535 1.605a5 5 0 0 1-8-1.5",
  "M17 22v-4h-4",
  "M7 10v4h4",
  "m7 14 1.535-1.605a5 5 0 0 1 8 1.5",
];

// Wheel center: the two L-tick corners sit at (7, 10) and (17, 22).
// Their midpoint is (12, 16) — the natural rotational pivot for the
// inscribed sync wheel.
const CLOUD_SYNC_ARROW_PIVOT = "12px 16px";

export const CLOUD_SYNC_ARROW_KEYFRAMES = {
  // Same timing shape as refresh-ccw. The badge's cap envelope reaches
  // ≈ 9.3 from center at rest (corner offset √(5² + 6²) + stroke), so
  // contracting to 0.78 keeps the spinning wheel comfortably inside
  // the 24×24 viewBox during the full revolution.
  scale: [1, 0.78, 0.78, 1],
  rotate: [0, 0, -360, -360],
  times: REFRESH_ARC_KEYFRAMES.times,
};

export const cloudSyncArrows: Motion = {
  matches: matchPathDOneOf(...CLOUD_SYNC_ARROW_PATHS),
  factory: (ctx) => ({
    rest: {
      scale: 1,
      rotate: 0,
      transformBox: "view-box",
      transformOrigin: CLOUD_SYNC_ARROW_PIVOT,
    },
    active: {
      scale: CLOUD_SYNC_ARROW_KEYFRAMES.scale,
      rotate: CLOUD_SYNC_ARROW_KEYFRAMES.rotate,
      transformBox: "view-box",
      transformOrigin: CLOUD_SYNC_ARROW_PIVOT,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay,
        repeat: ctx.repeat,
        scale: {
          inherit: true,
          ease: "easeInOut",
          times: CLOUD_SYNC_ARROW_KEYFRAMES.times,
        },
        rotate: {
          inherit: true,
          ease: "easeInOut",
          times: CLOUD_SYNC_ARROW_KEYFRAMES.times,
        },
      },
    },
  }),
};
