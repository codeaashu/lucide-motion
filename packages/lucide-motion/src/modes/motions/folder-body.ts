import { matchPathDOneOf, type Motion } from "../compose";

/**
 * Folder body — the host motion for every icon built around the
 * Lucide folder shape (30 icons today). The closed-folder outline
 * comes in two canonical spellings plus many reshaped variants
 * (each composite that inset-cuts the body for a badge); the open
 * folder in `folder-open` / `folder-open-dot` is two more d's. All
 * routed through the same motion.
 *
 * **Real-life referent — folder hinging open at its bottom edge.**
 * The signature gesture is a 3D `rotateX` tilt around the folder's
 * bottom edge — the folder hinges away from the viewer like a flap
 * lifting backward. With `transformPerspective: 600` the top tab,
 * the farthest point from the pivot, foreshortens dramatically and
 * visually retreats INTO the screen rather than just swinging in
 * the picture plane. Reads as the tab actually bending back.
 *
 * A `scaleY` contraction backs up the 3D effect for browsers that
 * don't fully honor SVG 3D transforms — top vertices compress
 * downward toward the bottom pivot, preserving the bend illusion
 * even without perspective.
 *
 * Pivot at `(12px, 20px)`: bottom-center of the standard folder
 * body. All paths in the icon share this pivot via the signature's
 * `transformOrigin`, so the body, payload glyphs, and markers all
 * tilt together as one 3D scene.
 *
 * ViewBox safety. The 3D foreshortening keeps everything inside
 * the viewBox at any peak angle — perspective always shrinks
 * apparent dimensions. The `scaleY` 0.92 contraction also stays
 * inside the rest box (contraction-only per principle 3).
 *
 * Sub-icons inherit BOTH `rotate` and `opacity` via the family
 * modifier-reveal so payloads (kanban bars, code chevrons, plus,
 * arrows, etc.) tilt and dim WITH the folder (principle 2 —
 * cohesion; monitor and mail are the existing precedents).
 *
 * Exports `FOLDER_BODY_KEYFRAMES` so the family modifier-reveal can
 * inherit both curves directly.
 *
 * Closed cycle: rotate and opacity both start AND end at rest.
 */
const FOLDER_BODY_PATHS = [
  // Standard closed folder — most variants
  "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
  // Standard closed folder — alternate spelling (folder-bookmark, folder-search-2)
  "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z",
  // Alternate canonical — used in folder-dot, folder-kanban, folder-root
  "M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z",
  // Reshaped bodies — corner cut for inset payloads
  "M20.9 19.8A2 2 0 0 0 22 18V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h5.1", // folder-archive
  "M7 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2", // folder-clock
  "M10.3 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.98a2 2 0 0 1 1.69.9l.66 1.2A2 2 0 0 0 12 6h8a2 2 0 0 1 2 2v3.3", // folder-cog
  "M9 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v5", // folder-git-2
  "M10.638 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v3.417", // folder-heart
  "M2 9V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1", // folder-input
  "M13 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v1.36", // folder-key
  "M10 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v2.5", // folder-lock
  "M2 7.5V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-1.5", // folder-output
  "M2 11.5V5a2 2 0 0 1 2-2h3.9c.7 0 1.3.3 1.7.9l.8 1.2c.4.6 1 .9 1.7.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-9.5", // folder-pen
  "M10.7 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v4.1", // folder-search
  "M2 9.35V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h7", // folder-symlink
  "M9 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v.5", // folder-sync
  // Open folders
  "m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2", // folder-open
  "m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2", // folder-open-dot
];

const matchBody = matchPathDOneOf(...FOLDER_BODY_PATHS);

export const FOLDER_BODY_KEYFRAMES = {
  // 3D tilt around the bottom edge: the folder hinges away from the
  // viewer so the top tab — the farthest point from the pivot —
  // recedes into the screen with perspective foreshortening. Reads
  // as the tab bending backward, not just shaking. Single beat to
  // peak then return, like opening to peek.
  rotateX: [0, -35, 0],
  // Slight scaleY backup so the bend still reads even in browsers
  // that don't honor SVG 3D transforms — top vertices visually
  // compress downward toward the pivot.
  scaleY: [1, 0.92, 1],
  // Opacity dim phase-locked so the surface reads as catching less
  // light when angled away.
  opacity: [1, 0.7, 1],
  times: [0, 0.4, 1],
};

export const folderBody: Motion = {
  matches: matchBody,
  factory: (ctx) => ({
    rest: { rotateX: 0, scaleY: 1, opacity: 1, transformPerspective: 600 },
    active: {
      rotateX: FOLDER_BODY_KEYFRAMES.rotateX,
      scaleY: FOLDER_BODY_KEYFRAMES.scaleY,
      opacity: FOLDER_BODY_KEYFRAMES.opacity,
      // Perspective constant — small value (relative to icon size)
      // produces visible foreshortening on a 24px-tall folder.
      transformPerspective: 600,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay,
        repeat: ctx.repeat,
        ease: "easeInOut",
        times: FOLDER_BODY_KEYFRAMES.times,
      },
    },
  }),
};
