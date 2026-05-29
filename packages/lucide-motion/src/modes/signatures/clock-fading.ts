import { compose } from "../compose";
import { clockFace } from "../motions/clock-face";
import { clockHands } from "../motions/clock-hands";

/**
 * Clock-fading — Lucide draws the face as five separate radius-10
 * arc fragments rather than one continuous circle, evoking a faded
 * or dotted appearance. `clockFace` catches all five via the
 * `[Aa]10 10 0` arc pattern, so the signature's small stagger
 * (`stagger: 0.06`, slightly larger than the standard clock 0.04)
 * cascades the gentle face pulse through the five arcs in sequence
 * — a natural visual reading of the "fading" character.
 *
 * No modifier paths here, so no `clockModifierReveal`; the hand-pair
 * still ticks via `clockHands`.
 */
export default compose({
  motions: [clockFace, clockHands],
  defaults: { duration: 1.2, easing: "easeInOut", stagger: 0.06 },
});
