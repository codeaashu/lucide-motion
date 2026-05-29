import { matchPathDOneOf, type Motion } from "../compose";

/**
 * Static-reference shapes for the arrow family — the reference
 * lines in `arrow-{up,down,left,right}-{from,to}-line` and the
 * destination dots in `arrow-{up-from,down-to}-dot`. These paths
 * represent the fixed endpoint that the arrow moves AWAY from or
 * TOWARD; they must stay anchored while the rest of the icon
 * glides.
 *
 * Caught BEFORE `arrowGlide` in the compose list so the wildcard
 * doesn't translate them with the arrow body. Carries a subtle
 * opacity dip for kinetic-life cohesion (principle 2) — without it
 * the static reference would feel disconnected from the gliding
 * arrow.
 *
 * Closed cycle: opacity starts AND ends at 1.
 */
const STATIC_LINE_PATHS = [
  // Top edge lines
  "M19 3H5", // arrow-down-from-line
  "M5 3h14", // arrow-up-to-line
  // Bottom edge lines
  "M19 21H5", // arrow-down-to-line
  "M5 21h14", // arrow-up-from-line
  // Right edge lines (vertical)
  "M21 19V5", // arrow-left-from-line
  "M21 5v14", // arrow-right-to-line
  // Left edge lines (vertical)
  "M3 19V5", // arrow-left-to-line
  "M3 5v14", // arrow-right-from-line
];

const matchStaticLine = matchPathDOneOf(...STATIC_LINE_PATHS);

const isStaticDot = (ctx: {
  pathTag: string;
  pathAttrs: Record<string, string | number>;
}) =>
  ctx.pathTag === "circle" &&
  String(ctx.pathAttrs.cx) === "12" &&
  String(ctx.pathAttrs.cy) === "21" &&
  String(ctx.pathAttrs.r) === "1";

export const arrowStaticRef: Motion = {
  matches: (ctx) => matchStaticLine(ctx) || isStaticDot(ctx),
  factory: (ctx) => ({
    rest: { opacity: 1 },
    active: {
      opacity: [1, 0.7, 1],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay,
        repeat: ctx.repeat,
        ease: "easeInOut",
        times: [0, 0.4, 1],
      },
    },
  }),
};
