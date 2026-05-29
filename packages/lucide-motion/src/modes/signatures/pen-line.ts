import { compose } from "../compose";
import { penLineStroke } from "../motions/pen-line-stroke";
import { penWrite } from "../motions/pen-write";

/**
 * `pen-line` — pen body + the underline mark the pen has just drawn
 * at the bottom. Body wobbles via `penWrite`; underline opacity dims
 * in sync via `penLineStroke` so the line "refreshes" with each
 * stroke.
 */
export default compose({
  motions: [penWrite, penLineStroke],
  defaults: { duration: 0.9, easing: "easeInOut", stagger: 0 },
});
