import { compose } from "../compose";
import { umbrellaCanopy } from "../motions/umbrella-canopy";

/**
 * Umbrella — handle + tip + canopy, all swaying gently via the
 * shared {@link umbrellaCanopy} motion: a small rotation (wind
 * catch) layered with a subtle scale contraction (canopy resisting
 * the gust) and an opacity dim. Pivots at the default (12, 12).
 */
export default compose({
  motions: [umbrellaCanopy],
  defaults: { duration: 1.4, easing: "easeInOut", stagger: 0 },
});
