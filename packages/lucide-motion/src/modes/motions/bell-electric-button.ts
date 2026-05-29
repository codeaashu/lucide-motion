import type { Motion } from "../compose";
import { BELL_ELECTRIC_BODY_KEYFRAMES } from "./bell-electric-body";

/**
 * Contact-button pulse for `bell-electric` — the small `<circle>` at
 * (cx=20, cy=16, r=2) sitting off the dome's right shoulder. Tier 1
 * marker: it depicts the electric contact / wireless press point,
 * not a physical phenomenon, so the motion is a quiet feedback pulse
 * rather than bespoke physics.
 *
 * **Opacity-only pulse**: the signature pivots scale around the dome
 * center (9px, 9px) so the radiating signal arcs grow outward cleanly
 * — but a scale animation on the off-center button would drag it
 * toward the dome at every contraction, which reads as the button
 * lurching rather than blinking. Opacity sidesteps that entirely and
 * lets the press feedback stay anchored.
 *
 * **Rocks with the host body**: rotation piggybacks on
 * `bellElectricBody`'s buzz so the button rocks with the bell
 * assembly through the ring event instead of floating static.
 */
export const bellElectricButton: Motion = {
  matches: (ctx) =>
    ctx.pathTag === "circle" &&
    String(ctx.pathAttrs.cx) === "20" &&
    String(ctx.pathAttrs.cy) === "16" &&
    String(ctx.pathAttrs.r) === "2",
  factory: (ctx) => ({
    rest: { opacity: 1, rotate: 0 },
    active: {
      opacity: [1, 0.4, 1, 0.5, 1, 0.8, 1],
      rotate: BELL_ELECTRIC_BODY_KEYFRAMES.rotate,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        repeat: ctx.repeat,
        opacity: {
          inherit: true,
          ease: "easeOut",
          times: [0, 0.05, 0.18, 0.32, 0.48, 0.7, 1],
        },
        rotate: {
          inherit: true,
          ease: BELL_ELECTRIC_BODY_KEYFRAMES.ease,
          times: BELL_ELECTRIC_BODY_KEYFRAMES.times,
        },
      },
    },
  }),
};
