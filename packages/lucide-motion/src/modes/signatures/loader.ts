import { compose } from "../compose";
import { loaderSpin } from "../motions/loader-spin";

/** Loader infinite spin — composed from the shared {@link loaderSpin} motion. */
export default compose({
  motions: [loaderSpin],
  defaults: { duration: 1.0, easing: "linear", stagger: 0, repeat: Infinity },
});
