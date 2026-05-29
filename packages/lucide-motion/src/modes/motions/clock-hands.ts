import type { Motion } from "../compose";

/**
 * The clock's hand-pair path. Lucide draws the minute and hour hands
 * as one combined stroke that starts at (12, 6) — the 12 o'clock
 * position — draws down to (12, 12) (centre), then continues out to
 * the hour-hand tip for that variant. Every clock variant's hand
 * path therefore starts with the literal `M12 6v…` (the minute hand
 * from the 12 mark down to the centre), so a startsWith match
 * catches all of: `clock`, `clock-1`..`clock-12`, and the composite
 * variants (`clock-alert`, `clock-arrow-up`, `clock-arrow-down`,
 * `clock-check`, `clock-fading`, `clock-plus`).
 *
 * **Real-life motion**: a clock's hands tick — a sharp forward
 * advance, a steady hold, then the next tick. For a hover animation
 * that returns to its rest pose we model a single tick of 6° (the
 * angle of one minute step on a 60-mark face), a brief hold, then a
 * smooth ease back so the user "catches" the tick without the time
 * permanently advancing. The rotation is clockwise — the way a real
 * clock advances — and pivots around the clock's centre (12, 12),
 * which is the signature default transform origin.
 *
 * The minute and hour hands rotate together by the same 6° because
 * they're one merged path; that's an exaggerated hour-hand step
 * (real hour hands move 0.5° per minute), but the visual reads as
 * "the clock ticks" rather than "this is metrologically accurate".
 */
export const clockHands: Motion = {
  matches: (ctx) =>
    ctx.pathTag === "path" &&
    String(ctx.pathAttrs.d).startsWith("M12 6v"),
  factory: (ctx) => ({
    rest: { rotate: 0 },
    active: {
      rotate: [0, 6, 6, 0],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        times: [0, 0.25, 0.6, 1],
        ease: ["easeOut", "linear", "easeInOut"],
        repeat: ctx.repeat,
      },
    },
  }),
};
