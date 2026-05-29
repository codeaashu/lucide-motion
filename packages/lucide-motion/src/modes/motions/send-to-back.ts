import { matchAnyPath, type Motion } from "../compose";
import type { ModeContext } from "../types";

/**
 * `send-to-back` — UI layer-stacking command, not a paper plane.
 * Two `<rect>`s sit at opposite corners (front at (2, 2, 8, 8),
 * back at (14, 14, 8, 8)) with two L-shaped connector paths
 * showing the "send this layer to the back" relationship.
 *
 * **Real-life motion**: the front rect briefly translates
 * diagonally toward the back rect's position and dims — the
 * direct visualisation of "this layer goes behind." The back
 * rect and the connector arrows share a quiet sympathy opacity
 * dip on the same rhythm so the icon reads as one cohesive
 * gesture rather than the front rect moving alone.
 */
function isFrontRect(ctx: ModeContext): boolean {
  return (
    ctx.pathTag === "rect" &&
    String(ctx.pathAttrs.x) === "2" &&
    String(ctx.pathAttrs.y) === "2"
  );
}

const SEND_TO_BACK_TIMES = [0, 0.45, 0.55, 0.8, 1];

export const sendToBackFront: Motion = {
  matches: isFrontRect,
  factory: (ctx) => ({
    rest: { x: 0, y: 0, opacity: 1 },
    active: {
      // Forward translate toward the back rect (down-right) +
      // opacity dim → hold → return to rest.
      x: [0, 3, 3, 0, 0],
      y: [0, 3, 3, 0, 0],
      opacity: [1, 0.3, 0.3, 1, 1],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        repeat: ctx.repeat,
        x: { inherit: true, ease: "easeInOut", times: SEND_TO_BACK_TIMES },
        y: { inherit: true, ease: "easeInOut", times: SEND_TO_BACK_TIMES },
        opacity: { inherit: true, ease: "easeInOut", times: SEND_TO_BACK_TIMES },
      },
    },
  }),
};

/**
 * Wildcard for the back rect and the two L-shaped connector
 * arrows. Quiet opacity sympathy dip in step with the front
 * rect's translate so the icon reads as one cohesive "shift to
 * back" gesture. Placed LAST in the compose list.
 */
export const sendToBackRest: Motion = {
  matches: matchAnyPath,
  factory: (ctx) => ({
    rest: { opacity: 1 },
    active: {
      opacity: [1, 0.6, 0.6, 1, 1],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        repeat: ctx.repeat,
        ease: "easeInOut",
        times: SEND_TO_BACK_TIMES,
      },
    },
  }),
};
