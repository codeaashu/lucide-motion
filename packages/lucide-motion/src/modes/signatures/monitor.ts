import { compose } from "../compose";
import { monitorChassis } from "../motions/monitor-chassis";

/**
 * `monitor` — bare display + stand. The monitorChassis motion covers
 * both anatomical roles: the screen swivels left-right on its stand
 * joint (damped ±6° rock around 12, 17) with a phase-locked opacity
 * dip, and the stand opacity-dips in lockstep without translating.
 *
 * Every other monitor-* composite reuses monitorChassis as the host
 * and layers `monitorModifierReveal` for the marker / payload glyph,
 * which inherits both the swivel and the opacity dip so payloads
 * stay anchored to the display through the rock.
 */
export default compose({
  motions: [monitorChassis],
  defaults: { duration: 0.65, easing: "easeInOut", stagger: 0 },
  transformOrigin: "12px 17px",
});
