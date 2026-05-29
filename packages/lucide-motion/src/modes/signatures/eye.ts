import { compose } from "../compose";
import { eyeBlink } from "../motions/eye-blink";

/** Eye blink — composed from the shared {@link eyeBlink} motion. */
export default compose({
  motions: [eyeBlink],
  defaults: { duration: 0.3, easing: "easeInOut", stagger: 0 },
});
