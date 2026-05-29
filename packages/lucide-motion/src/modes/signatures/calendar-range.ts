import { calendarFrame } from "../motions/calendar-frame";
import { calendarModifierReveal } from "../motions/calendar-modifier-reveal";
import { compose } from "../compose";

/**
 * `calendar-range` — calendar with two range-selection bars + two
 * dots inside. Calendar pins+settles; the range markers draw on via
 * `calendarModifierReveal` with stagger so the range reads as being
 * selected.
 */
export default compose({
  motions: [calendarFrame, calendarModifierReveal],
  defaults: { duration: 0.7, easing: "easeInOut", stagger: 0.06 },
});
