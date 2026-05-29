import { compose } from "../compose";
import { calendarFrame } from "../motions/calendar-frame";
import { calendarModifierReveal } from "../motions/calendar-modifier-reveal";

/**
 * calendar-x-2 — same gesture as `calendar-x`, but the two `×`
 * strokes sit in the cut-corner badge (lower-right) rather than
 * inside the body.
 */
export default compose({
  motions: [calendarFrame, calendarModifierReveal],
  defaults: { duration: 0.55, easing: "easeInOut", stagger: 0 },
});
