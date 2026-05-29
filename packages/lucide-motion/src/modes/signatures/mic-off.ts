import { compose } from "../compose";
import { micBody } from "../motions/mic-body";
import { micModifierReveal } from "../motions/mic-modifier-reveal";

/**
 * Mic-off — silenced microphone with a diagonal slash. The split
 * capsule and U-arc fragments all share the body's pulse via
 * `micBody`'s registry; the slash routes through the family modifier
 * reveal so it draws in on the second-pulse apex while inheriting the
 * body's scale for kinetic-life cohesion.
 */
export default compose({
  motions: [micBody, micModifierReveal],
  defaults: { duration: 1.0, easing: "easeInOut", stagger: 0 },
});
