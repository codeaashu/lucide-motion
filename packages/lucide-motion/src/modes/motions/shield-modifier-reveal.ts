import { matchAnyPath, type Motion } from "../compose";
import { SHIELD_BODY_KEYFRAMES } from "./shield-body";

/**
 * Shield-family wildcard reveal — every non-body path reveals at the
 * crest's first tilt apex, then inherits BOTH the body's rotate and
 * opacity for the rest of the cycle so payloads tilt and flash WITH
 * the shield (principle 2 — cohesion; the monitor and mail families
 * are the existing precedents).
 *
 * Catches whatever's left after `shieldBody` claims the crest
 * outline:
 *
 * - State markers: check tick (`shield-check`), × strokes
 *   (`shield-x`), `+` (`shield-plus`), `−` (`shield-minus`), `!`
 *   exclamation + dot (`shield-alert`), `?` curve + dot
 *   (`shield-question-mark`), diagonal slash (`shield-ban`,
 *   `shield-off`), the vertical half-divider (`shield-half`).
 * - Payload glyphs: `shield-cog`'s teeth + hub circle, `shield-cog-
 *   corner`'s teeth + hub, `shield-ellipsis`'s three dots,
 *   `shield-user`'s head circle + torso arc.
 *
 * Branches by element type for the reveal mechanism:
 *
 * - `<path>` / `<line>` → `strokeDasharray` + `strokeDashoffset`
 *   draw-in over the measured `ctx.pathLength` (cleared on
 *   `transitionEnd` so the resting stroke stays solid and seam-free).
 * - `<circle>` → `scale` from 0, pivoted at the circle's own
 *   `fill-box` centre so the reveal stamps in place rather than
 *   sliding from the signature's bottom-tip pivot.
 *
 * Reveal completes at `t = 0.25` — exactly when the body reaches its
 * first tilt apex. The payload appears AS the shield deflects, then
 * holds drawn through the recovery.
 *
 * Opacity tracks `SHIELD_BODY_KEYFRAMES.opacity` from 0 — `[0, 0,
 * 0.75, 1, 0.88, 1]` — so the payload emerges into the shield's
 * first dim and breathes with the crest through the rest of the
 * cycle.
 *
 * Rotate inherits the body's tilt directly — uniform in-plane
 * rotation around a fixed pivot is safe to direct-inherit per
 * principle 2's first branch (no orientation distortion on diagonals,
 * orthogonals, or curves).
 *
 * Place this LAST in the compose `motions` list — `matchAnyPath` is
 * greedy and would otherwise claim the body.
 */
export const shieldModifierReveal: Motion = {
  matches: matchAnyPath,
  factory: (ctx) => {
    const isCircle = ctx.pathTag === "circle";
    if (isCircle) {
      return {
        rest: {
          scale: 1,
          opacity: 1,
          rotate: 0,
          transformBox: "fill-box",
          transformOrigin: "center",
        },
        active: {
          scale: [0, 0, 1],
          opacity: [0, 0, 0.75, 1, 0.88, 1],
          rotate: SHIELD_BODY_KEYFRAMES.rotate,
          transformBox: "fill-box",
          transformOrigin: "center",
          transition: {
            duration: ctx.duration,
            delay: ctx.delay + ctx.index * ctx.stagger,
            repeat: ctx.repeat,
            scale: { inherit: true, ease: "easeOut", times: [0, 0.1, 0.25] },
            opacity: {
              inherit: true,
              ease: "easeOut",
              times: [0, 0.1, 0.25, 0.5, 0.75, 1],
            },
            rotate: {
              inherit: true,
              ease: "easeInOut",
              times: SHIELD_BODY_KEYFRAMES.times,
            },
          },
        },
      };
    }
    return {
      rest: {
        strokeDasharray: 0,
        strokeDashoffset: 0,
        opacity: 1,
        rotate: 0,
      },
      active: {
        strokeDasharray: ctx.pathLength,
        strokeDashoffset: [ctx.pathLength, ctx.pathLength, 0],
        opacity: [0, 0, 0.75, 1, 0.88, 1],
        rotate: SHIELD_BODY_KEYFRAMES.rotate,
        transition: {
          duration: ctx.duration,
          delay: ctx.delay + ctx.index * ctx.stagger,
          repeat: ctx.repeat,
          strokeDasharray: { duration: 0 },
          strokeDashoffset: { inherit: true, ease: "easeOut", times: [0, 0.1, 0.25] },
          opacity: {
            inherit: true,
            ease: "easeOut",
            times: [0, 0.1, 0.25, 0.5, 0.75, 1],
          },
          rotate: {
            inherit: true,
            ease: "easeInOut",
            times: SHIELD_BODY_KEYFRAMES.times,
          },
        },
        transitionEnd: {
          strokeDasharray: 0,
          strokeDashoffset: 0,
        },
      },
    };
  },
};
