import type { Motion } from "../compose";
import type { ModeContext } from "../types";

/**
 * `chart-bar-stacked` — two stacked horizontal bars (each: rounded
 * `<rect>` with one vertical divider stroke inside). Sister to
 * `chartStackedColumns`: groups the four non-axes elements into TWO
 * bars by y, so top bar (rect + its divider) fires first and bottom
 * bar follows after the stagger.
 *
 * Both rects and dividers contract `scaleX` toward x=7 (the bars'
 * shared left edge) so each bar compresses into the y-axis before
 * springing back. The divider rides exactly with its parent rect.
 *
 * Signature pivots at `"7px 12px"`.
 */
function elementY(ctx: ModeContext): number {
  if (ctx.pathTag === "rect") {
    return Number(ctx.pathAttrs.y);
  }
  const match = String(ctx.pathAttrs.d).match(/^M\d+(?:\.\d+)? (\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : 12;
}

const BAR_RECT_YS = new Set([5, 13]);
const BAR_DIVIDER_DS = new Set(["M11 13v4", "M15 5v4"]);

export const chartStackedBars: Motion = {
  matches: (ctx: ModeContext) => {
    if (ctx.pathTag === "rect") {
      return BAR_RECT_YS.has(Number(ctx.pathAttrs.y));
    }
    if (ctx.pathTag === "path") {
      return BAR_DIVIDER_DS.has(String(ctx.pathAttrs.d));
    }
    return false;
  },
  factory: (ctx) => {
    // Top bar (y < 10) fires first, bottom bar after stagger.
    const barIdx = elementY(ctx) < 10 ? 0 : 1;
    return {
      rest: { scaleX: 1, opacity: 1 },
      active: {
        scaleX: [1, 0.55, 1, 1],
        opacity: [1, 0.45, 1, 1],
        transition: {
          duration: ctx.duration,
          delay: ctx.delay + barIdx * ctx.stagger,
          repeat: ctx.repeat,
          scaleX: {
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
