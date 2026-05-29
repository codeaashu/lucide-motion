import { compose } from "../compose";
import { calendarFrame } from "../motions/calendar-frame";
import { calendarModifierReveal } from "../motions/calendar-modifier-reveal";

/**
 * calendar-plus — calendar pins+settles (`calendarFrame`) while the
 * `+` marker stamps on at the body's settle peak via
 * `calendarModifierReveal`, bobbing with the page so it stays
 * anchored.
 */
export default compose({
  motions: [calendarFrame, calendarModifierReveal],
  defaults: { duration: 0.55, easing: "easeInOut", stagger: 0 },
});
