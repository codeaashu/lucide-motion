import type { Motion } from "../compose";
import type { ModeContext } from "../types";
import { LOCK_SHACKLE_KEYFRAMES } from "./lock-shackle";

/**
 * Lock keyhole dot — the small `<circle cx=12 cy=16 r=1>` in
 * `lock-keyhole` and `lock-keyhole-open` representing the cylinder
 * entry. "Click" gesture phase-locked to the shackle pull: scale
 * dips so the dot reads as the keyhole momentarily engaging.
 *
 * Per-variant `transformOrigin: "12px 16px"` (in user units against
 * view-box `transformBox`) pins the scale to the dot's own centre
 * so it shrinks in place rather than pulling toward the icon centre.
 *
 * Scoped to the two `lock-keyhole*` icons; not used by composites
 * (no composite lock carries a keyhole dot).
 */
function isKeyholeDot(ctx: ModeContext): boolean {
  return (
    ctx.pathTag === "circle" &&
    String(ctx.pathAttrs.cx) === "12" &&
    String(ctx.pathAttrs.cy) === "16" &&
    String(ctx.pathAttrs.r) === "1"
  );
}

export const lockKeyhole: Motion = {
  matches: isKeyholeDot,
  factory: (ctx) => ({
    rest: { scale: 1, opacity: 1, transformOrigin: "12px 16px" },
    active: {
      scale: [1, 0.55, 1],
      opacity: [1, 0.6, 1],
      transformOrigin: "12px 16px",
      transition: {
        duration: ctx.duration,
        delay: ctx.delay,
        repeat: ctx.repeat,
        ease: "easeInOut",
        times: LOCK_SHACKLE_KEYFRAMES.times,
      },
    },
  }),
};
