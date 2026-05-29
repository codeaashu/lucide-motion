import type { Motion } from "../compose";
import type { ModeContext } from "../types";

/**
 * `chart-column-stacked` — two stacked columns (each: rounded `<rect>`
 * with one horizontal divider stroke inside). The icon has four
 * non-axes elements that need to wave in as TWO units, not four:
 * left column (rect + its divider) fires first, right column fires
 * after the stagger.
 *
 * The generic `chartBarsHorizontal` + `chartRectBars` pairing
 * staggered each of the four elements separately, producing a
 * jittery cascade that read divider-first-then-rect instead of
 * column-by-column. This bespoke motion groups by x: anything left
 * of x=12 is the left column, anything right is the right column.
 *
 * Both rects and dividers contract `scaleY` toward y=17 (the columns'
 * shared bottom edge) so each column compresses into its base before
 * springing back. The divider rides exactly with its parent rect.
 *
 * Signature pivots at `"12px 17px"`.
 */
function elementX(ctx: ModeContext): number {
  if (ctx.pathTag === "rect") {
    return Number(ctx.pathAttrs.x);
  }
  const match = String(ctx.pathAttrs.d).match(/^M(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : 12;
}

const COLUMN_RECT_XS = new Set([7, 15]);
const COLUMN_DIVIDER_DS = new Set(["M11 13H7", "M19 9h-4"]);

export const chartStackedColumns: Motion = {
  matches: (ctx: ModeContext) => {
    if (ctx.pathTag === "rect") {
      return COLUMN_RECT_XS.has(Number(ctx.pathAttrs.x));
    }
    if (ctx.pathTag === "path") {
      return COLUMN_DIVIDER_DS.has(String(ctx.pathAttrs.d));
    }
    return false;
  },
  factory: (ctx) => {
    const columnIdx = elementX(ctx) < 12 ? 0 : 1;
    return {
      rest: { scaleY: 1, opacity: 1 },
      active: {
        scaleY: [1, 0.55, 1, 1],
        opacity: [1, 0.45, 1, 1],
        transition: {
          duration: ctx.duration,
          delay: ctx.delay + columnIdx * ctx.stagger,
          repeat: ctx.repeat,
          scaleY: {
            inherit: true,
            ease: "easeInOut",
            times: [0, 0.28, 0.6, 1],
          },
          opacity: {
            inherit: true,
            ease: "easeInOut",
            times: [0, 0.28, 0.6, 1],
          },
        },
      },
    };
  },
};
