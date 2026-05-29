import type { Motion } from "../compose";

/**
 * Reference axis line for the align family — the path that
 * represents the alignment line itself (the horizontal or vertical
 * line that the boxes align to). Stays anchored at rest; a subtle
 * opacity dim provides kinetic-life cohesion with the cascading
 * boxes (principle 2).
 *
 * Detection: in align-* icons, any `<path>` without an arc (`a` or
 * `A`) command is a reference line — boxes are always either
 * `<rect>` elements or rounded `<path>`s with arcs at the corners.
 *
 * Placed BEFORE `alignBox` in each align signature so the line is
 * claimed before the box matcher would see it.
 *
 * Closed cycle: opacity ends at 1.
 */
const ALIGN_ICON_RE = /^align-/;

const hasArc = (d: string): boolean => /[aA]/.test(d);

export const alignReferenceLine: Motion = {
  matches: (ctx) => {
    if (!ALIGN_ICON_RE.test(ctx.iconName)) return false;
    if (ctx.pathTag !== "path") return false;
    return !hasArc(String(ctx.pathAttrs.d ?? ""));
  },
  factory: (ctx) => ({
    rest: { opacity: 1 },
    active: {
      opacity: [1, 0.7, 1],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay,
        repeat: ctx.repeat,
        ease: "easeInOut",
        times: [0, 0.5, 1],
      },
    },
  }),
};
