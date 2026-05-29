import { compose } from "../compose";
import { lockBody } from "../motions/lock-body";
import { lockKeyhole } from "../motions/lock-keyhole";
import { lockShackle } from "../motions/lock-shackle";

/**
 * `lock-keyhole` — standalone padlock with a keyhole dot below the
 * shackle. Shackle tugs, body dims, keyhole dot "clicks" via a
 * scale dip pivoted at its own centre (12, 16). All three motions
 * share the shackle's `times` so the lock reads as one cohesive
 * engagement gesture.
 */
export default compose({
  motions: [lockShackle, lockKeyhole, lockBody],
  defaults: { duration: 0.8, easing: "easeInOut", stagger: 0 },
});
