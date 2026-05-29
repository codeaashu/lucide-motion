import { compose } from "../compose";
import { scanCornersFrame } from "../motions/scan-corners-frame";
import { searchLoupe } from "../motions/search-loupe";

/**
 * `scan-search` — viewfinder brackets lock on via `scanCornersFrame`
 * while the magnifier wobbles via `searchLoupe` (per-iconName centre
 * lookup → (12, 12) for scan-search). Same canonical wobble rhythm
 * as every other search-bearing icon.
 */
export default compose({
  motions: [searchLoupe, scanCornersFrame],
  defaults: { duration: 1.2, easing: "easeInOut", stagger: 0 },
  transformOrigin: "12px 12px",
});
