import { matchPathDOneOf, type Motion } from "../compose";

/**
 * Message-circle body — the host motion for every icon built around
 * the Lucide round speech bubble (12 icons today: `message-circle`,
 * `message-circle-{check,code,dashed,heart,more,off,plus,question-
 * mark,reply,warning,x}`).
 *
 * The standard round-bubble outline is shared across 10 variants
 * (one path with the tail at the bottom-left). `message-circle-off`
 * splits the bubble into a lower fragment carrying the tail and an
 * upper-right arc fragment around the diagonal slash. `message-
 * circle-dashed` fragments the entire outline into 8 short arcs,
 * including the tail piece.
 *
 * **Real-life referent — speech bubble nodding while talking.** Same
 * gesture as `messageSquareBody` (the canonical speech-bubble
 * cadence) — the tail at the bottom-left (~3, 22) is the speaker's
 * mouth and the bubble nods slightly while it stays planted.
 *
 * Pivot at `(3, 22)` — the tail tip. Damped ±3° rock with a phase-
 * locked opacity dip so the bubble shimmers as it nods.
 *
 * ViewBox safety. The bubble's furthest point from the pivot is the
 * top-right cap at ≈ (22, 2), radius ≈ 27.6. At ±3° the orthogonal
 * displacement is ≈ 1.44; with stroke radius 1 the outer edge sits
 * around (20.95, 2.97) — inside the 24×24 viewBox.
 *
 * Sub-icons inherit BOTH rotate and opacity via the family modifier-
 * reveal (principle 2 — cohesion).
 *
 * Exports `MESSAGE_CIRCLE_BODY_KEYFRAMES` so the family modifier-
 * reveal can inherit both curves directly.
 *
 * Closed cycle: every keyframe array starts AND ends at the rest
 * value (principle 4).
 */
const MESSAGE_CIRCLE_BODY_PATHS = [
  // Standard outline — 10 variants share this single path
  "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",
  // message-circle-off — lower fragment with the tail
  "M4.929 4.929a10 10 0 0 0-1.938 11.412 2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 0 0 11.302-1.989",
  // message-circle-off — upper-right arc fragment
  "M8.35 2.69A10 10 0 0 1 21.3 15.65",
  // message-circle-dashed — 8 arc + tail fragments
  "M10.1 2.182a10 10 0 0 1 3.8 0",
  "M13.9 21.818a10 10 0 0 1-3.8 0",
  "M17.609 3.72a10 10 0 0 1 2.69 2.7",
  "M2.182 13.9a10 10 0 0 1 0-3.8",
  "M20.28 17.61a10 10 0 0 1-2.7 2.69",
  "M21.818 10.1a10 10 0 0 1 0 3.8",
  "M3.721 6.391a10 10 0 0 1 2.7-2.69",
  "m6.163 21.117-2.906.85a1 1 0 0 1-1.236-1.169l.965-2.98",
];

const matchBody = matchPathDOneOf(...MESSAGE_CIRCLE_BODY_PATHS);

export const MESSAGE_CIRCLE_BODY_KEYFRAMES = {
  // Damped left-right nod around the tail tip (3, 22).
  rotate: [0, -3, 2, -1, 0],
  // Opacity shimmer phase-locked to the nod apexes.
  opacity: [1, 0.78, 1, 0.9, 1],
  times: [0, 0.25, 0.5, 0.75, 1],
};

export const messageCircleBody: Motion = {
  matches: matchBody,
  factory: (ctx) => ({
    rest: { rotate: 0, opacity: 1 },
    active: {
      rotate: MESSAGE_CIRCLE_BODY_KEYFRAMES.rotate,
      opacity: MESSAGE_CIRCLE_BODY_KEYFRAMES.opacity,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay,
        repeat: ctx.repeat,
        ease: "easeInOut",
        times: MESSAGE_CIRCLE_BODY_KEYFRAMES.times,
      },
    },
  }),
};
