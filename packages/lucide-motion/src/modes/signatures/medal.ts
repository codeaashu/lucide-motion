import { compose } from "../compose";
import { medalSway } from "../motions/medal-sway";

/**
 * `medal` — sways as a rigid body pivoted at the medallion centre so
 * the disc stays put (rotation-invariant) while the neck ribbon swings
 * and the join between them stays intact. Disc + "1" glint. See
 * `medalSway`.
 */
export default compose({
  motions: [medalSway],
  defaults: { duration: 1.1, easing: "easeInOut", stagger: 0 },
  transformOrigin: "12px 17px",
});
