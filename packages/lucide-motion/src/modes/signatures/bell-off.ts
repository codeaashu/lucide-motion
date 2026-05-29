import { compose } from "../compose";
import { bellClapper } from "../motions/bell-clapper";
import { bellModifierReveal } from "../motions/bell-modifier-reveal";
import { bellShell } from "../motions/bell-shell";

/**
 * Bell still tries to ring (shell + clapper physics preserved), and
 * the diagonal slash strikes through mid-ring via `bellModifierReveal`
 * while rocking with the shell. The "bell is silenced" semantics come
 * from the slash appearing on top; the rocking keeps the slash visually
 * attached to the icon through the swing.
 */
export default compose({
  motions: [bellClapper, bellShell, bellModifierReveal],
  defaults: { duration: 1.0, easing: "easeOut", stagger: 0 },
  transformOrigin: "12px 4px",
});
