import { compose } from "../compose";
import { typewriterStamp } from "../motions/typewriter-stamp";

/**
 * `ampersands` — two ampersand glyphs. Both stamp via
 * `typewriterStamp` with per-iconName stagger (0.18) wired into the
 * stamp motion so the two ampersands cascade one by one.
 */
export default compose({
  motions: [typewriterStamp],
  defaults: { duration: 0.7, easing: "easeInOut", stagger: 0.18 },
});
