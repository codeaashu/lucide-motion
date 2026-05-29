import { compose } from "../compose";
import { eyeClosedLashes } from "../motions/eye-closed-lashes";
import { eyeClosedLid } from "../motions/eye-closed-lid";

/**
 * Eye-closed signature — the lid is already shut, so the motion isn't
 * a blink. The orbicularis muscle holds the closed lid with a subtle
 * tension; modeled here as a vertical squeeze on the lid arc
 * (`eyeClosedLid`) and a sympathetic opacity flutter on the four
 * lashes (`eyeClosedLashes`) that scales vertically with the lid so
 * the whole shut-eye reads as one cohesive squeeze-and-settle.
 *
 * `transformOrigin` pivots at the top of the closed lid (`12px 8px`)
 * — the natural hinge for an eyelid that opens downward — so the lid
 * arc compresses upward into its rest line rather than scaling from
 * the icon centre. The lashes inherit the same pivot so they pull
 * toward the lid base in lockstep.
 *
 * The default stagger of 0.04s cascades the lash flutter inner-to-
 * outer across the four lashes so they shimmer in sequence — a soft
 * detail that reads as the lashes settling after a blink.
 */
export default compose({
  motions: [eyeClosedLid, eyeClosedLashes],
  defaults: { duration: 0.7, easing: "easeInOut", stagger: 0.04 },
  transformOrigin: "12px 8px",
});
