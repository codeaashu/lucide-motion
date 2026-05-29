import { matchPathDOneOf, type Motion } from "../compose";

/**
 * File envelope — the host motion for every icon built around the
 * Lucide file shape (50 icons today: `file`, `file-text`, `file-code`,
 * `file-search`, `file-archive`, ..., plus `shredder`). Two anatomical
 * roles, matched per-path:
 *
 * - **Body** — the outer rectangle outline. Lucide reshapes it across
 *   composites where a badge cuts into the file (e.g. `file-clock`,
 *   `file-lock`, `file-search-corner`), so the registry below lists
 *   every observed shape. All 27 variants share the same gentle
 *   paper-settle motion.
 * - **Corner** — the folded triangle at top-right (`M14 2v5a1 1 0 0 0
 *   1 1h5`), identical across all 50 host icons. Does a dog-ear
 *   peel-down: small clockwise rotate around its hinge at (14, 2) so
 *   the corner tucks INWARD toward the page body (positive rotate in
 *   CSS = visually CW). Peeling outward would push the L's endpoint
 *   beyond the body's diagonal edge — the fold indicator would
 *   visibly detach from the outline. Peeling inward keeps every point
 *   of the L inside the body shape.
 *
 * **Real-life physics**: a piece of paper. The body settles subtly
 * (a hair of vertical bob, as if the page is landing on a desk); the
 * corner does its own dog-ear flick. Both share the same y bob
 * keyframe so the fold pivot (14, 2) stays attached to the body's
 * top-right corner — scaling the body would pull that pivot inward
 * and the L's stroke cap would visibly detach from the outline.
 *
 * Exports `FILE_ENVELOPE_KEYFRAMES` so future file-family motions
 * (badge subjects, state-marker reveals) can inherit the same timing
 * via per-value `inherit: true` and stay phase-locked with the host
 * (principle 2 — host coupling).
 *
 * Closed cycle: every keyframe array starts AND ends at the rest
 * value (principle 4).
 */
const FILE_CORNER_D = "M14 2v5a1 1 0 0 0 1 1h5";

// Pivot point: the fold hinge sits at (14, 2) — top-left of the corner
// triangle, where the page would crease in real life. Rotating around
// this point keeps the corner anchored to the body so the flick reads
// as "the corner lifts" rather than "the corner detaches and spins."
const FILE_CORNER_PIVOT = "14px 2px";

// Every body shape that pairs with the standard corner d. Canonical
// full-envelope first (23 hosts); the 26 partial variants follow,
// each used by exactly one composite where Lucide cuts the body to
// make room for an inset badge.
const FILE_BODY_PATHS = [
  // Canonical full envelope (file, file-text, file-code, file-search,
  // file-image, file-up, file-down, file-plus, file-minus, file-x,
  // file-check, file-chart-*, file-play, file-pen, file-user,
  // file-sliders, file-spreadsheet, file-type, file-terminal,
  // file-signal, file-braces, file-axis-3d)
  "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
  // Partial bodies (one per composite where a badge clips the body)
  "M13.659 22H18a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v11.5", // file-archive
  "M13 22h5a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v3.3", // file-badge
  "M14.5 22H18a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v3.8", // file-box
  "M14 22h4a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v6", // file-braces-corner
  "M15.941 22H18a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.704l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v3.512", // file-chart-pie
  "M10.5 22H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v6", // file-check-corner
  "M16 22h2a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v2.85", // file-clock
  "M4 12.15V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2h-3.35", // file-code-corner
  "M4 12V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2", // file-digit, file-video-camera
  "M4 6.835V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2h-.343", // file-headphone
  "M13 22h5a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v7", // file-heart
  "M4 11V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-1", // file-input
  "M9.65 22H18a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v4", // file-key
  "M4 9.8V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2h-3", // file-lock
  "M20 14V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12", // file-minus-corner
  "M11.65 22H18a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v10.35", // file-music
  "M4.226 20.925A2 2 0 0 0 6 22h12a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v3.127", // file-output
  "M12.659 22H18a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v9.34", // file-pen
  "M11.35 22H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v5.35", // file-plus-corner
  "M20 10V8a2.4 2.4 0 0 0-.706-1.704l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h4.35", // file-scan
  "M11.1 22H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.589 3.588A2.4 2.4 0 0 1 20 8v3.25", // file-search-corner
  "M4 11V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h7", // file-symlink
  "M12 22h6a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v6", // file-type-corner
  "M4 11.55V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2h-1.95", // file-volume
  "M11 22H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v5", // file-x-corner
  "M4 13V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v6", // shredder (the file the blades shred)
];

const matchFileBody = matchPathDOneOf(...FILE_BODY_PATHS);

/**
 * Shared timing for the host envelope. Other file-family motions can
 * inherit these values via per-value `inherit: true` to phase-lock
 * with the body's settle and the corner's flick.
 */
export const FILE_ENVELOPE_KEYFRAMES = {
  // Body: paper-settle as a rigid y bob (no scale). Scaling the body
  // around the icon center would pull the (14, 2) corner inward by
  // ~0.04 px and up by ~0.2 px, breaking the body's seam with the
  // L's pivot, which doesn't scale — the L's stroke cap then visibly
  // pokes above the body's outline at the top of the fold. Keeping
  // the body rigid and only translating it preserves the seam.
  bodyY: [0, 0.3, 0],
  // Corner: dog-ear peel-down. +10° (clockwise in CSS) around the
  // fold hinge tucks the L inward toward the page body. ViewBox-safe
  // and visually-bounded — endpoint (20, 8) reaches roughly
  // (18.87, 8.95) at peak, and every point of the L stays inside the
  // body's diagonal edge. Peel-up (negative) was the original choice
  // but pushed the endpoint beyond the body outline.
  cornerRotate: [0, 10, 0],
  // Shared timing for both body and corner so they read as one
  // coordinated gesture.
  times: [0, 0.4, 1],
};

export const fileEnvelope: Motion = {
  matches: (ctx) =>
    ctx.pathTag === "path" &&
    (ctx.pathAttrs.d === FILE_CORNER_D || matchFileBody(ctx)),
  factory: (ctx) => {
    const isCorner = ctx.pathAttrs.d === FILE_CORNER_D;
    if (isCorner) {
      return {
        rest: {
          rotate: 0,
          y: 0,
          transformBox: "view-box",
          transformOrigin: FILE_CORNER_PIVOT,
        },
        active: {
          rotate: FILE_ENVELOPE_KEYFRAMES.cornerRotate,
          // Corner translates with the body so they settle together;
          // its rotate handles the dog-ear flick on its own pivot.
          y: FILE_ENVELOPE_KEYFRAMES.bodyY,
          transformBox: "view-box",
          transformOrigin: FILE_CORNER_PIVOT,
          transition: {
            duration: ctx.duration,
            delay: ctx.delay,
            repeat: ctx.repeat,
            ease: "easeInOut",
            times: FILE_ENVELOPE_KEYFRAMES.times,
          },
        },
      };
    }
    // Body — rigid y bob (no scale). Sharing the same y keyframe as
    // the corner means the fold-pivot (14, 2) stays attached to the
    // body's top-right corner throughout the motion, so the L's
    // stroke cap never separates from the body outline.
    return {
      rest: { y: 0 },
      active: {
        y: FILE_ENVELOPE_KEYFRAMES.bodyY,
        transition: {
          duration: ctx.duration,
          delay: ctx.delay,
          repeat: ctx.repeat,
          ease: "easeInOut",
          times: FILE_ENVELOPE_KEYFRAMES.times,
        },
      },
    };
  },
};
