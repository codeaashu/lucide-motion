import { matchPathDOneOf, type Motion } from "../compose";

/**
 * The moon crescent — used by Lucide's `moon`, `moon-star`, and
 * `sun-moon` icons. Lucide draws two different crescent `d` strings
 * depending on the context: a smaller inner crescent for the
 * `sun-moon` composite (where the sun's quarter-arc + rays share the
 * frame), and a larger crescent for the standalone `moon` and
 * `moon-star` icons. Both `d` strings are listed here so the same
 * physics drives every moon path in the family.
 *
 * Tier 2 motion: the moon depicts an actual celestial body, so it
 * gets bespoke physics rather than reusing a generic reveal.
 *
 * **Real-life motion**: the moon doesn't *emit* light — it reflects
 * sunlight, so it doesn't radiate outward the way the sun's rays do.
 * Modeled here as an opacity-only soft dim and return: the moon
 * glows steadily, with a subtle brightness lull mid-animation that
 * reads as the moon's phase shifting rather than the moon itself
 * moving.
 *
 * No scale on purpose: the crescent sits off the icon centre in
 * `sun-moon` and off the star pivot in `moon-star`, so scaling it
 * around either composition's transform origin would translate the
 * crescent away from its rest position — exactly the "clip art over
 * animation" anti-pattern. Opacity sidesteps the origin entirely.
 *
 * Place this *before* element-specific siblings (`sunRayPulse`,
 * `moonStarTwinkle`) in the compose motions list so the moon's
 * specific d-match wins over their wildcards / broader matches.
 */
const MOON_PATHS = [
  // sun-moon's smaller inner crescent (radius 6 inner, 4 cut-out)
  "M14.837 16.385a6 6 0 1 1-7.223-7.222c.624-.147.97.66.715 1.248a4 4 0 0 0 5.26 5.259c.589-.255 1.396.09 1.248.715",
  // moon + moon-star's standalone crescent (radius 9 outer, 6 cut-out)
  "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",
];

export const moonGlow: Motion = {
  matches: matchPathDOneOf(...MOON_PATHS),
  factory: (ctx) => ({
    rest: { opacity: 1 },
    active: {
      opacity: [1, 0.65, 1],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        ease: ctx.easing,
        repeat: ctx.repeat,
      },
    },
  }),
};
