import { matchPathD, type Motion } from "../compose";
import { CLOUD_BODY_KEYFRAMES } from "./cloud-body";

/**
 * The lightning-bolt path in `cloud-lightning` — Lucide's zigzag
 * stroke hanging from the cloud's underside.
 *
 * **Real-life motion**: a lightning strike produces a sharp impact
 * that briefly displaces the bolt at its rest position, paired
 * with the multi-flash brightness pattern. The bolt doesn't slide
 * into the frame — it's already there, and the strike is a
 * downward jolt synced with the first flash.
 *
 * **Cycle shape** (over `ctx.duration`):
 * - 0 → 0.06: bolt jolts down (y = 0 → 0.7) at the strike; opacity
 *   holds at 1 (peak flash).
 * - 0.06 → 0.15: bolt springs back to rest (y = 0.7 → 0); opacity
 *   dips to 0.15 (post-strike dark moment).
 * - 0.15 → 0.30: opacity flashes back to 1.
 * - 0.30 → 0.50: opacity dips to 0.4.
 * - 0.50 → 1: opacity settles back to 1.
 *
 * Jolt amplitude is 0.7 viewBox units — smaller than zap's 1.0 to
 * keep the bolt's bottom cap safely inside the viewBox (the
 * cloud-lightning bolt's bottom point sits at y=22, plus
 * strokeWidth/2 = 23, so a 0.7 jolt lands at 23.7 with margin).
 *
 * **Couples to the cloud body**: scale piggybacks on
 * `CLOUD_BODY_KEYFRAMES.scale` via `inherit: true` so the bolt
 * stays anchored to the cloud's gentle breath through the post-
 * strike hold.
 */
const LIGHTNING_D = "m13 12-3 5h4l-3 5";

const BOLT_TIMES = [0, 0.06, 0.15, 0.30, 0.50, 1];

export const cloudLightningBolt: Motion = {
  matches: matchPathD(LIGHTNING_D),
  factory: (ctx) => ({
    rest: { y: 0, opacity: 1, scale: 1 },
    active: {
      y: [0, 0.7, 0, 0, 0, 0],
      opacity: [1, 1, 0.15, 1, 0.4, 1],
      scale: CLOUD_BODY_KEYFRAMES.scale,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        repeat: ctx.repeat,
        // easeOut on the jolt — sharp kick then decelerating settle.
        y: { inherit: true, ease: "easeOut", times: BOLT_TIMES },
        // Linear opacity for crisp flash peaks.
        opacity: { inherit: true, ease: "linear", times: BOLT_TIMES },
        // Scale stays loosely coupled to the cloud's gentle breath.
        scale: {
          inherit: true,
          ease: ctx.easing,
          times: CLOUD_BODY_KEYFRAMES.times,
        },
      },
    },
  }),
};
