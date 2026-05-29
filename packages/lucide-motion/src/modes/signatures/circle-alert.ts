import { compose } from "../compose";
import { alertExclamationFlash, alertSignPulse } from "../motions/alert-sign";

/**
 * `circle-alert` — the exclamation mark flashes for attention while the
 * ring holds steady with a small uniform flinch. See `alert-sign`.
 */
export default compose({
  motions: [alertExclamationFlash, alertSignPulse],
  defaults: { duration: 0.9, easing: "easeInOut", stagger: 0 },
});
