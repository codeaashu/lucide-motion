import { compose } from "../compose";
import { calendarFrame } from "../motions/calendar-frame";

/**
 * `calendar` — the base calendar icon: two pins, a rect body, and a
 * horizontal top divider. The calendarFrame motion covers all four
 * anatomical roles: pins pluck UP, body and divider settle DOWN, all
 * on a shared timing schedule. Reads as the calendar being pinned to
 * a wall.
 *
 * The same calendarFrame motion is the host for every other
 * calendar-* composite. Their signatures compose `calendarFrame`
 * alongside their own badge-subject motions (calendar-search's loupe,
 * calendar-cog's gear, calendar-clock's clock face, etc.).
 */
export default compose({
  motions: [calendarFrame],
  defaults: { duration: 0.55, easing: "easeInOut", stagger: 0 },
});
