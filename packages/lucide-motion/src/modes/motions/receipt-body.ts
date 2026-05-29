import { matchPathD, type Motion } from "../compose";

/**
 * Receipt body — the host motion for every icon built around the
 * Lucide receipt outline (10 icons today: `receipt`, plus the eight
 * currency variants `receipt-{cent,dollar-sign,euro,indian-rupee,
 * japanese-yen,pound-sterling,russian-ruble,swiss-franc,turkish-
 * lira}` and `receipt-text`).
 *
 * The scalloped zigzag outline is byte-identical across all 10 —
 * one `matchPathD` covers the entire family.
 *
 * **Real-life referent — receipt being printed from a thermal
 * printer.** A fresh receipt scrolls out of the print slot at the
 * top; if it gets retracted slightly then re-fed, the bottom edge
 * visibly moves while the top stays anchored at the slot. The
 * signature gesture is a `scaleY` contraction (`[1, 0.78, 1]`)
 * pivoted at the receipt's top edge `(10, 2)` — the imagined print
 * slot — paired with a phase-locked opacity dim. The bottom edge
 * is the furthest point from the pivot so it travels the most;
 * the top stays anchored at the slot. Reads as paper feeding back
 * into the printer and emerging again, not as a symmetric L-R
 * wobble.
 *
 * Pivot at `(10, 2)`: top edge centre. With `scaleY < 1` and pivot
 * at top, the bottom retracts UP toward the slot, then re-extends
 * down to rest.
 *
 * ViewBox safety. `scaleY: 0.78` is contraction-only per principle
 * 3 — the receipt only ever gets shorter, never extends past its
 * rest height. Safe at any stroke width.
 *
 * Sub-icons inherit BOTH rotate and opacity via the family
 * modifier-reveal so currency symbols and text lines sway with the
 * receipt rather than sitting statically over the dangling paper
 * (principle 2 — cohesion).
 *
 * Exports `RECEIPT_BODY_KEYFRAMES` so the family modifier-reveal
 * can inherit both curves directly.
 *
 * Closed cycle: rotate and opacity both start AND end at rest.
 */
const RECEIPT_BODY_D =
  "M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z";

export const RECEIPT_BODY_KEYFRAMES = {
  // Paper-feed: receipt retracts ~22% up into the slot, then feeds
  // back out to full length. Pivot at top so the bottom edge does
  // the visible work while the top stays at the print slot.
  scaleY: [1, 0.78, 1],
  opacity: [1, 0.78, 1],
  times: [0, 0.4, 1],
};

export const receiptBody: Motion = {
  matches: matchPathD(RECEIPT_BODY_D),
  factory: (ctx) => ({
    rest: { scaleY: 1, opacity: 1 },
    active: {
      scaleY: RECEIPT_BODY_KEYFRAMES.scaleY,
      opacity: RECEIPT_BODY_KEYFRAMES.opacity,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay,
        repeat: ctx.repeat,
        ease: "easeInOut",
        times: RECEIPT_BODY_KEYFRAMES.times,
      },
    },
  }),
};
