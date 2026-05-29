import { compose } from "../compose";
import { badgeModifierReveal } from "../motions/badge-modifier-reveal";
import { badgeShell } from "../motions/badge-shell";

/**
 * `badge-dollar-sign` — the medallion catches light (`badgeShell`) while the
 * currency emblem stamps onto the badge at the shell's light-beat
 * apex via `badgeModifierReveal`. The symbol's strokes are
 * typography; the same draw-in + inherited shell pulse reads as
 * "currency mark stamped, badge lights up."
 */
export default compose({
  motions: [badgeShell, badgeModifierReveal],
  defaults: { duration: 0.7, easing: "easeInOut", stagger: 0 },
});
