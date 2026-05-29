import { compose } from "../compose";
import { eyeBlink } from "../motions/eye-blink";
import { eyeModifierReveal } from "../motions/eye-modifier-reveal";

/**
 * Eye-off — the eye still tries to blink (the three almond fragments
 * and the pupil arc collapse vertically via `eyeBlink`) and the
 * diagonal slash strikes through on top via the family-wide
 * `eyeModifierReveal`, drawing in via `pathLength` + `opacity` while
 * collapsing with the host so it stays anchored through the squeeze.
 * The "silenced" reading comes from the slash appearing on top, not
 * from disabling the blink.
 *
 * Compose order mirrors `bell-off` / `heart-off`: specific host motion
 * first (`eyeBlink` claims the registered eye-body paths + pupil),
 * wildcard modifier reveal last (catches the slash and any future
 * eye-plus / eye-minus / eye-check markers Lucide may ship).
 *
 * Default duration is longer than the base `eye` signature (0.6 vs
 * 0.3) — the slash needs room to draw in after the eye begins to
 * close, so squeezing it into a 0.3 s blink reads as flickering rather
 * than as a deliberate silencing strike.
 */
export default compose({
  motions: [eyeBlink, eyeModifierReveal],
  defaults: { duration: 0.6, easing: "easeInOut", stagger: 0 },
});
