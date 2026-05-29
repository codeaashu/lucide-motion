import { matchAnyPath, type Motion } from "../compose";

/**
 * Typewriter-stamp archetype — the canonical motion for icons whose
 * subject is a letter, symbol, or typographic mark (no real-world
 * referent with characteristic motion). Reads as a type hammer
 * striking the page: the glyph compresses subtly, bobs down with
 * the impact, and springs back to rest.
 *
 * `matchAnyPath` so every element in the icon stamps together as a
 * single gesture. Anchorless `y` translate + contraction-only
 * `scale` (principle 3) — drops cleanly into any signature
 * regardless of `transformOrigin`.
 *
 * Per-iconName stagger via `STAMP_STAGGER` lets multi-glyph icons
 * (`ampersands`, `a-large-small`) cascade their elements one by one
 * instead of all stamping in unison.
 *
 * Coverage: typography icons that route through the abstract
 * "Typewriter stamp" archetype per the skill — `ampersand`,
 * `ampersands`, `asterisk`, `baseline`, `bold`, `case-{lower,
 * sensitive,upper}`, `heading`, `heading-{1..6}`, `italic`,
 * `pilcrow`, `strikethrough`, `subscript`, `superscript`,
 * `text-cursor`, `text-cursor-input`, `type`, `type-outline`, plus
 * the letter portion of composite typography icons (`a-arrow-up`,
 * `a-arrow-down`, `a-large-small`, `pilcrow-left`, `pilcrow-right`)
 * where the arrow / second-glyph portion has its own motion placed
 * BEFORE this in compose order.
 */
const STAMP_STAGGER: Record<string, number> = {
  // ampersands is the only "stamp glyph-by-glyph" case that maps
  // cleanly to per-path stagger (one ampersand per path). Multi-path-
  // per-glyph icons (a-large-small) use bespoke per-glyph grouping
  // motions instead — see `a-large-small-stamp.ts`.
  ampersands: 0.18,
};

export const TYPEWRITER_STAMP_KEYFRAMES: {
  scale: number[];
  opacity: number[];
  times: number[];
} = {
  scale: [1, 0.94, 1],
  opacity: [1, 0.85, 1],
  times: [0, 0.4, 1],
};

export const typewriterStamp: Motion = {
  matches: matchAnyPath,
  factory: (ctx) => {
    const perIcon = STAMP_STAGGER[ctx.iconName] ?? ctx.stagger;
    return {
      rest: { y: 0, scale: 1, opacity: 1 },
      active: {
        y: [0, 1, 0],
        scale: TYPEWRITER_STAMP_KEYFRAMES.scale,
        opacity: TYPEWRITER_STAMP_KEYFRAMES.opacity,
        transition: {
          duration: ctx.duration,
          delay: ctx.delay + ctx.index * perIcon,
          repeat: ctx.repeat,
          y: {
            inherit: true,
            ease: "easeInOut",
            times: TYPEWRITER_STAMP_KEYFRAMES.times,
          },
          scale: {
            inherit: true,
            ease: "easeInOut",
            times: TYPEWRITER_STAMP_KEYFRAMES.times,
          },
          opacity: {
            inherit: true,
            ease: "easeInOut",
            times: TYPEWRITER_STAMP_KEYFRAMES.times,
          },
        },
      },
    };
  },
};
