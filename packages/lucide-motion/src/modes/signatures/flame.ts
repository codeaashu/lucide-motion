import { compose } from "../compose";
import { flameFlicker } from "../motions/flame-flicker";

/**
 * Flame — a single teardrop path that flickers via the shared
 * {@link flameFlicker} motion: contraction-only scaleY (the flame
 * briefly shrinks toward its base), ±2° rotation sway (the tip
 * leans side-to-side in a draft), and an irregular opacity flicker
 * (the hot core is alternately exposed and shrouded).
 *
 * Pivots at `"12px 16px"` — the flame's base, where real flames
 * physically rise from. With this origin, the contractions and
 * sways keep the base anchored while the tip dances.
 */
export default compose({
  motions: [flameFlicker],
  defaults: { duration: 1.4, easing: "easeInOut", stagger: 0 },
  transformOrigin: "12px 16px",
});
