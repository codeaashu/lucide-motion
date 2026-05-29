import { calendarFrame } from "../motions/calendar-frame";
import { calendarModifierReveal } from "../motions/calendar-modifier-reveal";
import { compose } from "../compose";

/**
 * `calendar-heart` — calendar pins+settles; the heart badge in the
 * corner draws on via `calendarModifierReveal`. (The heart subject
 * motion `heartBeat` matches only the full-sized heart anatomy from
 * the standalone heart family; extending it to this badge-size
 * variant is deferred.)
 */
export default compose({
  motions: [calendarFrame, calendarModifierReveal],
  defaults: { duration: 0.7, easing: "easeInOut", stagger: 0 },
});
