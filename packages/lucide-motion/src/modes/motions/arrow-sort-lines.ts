import type { Motion } from "../compose";

/**
 * Cascading draw-in for the divider lines in the narrow-wide / wide-
 * narrow sort variants: `arrow-{up,down}-{narrow-wide,wide-narrow}`.
 * Each icon has three horizontal lines on the right side at y = 4, 8,
 * 12 (for arrow-down-*) or y = 12, 16, 20 (for arrow-up-*). The
 * cascade direction matches the arrow:
 *
 * - `arrow-down-*` — lines reveal top → bottom (y=4 first, y=12 last).
 * - `arrow-up-*` — lines reveal bottom → top (y=20 first, y=12 last).
 *
 * Each line owns a non-overlapping `0.15`-wide slice of the cycle:
 * line 0 at `t ∈ [0, 0.15]`, line 1 at `[0.15, 0.3]`, line 2 at
 * `[0.3, 0.45]`. All three finish by `t = 0.45` so the arrow's
 * glide (peak at `t = 0.4`) lands as the lines are wrapping up.
 *
 * `strokeDasharray` + `strokeDashoffset` against `ctx.pathLength`,
 * cleared on `transitionEnd` so the resting stroke stays solid and
 * seam-free. Opacity flips 0 → 1 in sync with the stroke draw.
 *
 * Place this FIRST in each narrow-wide variant's compose list so
 * the lines are claimed before `arrowSortContent`'s greedier
 * geometric predicate or `arrowGlide`'s matchAnyPath would grab
 * them.
 *
 * Closed cycle: opacity ends at 1; dasharray/offset cleared via
 * `transitionEnd`.
 */
const SORT_LINE_RE = /^M11 (\d+)h\d+$/;

const NARROW_WIDE_ICONS = new Set([
  "arrow-down-narrow-wide",
  "arrow-down-wide-narrow",
  "arrow-up-narrow-wide",
  "arrow-up-wide-narrow",
]);

function cascadeIndex(iconName: string, y: number): number {
  const isDown = iconName.startsWith("arrow-down-");
  if (isDown) {
    // Top-to-bottom: y=4 → 0, y=8 → 1, y=12 → 2
    if (y === 4) return 0;
    if (y === 8) return 1;
    return 2; // y === 12
  }
  // Bottom-to-top: y=20 → 0, y=16 → 1, y=12 → 2
  if (y === 20) return 0;
  if (y === 16) return 1;
  return 2; // y === 12
}

export const arrowSortLines: Motion = {
  matches: (ctx) => {
    if (!NARROW_WIDE_ICONS.has(ctx.iconName)) return false;
    if (ctx.pathTag !== "path") return false;
    return SORT_LINE_RE.test(String(ctx.pathAttrs.d ?? ""));
  },
  factory: (ctx) => {
    const m = String(ctx.pathAttrs.d).match(SORT_LINE_RE);
    const y = m ? Number(m[1]) : 4;
    const idx = cascadeIndex(ctx.iconName, y);
    const start = idx * 0.15;
    const end = start + 0.15;
    return {
      rest: {
        strokeDasharray: 0,
        strokeDashoffset: 0,
        opacity: 1,
      },
      active: {
        strokeDasharray: ctx.pathLength,
        strokeDashoffset: [ctx.pathLength, ctx.pathLength, 0, 0],
        opacity: [0, 0, 1, 1],
        transition: {
          duration: ctx.duration,
          delay: ctx.delay,
          repeat: ctx.repeat,
          strokeDasharray: { duration: 0 },
          strokeDashoffset: {
            inherit: true,
            ease: "easeOut",
            times: [0, start, end, 1],
          },
          opacity: {
            inherit: true,
            ease: "easeOut",
            times: [0, start, end, 1],
          },
        },
        transitionEnd: {
          strokeDasharray: 0,
          strokeDashoffset: 0,
        },
      },
    };
  },
};
