import { compose } from "../compose";
import { sunRayPulse } from "../motions/sun-ray-pulse";

/**
 * Sun — the central circle plus eight full ray segments at the
 * cardinal and diagonal positions. Tier-2 signature: the sun's
 * centre pulses first and each ray follows in cascade via the
 * shared {@link sunRayPulse} motion, so each ray appears to
 * lengthen toward its tip in turn — a wave of light radiating
 * outward from the surface.
 *
 * The icon centre (12, 12) is the sun's centre, so the default
 * transform origin is correct without an override.
 */
export default compose({
  motions: [sunRayPulse],
  defaults: { duration: 0.9, easing: "easeInOut", stagger: 0.05 },
});
