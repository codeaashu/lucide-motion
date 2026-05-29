import { compose } from "../compose";
import { gemFacetGlint } from "../motions/gem-facet-glint";

/**
 * `gem` — light glints across the cut facets in sequence. Per-path
 * `stagger` makes the sparkle travel across the three strokes in turn.
 * See `gemFacetGlint`.
 */
export default compose({
  motions: [gemFacetGlint],
  defaults: { duration: 0.9, easing: "easeInOut", stagger: 0.12 },
});
