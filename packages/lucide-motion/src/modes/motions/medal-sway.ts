import { matchAnyPath, type Motion } from "../compose";

/**
 * `medal` — the medal sways as a rigid body pivoted at the medallion's
 * centre (12, 17). Because the disc is a circle centred exactly on the
 * pivot, it's rotation-invariant — it visibly "stays put" — while the
 * neck ribbon above swings side to side. Rotating the whole icon as one
 * rigid unit keeps the strap's legs joined to the medallion throughout
 * (an `x`-translate on the strap alone tore that join apart, since the
 * strap legs terminate right at the medallion's top edge).
 *
 * The medallion disc + "1" numeral additionally catch a light glint
 * (opacity dip) so the metal reads as alive rather than merely
 * stationary; the cloth strap only sways (no glint).
 *
 * Damped rotation `[0, -5, 4, -2, 0]`. The signature pivots at
 * `"12px 17px"`. ViewBox-safe at ±5°: the furthest strap point sits at
 * radius ≈15 from the pivot and stays inside the 24×24 frame.
 *
 * `matchAnyPath` (the only motion in `medal`'s compose list); the
 * factory branches to add the glint to the medallion + numeral.
 */
const MEDAL_NUMERAL_D = "M12 18v-2h-.5";
const MEDAL_SWAY_TIMES = [0, 0.25, 0.55, 0.8, 1];
const MEDAL_SWAY_ROTATE = [0, -5, 4, -2, 0];

export const medalSway: Motion = {
  matches: matchAnyPath,
  factory: (ctx) => {
    const isMedallion =
      (ctx.pathTag === "circle" &&
        String(ctx.pathAttrs.cx) === "12" &&
        String(ctx.pathAttrs.cy) === "17") ||
      String(ctx.pathAttrs.d) === MEDAL_NUMERAL_D;

    if (isMedallion) {
      return {
        rest: { rotate: 0, opacity: 1 },
        active: {
          rotate: MEDAL_SWAY_ROTATE,
          opacity: [1, 0.8, 1, 0.9, 1],
          transition: {
            duration: ctx.duration,
            delay: ctx.delay,
            repeat: ctx.repeat,
            ease: "easeInOut",
            times: MEDAL_SWAY_TIMES,
          },
        },
      };
    }

    return {
      rest: { rotate: 0 },
      active: {
        rotate: MEDAL_SWAY_ROTATE,
        transition: {
          duration: ctx.duration,
          delay: ctx.delay,
          repeat: ctx.repeat,
          ease: "easeInOut",
          times: MEDAL_SWAY_TIMES,
        },
      },
    };
  },
};
