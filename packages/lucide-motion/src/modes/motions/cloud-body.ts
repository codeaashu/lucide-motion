import type { Motion } from "../compose";

/**
 * The cloud body — the shell shape that every cloud-family icon
 * shares (with per-variant carve-outs to make room for modifiers).
 * Lucide draws the cloud as a path whose distinctive feature is one
 * of two arc-radius combinations: a `7 7` arc (the standard
 * large-cloud body in `cloud`, `cloud-rain`, etc.) or an `5 5 0 1 1`
 * arc (the smaller cloud beside a sun or moon in `cloud-sun`,
 * `cloud-moon`, and their rain composites). The `5 5 0 1 1`
 * large-arc-flag rules out the visually-similar `5 5 0 0 1` arcs
 * used by `cloud-sync`'s rotating-arrows modifier — those aren't
 * cloud bodies.
 *
 * **Real-life motion**: clouds drift slowly in the sky and shift
 * their volume gently as moisture condenses and evaporates. Modeled
 * here as a subtle scale contraction + opacity dim from the icon's
 * default centre — the body "breathes" softly while the weather
 * elements (rain, snow, lightning, fog) do the visible work below
 * it. The amplitude is intentionally small so the cloud reads as
 * the steady frame within which precipitation, sun-rays, or
 * moonlight come and go.
 *
 * Exports `CLOUD_BODY_KEYFRAMES` so other cloud-family motions
 * (rain-drop reveals, snow twinkles, modifier reveals) can inherit
 * the host's scale via `inherit: true` per-value transitions and
 * stay loosely synced with the cloud's gentle pulse.
 */
export const CLOUD_BODY_KEYFRAMES = {
  scale: [1, 0.97, 1],
  times: [0, 0.5, 1],
};

const CLOUD_BODY_PATTERN = /[Aa]7 7 0|[Aa]5 5 0 1 1/;

export const cloudBody: Motion = {
  matches: (ctx) =>
    ctx.pathTag === "path" &&
    CLOUD_BODY_PATTERN.test(String(ctx.pathAttrs.d)),
  factory: (ctx) => ({
    rest: { scale: 1, opacity: 1 },
    active: {
      scale: CLOUD_BODY_KEYFRAMES.scale,
      opacity: [1, 0.85, 1],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        ease: ctx.easing,
        times: CLOUD_BODY_KEYFRAMES.times,
        repeat: ctx.repeat,
      },
    },
  }),
};
