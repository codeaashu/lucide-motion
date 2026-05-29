import { compose } from "../compose";
import { fileEnvelope } from "../motions/file-envelope";
import { fileModifierReveal } from "../motions/file-modifier-reveal";
import { lockBody } from "../motions/lock-body";
import { lockShackle } from "../motions/lock-shackle";

/**
 * `file-lock` — file envelope + lock badge. Shackle pulls up via
 * `lockShackle` (`M9 17v-2a2 2 0 0 0-4 0v2` already in
 * LOCK_SHACKLE_DS); body 8×5 rect at (3, 17) dims via `lockBody`
 * (already covered by the (w, h) tuple match).
 */
export default compose({
  motions: [lockShackle, lockBody, fileEnvelope, fileModifierReveal],
  defaults: { duration: 0.7, easing: "easeInOut", stagger: 0 },
});
