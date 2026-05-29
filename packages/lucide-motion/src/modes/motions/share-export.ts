import { matchPathDOneOf, type Motion } from "../compose";

/**
 * The arrow-out-of-box gesture in standalone `share` (the upload /
 * export icon, distinct from `share-2`'s 3-node graph). Two arrow
 * paths (shaft + head) lift up briefly out of the box and snap back.
 *
 * Anchorless `y` translate so there's no pivot dependency. The box
 * path (`M4 12v8...`) is intentionally NOT matched here — it stays
 * still while the arrow lifts.
 *
 * Closed cycle per principle 4.
 */
const SHARE_ARROW_DS = [
  // share shaft
  "M12 2v13",
  // share head
  "m16 6-4-4-4 4",
];

export const shareExport: Motion = {
  matches: matchPathDOneOf(...SHARE_ARROW_DS),
  factory: (ctx) => ({
    rest: { y: 0 },
    active: {
      y: [0, -1.5, 0],
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
