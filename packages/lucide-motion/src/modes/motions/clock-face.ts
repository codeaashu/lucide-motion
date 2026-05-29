import type { Motion } from "../compose";

/**
 * The clock's face — either the full `<circle cx=12 cy=12 r=10>` in
 * the simple variants (`clock`, `clock-1`..`clock-12`) or one of the
 * radius-10 partial arcs in the composite variants (`clock-alert`,
 * `clock-arrow-down`, `clock-arrow-up`, `clock-check`, `clock-fading`,
 * `clock-plus`). The partial arcs always include the literal "a10 10"
 * or "A10 10" arc command, so the match recognises both forms.
 *
 * **Real-life motion**: a clock's body doesn't move while it tells
 * time — the hands do the work. Modeled as a barely-perceptible
 * scale + opacity pulse so the face "breathes" gently around the
 * hand tick rather than sitting completely static. The amplitude is
 * intentionally tiny (2% inward contraction, scale ≤ 1 per
 * principle 3) so the face reads as the steady frame within which
 * the hands advance.
 *
 * **Cascade benefit**: in `clock-fading` the face is split into five
 * separate radius-10 arcs; with the signature's small stagger the
 * arcs pulse in sequence rather than in lockstep, which naturally
 * reads as the icon's "fading" character.
 *
 * Exports `CLOCK_FACE_KEYFRAMES` so other clock-family motions
 * (modifier reveals) can stay loosely synced with the face's
 * gentle pulse.
 */
export const CLOCK_FACE_KEYFRAMES = {
  scale: [1, 0.98, 1],
  times: [0, 0.5, 1],
};

const FACE_ARC_PATTERN = /[Aa]10 10 0/;

export const clockFace: Motion = {
  matches: (ctx) => {
    if (ctx.pathTag === "circle") {
      return (
        String(ctx.pathAttrs.cx) === "12" &&
        String(ctx.pathAttrs.cy) === "12" &&
        String(ctx.pathAttrs.r) === "10"
      );
    }
    if (ctx.pathTag === "path") {
      return FACE_ARC_PATTERN.test(String(ctx.pathAttrs.d));
    }
    return false;
  },
  factory: (ctx) => ({
    rest: { scale: 1, opacity: 1 },
    active: {
      scale: CLOCK_FACE_KEYFRAMES.scale,
      opacity: [1, 0.9, 1],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        ease: ctx.easing,
        times: CLOCK_FACE_KEYFRAMES.times,
        repeat: ctx.repeat,
      },
    },
  }),
};
