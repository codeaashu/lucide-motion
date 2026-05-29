import { matchAnyPath, type Motion } from "../compose";

/**
 * Sunray pulse — Tier 2 motion for a sun's body and its radiating
 * rays. Used as the wildcard catch-all in every sun-family
 * signature.
 *
 * **Real-life motion**: sun rays radiate *outward* from their source.
 * A brightness-only pulse reads as the sun blinking, not radiating —
 * the rays need to physically extend for the radiation to register.
 *
 * **How the radiation reads without exceeding the viewBox**: per
 * principle 3 and project memory `feedback_scaled_stroke_viewbox.md`,
 * rest is the max and active oscillates *downward*. The rays' rest
 * state is full Lucide-default length (scale 1). The active cycle
 * starts the rays slightly contracted (scale 0.94) and grows them
 * back to full at the cycle peak. The eye sees that growth-to-full
 * as outward radiation, even though the rays never exceed their
 * drawn length.
 *
 * scale: [0.94, 1, 0.94]
 *   - t=0: rays 6% contracted (gathered)
 *   - t=0.5: rays at full length (peak radiation)
 *   - t=1: rays 6% contracted (returning to gathered state)
 *
 * Combined with an opacity flare (`[1, 0.45, 1]`, brightness dips
 * mid-cycle and recovers) so the rays read as alive — variation in
 * both length and intensity, no clipping.
 *
 * Pivot point: the signature's `transformOrigin` must be the sun's
 * actual centre (so the scale extends each ray along its emission
 * direction from the sun). For `sun-dim` and `sun-medium` that's
 * the icon centre (12, 12); for `sun-snow` the sun sits on the left
 * so the signature pivots at (10, 12).
 *
 * Per-path stagger via `ctx.index * ctx.stagger` cascades the pulse
 * through the icon's paths so the rays light up in sequence. The
 * central circle is first in Lucide's path order for `sun-dim` and
 * `sun-medium`, so the cascade reads as the sun's centre flaring
 * first and the rays following — a wave of light radiating outward.
 */
export const sunRayPulse: Motion = {
  matches: matchAnyPath,
  factory: (ctx) => ({
    rest: { scale: 1, opacity: 1 },
    active: {
      // Pulse contracts FROM rest, then returns — keyframes form a closed
      // cycle so the animation lands back at the rest glyph without an
      // engine-level snap. (Earlier authoring `[0.94, 1, 0.94]` snapped
      // smaller at the start and left the ray contracted at the end.)
      scale: [1, 0.94, 1],
      opacity: [1, 0.45, 1],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        ease: ctx.easing,
        repeat: ctx.repeat,
      },
    },
  }),
};
