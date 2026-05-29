import { matchPathDOneOf, type Motion } from "../compose";
import type { ModeContext } from "../types";

/**
 * The 3-node graph in `share-2`: a source node at (6, 12) connected
 * by two lines to destination nodes at (18, 5) and (18, 19).
 *
 * Canonical "broadcast" gesture: source node pulses first, the two
 * connection lines shimmer in flight, then the destination nodes
 * pulse — a packet hopping from origin through the graph. Sequenced
 * by Lucide's path order, which happens to be [source-node-top,
 * source-node-mid, dest-node-bot, line-top, line-bot] — using
 * `ctx.index * stagger` produces the propagation read.
 *
 * Two exports — one for the circles (scale + opacity pulse around
 * each node's own centre), one for the connection lines (opacity dim
 * for "signal in flight").
 *
 * Per-element `transformOrigin` set to the circle's `(cx, cy)` so
 * each node pulses in place via view-box `transformBox` override.
 */
const SHARE_LINE_DS: string[] = [
  // share-2 connection lines (drawn as `<line>` but the engine
  // exposes them as path-tag elements with their own d on some
  // renderers — match both forms via the explicit endpoints in d).
  // Actually `<line>` elements come through with pathTag === "line"
  // and x1/x2/y1/y2 — matched separately below.
];

function isShareLine(ctx: ModeContext): boolean {
  if (ctx.pathTag !== "line") return false;
  const x1 = String(ctx.pathAttrs.x1);
  const y1 = String(ctx.pathAttrs.y1);
  const x2 = String(ctx.pathAttrs.x2);
  const y2 = String(ctx.pathAttrs.y2);
  // share-2's two connection lines
  return (
    (x1 === "8.59" && y1 === "13.51" && x2 === "15.42" && y2 === "17.49") ||
    (x1 === "15.41" && y1 === "6.51" && x2 === "8.59" && y2 === "10.49")
  );
}

function isShareNode(ctx: ModeContext): boolean {
  if (ctx.pathTag !== "circle") return false;
  if (String(ctx.pathAttrs.r) !== "3") return false;
  const cx = String(ctx.pathAttrs.cx);
  const cy = String(ctx.pathAttrs.cy);
  return (
    (cx === "18" && (cy === "5" || cy === "19")) ||
    (cx === "6" && cy === "12")
  );
}

export const shareGraphLink: Motion = {
  matches: (ctx: ModeContext) =>
    isShareLine(ctx) || (ctx.pathTag === "path" && SHARE_LINE_DS.includes(String(ctx.pathAttrs.d))),
  factory: (ctx) => ({
    rest: { opacity: 1 },
    active: {
      opacity: [1, 0.3, 1],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        repeat: ctx.repeat,
        ease: "easeInOut",
        times: [0, 0.4, 1],
      },
    },
  }),
};

export const shareGraphNode: Motion = {
  matches: isShareNode,
  factory: (ctx) => {
    const origin = `${ctx.pathAttrs.cx}px ${ctx.pathAttrs.cy}px`;
    return {
      rest: { scale: 1, opacity: 1, transformOrigin: origin },
      active: {
        scale: [1, 0.7, 1],
        opacity: [1, 0.5, 1],
        transformOrigin: origin,
        transition: {
          duration: ctx.duration,
          delay: ctx.delay + ctx.index * ctx.stagger,
          repeat: ctx.repeat,
          scale: { inherit: true, ease: "easeInOut", times: [0, 0.4, 1] },
          opacity: { inherit: true, ease: "easeInOut", times: [0, 0.4, 1] },
        },
      },
    };
  },
};
