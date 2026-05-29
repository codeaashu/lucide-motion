import { compose } from "../compose";
import { lockBody } from "../motions/lock-body";
import { lockShackle } from "../motions/lock-shackle";

/**
 * `lock` — standalone closed padlock. Shackle gets tugged up via
 * `lockShackle`, body dims subtly via `lockBody` (`opacity` phase-
 * locked to the shackle's pull apex). Canonical Round-2 lock template.
 */
export default compose({
  motions: [lockShackle, lockBody],
  defaults: { duration: 0.8, easing: "easeInOut", stagger: 0 },
});
