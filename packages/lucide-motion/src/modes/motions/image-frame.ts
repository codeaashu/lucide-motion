import type { Motion } from "../compose";
import type { ModeContext } from "../types";
import { IMAGE_SUN_KEYFRAMES } from "./image-sun";

/**
 * The picture frame in every image-bearing icon. In the standalone
 * `image` and `image-upscale` icons it's an explicit `<rect>`; in
 * variants where the frame has a corner cut to make room for a
 * modifier (image-down, image-up, image-plus, image-minus, image-
 * play, image-off) it's a closed path. Composite badge images
 * (file-image, book-image, folder-image, …) use yet another path d
 * per host.
 *
 * Subtle opacity dim + tiny uniform scale dip phase-locked to
 * `IMAGE_SUN_KEYFRAMES.times` — the frame reads as "catching the
 * shutter flash" alongside the sun without its own bespoke gesture.
 *
 * Matches the 18×18 standalone rect explicitly; future reshaped
 * frame paths get added to `IMAGE_FRAME_PATH_DS` when each composite
 * is signed.
 */
const IMAGE_FRAME_PATH_DS = new Set<string>([
  // (Add reshaped frame paths from image-down, image-up, image-plus,
  // image-minus, image-off, image-play, image-upscale, file-image,
  // book-image as those signatures are authored.)
]);

function isImageFrame(ctx: ModeContext): boolean {
  if (ctx.pathTag === "rect") {
    return (
      String(ctx.pathAttrs.width) === "18" &&
      String(ctx.pathAttrs.height) === "18" &&
      String(ctx.pathAttrs.x) === "3" &&
      String(ctx.pathAttrs.y) === "3"
    );
  }
  if (ctx.pathTag === "path") {
    return IMAGE_FRAME_PATH_DS.has(String(ctx.pathAttrs.d));
  }
  return false;
}

export const imageFrame: Motion = {
  matches: isImageFrame,
  factory: (ctx) => ({
    rest: { scale: 1, opacity: 1 },
    active: {
      scale: [1, 0.96, 1],
      opacity: [1, 0.7, 1],
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
  }),
};
