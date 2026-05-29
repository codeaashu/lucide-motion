import type { Motion } from "../compose";
import type { ModeContext } from "../types";

/**
 * Code chevron pair `</>` — the two bracket strokes Lucide uses to
 * mean "code" across the catalog. Each composite has a unique pair
 * of `d`-strings, but the gesture is universal: the brackets pinch
 * inward toward each other (like typing brackets being matched up)
 * and then return. Translate-only on the x axis so there's no pivot
 * dependency — the motion drops cleanly into any composite
 * signature regardless of its `transformOrigin`.
 *
 * Left bracket `<` translates `x` positively (rightward); right
 * bracket `>` translates `x` negatively (leftward). The factory
 * looks up which side each `d` belongs to via the `LEFT_BRACKET_DS`
 * / `RIGHT_BRACKET_DS` sets.
 *
 * Exports `CODE_SYMBOL_KEYFRAMES` so the `code-xml` forward slash
 * can phase-lock its dim to the same pinch cadence.
 *
 * Place this FIRST in any code-bearing signature so the chevrons
 * are claimed by the pinch before the host family modifier-reveal
 * (or `searchModifierReveal`) would draw them on as state markers.
 *
 * Per-iconName host coupling for cohesion in axis-asymmetric host
 * transforms (folder hinging, message bubble nodding, search loupe
 * wobbling) can be retrofitted later by adding a `HOST_INHERIT`
 * lookup — same pattern as `cogGear`'s `COG_CENTERS`. Today's
 * baseline is anchorless pinch + opacity dim, matching the cog /
 * lock / pen subjects.
 */
export const CODE_SYMBOL_KEYFRAMES: {
  opacity: number[];
  times: number[];
} = {
  opacity: [1, 0.78, 1],
  times: [0, 0.4, 1],
};

const LEFT_BRACKET_DS = new Set<string>([
  // Standalone
  "m8 6-6 6 6 6", // code
  "m6 8-4 4 4 4", // code-xml
  // Composites
  "M10 12.5 8 15l2 2.5", // file-code
  "m5 16-3 3 3 3", // file-code-corner
  "M10 10.5 8 13l2 2.5", // folder-code
  "m10 9-3 3 3 3", // message-circle-code, square-code
  "m10 8-3 3 3 3", // message-square-code
  "M10 9.5 8 12l2 2.5", // square-dashed-bottom-code
  "M9 8.5 7 11l2 2.5", // search-code
]);

const RIGHT_BRACKET_DS = new Set<string>([
  // Standalone
  "m16 18 6-6-6-6", // code
  "m18 16 4-4-4-4", // code-xml
  // Composites
  "m14 12.5 2 2.5-2 2.5", // file-code
  "m9 22 3-3-3-3", // file-code-corner
  "m14 10.5 2 2.5-2 2.5", // folder-code
  "m14 15 3-3-3-3", // message-circle-code, square-code
  "m14 14 3-3-3-3", // message-square-code
  "m14 9.5 2 2.5-2 2.5", // square-dashed-bottom-code
  "m13 13.5 2-2.5-2-2.5", // search-code
]);

function bracketSide(ctx: ModeContext): 0 | 1 | -1 {
  if (ctx.pathTag !== "path") return 0;
  const d = String(ctx.pathAttrs.d);
  if (LEFT_BRACKET_DS.has(d)) return 1;
  if (RIGHT_BRACKET_DS.has(d)) return -1;
  return 0;
}

export const codeSymbol: Motion = {
  matches: (ctx: ModeContext) => bracketSide(ctx) !== 0,
  factory: (ctx) => {
    const direction = bracketSide(ctx);
    return {
      rest: { x: 0, opacity: 1 },
      active: {
        x: [0, direction * 0.8, 0],
        opacity: CODE_SYMBOL_KEYFRAMES.opacity,
        transition: {
          duration: ctx.duration,
          delay: ctx.delay,
          repeat: ctx.repeat,
          x: {
            inherit: true,
            ease: "easeInOut",
            times: CODE_SYMBOL_KEYFRAMES.times,
          },
          opacity: {
            inherit: true,
            ease: "easeInOut",
            times: CODE_SYMBOL_KEYFRAMES.times,
          },
        },
      },
    };
  },
};
