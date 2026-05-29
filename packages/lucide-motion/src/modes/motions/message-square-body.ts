import { matchPathDOneOf, type Motion } from "../compose";

/**
 * Message-square body — the host motion for every icon built around
 * the Lucide square speech bubble (17 icons today: `message-square`,
 * `message-square-{check,code,dashed,diff,dot,heart,lock,more,off,
 * plus,quote,reply,share,text,warning,x}`).
 *
 * The standard bubble outline is shared across 12 variants — two
 * spellings (`A.71.71` and `A.7.7`) that render identically. Three
 * variants reshape it where a payload cuts into the body
 * (`message-square-dot`, `message-square-lock`, `message-square-
 * share`), `message-square-off` splits it into two casing fragments
 * around the diagonal strike-through, and `message-square-dashed`
 * fragments the entire outline into ten short dashed segments.
 *
 * **Real-life referent — speech bubble nodding while talking.** A
 * speech bubble's defining feature is the tail at the bottom-left
 * (around `(3, 22)`) where the speaker's "voice" emerges. The
 * characteristic motion is a slight rotation around that tail tip —
 * the bubble nods animatedly while the tail stays planted at the
 * speaker's mouth. Reads as the bubble "speaking," not "wobbling in
 * space."
 *
 * Pivot at `(3, 22)` — the tail tip. Damped ±3° rock with a phase-
 * locked opacity dip so the bubble shimmers slightly as it nods.
 *
 * ViewBox safety. The bubble's top-right corner sits at (22, 3),
 * distance ≈ 26.87 from the pivot. At ±3° rotation it moves to at
 * most (23.0, 4.0) or (21.0, 2.0); with stroke radius 1 the outer
 * edge lands at y ≈ 1.03 / x ≈ 24.0 — inside the 24×24 viewBox.
 *
 * Sub-icons inherit BOTH rotate and opacity via the family
 * modifier-reveal (principle 2 — cohesion; monitor and mail are the
 * existing precedents).
 *
 * Exports `MESSAGE_SQUARE_BODY_KEYFRAMES` so the family modifier-
 * reveal can inherit both curves directly.
 *
 * Closed cycle: every keyframe array starts AND ends at the rest
 * value (principle 4).
 */
const MESSAGE_SQUARE_BODY_PATHS = [
  // Standard outline — `.71.71` spelling (most variants)
  "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",
  // Standard outline — `.7.7` spelling (check, off use this)
  "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.7.7 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",
  // message-square-dot — body cut for notification dot at top-right
  "M12.7 3H4a2 2 0 0 0-2 2v16.286a.71.71 0 0 0 1.212.502l2.202-2.202A2 2 0 0 1 6.828 19H20a2 2 0 0 0 2-2v-4.7",
  // message-square-lock — body cut for the padlock
  "M22 8.5V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v16.286a.71.71 0 0 0 1.212.502l2.202-2.202A2 2 0 0 1 6.828 19H10",
  // message-square-off — lower-left casing fragment
  "M19 19H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.7.7 0 0 1 2 21.286V5a2 2 0 0 1 1.184-1.826",
  // message-square-off — upper-right casing fragment
  "M8.656 3H20a2 2 0 0 1 2 2v11.344",
  // message-square-share — body cut for the share arrow
  "M12 3H4a2 2 0 0 0-2 2v16.286a.71.71 0 0 0 1.212.502l2.202-2.202A2 2 0 0 1 6.828 19H20a2 2 0 0 0 2-2v-4",
  // message-square-dashed — ten short outline segments (treat all
  // as part of the host so the dashed bubble nods as one shape)
  "M14 3h2",
  "M16 19h-2",
  "M2 12v-2",
  "M2 16v5.286a.71.71 0 0 0 1.212.502l1.149-1.149",
  "M20 19a2 2 0 0 0 2-2v-1",
  "M22 10v2",
  "M22 6V5a2 2 0 0 0-2-2",
  "M4 3a2 2 0 0 0-2 2v1",
  "M8 19h2",
  "M8 3h2",
];

const matchBody = matchPathDOneOf(...MESSAGE_SQUARE_BODY_PATHS);

export const MESSAGE_SQUARE_BODY_KEYFRAMES = {
  // Damped left-right nod around the tail tip (3, 22).
  rotate: [0, -3, 2, -1, 0],
  // Opacity shimmer phase-locked to the nod apexes.
  opacity: [1, 0.78, 1, 0.9, 1],
  times: [0, 0.25, 0.5, 0.75, 1],
};

export const messageSquareBody: Motion = {
  matches: matchBody,
  factory: (ctx) => ({
    rest: { rotate: 0, opacity: 1 },
    active: {
      rotate: MESSAGE_SQUARE_BODY_KEYFRAMES.rotate,
      opacity: MESSAGE_SQUARE_BODY_KEYFRAMES.opacity,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay,
        repeat: ctx.repeat,
        ease: "easeInOut",
        times: MESSAGE_SQUARE_BODY_KEYFRAMES.times,
      },
    },
  }),
};
