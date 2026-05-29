import { calendarFrame } from "../motions/calendar-frame";
import { calendarModifierReveal } from "../motions/calendar-modifier-reveal";
import { compose } from "../compose";

/**
 * `calendar-clock` — calendar pins+settles; the small clock badge
 * (face circle r=6 + hands at (16, 14)) draws on via
 * `calendarModifierReveal`. The clock subject motions (clockFace,
 * clockHands) currently only match the standalone clock geometry
 * (r=10 face); extending them to this composite is deferred to a
 * future clock-subject Round-2 pass.
 */
export default compose({
  motions: [calendarFrame, calendarModifierReveal],
  defaults: { duration: 0.8, easing: "easeInOut", stagger: 0.04 },
});
