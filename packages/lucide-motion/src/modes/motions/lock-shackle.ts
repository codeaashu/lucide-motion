import { matchPathDOneOf, type Motion } from "../compose";

/**
 * Lock shackle — the U-shaped arc above the lock body that arcs up
 * and over to clamp the body shut. Canonical "lock test" gesture:
 * shackle gets pulled up briefly (someone tugging on the lock to
 * verify it's secure) then snaps back to its rest position. Reads
 * for both the closed and open variants — the open shackle is
 * already lifted, but the gesture of "lifting + returning" still
 * reads as the lock being interacted with.
 *
 * Translate-only (`y: [0, -0.6, 0]`) so it's anchor-free — works in
 * any signature regardless of `transformOrigin`. Composite badge
 * shackles (small 5-unit body) and standalone shackles (full 11/12-
 * unit body) both look right at -0.6 user units: ~5% pull on
 * standalone, ~12% on composite — subtle on both.
 *
 * Exports `LOCK_SHACKLE_KEYFRAMES` so the body and keyhole can
 * phase-lock their opacity/scale dip to the pull apex.
 *
 * Place this and `lockBody`/`lockKeyhole` FIRST in any lock-bearing
 * composite's compose list so they claim the shackle/body/keyhole
 * before the host family modifier-reveal would draw them on as state
 * markers.
 */
export const LOCK_SHACKLE_KEYFRAMES: {
  y: number[];
  times: number[];
} = {
  y: [0, -0.6, 0],
  times: [0, 0.35, 1],
};

const LOCK_SHACKLE_DS = [
  // Standalone — closed
  "M7 11V7a5 5 0 0 1 10 0v4",
  // Standalone lock-open — tilted-open shackle
  "M7 11V7a5 5 0 0 1 9.9-1",
  // lock-keyhole — closed
  "M7 10V7a5 5 0 0 1 10 0v3",
  // lock-keyhole-open — tilted-open
  "M7 10V7a5 5 0 0 1 9.33-2.5",
  // Composite badge shackles (one per host position; add new rows
  // alongside COG_CENTERS-style additions when authoring families)
  "M20 17v-2a2 2 0 1 0-4 0v2", // folder-lock, door-closed-locked
  "M20 15v-2a2 2 0 0 0-4 0v2", // message-square-lock
  "M18 6V4a2 2 0 1 0-4 0v2", // book-lock
  "M9 17v-2a2 2 0 0 0-4 0v2", // file-lock
  "M20 6V4a2 2 0 1 0-4 0v2", // earth-lock, globe-lock
  "M19 16v-2a2 2 0 0 0-4 0v2", // user-lock
];

export const lockShackle: Motion = {
  matches: matchPathDOneOf(...LOCK_SHACKLE_DS),
  factory: (ctx) => ({
    rest: { y: 0 },
    active: {
      y: LOCK_SHACKLE_KEYFRAMES.y,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay,
        repeat: ctx.repeat,
        ease: "easeInOut",
        times: LOCK_SHACKLE_KEYFRAMES.times,
      },
    },
  }),
};
