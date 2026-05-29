import type { Motion } from "../compose";
import type { ModeContext } from "../types";

/**
 * `circle-alert` / `triangle-alert` — a warning sign whose exclamation
 * mark flashes for attention while the surrounding shape (circle or
 * triangle) holds steady with a small "flinch."
 *
 * `alertSignPulse` (the host circle / triangle) does a subtle UNIFORM
 * `scale` contraction `[1, 0.95, 1, 0.97, 1]` — uniform so the circle
 * stays a circle (a `scaleY`-only squash would turn it into a visible
 * oval) — plus a phase-locked opacity dip. It barely moves; it reads as
 * the sign tensing, not bouncing.
 *
 * `alertExclamationFlash` (the `!` stem + dot) blinks sharply
 * (`opacity: [1, 0.25, 1, 0.5, 1]`, an alarm cadence) and inherits the
 * sign's uniform scale so it tenses in step with the shape. Uniform
 * scale preserves the vertical stem's orientation, so there's no
 * distortion. This is a flash, not a draw-in — an alert `!` blinks; it
 * doesn't stroke on.
 *
 * Both icons share these two motions. The host matches the
 * `circle-alert` ring (`<circle>` at 12,12 r10) and the
 * `triangle-alert` body `<path>`; the exclamation matches the `<line>`
 * stem + dot in `circle-alert` and the `<path>` stem + dot in
 * `triangle-alert`. Compose order doesn't matter — the two matchers are
 * disjoint and cover every path (no fall-through to `draw`).
 *
 * Exports `ALERT_SIGN_KEYFRAMES` so the exclamation stays phase-locked
 * with the host (principle 2).
 */
const TRIANGLE_ALERT_BODY_D =
  "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3";

export const ALERT_SIGN_KEYFRAMES = {
  scale: [1, 0.95, 1, 0.97, 1],
  opacity: [1, 0.85, 1, 0.9, 1],
  times: [0, 0.18, 0.4, 0.6, 1],
};

const isAlertHost = (ctx: ModeContext): boolean =>
  (ctx.pathTag === "circle" &&
    String(ctx.pathAttrs.cx) === "12" &&
    String(ctx.pathAttrs.cy) === "12" &&
    String(ctx.pathAttrs.r) === "10") ||
  (ctx.pathTag === "path" && String(ctx.pathAttrs.d) === TRIANGLE_ALERT_BODY_D);

const isAlertMark = (ctx: ModeContext): boolean => {
  // circle-alert's stem + dot are <line>s at x = 12.
  if (ctx.pathTag === "line") {
    return String(ctx.pathAttrs.x1) === "12";
  }
  // triangle-alert's stem + dot are <path>s.
  if (ctx.pathTag === "path") {
    const d = String(ctx.pathAttrs.d);
    return d === "M12 9v4" || d === "M12 17h.01";
  }
  return false;
};

export const alertSignPulse: Motion = {
  matches: isAlertHost,
  factory: (ctx) => ({
    rest: { scale: 1, opacity: 1 },
    active: {
      scale: ALERT_SIGN_KEYFRAMES.scale,
      opacity: ALERT_SIGN_KEYFRAMES.opacity,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay,
        repeat: ctx.repeat,
        ease: "easeInOut",
        times: ALERT_SIGN_KEYFRAMES.times,
      },
    },
  }),
};

export const alertExclamationFlash: Motion = {
  matches: isAlertMark,
  factory: (ctx) => ({
    rest: { opacity: 1, scale: 1 },
    active: {
      opacity: [1, 0.25, 1, 0.5, 1],
      scale: ALERT_SIGN_KEYFRAMES.scale,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay,
        repeat: ctx.repeat,
        opacity: { inherit: true, ease: "easeInOut", times: [0, 0.18, 0.4, 0.6, 1] },
        scale: { inherit: true, ease: "easeInOut", times: ALERT_SIGN_KEYFRAMES.times },
      },
    },
  }),
};
