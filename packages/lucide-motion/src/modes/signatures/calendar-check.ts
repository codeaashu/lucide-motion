import { compose } from "../compose";
import { calendarFrame } from "../motions/calendar-frame";
import { calendarModifierReveal } from "../motions/calendar-modifier-reveal";

/**
 * calendar-check — calendar pins+settles (`calendarFrame`) while
 * the `✓` stroke draws on at the settle peak via
 * `calendarModifierReveal`.
 */
export default compose({
  motions: [calendarFrame, calendarModifierReveal],
  defaults: { duration: 0.55, easing: "easeInOut", stagger: 0 },
});
