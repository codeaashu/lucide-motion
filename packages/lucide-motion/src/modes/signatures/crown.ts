import { compose } from "../compose";
import { crownLift } from "../motions/crown-lift";

/**
 * `crown` — the jewelled band lifts as if raised in coronation, then
 * settles; the base line stays planted. See `crownLift`.
 */
export default compose({
  motions: [crownLift],
  defaults: { duration: 0.9, easing: "easeInOut", stagger: 0 },
});
