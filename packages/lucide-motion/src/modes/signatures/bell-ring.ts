import { compose } from "../compose";
import { bellClapper } from "../motions/bell-clapper";
import { bellShell } from "../motions/bell-shell";
import { bellSoundWaves } from "../motions/bell-sound-waves";

/**
 * Bell rings, and the two sound-wave arcs radiate outward from the bell
 * mount via `bellSoundWaves` — scale-from-origin so the waves visually
 * emerge from where the bell hangs and propagate outward, the way real
 * sound waves do.
 *
 * Tier-2 signature: the sound waves represent an actual physical
 * phenomenon (sound), so they get bespoke motion rather than the
 * generic `modifierReveal` used for UI markers like +, −, ✓, off-slash.
 */
export default compose({
  motions: [bellClapper, bellShell, bellSoundWaves],
  defaults: { duration: 1.0, easing: "easeOut", stagger: 0 },
  transformOrigin: "12px 4px",
});
