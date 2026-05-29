import { compose } from "../compose";
import { bellClapper } from "../motions/bell-clapper";
import { bellDotReveal } from "../motions/bell-dot-reveal";
import { bellShell } from "../motions/bell-shell";

/**
 * Bell rings; the notification dot pops in mid-ring (opacity + small
 * scale punch) via `bellDotReveal`, which also rocks with the shell so
 * the dot stays anchored to the bell through the swing. Uses
 * `bellDotReveal` rather than the path-based wildcard because the dot
 * is a `<circle>` element matched by geometry.
 */
export default compose({
  motions: [bellClapper, bellShell, bellDotReveal],
  defaults: { duration: 1.0, easing: "easeOut", stagger: 0 },
  transformOrigin: "12px 4px",
});
