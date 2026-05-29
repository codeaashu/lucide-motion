import { matchPathD, type Motion } from "../compose";

/**
 * `award`'s ribbon flag — the V-shaped tail that hangs below the
 * medal circle. Rotation around the attachment point at (12, 13)
 * pins the top of the ribbon to the medal underside while the
 * bottom of the V swings side-to-side — real pendulum physics.
 *
 * Amplitude is intentionally subtle (±4°) so the top corners stay
 * visually attached to the medal; a larger angle would visibly
 * separate the ribbon's upper edges from the circle.
 *
 * Per-variant `transformOrigin: "12px 13px"` (resolved against
 * view-box `transformBox` set by the engine) pivots the rotation
 * at the attachment point. Same pattern as `cogGear` — variant
 * `transformOrigin` overrides the signature-level default for
 * this specific path.
 *
 * Place this BEFORE `polishedShineSweep` in `award`'s compose list
 * so the ribbon path is claimed by the sway; the medal circle
 * falls through to the shine sweep.
 */
const AWARD_RIBBON_D =
  "m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526";

export const awardRibbonSway: Motion = {
  matches: matchPathD(AWARD_RIBBON_D),
  factory: (ctx) => ({
    rest: { rotate: 0, transformOrigin: "12px 13px" },
    active: {
      rotate: [0, -4, 2.5, -1, 0],
      transformOrigin: "12px 13px",
      transition: {
        duration: ctx.duration,
        delay: ctx.delay,
        repeat: ctx.repeat,
        ease: "easeInOut",
        times: [0, 0.25, 0.55, 0.8, 1],
      },
    },
  }),
};
