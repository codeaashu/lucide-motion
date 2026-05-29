import { compose } from "../compose";
import { shieldBody } from "../motions/shield-body";

/**
 * `shield` — bare crest outline. The shieldBody motion gives it the
 * brace-and-rebound deflect: damped ±4° tilt around the bottom-tip
 * grip (12, 22) + phase-locked opacity dip so the surface flashes as
 * it absorbs an imagined impact.
 *
 * Every other shield-* composite reuses shieldBody as the host and
 * layers `shieldModifierReveal` for the marker / payload glyph,
 * which inherits both the tilt and the opacity so payloads stay
 * anchored to the crest through the recoil.
 */
export default compose({
  motions: [shieldBody],
  defaults: { duration: 0.65, easing: "easeInOut", stagger: 0 },
  transformOrigin: "12px 22px",
});
