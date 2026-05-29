import { compose } from "../compose";
import { bellElectricBody } from "../motions/bell-electric-body";
import { bellElectricButton } from "../motions/bell-electric-button";
import { bellElectricSignal } from "../motions/bell-electric-signal";
import { bellElectricSpark } from "../motions/bell-electric-spark";

/**
 * Electric bell rings — the dome + base buzz rapidly in place (a
 * high-frequency low-amplitude rotation instead of the pendulum rock
 * of a hanging bell), the two signal arcs radiate outward from the
 * dome center in a double-pulse cadence that reads as electric
 * rather than acoustic, the contact button blinks on the right, and
 * the central spark flashes at the bell's core. Every non-host path
 * inherits the body's buzz keyframes so the assembly reads as one
 * cohesive vibrating device.
 *
 * Tier-2 signature: the signal arcs depict an actual physical
 * phenomenon (electromagnetic / acoustic radiation), so they get
 * bespoke scale-from-origin motion rather than a generic reveal.
 */
export default compose({
  motions: [
    bellElectricBody,
    bellElectricSignal,
    bellElectricButton,
    bellElectricSpark,
  ],
  defaults: { duration: 1.0, easing: "easeOut", stagger: 0 },
  transformOrigin: "9px 9px",
});
