import { compose } from "../compose";
import { lockBody } from "../motions/lock-body";
import { lockKeyhole } from "../motions/lock-keyhole";
import { lockShackle } from "../motions/lock-shackle";

/**
 * `lock-keyhole-open` — standalone keyhole padlock with the shackle
 * already tilted open. Same composition as `lock-keyhole`.
 */
export default compose({
  motions: [lockShackle, lockKeyhole, lockBody],
  defaults: { duration: 0.8, easing: "easeInOut", stagger: 0 },
});
