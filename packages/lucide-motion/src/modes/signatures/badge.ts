import { compose } from "../compose";
import { badgeShell } from "../motions/badge-shell";

/**
 * `badge` — bare wavy outline, no marker. The badgeShell motion
 * covers the only anatomical role: a uniform contraction + opacity
 * dim that reads as the medallion catching light (polished-shine-
 * sweep archetype, contraction-only).
 *
 * Every other badge-* composite reuses badgeShell as the host and
 * layers `badgeModifierReveal` for the marker / currency symbol.
 */
export default compose({
  motions: [badgeShell],
  defaults: { duration: 0.7, easing: "easeInOut", stagger: 0 },
});
