import { compose } from "../compose";
import { squareShell } from "../motions/square-shell";

/**
 * `square` — bare standard square rect. The squareShell motion
 * applies the vertex-sequence-pulse archetype as a uniform
 * contraction + opacity dim. Every other square-* composite reuses
 * squareShell and layers squareModifierReveal for its marker /
 * payload.
 */
export default compose({
  motions: [squareShell],
  defaults: { duration: 0.65, easing: "easeInOut", stagger: 0 },
});
