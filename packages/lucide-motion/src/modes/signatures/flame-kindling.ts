import { compose } from "../compose";
import { flameFlicker } from "../motions/flame-flicker";
import { flameKindlingEmbers } from "../motions/flame-kindling-embers";

/**
 * Flame-kindling — a (slightly smaller) flame teardrop dancing on
 * top of two crossed kindling sticks at the icon's base.
 *
 * The flame uses {@link flameFlicker} (contraction scaleY +
 * rotation sway + opacity flicker), pivoted at the flame's base
 * `"12px 15px"`. The kindling uses {@link flameKindlingEmbers}
 * (opacity-only ember glow) and inherits the flame's rotation via
 * `inherit: true` so the sticks rock subtly with the fire's air
 * currents — real kindling does respond to fire's draft, just not
 * by much.
 */
export default compose({
  motions: [flameFlicker, flameKindlingEmbers],
  defaults: { duration: 1.4, easing: "easeInOut", stagger: 0 },
  transformOrigin: "12px 15px",
});
