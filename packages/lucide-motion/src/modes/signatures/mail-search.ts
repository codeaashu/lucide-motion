import { compose } from "../compose";
import { mailEnvelope } from "../motions/mail-envelope";
import { mailFlap } from "../motions/mail-flap";
import { searchLoupe } from "../motions/search-loupe";

/**
 * `mail-search` — envelope + flap-raise gesture, plus the magnifying
 * loupe wobbling around its own centre (18, 18) via `searchLoupe`.
 * `searchLoupe` placed FIRST so the loupe path/circle/handle are
 * claimed by the wobble; the envelope and flap motions then claim
 * their own paths. The earlier `mailSearchLoupe` (scale+opacity
 * scan-pulse synced to the flap) is replaced by the canonical
 * search wobble per the Round-2 subject rule — every loupe across
 * the catalog now shares the same gesture.
 */
export default compose({
  motions: [searchLoupe, mailEnvelope, mailFlap],
  defaults: { duration: 1.0, easing: "easeInOut", stagger: 0 },
  transformOrigin: "12px 7px",
});
