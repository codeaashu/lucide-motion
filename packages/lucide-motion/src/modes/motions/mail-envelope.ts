import { matchPathDOneOf, type Motion } from "../compose";
import type { ModeContext } from "../types";
import { MAIL_FLAP_KEYFRAMES } from "./mail-flap";

/**
 * The envelope body across the mail family. Lucide ships the body
 * as either a `<rect>` (`mail`) or a `<path>` whose shape varies
 * across variants:
 *
 * - `mail` — `<rect x=2 y=4 width=20 height=16 rx=2>` (full rect)
 * - `mail-open` — body path with the open-flap arc on top
 * - `mail-{plus,minus,check,x,warning,question-mark,search}` —
 *   partial-rect paths where Lucide carves out a corner to make
 *   room for the modifier
 *
 * **Real-life motion**: the envelope body itself stays still — it
 * is the rigid container around the moving flap. To share kinetic
 * life with the flap (principle 2), the body's opacity dips
 * gently in step with the flap raising, then recovers. The
 * envelope reads as "responding" to the flap motion without
 * itself distorting in a way that would warp the rectangle.
 *
 * Inherits `MAIL_FLAP_KEYFRAMES.opacity` and `times` directly so
 * the body and flap share one synchronized rhythm. Modifier pulses
 * also inherit this rhythm (see `mailModifierPulse`).
 */
const BODY_PATHS = [
  // mail-check, mail-plus
  "M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8",
  // mail-minus
  "M22 15V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8",
  // mail-x
  "M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h9",
  // mail-question-mark, mail-warning
  "M22 10.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h12.5",
  // mail-search
  "M22 12.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h7.5",
  // mail-open
  "M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z",
];

const matchBodyPath = matchPathDOneOf(...BODY_PATHS);

function isEnvelopeRect(ctx: ModeContext): boolean {
  return (
    ctx.pathTag === "rect" &&
    String(ctx.pathAttrs.x) === "2" &&
    String(ctx.pathAttrs.y) === "4" &&
    String(ctx.pathAttrs.width) === "20" &&
    String(ctx.pathAttrs.height) === "16"
  );
}

export const mailEnvelope: Motion = {
  matches: (ctx) => matchBodyPath(ctx) || isEnvelopeRect(ctx),
  factory: (ctx) => ({
    rest: { opacity: 1 },
    active: {
      opacity: MAIL_FLAP_KEYFRAMES.opacity,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        repeat: ctx.repeat,
        ease: "easeInOut",
        times: MAIL_FLAP_KEYFRAMES.times,
      },
    },
  }),
};
