import { matchAnyPath, type Motion } from "../compose";
import { SEARCH_LOUPE_KEYFRAMES } from "./search-loupe";

/**
 * Search-family wildcard reveal — a delayed stroke draw-in plus the
 * host `searchScan` rotation so every state-marker path inside a
 * search variant draws onto the loupe and then tilts cohesively with
 * the wobble. Catches whatever's left after `searchScan` claims the
 * loupe circle + handle: the check tick, the × strokes, the slash,
 * the code brackets, the alert stem and dot.
 *
 * Treats every inner glyph as an External State Marker per project
 * memory `feedback_state_markers_are_external.md` — even the code
 * brackets, which earlier rode the wobble rigidly under the older
 * "contained payload" framing.
 *
 * Animates `strokeDashoffset` against a measured `ctx.pathLength`
 * instead of Motion's `pathLength` shortcut (which leaves
 * `pathLength="1"` + `stroke-dasharray="1 1"` on the DOM at rest).
 * `transitionEnd` resets both dash attrs to 0 after the play so the
 * rest state stays dash-free. See `src/modes/draw.ts` and
 * `bell-modifier-reveal.ts` for the canonical pattern.
 *
 * Rotate inherits the host `searchScan` wobble directly — search is
 * an in-plane uniform rotation, so direct inheritance preserves the
 * marker's shape (per principle 2).
 *
 * Place this last in the compose `motions` list so the loupe + handle
 * are claimed by `searchScan` first; whatever remains is the marker.
 */
export const searchModifierReveal: Motion = {
  matches: matchAnyPath,
  factory: (ctx) => ({
    rest: {
      strokeDasharray: 0,
      strokeDashoffset: 0,
      opacity: 1,
      rotate: 0,
    },
    active: {
      strokeDasharray: ctx.pathLength,
      strokeDashoffset: [ctx.pathLength, ctx.pathLength, 0],
      opacity: [0, 0, 1],
      rotate: SEARCH_LOUPE_KEYFRAMES.rotate,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        repeat: ctx.repeat,
        strokeDasharray: { duration: 0 },
        strokeDashoffset: { inherit: true, ease: "easeOut", times: [0, 0.2, 0.55] },
        opacity: { inherit: true, ease: "easeOut", times: [0, 0.2, 0.55] },
        rotate: {
          inherit: true,
          ease: "easeInOut",
          times: SEARCH_LOUPE_KEYFRAMES.times,
        },
      },
      transitionEnd: {
        strokeDasharray: 0,
        strokeDashoffset: 0,
      },
    },
  }),
};
