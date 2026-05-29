import { arrowGlide } from "../motions/arrow-glide";
import { compose } from "../compose";

export default compose({
  motions: [arrowGlide],
  defaults: { duration: 0.7, easing: "easeOut", stagger: 0 },
});
