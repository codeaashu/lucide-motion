import { compose } from "../compose";
import { starTwinkle } from "../motions/star-twinkle";

/**
 * Star-half — Lucide draws the half-rating star as a single
 * open-ended outline tracing only the left silhouette of the five-
 * pointed shape (bottom-centre up around the left arm to top-
 * centre). It's the same anatomy as `star`, just an incomplete
 * outline, so the same {@link starTwinkle} physics drives it: the
 * host motion's `matchPathDOneOf` list includes this half-d.
 *
 * No modifier path means no slash to reveal — the signature is
 * intentionally minimal, just the family's host twinkle.
 */
export default compose({
  motions: [starTwinkle],
  defaults: { duration: 0.6, easing: "easeInOut", stagger: 0 },
});
