import type { Motion } from "../compose";

/**
 * Square shell — the host motion for every icon built around the
 * Lucide standard square rect `<rect x=3 y=3 w=18 h=18 rx=2>`. 46
 * icons share this exact rect — `square` plus most of its state
 * markers (`-check`, `-x`, `-plus`, `-minus`, `-asterisk`, …),
 * symbol payloads (`-pi`, `-sigma`, `-radical`, `-percent`, …),
 * directional arrows (`-arrow-up`, `-chevron-down`, …), and content
 * payloads (`-kanban`, `-menu`, `-stack`, `-activity`, …).
 *
 * **Real-life referent — geometric primitive (vertex sequence
 * pulse archetype).** A square has no inherent motion; per the
 * skill's abstract-archetype catalog it gets a vertex pulse. As a
 * single-element rect we can't isolate the corners, so the
 * archetype lands as a uniform contraction + opacity dim — the
 * square reads as catching light at the centre then relaxing.
 * Same family as `badgeShell`.
 *
 * Sub-icons inherit BOTH scale and opacity via the family
 * modifier-reveal so state markers and payloads pulse with the
 * shell (principle 2 — cohesion).
 *
 * Exports `SQUARE_SHELL_KEYFRAMES` so the family modifier-reveal
 * can inherit both curves directly.
 *
 * Closed cycle: scale and opacity both start AND end at 1.
 */
const isStandardSquareRect = (ctx: {
  pathTag: string;
  pathAttrs: Record<string, string | number>;
}): boolean =>
  ctx.pathTag === "rect" &&
  String(ctx.pathAttrs.x) === "3" &&
  String(ctx.pathAttrs.y) === "3" &&
  String(ctx.pathAttrs.width) === "18" &&
  String(ctx.pathAttrs.height) === "18";

export const SQUARE_SHELL_KEYFRAMES = {
  scale: [1, 0.94, 1],
  opacity: [1, 0.78, 1],
  times: [0, 0.4, 1],
};

export const squareShell: Motion = {
  matches: isStandardSquareRect,
  factory: (ctx) => ({
    rest: { scale: 1, opacity: 1 },
    active: {
      scale: SQUARE_SHELL_KEYFRAMES.scale,
      opacity: SQUARE_SHELL_KEYFRAMES.opacity,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay,
        repeat: ctx.repeat,
        ease: "easeInOut",
        times: SQUARE_SHELL_KEYFRAMES.times,
      },
    },
  }),
};
