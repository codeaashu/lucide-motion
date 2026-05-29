import { aLargeSmallStamp } from "../motions/a-large-small-stamp";
import { compose } from "../compose";

/**
 * `a-large-small` — small `a` (triangle + crossbar) and large `A`
 * (triangle + crossbar). Per-glyph grouping via `aLargeSmallStamp`
 * so each letter's two strokes stamp together as one unit, with
 * small `a` leading large `A` by 0.14s.
 */
export default compose({
  motions: [aLargeSmallStamp],
  defaults: { duration: 0.7, easing: "easeInOut", stagger: 0 },
});
