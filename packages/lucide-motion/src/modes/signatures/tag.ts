import { compose } from "../compose";
import { tagDangle } from "../motions/tag-dangle";

/**
 * `tag` — a price tag dangling from the string through its eyelet;
 * swings as a pendulum from the hole. See `tagDangle`.
 */
export default compose({
  motions: [tagDangle],
  defaults: { duration: 1.1, easing: "easeInOut", stagger: 0 },
});
