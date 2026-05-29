import { compose } from "../compose";
import { alignBox } from "../motions/align-box";
import { alignReferenceLine } from "../motions/align-reference-line";

/**
 * `align-start-horizontal` — the reference axis line stays anchored with a subtle
 * opacity dim (`alignReferenceLine`) while the boxes snap into
 * alignment one by one along the alignment axis (`alignBox`).
 * Reads as items being aligned to the axis in sequence — the
 * canonical "alignment action" gesture per the abstract archetype
 * catalog.
 */
export default compose({
  motions: [alignReferenceLine, alignBox],
  defaults: { duration: 0.95, easing: "easeInOut", stagger: 0 },
});
