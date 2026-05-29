import { compose } from "../compose";
import { volumeModifierReveal } from "../motions/volume-modifier-reveal";
import { volumeSpeaker } from "../motions/volume-speaker";

/**
 * Volume-off — silenced speaker with a diagonal slash splitting the
 * chassis. The two speaker fragments inherit the host thump via
 * `volumeSpeaker`'s registry; the slash and the broken arc fragments
 * route through the family modifier reveal so they draw in on the
 * second-thump apex while sharing the speaker's pulse.
 */
export default compose({
  motions: [volumeSpeaker, volumeModifierReveal],
  defaults: { duration: 1.0, easing: "easeInOut", stagger: 0 },
  transformOrigin: "11px 12px",
});
