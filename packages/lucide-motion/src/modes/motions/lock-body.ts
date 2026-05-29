import type { Motion } from "../compose";
import type { ModeContext } from "../types";
import { LOCK_SHACKLE_KEYFRAMES } from "./lock-shackle";

/**
 * Lock body — the rounded rect under the shackle. Matches three
 * sizes:
 *
 * - 18×11 (standalone `lock`, `lock-open`)
 * - 18×12 (standalone `lock-keyhole`, `lock-keyhole-open`)
 * - 8×5   (every composite badge-style lock: folder-lock,
 *          message-square-lock, file-lock, book-lock, earth-lock,
 *          globe-lock, user-lock, door-closed-locked)
 *
 * Opacity-only dim phase-locked to the shackle's pull apex via
 * `LOCK_SHACKLE_KEYFRAMES.times`. Reads as the body "registering"
 * the tug. No transform → no pivot concern, so the same motion
 * works in every composite's signature regardless of its
 * `transformOrigin`.
 */
function isLockBodyRect(ctx: ModeContext): boolean {
  if (ctx.pathTag !== "rect") return false;
  const w = String(ctx.pathAttrs.width);
  const h = String(ctx.pathAttrs.height);
  return (
    (w === "18" && (h === "11" || h === "12")) ||
    (w === "8" && h === "5")
  );
}

export const lockBody: Motion = {
  matches: isLockBodyRect,
  factory: (ctx) => ({
    rest: { opacity: 1 },
    active: {
      opacity: [1, 0.78, 1],
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
