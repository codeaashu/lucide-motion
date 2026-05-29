import { compose } from "../compose";
import { moonGlow } from "../motions/moon-glow";
import { moonStarTwinkle } from "../motions/moon-star-twinkle";

/**
 * Moon-star — a crescent moon plus a small four-pointed sparkle in
 * the upper-right. The crescent glows softly via {@link moonGlow}
 * (opacity-only, the moon reflects light rather than emitting it),
 * while the sparkle pulses sharply via {@link moonStarTwinkle} —
 * the star's bright-dim-bright twinkle is what the doc's roadmap
 * specifically called out for this icon.
 *
 * Transform-origin override: pivots at `"20px 5px"` — the star's
 * own centre — so the sparkle scale animates in place rather than
 * translating across the icon. `moonGlow` is opacity-only and so is
 * unaffected by the off-centre pivot.
 */
export default compose({
  motions: [moonStarTwinkle, moonGlow],
  defaults: { duration: 1.4, easing: "easeInOut", stagger: 0.04 },
  transformOrigin: "20px 5px",
});
