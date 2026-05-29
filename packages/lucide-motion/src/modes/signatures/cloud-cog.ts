import { compose } from "../compose";
import { cloudBody } from "../motions/cloud-body";
import { cogGear } from "../motions/cog-gear";

/**
 * `cloud-cog` — cloud body breathes while the gear badge below it
 * rotates one full revolution via `cogGear` around the cog's centre
 * at (12, 17). `cogGear` matches both the six discrete tooth strokes
 * and the two merged hub-arc + tooth strokes Lucide uses for this
 * cog (the cloud's lower arc cuts through where a separate hub
 * circle would sit).
 *
 * `cogGear` is placed BEFORE `cloudBody` so it claims the cog
 * elements first; the cloud body still matches its own paths
 * separately and is unaffected. No `cloudModifierReveal` needed —
 * every non-cog path is the cloud body itself.
 */
export default compose({
  motions: [cogGear, cloudBody],
  defaults: { duration: 1.4, easing: "easeInOut", stagger: 0 },
});
