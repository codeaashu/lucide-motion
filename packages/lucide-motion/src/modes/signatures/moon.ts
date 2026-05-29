import { compose } from "../compose";
import { moonGlow } from "../motions/moon-glow";

/**
 * Moon — a single crescent path that glows softly via the shared
 * {@link moonGlow} motion. Opacity-only because the moon reflects
 * sunlight rather than emitting it, so any radial scale would read
 * as the moon physically inflating, which isn't what a real moon
 * does. The icon stays compositionally still while its brightness
 * gently dims and recovers — the way moonlight actually fluctuates
 * with passing thin cloud or atmospheric haze.
 */
export default compose({
  motions: [moonGlow],
  defaults: { duration: 1.6, easing: "easeInOut", stagger: 0 },
  needsTransformOrigin: false,
});
