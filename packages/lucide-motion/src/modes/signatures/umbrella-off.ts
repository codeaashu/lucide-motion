import { compose } from "../compose";
import { umbrellaCanopy } from "../motions/umbrella-canopy";
import { umbrellaModifierReveal } from "../motions/umbrella-modifier-reveal";

/**
 * Umbrella-off — the canopy is split into upper + lower fragments
 * by a diagonal slash; handle + tip stay intact. `umbrellaCanopy`
 * catches the handle, tip, and both canopy fragments via the
 * explicit d-list match; `umbrellaModifierReveal` draws the slash
 * in with `pathLength` + `opacity` while inheriting the umbrella's
 * scale + rotate so the slash sways with the rest of the assembly.
 */
export default compose({
  motions: [umbrellaCanopy, umbrellaModifierReveal],
  defaults: { duration: 1.4, easing: "easeInOut", stagger: 0.04 },
});
