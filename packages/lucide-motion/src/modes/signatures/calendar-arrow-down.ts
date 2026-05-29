import { calendarFrame } from "../motions/calendar-frame";
import { calendarModifierReveal } from "../motions/calendar-modifier-reveal";
import { compose } from "../compose";

/**
 * `calendar-arrow-down` — calendar pins+settles; the corner-badge
 * down-arrow is a Tier 1 state marker that draws on via
 * `calendarModifierReveal`.
 */
export default compose({
  motions: [calendarFrame, calendarModifierReveal],
  defaults: { duration: 0.6, easing: "easeInOut", stagger: 0.04 },
});
