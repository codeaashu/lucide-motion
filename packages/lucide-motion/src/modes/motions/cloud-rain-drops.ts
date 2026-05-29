import { matchPathDOneOf, type Motion } from "../compose";
import { CLOUD_BODY_KEYFRAMES } from "./cloud-body";

/**
 * Rain droplets, drizzle, hail's vertical chunks, and rain-wind's
 * diagonal streaks across the cloud family. Lucide draws each one
 * as a short straight stroke (vertical for rain/drizzle/hail,
 * slanted for rain-wind) sitting below the cloud body.
 *
 * Tier 2 motion: real rain falls. Each drop translates downward
 * through a small Y range (≈ 6px total) while its opacity envelope
 * fades in as it leaves the cloud and out before it reaches the
 * viewBox floor. The eye reads the continuous translation + soft
 * fade as drops emerging, falling, and dissipating. Per-path
 * stagger from the signature offsets each drop's phase so the rain
 * reads as continuous rather than synchronised.
 *
 * Single-cycle gesture: opacity returns to 0 at cycle end (matching
 * cycle start) so if a consumer opts into `repeat: Infinity` the
 * Y reset between cycles is invisible. Default plays once on hover.
 *
 * **Couples to the cloud body**: scale piggybacks on
 * `cloudBody`'s gentle pulse via `inherit: true` so the drops
 * shrink slightly with the cloud's breath rather than floating
 * independently.
 *
 * Earlier implementation used `pathLength` draw-in, which read as
 * the icon writing itself rather than rain falling. Draw-in is a
 * Tier 1 (state marker) mechanism; Tier 2 elements need real
 * physics.
 */
const RAIN_PATHS = [
  // cloud-rain — full-length drops
  "M16 14v6",
  "M8 14v6",
  "M12 16v6",
  // cloud-drizzle — short flickers (each drop is a one-unit nub)
  "M8 19v1",
  "M8 14v1",
  "M16 19v1",
  "M16 14v1",
  "M12 21v1",
  "M12 16v1",
  // cloud-hail — vertical chunks (the larger half of the hail pieces)
  "M16 14v2",
  "M8 14v2",
  "M12 16v2",
  // cloud-sun-rain / cloud-moon-rain — short drops below the smaller cloud
  "M11 20v2",
  "M7 19v2",
  // cloud-rain-wind — diagonal streaks (rain blown by wind)
  "m9.2 22 3-7",
  "m9 13-3 7",
  "m17 13-3 7",
];

export const cloudRainDrops: Motion = {
  matches: matchPathDOneOf(...RAIN_PATHS),
  factory: (ctx) => ({
    rest: { y: 0, opacity: 1, scale: 1 },
    active: {
      // Closed-cycle fall: drop fades out at its rest position, "respawns"
      // above the cloud while invisible, falls through visible, fades out
      // at the bottom, and returns to rest under cover of opacity 0. Every
      // teleport (rest→top, bottom→rest) happens while the drop is
      // invisible so the only visible motion is the falling segment, and
      // each play lands cleanly back at the rest glyph.
      y: [0, -3, -1.5, 1.5, 3, 0],
      opacity: [1, 0, 1, 1, 0, 1],
      scale: CLOUD_BODY_KEYFRAMES.scale,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        repeat: ctx.repeat,
        // Linear Y read as gravity through the visible fall window (10% →
        // 85%). The brief fade-out at the start (0 → 10%) and fade-in at
        // the end (85% → 100%) cover the off-screen reposition beats.
        y: { inherit: true, ease: "linear", times: [0, 0.1, 0.25, 0.7, 0.85, 1] },
        opacity: {
          inherit: true,
          ease: "easeInOut",
          times: [0, 0.1, 0.25, 0.7, 0.85, 1],
        },
        scale: {
          inherit: true,
          ease: ctx.easing,
          times: CLOUD_BODY_KEYFRAMES.times,
        },
      },
    },
  }),
};
