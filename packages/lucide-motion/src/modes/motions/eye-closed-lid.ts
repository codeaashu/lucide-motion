import { matchPathD, type Motion } from "../compose";

/**
 * The closed-eye eyelid arc — the downward-curving line that runs
 * from (2, 8) to (22, 8) through (12, ~13) and represents the
 * shut eyelid in Lucide's `eye-closed`.
 *
 * Tier 2 motion: a real shut eyelid isn't perfectly still — the
 * orbicularis muscle holds the lid closed with a subtle ongoing
 * tension, occasionally tightening to a firmer squeeze before
 * relaxing back. The lid doesn't "blink shut" again (the eye is
 * already closed); it just settles. Modeled here as a small
 * vertical squeeze (`scaleY ≤ 1`) — the lid arc compresses
 * briefly toward its rest line and eases back. Contraction-only
 * keeps the curve well inside the 24×24 viewBox (the arc's
 * lowest point is around y=13, so any expansion would risk
 * clipping at the bottom).
 *
 * Pivot: the signature uses `transformOrigin: "12px 8px"` so the
 * lid hinges from the top of the closed eyelid — the natural pivot
 * for an eyelid that opens downward — rather than the icon centre.
 *
 * Exports `EYE_CLOSED_LID_KEYFRAMES` so the family's lash motion
 * (and any future modifier reveal) can inherit the squeeze via
 * per-value `inherit: true` transitions and stay anchored through
 * the settle.
 */
export const EYE_CLOSED_LID_KEYFRAMES = {
  scaleY: [1, 0.88, 1],
  times: [0, 0.45, 1],
};

const EYE_CLOSED_LID_D = "M2 8a10.645 10.645 0 0 0 20 0";

export const eyeClosedLid: Motion = {
  matches: matchPathD(EYE_CLOSED_LID_D),
  factory: (ctx) => ({
    rest: { scaleY: 1 },
    active: {
      scaleY: EYE_CLOSED_LID_KEYFRAMES.scaleY,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        ease: ctx.easing,
        times: EYE_CLOSED_LID_KEYFRAMES.times,
        repeat: ctx.repeat,
      },
    },
  }),
};
