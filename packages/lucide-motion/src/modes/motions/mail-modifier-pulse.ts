import { matchAnyPath, type Motion } from "../compose";
import { MAIL_FLAP_KEYFRAMES } from "./mail-flap";

/**
 * Wildcard pulse for the mail family's Tier 1 markers: `+`, `−`,
 * `✓`, `×`, `!` exclamation stem + dot, `?` question curve + dot.
 * Placed LAST in the compose `motions` list since it's
 * `matchAnyPath` — more specific motions (envelope body, V-flap,
 * search loupe) get tried first.
 *
 * Markers stay visible at rest. Plus/minus/check/x/question pulse
 * like UI status badges mounted on the envelope; warning blinks more
 * sharply like an alert indicator. Uniform scale preserves marker
 * shape, and opacity follows the flap rhythm so the marker remains
 * kinetically attached without becoming a draw-on animation.
 */
export const mailModifierPulse: Motion = {
  matches: matchAnyPath,
  factory: (ctx) => {
    const isWarning = ctx.iconName === "mail-warning";

    return {
      rest: {
        scale: 1,
        opacity: 1,
        transformBox: "fill-box",
        transformOrigin: "center",
      },
      active: {
        // Press-rebound pulse: rest → press in → rebound out → settle back
        // at rest. Earlier authoring `[1, 0.82, 1, 0.9]` and friends left
        // the marker visibly shrunk and dimmed after the play (especially
        // the warning variant at 18% opacity). The 4th keyframe is now the
        // explicit return to rest so each play forms a closed cycle.
        scale: isWarning ? [1, 0.82, 1, 1] : [1, 0.9, 1, 1],
        opacity: isWarning
          ? [1, 0.18, 1, 1]
          : [1, MAIL_FLAP_KEYFRAMES.opacity[1], 1, 1],
        transformBox: "fill-box",
        transformOrigin: "center",
        transition: {
          duration: ctx.duration,
          delay: ctx.delay + ctx.index * ctx.stagger,
          repeat: ctx.repeat,
          scale: {
            inherit: true,
            ease: "easeInOut",
            times: MAIL_FLAP_KEYFRAMES.times,
          },
          opacity: {
            inherit: true,
            ease: "easeInOut",
            times: MAIL_FLAP_KEYFRAMES.times,
          },
        },
      },
    };
  },
};
