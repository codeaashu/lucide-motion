import { bookBody } from "../motions/book-body";
import { bookModifierReveal } from "../motions/book-modifier-reveal";
import { compose } from "../compose";

export default compose({
  motions: [bookBody, bookModifierReveal],
  defaults: { duration: 0.6, easing: "easeInOut", stagger: 0 },
});
