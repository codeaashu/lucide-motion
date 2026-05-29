import { calendarFrame } from "../motions/calendar-frame";
import { calendarModifierReveal } from "../motions/calendar-modifier-reveal";
import { compose } from "../compose";

/**
 * `calendar-fold` — calendar with a folded-corner shape. The
 * folded-corner body path is already in `calendarFrame`'s matcher
 * registry so the whole frame pins+settles together. The L-bracket
 * inside the fold draws on via `calendarModifierReveal`.
 */
export default compose({
  motions: [calendarFrame, calendarModifierReveal],
  defaults: { duration: 0.6, easing: "easeInOut", stagger: 0 },
});
