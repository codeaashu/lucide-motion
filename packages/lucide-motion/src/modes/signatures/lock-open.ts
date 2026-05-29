import { compose } from "../compose";
import { lockBody } from "../motions/lock-body";
import { lockShackle } from "../motions/lock-shackle";

/**
 * `lock-open` — standalone padlock with the shackle already tilted
 * open. Same `lockShackle` tug + `lockBody` dim; the open shackle's
 * `d` is the only difference from `lock`.
 */
export default compose({
  motions: [lockShackle, lockBody],
  defaults: { duration: 0.8, easing: "easeInOut", stagger: 0 },
});
