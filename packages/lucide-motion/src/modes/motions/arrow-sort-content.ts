import type { Motion } from "../compose";

/**
 * Static-content holder for the arrow sort family —
 * `arrow-{up,down}-{a-z,z-a,0-1,1-0,narrow-wide,wide-narrow}`. Each
 * sort variant has an arrow on the LEFT (shaft + arrowhead at x = 3
 * to 11) and labeled content on the RIGHT (letters, numbers, or
 * narrow→wide / wide→narrow divider lines at x ≥ 11).
 *
 * This motion claims the right-side content paths so they stay
 * anchored while `arrowGlide` translates the arrow part in the
 * sort direction. Carries a subtle opacity dip for kinetic-life
 * cohesion (principle 2) — without it the labels feel disconnected
 * from the gliding arrow.
 *
 * Geometric predicate (not a path-d registry): a path or rect is
 * "sort content" iff its first x coordinate ≥ 10. Covers the rect
 * `0`s, the `1` / `A` / `Z` glyph strokes, and the narrow/wide
 * divider lines without enumerating every d.
 *
 * Placed FIRST in each sort variant's compose list so the content
 * is claimed before `arrowGlide`'s matchAnyPath would translate it.
 *
 * Closed cycle: opacity starts AND ends at 1.
 */
const SORT_ICON_RE =
  /^arrow-(up|down)-(a-z|z-a|0-1|1-0|narrow-wide|wide-narrow)$/;

const isSortContent = (ctx: {
  iconName: string;
  pathTag: string;
  pathAttrs: Record<string, string | number>;
}): boolean => {
  if (!SORT_ICON_RE.test(ctx.iconName)) return false;
  if (ctx.pathTag === "rect") {
    return Number(ctx.pathAttrs.x ?? 0) >= 10;
  }
  if (ctx.pathTag === "path") {
    const d = String(ctx.pathAttrs.d ?? "");
    const m = d.match(/^[mM]\s*(-?\d+(?:\.\d+)?)/);
    if (!m) return false;
    return Number(m[1]) >= 10;
  }
  return false;
};

export const arrowSortContent: Motion = {
  matches: isSortContent,
  factory: (ctx) => ({
    rest: { opacity: 1 },
    active: {
      opacity: [1, 0.7, 1],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay,
        repeat: ctx.repeat,
        ease: "easeInOut",
        times: [0, 0.4, 1],
      },
    },
  }),
};
