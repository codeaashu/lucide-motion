import { compose } from "../compose";
import { folderBody } from "../motions/folder-body";

/**
 * `folder` — bare folder outline. The folderBody motion lifts the
 * folder ~1 viewBox unit and dips its opacity to 0.78 at the apex,
 * then settles back — reads as the folder being picked up / hovered
 * in a file manager. Every other folder-* composite reuses
 * folderBody as the host and layers `folderModifierReveal` for the
 * marker / payload glyph, which inherits both the lift and the
 * opacity so payloads stay anchored.
 */
export default compose({
  motions: [folderBody],
  defaults: { duration: 0.6, easing: "easeInOut", stagger: 0 },
  transformOrigin: "12px 20px",
});
