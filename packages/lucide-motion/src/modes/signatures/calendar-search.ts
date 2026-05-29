import { calendarFrame } from "../motions/calendar-frame";
import { calendarModifierReveal } from "../motions/calendar-modifier-reveal";
import { compose } from "../compose";
import { searchLoupe } from "../motions/search-loupe";

/**
 * `calendar-search` — calendar pins+settles; the search loupe at
 * (18, 18) wobbles via `searchLoupe` (per-iconName lookup in
 * SEARCH_LOUPE_CENTERS). Search motion placed FIRST so the loupe
 * circle + handle are claimed by the wobble before
 * `calendarModifierReveal`'s wildcard would draw them on.
 */
export default compose({
  motions: [searchLoupe, calendarFrame, calendarModifierReveal],
  defaults: { duration: 1.0, easing: "easeInOut", stagger: 0 },
});
