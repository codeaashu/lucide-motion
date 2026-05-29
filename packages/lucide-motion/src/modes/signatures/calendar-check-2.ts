import { compose } from "../compose";
import { calendarFrame } from "../motions/calendar-frame";
import { calendarModifierReveal } from "../motions/calendar-modifier-reveal";

/**
 * calendar-check-2 — same gesture as `calendar-check`, but the `✓`
 * sits in the cut-corner badge (lower-right) rather than inside
 * the body.
 */
export default compose({
  motions: [calendarFrame, calendarModifierReveal],
  defaults: { duration: 0.55, easing: "easeInOut", stagger: 0 },
});
