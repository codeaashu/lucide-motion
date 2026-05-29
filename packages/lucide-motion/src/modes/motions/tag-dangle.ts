import { matchAnyPath, type Motion } from "../compose";

/**
 * `tag` / `tags` — a price tag dangling from the string threaded
 * through its eyelet hole. The tag swings as a pendulum from that
 * hole: a damped side-to-side rotation `[0, -5, 4, -2, 0]` that settles
 * back to rest.
 *
 * The pivot is the eyelet itself, looked up per-icon in
 * `TAG_DANGLE_CENTERS` and applied as a per-variant `transformOrigin`
 * (resolved against the engine's `transformBox: "view-box"`, the same
 * per-iconName pivot pattern as `cog-gear`'s `COG_CENTERS`). The hole
 * sits exactly on the pivot, so it stays put while the body swings.
 *
 * For `tags` (two overlapping tags on one ring) the signature sets a
 * small `stagger`, so the front tag leads and the back tag follows by
 * `ctx.index * stagger` — the two tags jostle slightly out of phase
 * rather than swinging in lockstep.
 *
 * Amplitude capped at ±5° so the tag's lowest tip (≈y21) stays inside
 * the 24×24 viewBox through the swing.
 *
 * `matchAnyPath` — the only motion in each signature's compose list.
 */
const TAG_DANGLE_CENTERS: Record<string, [number, number]> = {
  tag: [7.5, 7.5],
  tags: [10.5, 6.5],
};

export const tagDangle: Motion = {
  matches: matchAnyPath,
  factory: (ctx) => {
    const [cx, cy] = TAG_DANGLE_CENTERS[ctx.iconName] ?? [12, 12];
    const origin = `${cx}px ${cy}px`;
    return {
      rest: { rotate: 0, transformOrigin: origin },
      active: {
        rotate: [0, -5, 4, -2, 0],
        transformOrigin: origin,
        transition: {
          duration: ctx.duration,
          delay: ctx.delay + ctx.index * ctx.stagger,
          repeat: ctx.repeat,
          ease: "easeInOut",
          times: [0, 0.25, 0.55, 0.8, 1],
        },
      },
    };
  },
};
