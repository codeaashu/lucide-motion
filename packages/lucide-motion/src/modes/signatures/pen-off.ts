import { compose } from "../compose";
import { penModifierReveal } from "../motions/pen-modifier-reveal";
import { penWrite } from "../motions/pen-write";

/**
 * `pen-off` — the broken pen fragments wobble via `penWrite` (per-
 * fragment fill-box pivot so each rotates around its own centre);
 * the diagonal off-slash strikes through via `penModifierReveal`.
 */
export default compose({
  motions: [penWrite, penModifierReveal],
  defaults: { duration: 0.9, easing: "easeInOut", stagger: 0 },
});
