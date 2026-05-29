import { codeSymbol } from "../motions/code-symbol";
import { compose } from "../compose";
import { folderBody } from "../motions/folder-body";
import { folderModifierReveal } from "../motions/folder-modifier-reveal";

/**
 * `folder-code` — folder hinges via `folderBody`; the `</>` chevron
 * pair on the folder face pinches inward via `codeSymbol`. Code
 * motion placed FIRST so the chevrons are claimed by the pinch
 * before `folderModifierReveal`'s wildcard would draw them on as
 * state markers.
 */
export default compose({
  motions: [codeSymbol, folderBody, folderModifierReveal],
  defaults: { duration: 0.7, easing: "easeInOut", stagger: 0 },
  transformOrigin: "12px 20px",
});
