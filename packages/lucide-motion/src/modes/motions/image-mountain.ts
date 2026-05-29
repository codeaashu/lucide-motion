import { matchPathDOneOf, type Motion } from "../compose";
import { IMAGE_SUN_KEYFRAMES } from "./image-sun";

/**
 * The mountain triangle path inside every image-bearing icon —
 * Lucide draws it as a closing peak rising from the lower-left to
 * the upper-right of the frame. Each composite has its own d (the
 * peak's position depends on where the frame sits in the icon), so
 * the matcher enumerates them.
 *
 * Phase-locked opacity dim to `IMAGE_SUN_KEYFRAMES.times` — the
 * mountain reads as "catching the flash" alongside the sun without
 * its own bespoke gesture.
 */
const MOUNTAIN_DS = [
  // Standalone image (and image-plus which uses the same mountain)
  "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",
  // image-down, image-up — the frame is reshaped but the mountain d
  // remains the same shape, embedded in the frame path. The standalone
  // mountain d above is the canonical case.
  // file-image (composite)
  "m20 17-1.296-1.296a2.41 2.41 0 0 0-3.408 0L9 22",
  // book-image (composite)
  "m20 13.7-2.1-2.1a2 2 0 0 0-2.8 0L9.7 17",
];

export const imageMountain: Motion = {
  matches: matchPathDOneOf(...MOUNTAIN_DS),
  factory: (ctx) => ({
    rest: { opacity: 1 },
    active: {
      opacity: [1, 0.6, 1],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay,
        repeat: ctx.repeat,
        ease: "easeInOut",
        times: IMAGE_SUN_KEYFRAMES.times,
      },
    },
  }),
};
