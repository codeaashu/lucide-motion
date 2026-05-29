import type { Motion } from "../compose";
import type { ModeContext } from "../types";

/**
 * Image sun — the small `<circle r=2>` that represents the sun /
 * light source in every image-bearing icon. Canonical "shutter
 * capture" gesture: brief opacity + scale pulse around the circle's
 * own centre, reading as the camera flash firing as the picture is
 * taken.
 *
 * Per-element `transformOrigin` set to the circle's `(cx, cy)` so the
 * scale dip pinches in place rather than pulling toward the icon
 * centre. Resolves in user units against the engine's view-box
 * `transformBox` setup (same pattern as `cog-gear`).
 *
 * Coverage today: standalone `image` (sun at (9, 9)). Composite sun
 * positions in `file-image` (10, 12), `book-image` (10, 8), and
 * future folder/badge/etc. composites get added by extending the
 * geometric match. Per-iconName centre lookup isn't needed — the
 * circle's own (cx, cy) is the pivot.
 *
 * Exports `IMAGE_SUN_KEYFRAMES` so the mountain + frame can phase-
 * lock their dim to the same shutter cadence.
 *
 * Place this FIRST in any image-bearing signature so the sun is
 * claimed by the flash before the host family modifier-reveal
 * would draw it on as a state marker.
 */
export const IMAGE_SUN_KEYFRAMES: {
  scale: number[];
  opacity: number[];
  times: number[];
} = {
  scale: [1, 0.55, 1],
  opacity: [1, 0.35, 1],
  times: [0, 0.3, 1],
};

function isImageSun(ctx: ModeContext): boolean {
  if (ctx.pathTag !== "circle") return false;
  if (String(ctx.pathAttrs.r) !== "2") return false;
  const cx = String(ctx.pathAttrs.cx);
  const cy = String(ctx.pathAttrs.cy);
  // Sun positions across the catalog. Add a row when authoring a new
  // image-bearing composite.
  return (
    (cx === "9" && cy === "9") || // standalone image, image-down, image-up, image-plus, image-minus, image-play
    (cx === "10" && cy === "12") || // file-image
    (cx === "10" && cy === "8") // book-image
  );
}

export const imageSun: Motion = {
  matches: isImageSun,
  factory: (ctx) => {
    const origin = `${ctx.pathAttrs.cx}px ${ctx.pathAttrs.cy}px`;
    return {
      rest: { scale: 1, opacity: 1, transformOrigin: origin },
      active: {
        scale: IMAGE_SUN_KEYFRAMES.scale,
        opacity: IMAGE_SUN_KEYFRAMES.opacity,
        transformOrigin: origin,
        transition: {
          duration: ctx.duration,
          delay: ctx.delay,
          repeat: ctx.repeat,
          scale: {
            inherit: true,
            ease: "easeInOut",
            times: IMAGE_SUN_KEYFRAMES.times,
          },
          opacity: {
            inherit: true,
            ease: "easeInOut",
            times: IMAGE_SUN_KEYFRAMES.times,
          },
        },
      },
    };
  },
};
