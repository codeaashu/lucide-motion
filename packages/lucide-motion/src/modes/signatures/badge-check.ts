import { compose } from "../compose";
import { badgeModifierReveal } from "../motions/badge-modifier-reveal";
import { badgeShell } from "../motions/badge-shell";

/**
 * `badge-check` — the medallion catches light (`badgeShell`) while the
 * marker stamps on at the shell's light-beat apex via
 * `badgeModifierReveal`, scaling with the shell so it stays anchored
 * to the badge throughout the pulse.
 */
export default compose({
  motions: [badgeShell, badgeModifierReveal],
  defaults: { duration: 0.7, easing: "easeInOut", stagger: 0 },
});
