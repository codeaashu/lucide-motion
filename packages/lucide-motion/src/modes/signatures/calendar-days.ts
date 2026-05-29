import { calendarFrame } from "../motions/calendar-frame";
import { calendarModifierReveal } from "../motions/calendar-modifier-reveal";
import { compose } from "../compose";

/**
 * `calendar-days` — calendar with a 2x3 dot grid inside. Calendar
 * pins+settles; the six dots draw on (sequenced via the wildcard
 * stagger) via `calendarModifierReveal`.
 */
export default compose({
  motions: [calendarFrame, calendarModifierReveal],
  defaults: { duration: 0.7, easing: "easeInOut", stagger: 0.04 },
});
