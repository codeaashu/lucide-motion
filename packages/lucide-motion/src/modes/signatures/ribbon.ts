import { compose } from "../compose";
import { ribbonSway } from "../motions/ribbon-sway";

/**
 * `ribbon` — a prize rosette pinned through its centre; the whole
 * rosette sways on its pin so the hanging tails trail the motion.
 * Pivots at the rosette loop's centre. See `ribbonSway`.
 */
export default compose({
  motions: [ribbonSway],
  defaults: { duration: 1.2, easing: "easeInOut", stagger: 0 },
  transformOrigin: "12px 7px",
});
