import { matchPathDOneOf, type Motion } from "../compose";
import type { ModeContext } from "../types";

/**
 * The key inside `rotate-ccw-key` — vertical shaft (`M12 7v6`),
 * cross piece (`M12 9h2`), and keyhole `<circle cx=12 cy=15 r=2>`.
 * Rotates as one rigid body about the icon's z axis (the global
 * `transformOrigin` at the icon centre) through one full
 * counter-clockwise revolution while the arc swings overhead.
 *
 * Plain `rotate` only — no synthesized translate compensation, no
 * per-element pivot shifting. The key swings as a single piece
 * around the icon centre and returns to its rest pose after one
 * complete revolution.
 *
 * Times are aligned to the arc's pinch-and-swing window: the twist
 * starts at t = 0.15 (when the arc is fully pinched), reaches its
 * peak at the arc's apex (t = 0.55), then unwinds back to rest by
 * t = 1. The keyframes form a closed cycle (0 → -180 → 0) instead
 * of a -360 wrap, so the key visibly twists and releases rather
 * than DOM-accumulating winding numbers across plays.
 */
const KEY_BODY_PATHS = ["M12 7v6", "M12 9h2"];
const matchKeyBody = matchPathDOneOf(...KEY_BODY_PATHS);

function isKeyholeCircle(ctx: ModeContext): boolean {
  return (
    ctx.pathTag === "circle" &&
    String(ctx.pathAttrs.cx) === "12" &&
    String(ctx.pathAttrs.cy) === "15" &&
    String(ctx.pathAttrs.r) === "2"
  );
}

const KEY_TURN_KEYFRAMES = [0, 0, -180, 0];
const KEY_TURN_TIMES = [0, 0.15, 0.55, 1];

export const rotateKeyTurn: Motion = {
  matches: (ctx) => matchKeyBody(ctx) || isKeyholeCircle(ctx),
  factory: (ctx) => ({
    rest: { rotate: 0 },
    active: {
      rotate: KEY_TURN_KEYFRAMES,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        repeat: ctx.repeat,
        ease: "easeInOut",
        times: KEY_TURN_TIMES,
      },
    },
  }),
};
