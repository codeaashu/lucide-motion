import { matchPathDOneOf, type Motion } from "../compose";

/**
 * The V-flap line of the envelope across the mail family — the
 * seam where the gummed flap meets the front of the envelope.
 * Across variants the V has slightly different `d` strings (Lucide
 * rounds the curve handles differently in `mail` vs the modifier
 * variants vs `mail-open`), so the registry lists every known
 * shape.
 *
 * **Real-life motion**: the canonical mail gesture is the flap
 * *raising* briefly — peeking open as if to reveal the contents,
 * then settling closed again. We achieve that with a `scaleY`
 * contraction around the flap-corner Y level (the signature sets
 * `transformOrigin` to `"12px 7px"` — the y-coordinate of the
 * V's outer corners in `mail`). Contracting the Y dimension
 * around that pivot keeps the V's corners pinned to the envelope's
 * top edges while the middle (the V's deep point) rises *up*
 * toward y=7 — exactly what the flap looks like as it opens.
 *
 * For `mail-open` the V sits at y=10 corners and deeper middle;
 * the same gesture around the pivot reads as the open-state flap
 * also "raising" — visually consistent across the family.
 *
 * Opacity dips slightly alongside so the seam reads as
 * highlighting/relaxing rather than statically transforming.
 * Exports `MAIL_FLAP_KEYFRAMES` so the body and modifier pulses
 * can share the rhythm.
 */
export const MAIL_FLAP_KEYFRAMES: {
  scaleY: number[];
  opacity: number[];
  times: number[];
} = {
  scaleY: [1, 0.35, 1, 1],
  opacity: [1, 0.6, 1, 1],
  times: [0, 0.4, 0.75, 1],
};

const FLAP_PATHS = [
  // base mail V-flap
  "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",
  // mail-plus, -minus, -check, -x, -warning, -question-mark, -search
  "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",
  // mail-open (raised V at y=10)
  "m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10",
];

export const mailFlap: Motion = {
  matches: matchPathDOneOf(...FLAP_PATHS),
  factory: (ctx) => ({
    rest: { scaleY: 1, opacity: 1 },
    active: {
      scaleY: MAIL_FLAP_KEYFRAMES.scaleY,
      opacity: MAIL_FLAP_KEYFRAMES.opacity,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        repeat: ctx.repeat,
        scaleY: {
          inherit: true,
          ease: "easeInOut",
          times: MAIL_FLAP_KEYFRAMES.times,
        },
        opacity: {
          inherit: true,
          ease: "easeInOut",
          times: MAIL_FLAP_KEYFRAMES.times,
        },
      },
    },
  }),
};
