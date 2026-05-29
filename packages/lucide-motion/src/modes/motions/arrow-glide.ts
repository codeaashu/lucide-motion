import { matchAnyPath, type Motion } from "../compose";

/**
 * Directional arrow glide — every cardinal and diagonal arrow icon
 * translates briefly in its named direction and snaps back. Canonical
 * "go this way" gesture.
 *
 * Anchorless translate (just `x` / `y`) → no pivot dependency, so the
 * same motion works for any arrow icon regardless of its
 * `transformOrigin`. The factory reads `ctx.iconName` and looks up
 * the direction in `ARROW_DIRECTIONS`; both paths of a given arrow
 * icon (shaft + head) translate together as a rigid unit.
 *
 * Used today by the standalone cardinal and diagonal arrows in the
 * `arrow-*` family plus the `move-*` family. Composite state-marker
 * arrows (`file-arrow-up`, `clock-arrow-down`, `circle-arrow-up`,
 * etc.) stay Tier 1 — they draw in via their host family's modifier-
 * reveal rather than gliding, since those tiny corner badges are
 * abstract state indicators, not standalone arrows.
 *
 * Diagonal arrows use 0.7 user units per axis (≈ cos/sin 45°) so the
 * total translation magnitude matches the cardinal 1.0.
 *
 * Closed cycle per principle 4 — x and y both start AND end at 0.
 */
const ARROW_DIRECTIONS: Record<string, [number, number]> = {
  // Cardinal + diagonal — original signed set
  "arrow-up": [0, -1],
  "arrow-down": [0, 1],
  "arrow-left": [-1, 0],
  "arrow-right": [1, 0],
  "arrow-up-right": [0.7, -0.7],
  "arrow-up-left": [-0.7, -0.7],
  "arrow-down-right": [0.7, 0.7],
  "arrow-down-left": [-0.7, 0.7],
  // Big arrows — same direction, slightly stronger nudge to match
  // their visual weight
  "arrow-big-up": [0, -1.5],
  "arrow-big-down": [0, 1.5],
  "arrow-big-left": [-1.5, 0],
  "arrow-big-right": [1.5, 0],
  "arrow-big-up-dash": [0, -1.5],
  "arrow-big-down-dash": [0, 1.5],
  "arrow-big-left-dash": [-1.5, 0],
  "arrow-big-right-dash": [1.5, 0],
  // From-line / to-line variants — arrow nudges in direction; the
  // reference line stays anchored via `arrowStaticRef` (placed
  // FIRST in the compose list so it claims the line before this
  // motion's matchAnyPath would).
  "arrow-up-from-line": [0, -1],
  "arrow-down-from-line": [0, 1],
  "arrow-left-from-line": [-1, 0],
  "arrow-right-from-line": [1, 0],
  "arrow-up-to-line": [0, -1],
  "arrow-down-to-line": [0, 1],
  "arrow-left-to-line": [-1, 0],
  "arrow-right-to-line": [1, 0],
  // From-dot / to-dot — same pattern, dot stays anchored
  "arrow-up-from-dot": [0, -1],
  "arrow-down-to-dot": [0, 1],
  // Move family — already-signed cardinal directions
  "move-up": [0, -1],
  "move-down": [0, 1],
  "move-left": [-1, 0],
  "move-right": [1, 0],
  // Move diagonals — corner L-bracket + diagonal stroke
  "move-up-right": [0.7, -0.7],
  "move-up-left": [-0.7, -0.7],
  "move-down-right": [0.7, 0.7],
  "move-down-left": [-0.7, 0.7],
  // Sort arrows — the arrow shaft + head on the LEFT side glides
  // in the indicated direction; the letter / number / divider
  // content on the RIGHT side stays anchored via `arrowSortContent`
  // (placed FIRST in the compose list so it claims the content
  // paths before this motion's matchAnyPath would translate them).
  "arrow-down-0-1": [0, 1.2],
  "arrow-down-1-0": [0, 1.2],
  "arrow-down-a-z": [0, 1.2],
  "arrow-down-z-a": [0, 1.2],
  "arrow-down-narrow-wide": [0, 1.2],
  "arrow-down-wide-narrow": [0, 1.2],
  "arrow-up-0-1": [0, -1.2],
  "arrow-up-1-0": [0, -1.2],
  "arrow-up-a-z": [0, -1.2],
  "arrow-up-z-a": [0, -1.2],
  "arrow-up-narrow-wide": [0, -1.2],
  "arrow-up-wide-narrow": [0, -1.2],
};

export const ARROW_GLIDE_KEYFRAMES: {
  times: number[];
} = {
  times: [0, 0.4, 1],
};

export const arrowGlide: Motion = {
  matches: matchAnyPath,
  factory: (ctx) => {
    const [dx, dy] = ARROW_DIRECTIONS[ctx.iconName] ?? [0, 0];
    return {
      rest: { x: 0, y: 0 },
      active: {
        x: [0, dx, 0],
        y: [0, dy, 0],
        transition: {
          duration: ctx.duration,
          delay: ctx.delay,
          repeat: ctx.repeat,
          x: {
            inherit: true,
            ease: "easeOut",
            times: ARROW_GLIDE_KEYFRAMES.times,
          },
          y: {
            inherit: true,
            ease: "easeOut",
            times: ARROW_GLIDE_KEYFRAMES.times,
          },
        },
      },
    };
  },
};
