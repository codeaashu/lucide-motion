import { matchAnyPath, type Motion } from "../compose";
import { MESSAGE_CIRCLE_BODY_KEYFRAMES } from "./message-circle-body";

/**
 * Message-circle-family wildcard reveal — every non-body path
 * reveals at the bubble's first nod apex, then inherits BOTH the
 * body's rotate and opacity so payloads nod and dim WITH the bubble
 * (principle 2 — cohesion; monitor, mail, and message-square are
 * the existing precedents).
 *
 * Catches whatever's left after `messageCircleBody` claims the
 * outline:
 *
 * - State markers: check (`-check`), × strokes (`-x`), `+`
 *   (`-plus`), warning `!` + dot (`-warning`), question-mark curve
 *   + dot (`-question-mark`), `-off` slash, three dots (`-more`).
 * - Payload glyphs: heart (`-heart`), code chevrons (`-code`),
 *   reply arrow (`-reply`).
 *
 * Every variant's non-body anatomy is a `<path>` (or degenerate dot
 * path), so the dasharray + dashoffset draw-in covers all of them —
 * no `<circle>` / `<rect>` branch needed for this family.
 *
 * Reveal completes at `t = 0.25` — exactly when the bubble reaches
 * its first nod apex. Opacity tracks
 * `MESSAGE_CIRCLE_BODY_KEYFRAMES.opacity` from 0 so the payload
 * emerges into the bubble's first dim and breathes with the body
 * through the rest of the cycle. Rotate inherits the body's nod
 * directly — uniform in-plane rotation around the tail tip is safe
 * to direct-inherit (no orientation distortion).
 *
 * Place this LAST in the compose `motions` list — `matchAnyPath` is
 * greedy and would otherwise claim the body.
 */
export const messageCircleModifierReveal: Motion = {
  matches: matchAnyPath,
  factory: (ctx) => ({
    rest: {
      strokeDasharray: 0,
      strokeDashoffset: 0,
      opacity: 1,
      rotate: 0,
    },
    active: {
      strokeDasharray: ctx.pathLength,
      strokeDashoffset: [ctx.pathLength, ctx.pathLength, 0],
      opacity: [0, 0, 0.78, 1, 0.9, 1],
      rotate: MESSAGE_CIRCLE_BODY_KEYFRAMES.rotate,
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
          times: MESSAGE_CIRCLE_BODY_KEYFRAMES.times,
        },
      },
      transitionEnd: {
        strokeDasharray: 0,
        strokeDashoffset: 0,
      },
    },
  }),
};
