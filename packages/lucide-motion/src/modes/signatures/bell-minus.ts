import { compose } from "../compose";
import { bellClapper } from "../motions/bell-clapper";
import { bellModifierReveal } from "../motions/bell-modifier-reveal";
import { bellShell } from "../motions/bell-shell";

/**
 * Bell rings (shared `bellClapper` + `bellShell`), and the − stroke
 * draws itself in mid-ring via `bellModifierReveal` while rocking with
 * the shell so the marker stays anchored through the swing.
 */
export default compose({
  motions: [bellClapper, bellShell, bellModifierReveal],
  defaults: { duration: 1.0, easing: "easeOut", stagger: 0 },
  transformOrigin: "12px 4px",
});
