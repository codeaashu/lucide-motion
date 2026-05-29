import { compose } from "../compose";
import { typewriterStamp } from "../motions/typewriter-stamp";

export default compose({
  motions: [typewriterStamp],
  defaults: { duration: 0.7, easing: "easeInOut", stagger: 0 },
});
