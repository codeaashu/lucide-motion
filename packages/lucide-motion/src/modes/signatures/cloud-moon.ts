import { compose } from "../compose";
import { cloudBody } from "../motions/cloud-body";
import { moonGlow } from "../motions/moon-glow";

/**
 * Cloud-moon — the smaller cloud sits in the lower-left while the
 * moon crescent peeks out from the upper-right. Cloud body breathes
 * via {@link cloudBody}, moon glows via {@link moonGlow} (opacity-
 * only, since the moon reflects rather than emits light, so it
 * shouldn't physically inflate).
 */
export default compose({
  motions: [cloudBody, moonGlow],
  defaults: { duration: 1.6, easing: "easeInOut", stagger: 0.05 },
});
