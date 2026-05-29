import { calendarFrame } from "../motions/calendar-frame";
import { calendarModifierReveal } from "../motions/calendar-modifier-reveal";
import { compose } from "../compose";

/**
 * `calendar-1` — calendar pins+settles via `calendarFrame`; the "1"
 * numeral inside draws on via `calendarModifierReveal` at the settle
 * peak.
 */
export default compose({
  motions: [calendarFrame, calendarModifierReveal],
  defaults: { duration: 0.55, easing: "easeInOut", stagger: 0 },
});
