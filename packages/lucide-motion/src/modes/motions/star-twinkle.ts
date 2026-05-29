import { matchPathDOneOf, type Motion } from "../compose";

/**
 * Twinkle — light scintillating off a five-pointed star.
 *
 * **Real-life motion**: a star's twinkle isn't a size change — distant
 * point sources of light scintillate because atmospheric turbulence
 * deflects the rays and modulates their apparent brightness. The eye
 * reads that as a flicker: the star briefly dims and brightens, with
 * a tiny angular jitter where the spike of light catches the corner
 * of the eye. Modeled here as an opacity dim + recover, a small
 * rotation wobble (the angular jitter), and a brief inward
 * contraction (the apparent narrowing of the bright spike as the
 * light dims).
 *
 * **Why contraction, not expansion**: per principle 3 of
 * `docs/signatures.md`, scale-based motion must stay `≤ 1` so the
 * stroke can't push past the 24×24 viewBox edges — and scaling a star
 * outward isn't anatomically accurate anyway (real stars don't grow,
 * they scintillate). A subtle inward contraction reads as the star's
 * silhouette tightening for a beat as the light dims, then easing
 * back out as it recovers.
 *
 * **Matched variants**:
 *   - `star` — full five-pointed outline.
 *   - `star-half` — half-outline tracing the left silhouette only.
 *   - `star-off` — top-right + bottom-left fragments of a broken star,
 *     separated by the diagonal slash that the family's modifier
 *     reveal handles.
 *
 * Exports {@link STAR_TWINKLE_KEYFRAMES} so the family's modifier
 * reveal can inherit the same rhythm via `inherit: true` per-value
 * transitions — the off-slash wobbles and dims in step with the
 * broken star fragments rather than floating statically over them.
 */
export const STAR_TWINKLE_KEYFRAMES = {
  scale: [1, 0.9, 0.98, 1],
  rotate: [0, 8, -5, 0],
  opacity: [1, 0.6, 0.9, 1],
  times: [0, 0.35, 0.7, 1],
};

const STAR_PATHS = [
  // star — full outline
  "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
  // star-half — left-half outline (open path from bottom-centre up to top-centre)
  "M12 18.338a2.1 2.1 0 0 0-.987.244L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16l2.309-4.679A.53.53 0 0 1 12 2",
  // star-off — top-right fragment of the broken outline
  "m10.344 4.688 1.181-2.393a.53.53 0 0 1 .95 0l2.31 4.679a2.12 2.12 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.237 3.152",
  // star-off — bottom-left + lower-right tail fragment of the broken outline
  "m17.945 17.945.43 2.505a.53.53 0 0 1-.771.56l-4.618-2.428a2.12 2.12 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a8 8 0 0 0 .4-.099",
];

export const starTwinkle: Motion = {
  matches: matchPathDOneOf(...STAR_PATHS),
  factory: (ctx) => ({
    rest: { rotate: 0, scale: 1, opacity: 1 },
    active: {
      rotate: STAR_TWINKLE_KEYFRAMES.rotate,
      scale: STAR_TWINKLE_KEYFRAMES.scale,
      opacity: STAR_TWINKLE_KEYFRAMES.opacity,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        ease: ctx.easing,
        times: STAR_TWINKLE_KEYFRAMES.times,
        repeat: ctx.repeat,
      },
    },
  }),
};
