import { matchPathDOneOf, type Motion } from "../compose";
import { CLOUD_BODY_KEYFRAMES } from "./cloud-body";

/**
 * The two horizontal fog streaks in `cloud-fog`. Lucide draws them
 * as `M16 17H7` (upper) and `M17 21H9` (lower) — short flat lines
 * sitting under the cloud body.
 *
 * Tier 2 motion: fog drifts laterally on slow air currents and
 * thins/rebuilds as its density shifts. Modeled as a horizontal
 * sway (X translation) layered with a subtle opacity dim/recover
 * (density variation). The fog stays visible throughout the cycle
 * (no fade to 0) because fog is a persistent layer of moisture,
 * not a discrete falling drop — it rolls, it doesn't disappear.
 *
 * Per-path stagger from the signature offsets the two streaks so
 * the upper bank drifts slightly ahead of the lower, suggesting
 * layered wisps rather than a single rigid sheet.
 *
 * **Couples to the cloud body**: scale piggybacks on `cloudBody`'s
 * gentle pulse via `inherit: true` so the streaks breathe with
 * the cloud rather than floating statically.
 *
 * Earlier implementation drew the streaks in via `pathLength`,
 * which read as the icon writing itself rather than fog rolling.
 * Draw-in is a Tier 1 (state marker) mechanism; fog needs lateral
 * motion.
 */
const FOG_PATHS = [
  "M16 17H7",
  "M17 21H9",
];

export const cloudFogStreaks: Motion = {
  matches: matchPathDOneOf(...FOG_PATHS),
  factory: (ctx) => ({
    rest: { x: 0, opacity: 1, scale: 1 },
    active: {
      // Asymmetric drift — fog rolls farther one way before
      // pulling back, the way real wisps catch on the prevailing
      // breeze before eddying. Returns to 0 at cycle end so the
      // loop reset is invisible.
      x: [0, 1.5, -1, 0],
      // Density dip mid-drift, recovers by cycle end. Stays above
      // 0 throughout — fog persists.
      opacity: [1, 0.55, 0.85, 1],
      scale: CLOUD_BODY_KEYFRAMES.scale,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        repeat: ctx.repeat,
        x: { inherit: true, ease: "easeInOut", times: [0, 0.35, 0.7, 1] },
        opacity: { inherit: true, ease: "easeInOut", times: [0, 0.3, 0.7, 1] },
        scale: {
          inherit: true,
          ease: ctx.easing,
          times: CLOUD_BODY_KEYFRAMES.times,
        },
      },
    },
  }),
};
