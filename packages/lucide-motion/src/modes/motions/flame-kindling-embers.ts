import { matchPathDOneOf, type Motion } from "../compose";
import { FLAME_KEYFRAMES } from "./flame-flicker";

/**
 * The two crossed kindling sticks under the flame in
 * `flame-kindling` — a diagonal `\` from (5, 22) to (19, 18) and a
 * diagonal `/` from (5, 18) to (19, 22), forming an X.
 *
 * Tier 2 motion: real burning kindling doesn't translate — the
 * wood stays where it sits. What moves is the *ember glow* (the
 * hot spots dim and brighten as the embers oxidize and re-cool).
 * Modeled here as an opacity flicker layered with an inherited
 * rotate from the flame above: the sticks rock very slightly with
 * the flame's sway, the way real kindling responds to fire's air
 * currents without actually moving.
 *
 * **Cohesion via inherit**: `rotate` piggybacks on the host
 * `flameFlicker`'s keyframes via `inherit: true` so the sticks
 * stay loosely tied to the flame's flicker rather than animating
 * on their own out-of-phase schedule. The opacity keeps its own
 * slower glow rhythm.
 */
const KINDLING_PATHS = [
  "m5 22 14-4",
  "m5 18 14 4",
];

export const flameKindlingEmbers: Motion = {
  matches: matchPathDOneOf(...KINDLING_PATHS),
  factory: (ctx) => ({
    rest: { opacity: 1, rotate: 0 },
    active: {
      opacity: [1, 0.6, 1, 0.8, 1],
      rotate: FLAME_KEYFRAMES.rotate,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        repeat: ctx.repeat,
        opacity: { inherit: true, ease: "easeInOut", times: [0, 0.25, 0.5, 0.75, 1] },
        rotate: {
          inherit: true,
          ease: ctx.easing,
          times: FLAME_KEYFRAMES.times,
        },
      },
    },
  }),
};
