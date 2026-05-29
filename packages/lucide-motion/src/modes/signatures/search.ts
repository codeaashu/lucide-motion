import { compose } from "../compose";
import { searchLoupe } from "../motions/search-loupe";

/**
 * search — magnifier wobbles around its loupe centre via
 * `searchLoupe` (per-iconName centre lookup → (11, 11) for base
 * search). Canonical Round-2 search-subject template.
 */
export default compose({
  motions: [searchLoupe],
  defaults: { duration: 1.2, easing: "easeInOut", stagger: 0 },
  transformOrigin: "11px 11px",
});
