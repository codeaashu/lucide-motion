import { compose } from "../compose";
import { heartBeat } from "../motions/heart-beat";
import { scanCornersFrame } from "../motions/scan-corners-frame";

/**
 * `scan-heart` — viewfinder brackets lock on while the heart beats.
 * Reuses the canonical `heartBeat` primitive (lub-dub `scale [1,
 * 0.85, 1, 0.9, 0.95, 1]`); scan-heart's small heart `d` is now
 * registered in `HEART_PATHS` so it inherits the family rhythm.
 */
export default compose({
  motions: [scanCornersFrame, heartBeat],
  defaults: { duration: 1.1, easing: "easeInOut", stagger: 0 },
  transformOrigin: "12px 12px",
});
