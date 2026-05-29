import type { Motion } from "../compose";

/**
 * Battery charge bars. The short vertical strokes are the visible
 * state-of-charge cells, so they stay visible and carry a voltage
 * ripple: each cell briefly sags toward the bottom baseline, dims,
 * then recovers in left-to-right order regardless of Lucide's
 * per-icon node order.
 */
export const BATTERY_CELL_KEYFRAMES = {
  scaleY: [1, 0.68, 1, 0.88, 1],
  opacity: [1, 0.42, 1, 0.72, 1],
};

const CELL_PATH_PATTERN = /^M(6|10|14) (?:10v4|14v-4)$/;

function cellX(d: string): number | null {
  const match = CELL_PATH_PATTERN.exec(d);
  return match ? Number(match[1]) : null;
}

function cellTimes(x: number): number[] {
  if (x === 6) return [0, 0.1, 0.34, 0.76, 1];
  if (x === 10) return [0, 0.24, 0.52, 0.82, 1];
  return [0, 0.38, 0.68, 0.88, 1];
}

export const batteryCellFill: Motion = {
  matches: (ctx) =>
    ctx.pathTag === "path" && cellX(String(ctx.pathAttrs.d)) !== null,
  factory: (ctx) => {
    const x = cellX(String(ctx.pathAttrs.d)) ?? 6;

    return {
      rest: {
        scaleY: 1,
        opacity: 1,
        transformBox: "view-box",
        transformOrigin: `${x}px 14px`,
      },
      active: {
        scaleY: BATTERY_CELL_KEYFRAMES.scaleY,
        opacity: BATTERY_CELL_KEYFRAMES.opacity,
        transformBox: "view-box",
        transformOrigin: `${x}px 14px`,
        transition: {
          duration: ctx.duration,
          delay: ctx.delay,
          repeat: ctx.repeat,
          scaleY: {
            inherit: true,
            ease: "easeInOut",
            times: cellTimes(x),
          },
          opacity: {
            inherit: true,
            ease: "easeInOut",
            times: cellTimes(x),
          },
        },
      },
    };
  },
};
