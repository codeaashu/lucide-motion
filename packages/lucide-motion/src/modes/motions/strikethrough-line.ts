import type { Motion } from "../compose";
import type { ModeContext } from "../types";

/**
 * The horizontal strikethrough bar in `strikethrough` —
 * `<line x1=4 x2=20 y1=12 y2=12>`. Draws in left-to-right via
 * strokeDashoffset over the measured `ctx.pathLength`, reading as
 * the strikethrough being applied while the text glyph stamps.
 *
 * Place this BEFORE `typewriterStamp` in the compose list so the
 * line is claimed by the dashoffset sweep; the S-shaped text
 * strokes fall through to the stamp.
 *
 * Cleared via `transitionEnd` so the resting DOM stays dash-free.
 */
function isStrikethroughLine(ctx: ModeContext): boolean {
  return (
    ctx.pathTag === "line" &&
    String(ctx.pathAttrs.x1) === "4" &&
    String(ctx.pathAttrs.x2) === "20" &&
    String(ctx.pathAttrs.y1) === "12" &&
    String(ctx.pathAttrs.y2) === "12"
  );
}

export const strikethroughLine: Motion = {
  matches: isStrikethroughLine,
  factory: (ctx) => ({
    rest: {
      strokeDasharray: 0,
      strokeDashoffset: 0,
      opacity: 1,
    },
    active: {
      strokeDasharray: ctx.pathLength,
      strokeDashoffset: [ctx.pathLength, 0, 0],
      opacity: [0, 1, 1],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay,
        repeat: ctx.repeat,
        strokeDasharray: { duration: 0 },
        strokeDashoffset: {
          inherit: true,
          ease: "easeOut",
          times: [0, 0.6, 1],
        },
        opacity: { inherit: true, ease: "easeOut", times: [0, 0.2, 1] },
      },
      transitionEnd: {
        strokeDasharray: 0,
        strokeDashoffset: 0,
      },
    },
  }),
};
