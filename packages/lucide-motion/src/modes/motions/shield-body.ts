import { matchPathDOneOf, type Motion } from "../compose";

/**
 * Shield body — the host motion for every icon built around the
 * Lucide heraldic crest outline (14 icons today: `shield`,
 * `shield-alert`, `shield-ban`, `shield-check`, `shield-cog`,
 * `shield-cog-corner`, `shield-ellipsis`, `shield-half`,
 * `shield-minus`, `shield-off`, `shield-plus`, `shield-question-mark`,
 * `shield-user`, `shield-x`).
 *
 * The standard outline is byte-identical across 11 variants. Three
 * variants reshape it:
 *
 * - `shield-cog-corner` — top-right corner cut to make room for the
 *   inset gear.
 * - `shield-off` — split into two casing fragments around the
 *   diagonal strike-through.
 *
 * **Real-life referent — shield deflecting a strike.** A held shield's
 * characteristic motion is the brace-and-rebound when it absorbs an
 * impact: the shield tilts briefly under the hit and recoils. Per the
 * skill's "Polished shine sweep" archetype this is the bespoke
 * physics version — a damped left-right tilt around the bottom tip
 * (12, 22), the grip-side of a held shield, paired with an opacity
 * dip phase-locked to the tilt apexes so the surface flashes as it
 * deflects.
 *
 * Pivot at `(12, 22)`: the bottom tip of the crest where the shield
 * is held in the hand or planted on the ground. Tilting around the
 * grip reads as "the shield is being struck and rebounds," not
 * "the shield is wobbling in space."
 *
 * ViewBox safety. Top corners of the body sit at roughly (4, 6) and
 * (20, 6), distance ≈ 17.9 from the pivot. At ±4° rotation, the
 * farthest top corner moves to roughly (2.9, 6.6) — still inside the
 * 24×24 viewBox after accounting for stroke radius 1. The top tip
 * at (12, 2) — distance 20 from the pivot — moves to (13.4, 2.05) at
 * peak; visible edge with stroke radius lands at y ≈ 1.05, safe.
 *
 * Sub-icons inherit BOTH the rotate and the opacity via the family
 * modifier-reveal so payloads (alert dot, check tick, cog teeth +
 * hub, user head, etc.) tilt and flash WITH the shield rather than
 * sitting statically over a recoiling host (principle 2 — cohesion;
 * monitor and mail are the existing precedents).
 *
 * Exports `SHIELD_BODY_KEYFRAMES` so the family modifier-reveal can
 * inherit both curves directly.
 *
 * Closed cycle: every keyframe array starts AND ends at the rest
 * value (principle 4).
 */
const SHIELD_BODY_PATHS = [
  // Standard crest outline (11 variants share this)
  "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
  // shield-cog-corner — top-right cut to host the gear
  "M11 22c-3.806-1.45-7-3.966-7-9V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1v4",
  // shield-off — lower-left fragment
  "M5 5a1 1 0 0 0-1 1v7c0 5 3.5 7.5 7.67 8.94a1 1 0 0 0 .67.01c2.35-.82 4.48-1.97 5.9-3.71",
  // shield-off — upper-right fragment
  "M9.309 3.652A12.252 12.252 0 0 0 11.24 2.28a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1v7a9.784 9.784 0 0 1-.08 1.264",
];

const matchShieldBody = matchPathDOneOf(...SHIELD_BODY_PATHS);

export const SHIELD_BODY_KEYFRAMES = {
  // Damped left-right tilt around the bottom-tip grip (12, 22).
  // The crest leans into a strike, rebounds past centre, settles.
  rotate: [0, -4, 3, -1, 0],
  // Opacity dip phase-locked to the tilt apexes. Surface flashes
  // as it deflects, brightens as it returns to vertical.
  opacity: [1, 0.75, 1, 0.88, 1],
  times: [0, 0.25, 0.5, 0.75, 1],
};

export const shieldBody: Motion = {
  matches: matchShieldBody,
  factory: (ctx) => ({
    rest: { rotate: 0, opacity: 1 },
    active: {
      rotate: SHIELD_BODY_KEYFRAMES.rotate,
      opacity: SHIELD_BODY_KEYFRAMES.opacity,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay,
        repeat: ctx.repeat,
        ease: "easeInOut",
        times: SHIELD_BODY_KEYFRAMES.times,
      },
    },
  }),
};
