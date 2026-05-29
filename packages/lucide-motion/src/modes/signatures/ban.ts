import { compose } from "../compose";
import { banRing, banSlashStrike } from "../motions/ban-strike";

/**
 * `ban` — the ring holds steady with a firm attention pulse while the
 * slash strikes through (draws in). See `ban-strike`.
 */
export default compose({
  motions: [banRing, banSlashStrike],
  defaults: { duration: 0.8, easing: "easeInOut", stagger: 0 },
});
