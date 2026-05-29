import { matchAnyPath, type Motion } from "../compose";
import { EYE_BLINK_KEYFRAMES } from "./eye-blink";

/**
 * Eye-family wildcard reveal — `pathLength` + `opacity` draw-in that
 * strikes through on top of the eye, timed to **complete at the blink's
 * apex** (50% of the cycle) and paired with a uniform `scale` dip that
 * gives the slash kinetic life without distorting it.
 *
 * Used for any state modifier overlaid on the eye (the diagonal slash
 * in `eye-off`, and future markers like plus / minus / check / dot if
 * Lucide ships them).
 *
 * ## Why uniform `scale` and not `scaleY`
 *
 * The eye's primary motion (`eyeBlink`) is axis-asymmetric — `scaleY`
 * only. A diagonal slash inheriting that vertical-only squeeze flattens
 * toward the horizontal axis at the apex and reads as the slash itself
 * blinking. That's wrong: the slash is an overlay, not an eye part.
 *
 * But going fully rigid is also wrong — without any kinetic life, the
 * slash is a static line that pops in over a moving icon, and the read
 * is disconnected. The bell / heart / cloud modifier-reveals feel
 * smooth because their slashes share continuous motion with the host
 * (rotation, uniform scale, breath) — that's what makes them feel like
 * one coordinated gesture rather than two separate animations.
 *
 * Solution: give the slash a uniform `scale` dip (`[1, 0.85, 1]`) timed
 * to the blink's apex via `EYE_BLINK_KEYFRAMES.times`. Uniform scale
 * contracts the slash proportionally — it stays a 45° diagonal,
 * unflattened — while sharing a temporal peak with the blink so the
 * two motions feel like a single coordinated gesture. This is the same
 * isotropic-inheritance pattern as `heart-modifier-reveal`'s `scale`,
 * synthesized for the eye family (the eye itself has no uniform scale
 * since blink is axis-asymmetric, so the slash defines its own).
 *
 * ## Why the timing
 *
 * `pathLength` + `opacity` peak at the blink apex (`times: [0, 0.15,
 * 0.5]`) — the strike *completes* right as the eye reaches max close,
 * so the two events share a single peak instead of staggering. After
 * the apex, the slash holds drawn while the eye reopens around it.
 *
 * Place this LAST in the compose `motions` list — `matchAnyPath` is
 * greedy and would otherwise claim eye-body paths.
 */
export const eyeModifierReveal: Motion = {
  matches: matchAnyPath,
  factory: (ctx) => ({
    rest: {
      strokeDasharray: 0,
      strokeDashoffset: 0,
      opacity: 1,
      scale: 1,
    },
    active: {
      strokeDasharray: ctx.pathLength,
      strokeDashoffset: [ctx.pathLength, ctx.pathLength, 0],
      opacity: [0, 0, 1],
      scale: [1, 0.85, 1],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        repeat: ctx.repeat,
        strokeDasharray: { duration: 0 },
        // Strike completes AT the blink apex (50% of cycle): brief
        // anticipation hold, then a decisive easeOut draw-in.
        strokeDashoffset: { inherit: true, ease: "easeOut", times: [0, 0.15, 0.5] },
        opacity: { inherit: true, ease: "easeOut", times: [0, 0.15, 0.5] },
        // Uniform scale dip shares the blink's times so the slash
        // proportionally contracts at the same moment the eye reaches
        // max close. Stays a 45° line — not asymmetric. easeInOut to
        // match the eye's smooth bell-curve easing.
        scale: {
          inherit: true,
          ease: ctx.easing,
          times: EYE_BLINK_KEYFRAMES.times,
        },
      },
      transitionEnd: { strokeDasharray: 0, strokeDashoffset: 0 },
    },
  }),
};
