import { compose } from "../compose";
import { folderBody } from "../motions/folder-body";
import { folderModifierReveal } from "../motions/folder-modifier-reveal";
import { penWrite } from "../motions/pen-write";

/**
 * `folder-pen` — folder lifts via `folderBody`; the pen badge in the
 * upper-right wobbles in place via `penWrite` (per-element fill-box
 * pivot so the pen rotates around its own bbox centre regardless of
 * the signature's transformOrigin).
 *
 * `penWrite` is placed FIRST so the pen body is claimed by the
 * wobble before `folderModifierReveal`'s wildcard would draw it on
 * as a state marker.
 */
export default compose({
  motions: [penWrite, folderBody, folderModifierReveal],
  defaults: { duration: 0.8, easing: "easeInOut", stagger: 0 },
});
