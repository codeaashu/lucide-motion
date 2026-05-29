import { compose } from "../compose";
import { settings2Knob, settings2Track } from "../motions/settings-2-sliders";

/**
 * `settings-2` — two horizontal sliders. Each knob slides along its
 * track briefly via `settings2Knob` (per-knob direction lookup);
 * tracks dim subtly via `settings2Track`. Reads as "adjusting two
 * settings."
 *
 * Distinct from `settings` (the wavy-outline gear which rotates).
 */
export default compose({
  motions: [settings2Knob, settings2Track],
  defaults: { duration: 0.9, easing: "easeInOut", stagger: 0 },
});
