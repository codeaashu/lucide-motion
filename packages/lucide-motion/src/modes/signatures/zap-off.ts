import { compose } from "../compose";
import { zapModifierReveal } from "../motions/zap-modifier-reveal";
import { zapStrike } from "../motions/zap-strike";

/**
 * Zap-off — the three bolt fragments still descend and flicker as
 * one broken strike; the diagonal slash holds invisible through the
 * primary flash, then strikes through during the dim trough between
 * the first and second flickers. The "off" reading comes from the
 * slash landing in the dark moment when the bolt has just struck —
 * a clear "this lightning is being suppressed" beat.
 */
export default compose({
  motions: [zapStrike, zapModifierReveal],
  defaults: { duration: 0.8, easing: "easeOut", stagger: 0 },
});
