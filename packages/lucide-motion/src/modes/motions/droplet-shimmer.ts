import type { Motion } from "../compose";

/**
 * The water-droplet shape used by `droplet` (one drop), `droplets`
 * (two drops side-by-side), and the two split fragments in
 * `droplet-off`.
 *
 * Tier 2 motion: a hanging water droplet sits at the brink of
 * falling, surface tension pulling it inward briefly before it
 * releases. Modeled here as a gentle downward bob (the drop swells
 * and dips), a small scale contraction (surface tension drawing
 * the drop inward), and a soft opacity dim (light refracting
 * through the curved surface). Per-axis amplitudes are small so
 * neither the drop's bottom tip nor its sides clip the viewBox.
 *
 * **Match strategy**: every drop-shape path includes at least one
 * arc command (`[Aa]\d…`) — the curves that form the drop's
 * outline. The diagonal slash in `droplet-off` is `m2 2 20 20`
 * (lines only, no arcs) so it falls through to the family's
 * modifier reveal instead.
 *
 * Exports `DROPLET_KEYFRAMES` for the modifier reveal to inherit
 * via per-value `inherit: true` transitions so the slash breathes
 * in sync with the drop fragments.
 */
export const DROPLET_KEYFRAMES = {
  scale: [1, 0.96, 1],
  times: [0, 0.5, 1],
};

const DROPLET_ARC_PATTERN = /[Aa]\d/;

export const dropletShimmer: Motion = {
  matches: (ctx) =>
    ctx.pathTag === "path" &&
    DROPLET_ARC_PATTERN.test(String(ctx.pathAttrs.d)),
  factory: (ctx) => ({
    rest: { y: 0, scale: 1, opacity: 1 },
    active: {
      y: [0, 0.6, 0],
      scale: DROPLET_KEYFRAMES.scale,
      opacity: [1, 0.85, 1],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        ease: ctx.easing,
        times: DROPLET_KEYFRAMES.times,
        repeat: ctx.repeat,
      },
    },
  }),
};
