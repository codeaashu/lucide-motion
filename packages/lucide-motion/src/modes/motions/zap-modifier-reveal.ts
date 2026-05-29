import { matchAnyPath, type Motion } from "../compose";

/**
 * Zap-family wildcard reveal for the off-slash in `zap-off` (the
 * diagonal `m2 2 20 20` stroke that strikes through the broken
 * bolt to indicate the lightning is suppressed).
 *
 * **Coupling pattern**: the host motion ({@link import("./zap-strike").zapStrike})
 * jolts `y` briefly downward at the strike and flickers `opacity`
 * through the multi-flash schedule. The slash:
 * - Skips `y` inheritance (a slash sliding with the jolt stops
 *   reading as a static strike-through).
 * - Holds invisible through the jolt + primary flash
 *   (t = 0..0.10), then strikes through during the dim trough
 *   (t = 0.10..0.15) right after the bolt's peak. The dark
 *   moment is when the slash makes its narrative point.
 * - Carries a synthesized uniform `scale` dip `[1, 0.92, 1]`
 *   whose trough aligns with the strike apex — continuous
 *   kinetic life that doesn't distort the 45° diagonal.
 *
 * Three-criteria check:
 * - **Kinetic life**: pathLength + opacity vary through the
 *   reveal; scale dip continues from t=0.15 to t=1 so the slash
 *   stays alive through the post-strike flicker. ✓
 * - **Non-distortion**: uniform scale, no rotation, no
 *   translation. ✓
 * - **Apex alignment**: strike completes at the host's first
 *   dim trough. ✓
 *
 * Place this LAST in the compose `motions` list — `matchAnyPath`
 * is greedy and would otherwise claim the bolt fragments.
 */
export const zapModifierReveal: Motion = {
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
      scale: [1, 0.92, 1],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        repeat: ctx.repeat,
        strokeDasharray: { duration: 0 },
        strokeDashoffset: { inherit: true, ease: "easeOut", times: [0, 0.10, 0.15] },
        opacity: { inherit: true, ease: "easeOut", times: [0, 0.10, 0.15] },
        // Scale trough at t=0.15 = slash strike apex; recovers
        // across the bolt's secondary flickers.
        scale: { inherit: true, ease: "easeInOut", times: [0, 0.15, 1] },
      },
      transitionEnd: { strokeDasharray: 0, strokeDashoffset: 0 },
    },
  }),
};
