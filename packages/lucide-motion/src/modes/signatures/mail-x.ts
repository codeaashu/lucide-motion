import { compose } from "../compose";
import { mailEnvelope } from "../motions/mail-envelope";
import { mailFlap } from "../motions/mail-flap";
import { mailModifierPulse } from "../motions/mail-modifier-pulse";

/**
 * mail-x — envelope + flap-raise gesture (see `mail`), plus the
 * modifier strokes pulsing via `mailModifierPulse` and sharing the
 * body opacity dip for kinetic life.
 */
export default compose({
  motions: [mailEnvelope, mailFlap, mailModifierPulse],
  defaults: { duration: 1.0, easing: "easeInOut", stagger: 0 },
  transformOrigin: "12px 7px",
});
