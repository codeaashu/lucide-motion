import { compose } from "../compose";
import { alertExclamationFlash, alertSignPulse } from "../motions/alert-sign";

/**
 * `triangle-alert` — the exclamation mark flashes for attention while
 * the triangle holds steady with a small uniform flinch. Shares
 * `alert-sign` with `circle-alert`.
 */
export default compose({
  motions: [alertExclamationFlash, alertSignPulse],
  defaults: { duration: 0.9, easing: "easeInOut", stagger: 0 },
});
