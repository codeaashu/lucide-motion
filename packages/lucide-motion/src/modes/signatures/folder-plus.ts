import { compose } from "../compose";
import { folderBody } from "../motions/folder-body";
import { folderModifierReveal } from "../motions/folder-modifier-reveal";

/**
 * `folder-plus` — the folder lifts (`folderBody`) while the marker /
 * payload reveals at the lift apex via `folderModifierReveal`,
 * inheriting both the y bob and the opacity dim so payloads stay
 * anchored to the folder through the gesture.
 */
export default compose({
  motions: [folderBody, folderModifierReveal],
  defaults: { duration: 0.6, easing: "easeInOut", stagger: 0 },
  transformOrigin: "12px 20px",
});
