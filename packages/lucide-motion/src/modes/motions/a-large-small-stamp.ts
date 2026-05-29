import { matchAnyPath, type Motion } from "../compose";
import { TYPEWRITER_STAMP_KEYFRAMES } from "./typewriter-stamp";

/**
 * `a-large-small` — small `a` and large `A`, each composed of a
 * triangle outline + a horizontal crossbar.
 *
 * Two fixes layered onto the basic typewriter stamp:
 *
 * 1. **Per-glyph grouping**: triangle and crossbar of each letter
 *    share the SAME delay so the crossbar stamps WITH its parent
 *    letter (not staggered by `ctx.index` alone).
 * 2. **Per-glyph pivot**: each letter's paths share a
 *    `transformOrigin` at the letter's own centre (small `a` at
 *    ~(18.5, 12), large `A` at ~(6.5, 11.5)) so the scale dip
 *    shrinks each letter toward its own middle as one unit, instead
 *    of pulling both paths toward the icon centre (12, 12) and
 *    making the crossbar drift relative to its triangle.
 *
 * Resolved against the engine's view-box `transformBox` (same
 * pattern as `cog-gear`'s `COG_CENTERS`).
 *
 * Small `a` stamps first, large `A` follows after the 0.14s
 * stagger.
 */
function glyphGroup(d: string): 0 | 1 {
  if (d.startsWith("m15 ") || d.startsWith("M15")) return 0;
  return 1;
}

const GROUP_PIVOT: [string, string] = [
  "18.5px 12px", // small a centre
  "6.5px 11.5px", // large A centre
];

const GLYPH_STAGGER = 0.14;

export const aLargeSmallStamp: Motion = {
  matches: matchAnyPath,
  factory: (ctx) => {
    const group = glyphGroup(String(ctx.pathAttrs.d));
    const origin = GROUP_PIVOT[group];
    return {
      rest: { y: 0, scale: 1, opacity: 1, transformOrigin: origin },
      active: {
        y: [0, 1, 0],
        scale: TYPEWRITER_STAMP_KEYFRAMES.scale,
        opacity: TYPEWRITER_STAMP_KEYFRAMES.opacity,
        transformOrigin: origin,
        transition: {
          duration: ctx.duration,
          delay: ctx.delay + group * GLYPH_STAGGER,
          repeat: ctx.repeat,
          y: {
            inherit: true,
            ease: "easeInOut",
            times: TYPEWRITER_STAMP_KEYFRAMES.times,
          },
          scale: {
            inherit: true,
            ease: "easeInOut",
            times: TYPEWRITER_STAMP_KEYFRAMES.times,
          },
          opacity: {
            inherit: true,
            ease: "easeInOut",
            times: TYPEWRITER_STAMP_KEYFRAMES.times,
          },
        },
      },
    };
  },
};
