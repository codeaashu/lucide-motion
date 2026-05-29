import type { Motion } from "../compose";

/**
 * Sort-sweep for the two characters in the digit / letter sort
 * variants: `arrow-{up,down}-{0-1,1-0,a-z,z-a}`. Each character
 * stays visible at rest and briefly bobs TOWARD the middle of the
 * icon in cascade sequence — top character bobs DOWN, bottom
 * character bobs UP — like the sort cursor is sweeping through
 * them in the arrow's direction. Each character also pulses
 * opacity at its peak, like getting picked up by the sort.
 *
 * Cascade direction matches the arrow:
 *
 * - `arrow-down-*` — top character bobs first, bottom second.
 * - `arrow-up-*` — bottom bobs first, top second.
 *
 * Each character is a group of 1+ elements (`"0"` is a `<rect>`;
 * `"1"`, `"A"`, `"Z"` are 1-2 `<path>`s). All elements of a
 * character share the same slot (matched by their y-coordinate
 * group): y ≤ 12 → top group, y > 12 → bottom group.
 *
 * Two slots, each 0.4 wide of the cycle: slot 0 = `t ∈ [0, 0.4]`,
 * slot 1 = `t ∈ [0.4, 0.8]`. Both bobs done by `t = 0.8`, leaving
 * the rest of the cycle to settle.
 *
 * Movement is `±1.5` viewBox units — just enough to read as motion
 * without the two characters touching. `"0"` (a single rect) also
 * scales `[1, 0.85, 1]` for emphasis pivoted at its own fill-box
 * centre; path-based characters (`"1"`, `"A"`, `"Z"`) skip the
 * scale so the multi-stroke shape doesn't fragment at its joints.
 *
 * Place this FIRST in each digit/letter sort variant's compose
 * list so the characters are claimed before `arrowSortContent`'s
 * geometric predicate would treat them as static.
 *
 * Closed cycle: y, opacity, and (rect-only) scale all start AND end
 * at their rest values.
 */
const CHAR_SORT_ICONS = new Set([
  "arrow-down-0-1",
  "arrow-down-1-0",
  "arrow-down-a-z",
  "arrow-down-z-a",
  "arrow-up-0-1",
  "arrow-up-1-0",
  "arrow-up-a-z",
  "arrow-up-z-a",
]);

const firstYFromPath = (d: string): number | null => {
  const m = d.match(/^[mM]\s*-?\d+(?:\.\d+)?[\s,]+(-?\d+(?:\.\d+)?)/);
  return m ? Number(m[1]) : null;
};

const isCharElement = (ctx: {
  iconName: string;
  pathTag: string;
  pathAttrs: Record<string, string | number>;
}): boolean => {
  if (!CHAR_SORT_ICONS.has(ctx.iconName)) return false;
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

const cascadeSlot = (
  iconName: string,
  isTopGroup: boolean
): number => {
  const isDown = iconName.startsWith("arrow-down-");
  // arrow-down → top bobs first (slot 0), bottom second (slot 1)
  // arrow-up   → bottom bobs first (slot 0), top second (slot 1)
  if (isDown) return isTopGroup ? 0 : 1;
  return isTopGroup ? 1 : 0;
};

export const arrowSortChars: Motion = {
  matches: isCharElement,
  factory: (ctx) => {
    // Determine top vs bottom group by first y coordinate.
    let y: number | null = null;
    if (ctx.pathTag === "rect") {
      y = Number(ctx.pathAttrs.y ?? 0);
    } else if (ctx.pathTag === "path") {
      y = firstYFromPath(String(ctx.pathAttrs.d ?? ""));
    }
    const isTopGroup = y !== null && y <= 12;
    const slot = cascadeSlot(ctx.iconName, isTopGroup);
    const start = slot * 0.4;
    const peak = start + 0.2;
    const end = start + 0.4;

    // Top group bobs DOWN (+y) toward middle; bottom group bobs UP (-y).
    const yPeak = isTopGroup ? 1.5 : -1.5;

    if (ctx.pathTag === "rect") {
      return {
        rest: {
          y: 0,
          scale: 1,
          opacity: 1,
          transformBox: "fill-box",
          transformOrigin: "center",
        },
        active: {
          y: [0, 0, yPeak, 0, 0],
          scale: [1, 1, 0.85, 1, 1],
          opacity: [1, 1, 0.55, 1, 1],
          transformBox: "fill-box",
          transformOrigin: "center",
          transition: {
            duration: ctx.duration,
            delay: ctx.delay,
            repeat: ctx.repeat,
            y: {
              inherit: true,
              ease: "easeInOut",
              times: [0, start, peak, end, 1],
            },
            scale: {
              inherit: true,
              ease: "easeInOut",
              times: [0, start, peak, end, 1],
            },
            opacity: {
              inherit: true,
              ease: "easeInOut",
              times: [0, start, peak, end, 1],
            },
          },
        },
      };
    }

    // Path characters: y-translation + opacity only (skip scale so
    // multi-stroke shapes like the "1"'s vertical + base don't
    // fragment at their joints).
    return {
      rest: { y: 0, opacity: 1 },
      active: {
        y: [0, 0, yPeak, 0, 0],
        opacity: [1, 1, 0.55, 1, 1],
        transition: {
          duration: ctx.duration,
          delay: ctx.delay,
          repeat: ctx.repeat,
          y: {
            inherit: true,
            ease: "easeInOut",
            times: [0, start, peak, end, 1],
          },
          opacity: {
            inherit: true,
            ease: "easeInOut",
            times: [0, start, peak, end, 1],
          },
        },
      },
    };
  },
};
