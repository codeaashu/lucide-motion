import { matchAnyPath, type Motion } from "../compose";

/**
 * `settings` icon — the rounded wavy-outline gear with a single
 * central `r=3` socket. Different anatomy from the standalone `cog`
 * icon (one continuous outline path instead of twelve discrete teeth),
 * but same "configure" identity → same rotation gesture, just
 * authored as `matchAnyPath` since both elements share the icon
 * centre as their pivot and there's nothing else in the icon to
 * exclude.
 *
 * Used only by `settings.ts`. Standalone scope; not reused by
 * composites (no `*-settings` family in Lucide today).
 */
export const settingsGear: Motion = {
  matches: matchAnyPath,
  factory: (ctx) => ({
    rest: { rotate: 0 },
    active: {
      rotate: [0, 360],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay,
        repeat: ctx.repeat,
        ease: "easeInOut",
      },
    },
  }),
};
