import { compose } from "../compose";
import { volumeModifierReveal } from "../motions/volume-modifier-reveal";
import { volumeSpeaker } from "../motions/volume-speaker";

/**
 * Volume-x — muted speaker with a crossed-out "×" marker. Speaker
 * thumps as usual; the two `<line>` strokes of the × draw in via the
 * family modifier reveal and complete at the second-thump apex so the
 * mute mark lands *on* a speaker event.
 */
export default compose({
  motions: [volumeSpeaker, volumeModifierReveal],
  defaults: { duration: 1.0, easing: "easeInOut", stagger: 0 },
  transformOrigin: "11px 12px",
});
