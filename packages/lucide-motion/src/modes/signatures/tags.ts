import { compose } from "../compose";
import { tagDangle } from "../motions/tag-dangle";

/**
 * `tags` — two tags on one ring dangle from the front tag's eyelet.
 * Per-tag `stagger` makes them jostle slightly out of phase (front
 * leads, back follows). See `tagDangle`.
 */
export default compose({
  motions: [tagDangle],
  defaults: { duration: 1.1, easing: "easeInOut", stagger: 0.08 },
});
