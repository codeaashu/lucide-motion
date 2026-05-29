import { arrowGlide } from "../motions/arrow-glide";
import { compose } from "../compose";

/**
 * `arrow-up` — the whole arrow translates one user unit up and snaps
 * back via `arrowGlide` (anchorless `y` translate). Canonical
 * Round-2 arrow template.
 */
export default compose({
  motions: [arrowGlide],
  defaults: { duration: 0.7, easing: "easeOut", stagger: 0 },
});
