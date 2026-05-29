import { compose } from "../compose";
import { zapStrike } from "../motions/zap-strike";

/**
 * Zap — lightning bolt descends from above the viewBox and lands
 * with a multi-flash flicker before settling at residual brightness.
 * Translates a real lightning strike's physics (gravity-pulled
 * descent + secondary flashes) into a single 0.8s cycle.
 */
export default compose({
  motions: [zapStrike],
  defaults: { duration: 0.8, easing: "easeOut", stagger: 0 },
});
