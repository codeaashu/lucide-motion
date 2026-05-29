import { compose } from "../compose";
import { calendarFrame } from "../motions/calendar-frame";
import { calendarModifierReveal } from "../motions/calendar-modifier-reveal";

/**
 * calendar-off — calendar pins+settles (`calendarFrame`) while the
 * diagonal slash `m2 2 20 20` strikes through at the body's settle
 * peak via `calendarModifierReveal`, bobbing with the calendar so
 * the slash stays anchored across the strike.
 *
 * The calendar body is split into two fragments and the divider
 * into two stubs to make room for the slash — both fragments and
 * stubs are already in calendarFrame's path registry so they bob
 * with the rest of the frame, leaving only the slash for the
 * wildcard modifier-reveal to claim.
 */
export default compose({
  motions: [calendarFrame, calendarModifierReveal],
  defaults: { duration: 0.55, easing: "easeInOut", stagger: 0 },
});
