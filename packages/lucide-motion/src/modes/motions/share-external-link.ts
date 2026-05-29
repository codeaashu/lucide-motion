import { matchPathDOneOf, type Motion } from "../compose";

/**
 * The up-right "external link" arrow Lucide draws in
 * `message-square-share` (and the standard `external-link` /
 * `square-arrow-out-up-right` family, which aren't signed yet).
 * Two paths form the arrow: the L-shaped corner bracket and the
 * diagonal line. Both translate up-right briefly to read as "open
 * in a new place" and snap back.
 *
 * Anchorless x/y translate → no pivot dependency. Drops cleanly
 * into any composite signature (e.g. message-square-share inside
 * the bubble nod).
 */
const SHARE_EXTERNAL_ARROW_DS = [
  // message-square-share — L-bracket corner
  "M16 3h6v6",
  // message-square-share — diagonal line
  "m16 9 6-6",
];

export const shareExternalLink: Motion = {
  matches: matchPathDOneOf(...SHARE_EXTERNAL_ARROW_DS),
  factory: (ctx) => ({
    rest: { x: 0, y: 0 },
    active: {
      x: [0, 0.8, 0],
      y: [0, -0.8, 0],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay,
        repeat: ctx.repeat,
        ease: "easeOut",
        times: [0, 0.4, 1],
      },
    },
  }),
};
