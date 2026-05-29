import { calendarFrame } from "../motions/calendar-frame";
import { calendarModifierReveal } from "../motions/calendar-modifier-reveal";
import { compose } from "../compose";

/**
 * `calendar-sync` — calendar pins+settles; the two sync-arrow
 * curves in the corner draw on via `calendarModifierReveal`. A
 * bespoke "rotating sync arrows" motion (like refresh-arc-cycle) is
 * deferred — the draw-in still reads as the sync indicator being
 * activated.
 */
export default compose({
  motions: [calendarFrame, calendarModifierReveal],
  defaults: { duration: 0.8, easing: "easeInOut", stagger: 0.05 },
});
