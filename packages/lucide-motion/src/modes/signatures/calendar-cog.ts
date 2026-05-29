import { calendarFrame } from "../motions/calendar-frame";
import { calendarModifierReveal } from "../motions/calendar-modifier-reveal";
import { cogGear } from "../motions/cog-gear";
import { compose } from "../compose";

/**
 * `calendar-cog` — calendar pins+settles; the cog badge at (18, 18)
 * rotates one full revolution via `cogGear` around its own centre
 * (per-iconName lookup in COG_CENTERS). Cog motion placed FIRST so
 * the teeth + hub are claimed by rotation before
 * `calendarModifierReveal`'s wildcard would draw them on.
 */
export default compose({
  motions: [cogGear, calendarFrame, calendarModifierReveal],
  defaults: { duration: 1.1, easing: "easeInOut", stagger: 0 },
});
