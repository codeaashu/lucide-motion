import { compose } from "../compose";
import { cloudBody } from "../motions/cloud-body";

/**
 * Cloud — a single closed cloud-body path that breathes via the
 * shared {@link cloudBody} subtle scale contraction + opacity dim.
 * No weather elements, no UI markers — just the cloud, gently
 * pulsing.
 */
export default compose({
  motions: [cloudBody],
  defaults: { duration: 1.4, easing: "easeInOut", stagger: 0 },
});
