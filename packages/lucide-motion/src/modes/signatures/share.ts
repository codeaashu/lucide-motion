import { compose } from "../compose";
import { shareExport } from "../motions/share-export";

/**
 * `share` — standalone upload/export icon: a box with an upward
 * arrow lifting out. The arrow paths (shaft + head) translate up
 * via `shareExport`; the box stays still.
 */
export default compose({
  motions: [shareExport],
  defaults: { duration: 0.7, easing: "easeOut", stagger: 0 },
});
