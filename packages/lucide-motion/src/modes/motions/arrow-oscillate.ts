import { matchAnyPath, type Motion } from "../compose";

/**
 * Bidirectional arrow per-arrow motion — for `arrow-up-down`,
 * `arrow-down-up`, `arrow-left-right`, `arrow-right-left`. Each
 * icon has two arrows pointing in opposite directions; each arrow
 * nudges in ITS OWN direction so the two halves of the icon travel
 * apart and snap back together. Reads as the icon actively
 * demonstrating bidirectional flow, not just oscillating.
 *
 * Horizontal-layout variants (`arrow-left-right`, `arrow-right-left`)
 * split top vs bottom (y < 12 → top half). Vertical-layout variants
 * (`arrow-up-down`, `arrow-down-up`) split left vs right (x < 12 →
 * left half).
 *
 * Per-arrow direction by icon:
 *
 * - `arrow-left-right` — top arrow (left-pointing) nudges LEFT,
 *   bottom arrow (right-pointing) nudges RIGHT.
 * - `arrow-right-left` — top (right) nudges RIGHT, bottom (left)
 *   nudges LEFT.
 * - `arrow-up-down` — left arrow (up-pointing) nudges UP, right
 *   arrow (down-pointing) nudges DOWN.
 * - `arrow-down-up` — left (down) nudges DOWN, right (up) nudges UP.
 *
 * Group detection: parse the first M-coordinate from the path d.
 * If absent (which would only happen for an unexpected element),
 * fall back to no nudge.
 *
 * Anchorless translate per path — no pivot dependency.
 *
 * Closed cycle per principle 4 — x and y both start AND end at 0.
 */
type Vec2 = [number, number];

// Per-icon: [firstHalfDir, secondHalfDir]
// firstHalf = top (horizontal layout) or left (vertical layout)
const PER_ARROW_DIRECTIONS: Record<string, [Vec2, Vec2]> = {
  "arrow-left-right": [
    [-1.2, 0], // top arrow points LEFT
    [1.2, 0], // bottom arrow points RIGHT
  ],
  "arrow-right-left": [
    [1.2, 0], // top points RIGHT
    [-1.2, 0], // bottom points LEFT
  ],
  "arrow-up-down": [
    [0, -1.2], // left arrow points UP
    [0, 1.2], // right arrow points DOWN
  ],
  "arrow-down-up": [
    [0, 1.2], // left points DOWN
    [0, -1.2], // right points UP
  ],
};

const HORIZONTAL_LAYOUT = new Set(["arrow-left-right", "arrow-right-left"]);

const parseFirstCoord = (d: string): Vec2 | null => {
  const m = d.match(/^[mM]\s*(-?\d+(?:\.\d+)?)[\s,]+(-?\d+(?:\.\d+)?)/);
  if (!m) return null;
  return [Number(m[1]), Number(m[2])];
};

export const arrowOscillate: Motion = {
  matches: matchAnyPath,
  factory: (ctx) => {
    const dirs = PER_ARROW_DIRECTIONS[ctx.iconName];
    let dx = 0;
    let dy = 0;
    if (dirs) {
      const coord = parseFirstCoord(String(ctx.pathAttrs.d ?? ""));
      const splitVal = coord
        ? HORIZONTAL_LAYOUT.has(ctx.iconName)
          ? coord[1]
          : coord[0]
        : 0;
      const isFirstHalf = splitVal < 12;
      [dx, dy] = isFirstHalf ? dirs[0] : dirs[1];
    }
    return {
      rest: { x: 0, y: 0 },
      active: {
        x: [0, dx, 0],
        y: [0, dy, 0],
        transition: {
          duration: ctx.duration,
          delay: ctx.delay,
          repeat: ctx.repeat,
          x: { inherit: true, ease: "easeInOut", times: [0, 0.4, 1] },
          y: { inherit: true, ease: "easeInOut", times: [0, 0.4, 1] },
        },
      },
    };
  },
};
