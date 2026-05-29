import { matchPathD, type Motion } from "../compose";

/**
 * Badge shell — the host motion for every icon built around the
 * Lucide badge wavy outline (18 icons today: `badge`, `badge-check`,
 * `badge-x`, `badge-plus`, `badge-minus`, `badge-alert`, `badge-info`,
 * `badge-percent`, `badge-question-mark`, plus the currency variants
 * `badge-cent`, `badge-dollar-sign`, `badge-euro`,
 * `badge-indian-rupee`, `badge-japanese-yen`, `badge-pound-sterling`,
 * `badge-russian-ruble`, `badge-swiss-franc`, `badge-turkish-lira`).
 *
 * The wavy outline is byte-identical across every variant — one
 * `matchPathD` covers all 18.
 *
 * **Real-life referent (abstract archetype — polished shine sweep).**
 * A badge has no inherent physical motion, so it routes through the
 * skill's "Polished shine sweep" archetype (`.claude/skills/
 * lucide-signature.md` step 1). The canonical implementation calls for
 * a linear-gradient highlight sweeping across the metal; the
 * contraction-only equivalent the rest of the library uses is a brief
 * uniform tightening of the outline paired with an opacity dim — the
 * medallion catches light, the highlight passes, the medallion
 * relaxes. Same identity, no extra SVG infrastructure, viewBox-safe by
 * construction (principle 3 — scale ≤ 1).
 *
 * Exports `BADGE_SHELL_KEYFRAMES` so the family modifier-reveal can
 * inherit the same `scale` and `times` and stay phase-locked with the
 * shell's light beat (principle 2 — host coupling). Inheriting the
 * uniform scale directly is safe for both diagonal (`×`, slash,
 * percent) and orthogonal (`+`, `−`) markers; the eye-asymmetric
 * synthesized-companion pattern is not needed here.
 *
 * Closed cycle: scale and opacity both start AND end at 1 (principle
 * 4); no `transitionEnd` cleanup required because the rest values
 * already match the bookend frames.
 */
const BADGE_SHELL_D =
  "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z";

export const BADGE_SHELL_KEYFRAMES = {
  scale: [1, 0.95, 1],
  opacity: [1, 0.78, 1],
  times: [0, 0.4, 1],
};

export const badgeShell: Motion = {
  matches: matchPathD(BADGE_SHELL_D),
  factory: (ctx) => ({
    rest: { scale: 1, opacity: 1 },
    active: {
      scale: BADGE_SHELL_KEYFRAMES.scale,
      opacity: BADGE_SHELL_KEYFRAMES.opacity,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay,
        repeat: ctx.repeat,
        ease: "easeInOut",
        times: BADGE_SHELL_KEYFRAMES.times,
      },
    },
  }),
};
