import { compose } from "../compose";
import { bellClapper } from "../motions/bell-clapper";
import { bellShell } from "../motions/bell-shell";

/**
 * Bell ring — pivots from the top mount, shell rocks gently, clapper
 * swings in a larger arc inside it. Each path's motion is defined in its
 * own module (`bell-clapper`, `bell-shell`) so every bell variant
 * (`bell-plus`, `bell-ring`, `bell-off`, …) can compose the same physics
 * by importing the same modules.
 */
export default compose({
  motions: [bellClapper, bellShell],
  defaults: { duration: 1.0, easing: "easeOut", stagger: 0 },
  transformOrigin: "12px 4px",
});
