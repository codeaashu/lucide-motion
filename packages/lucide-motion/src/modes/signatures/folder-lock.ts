import { compose } from "../compose";
import { folderBody } from "../motions/folder-body";
import { folderModifierReveal } from "../motions/folder-modifier-reveal";
import { lockBody } from "../motions/lock-body";
import { lockShackle } from "../motions/lock-shackle";

/**
 * `folder-lock` — folder lifts via `folderBody`; the lock badge in
 * the corner runs its own "lock test" gesture via `lockShackle`
 * (anchorless `y` translate) + `lockBody` (opacity dim). Lock motions
 * are placed FIRST so they claim the shackle path + body rect before
 * `folderModifierReveal`'s wildcard would draw them on as state
 * markers.
 */
export default compose({
  motions: [lockShackle, lockBody, folderBody, folderModifierReveal],
  defaults: { duration: 0.7, easing: "easeInOut", stagger: 0 },
});
