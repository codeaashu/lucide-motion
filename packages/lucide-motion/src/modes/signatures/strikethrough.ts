import { compose } from "../compose";
import { strikethroughLine } from "../motions/strikethrough-line";
import { typewriterStamp } from "../motions/typewriter-stamp";

/**
 * `strikethrough` — S-shaped text strokes stamp via
 * `typewriterStamp`; the horizontal strikethrough bar draws in
 * left-to-right via `strikethroughLine` (placed FIRST so the line
 * is claimed by the dashoffset sweep).
 */
export default compose({
  motions: [strikethroughLine, typewriterStamp],
  defaults: { duration: 0.8, easing: "easeInOut", stagger: 0 },
});
