import { matchAnyPath, type Motion } from "../compose";
import { REFRESH_ARC_KEYFRAMES } from "./refresh-arc-cycle";

/**
 * Refresh-family wildcard reveal for the off-slash in `refresh-cw-off`
 * (the diagonal `M22 22 2 2` stroke that strikes through the icon to
 * indicate the refresh action is disabled).
 *
 * **Coupling pattern**: the host motion ({@link import("./refresh-arc-cycle").refreshArcCycle})
 * transforms `scale` (uniform) + `rotate` (one full revolution).
 * Rotate is *not* inherited — direct inheritance would carry the
 * slash around with the wheel, destroying the "strike-through"
 * reading the moment the slash crosses the spinning arrows. Uniform
 * `scale` IS inherited via `REFRESH_ARC_KEYFRAMES.scale` so the
 * slash pinches in lockstep with the wheel, sharing a kinetic peak
 * without rotating with it. This is the same pattern as
 * `eyeModifierReveal` (synthesized companion when direct inheritance
 * would distort the marker), just adapted to refresh's mechanical
 * pinch-then-spin rhythm.
 *
 * `pathLength` + `opacity` reveal the slash mid-cycle, completing
 * AT the halfway point of the rotation (`t = 0.5`) — the moment
 * the wheel has spun a full 180°, the visually busiest moment of
 * the cycle. The slash strikes through right at the apex of the
 * action, which lands the "blocked at peak effort" reading.
 *
 * ## ViewBox safety
 *
 * At scale 0.85, the slash endpoints (22, 22) and (2, 2) scale to
 * (20.5, 20.5) and (3.5, 3.5) around the (12, 12) pivot — well
 * inside the 24×24 viewBox. The slash never rotates so the only
 * geometry concern is the scale pinch, which is bounds-safe.
 *
 * Place this LAST in the compose `motions` list — `matchAnyPath` is
 * greedy and would otherwise claim the arc fragments.
 */
export const refreshModifierReveal: Motion = {
  matches: matchAnyPath,
  factory: (ctx) => ({
    rest: {
      strokeDasharray: 0,
      strokeDashoffset: 0,
      opacity: 1,
      scale: 1,
    },
    active: {
      // Slash holds invisible during the pinch-in, then strikes
      // through mid-spin. Dashoffset starts at full length so the
      // path is invisible until the strike begins.
      strokeDasharray: ctx.pathLength,
      strokeDashoffset: [ctx.pathLength, ctx.pathLength, 0],
      opacity: [0, 0, 1],
      // Pinch in lockstep with the wheel. Uniform scale preserves
      // the 45° diagonal — no rotation, no distortion.
      scale: REFRESH_ARC_KEYFRAMES.scale,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        repeat: ctx.repeat,
        strokeDasharray: { duration: 0 },
        // Strike completes at t=0.5 — the wheel has spun a full
        // 180° (the visual midpoint of the rotation). The slash
        // lands at the apex of the action, reading as "blocked
        // at peak effort."
        strokeDashoffset: { inherit: true, ease: "easeOut", times: [0, 0.15, 0.5] },
        opacity: { inherit: true, ease: "easeOut", times: [0, 0.15, 0.5] },
        // Scale piggybacks on the host's pinch — slash contracts
        // and expands with the wheel, sharing the kinetic peak.
        scale: {
          inherit: true,
          ease: "easeInOut",
          times: REFRESH_ARC_KEYFRAMES.times,
        },
      },
      transitionEnd: { strokeDasharray: 0, strokeDashoffset: 0 },
    },
  }),
};
