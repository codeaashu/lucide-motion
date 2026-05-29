import { compose } from "../compose";
import { starTwinkle } from "../motions/star-twinkle";

/** Star twinkle — composed from the shared {@link starTwinkle} motion. */
export default compose({
  motions: [starTwinkle],
  defaults: { duration: 0.6, easing: "easeInOut", stagger: 0 },
});
