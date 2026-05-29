import { compose } from "../compose";
import { heartBeat } from "../motions/heart-beat";

/** Heart beat — composed from the shared {@link heartBeat} motion. */
export default compose({
  motions: [heartBeat],
  defaults: { duration: 0.8, easing: "easeInOut", stagger: 0 },
});
