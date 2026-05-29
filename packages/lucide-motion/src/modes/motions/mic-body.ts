import type { ModeContext } from "../types";
import type { Motion } from "../compose";

/**
 * Microphone body — the "mic is hot" pulse. A real microphone has no
 * visible motion; the convention readers recognize is an indicator
 * light on the capsule that pulses while the mic is live. We carry
 * that idea into a soft two-beat scale contraction across the whole
 * mic body so the icon reads as actively listening.
 *
 * The pulse is uniform (in-plane) and stays at `scale ≤ 1` per
 * principle 3 — rest is the maximum size, active oscillates downward.
 * Every structural path of the mic family rides the same pulse via
 * the registry below so capsule, U-arc holder, stem, vocal-mic ball,
 * handle, and cable all breathe together rather than the capsule
 * flicking alone over a static frame.
 *
 * `mic-off`'s diagonal slash is intentionally NOT in this registry —
 * it routes through the family modifier reveal so it strikes through
 * at the second-pulse apex.
 *
 * Exports `MIC_BODY_KEYFRAMES` so `micModifierReveal` inherits the
 * same rhythm and the slash stays phase-locked with the body.
 */
export const MIC_BODY_KEYFRAMES = {
  scale: [1, 0.94, 1, 0.97, 1],
  times: [0, 0.2, 0.45, 0.7, 1],
};

const MIC_BODY_PATH_DS = [
  // mic + mic-off stem
  "M12 19v3",
  // mic U-arc holder
  "M19 10v2a7 7 0 0 1-14 0v-2",
  // mic-off capsule upper fragment
  "M15 9.34V5a3 3 0 0 0-5.68-1.33",
  // mic-off U-arc left fragment
  "M16.95 16.95A7 7 0 0 1 5 12v-2",
  // mic-off U-arc right fragment
  "M18.89 13.23A7 7 0 0 0 19 12v-2",
  // mic-off capsule lower fragment
  "M9 9v3a3 3 0 0 0 5.12 2.12",
  // mic-vocal handle
  "m11 7.601-5.994 8.19a1 1 0 0 0 .1 1.298l.817.818a1 1 0 0 0 1.314.087L15.09 12",
  // mic-vocal cable
  "M16.5 21.174C15.5 20.5 14.372 20 13 20c-2.058 0-3.928 2.356-6 2-2.072-.356-2.775-3.369-1.5-4.5",
];

function isMicBodyPath(ctx: ModeContext): boolean {
  if (ctx.pathTag === "rect") {
    // mic capsule — <rect x=9 y=2 width=6 height=13 rx=3>
    return (
      String(ctx.pathAttrs.x) === "9" &&
      String(ctx.pathAttrs.y) === "2" &&
      String(ctx.pathAttrs.width) === "6" &&
      String(ctx.pathAttrs.height) === "13"
    );
  }
  if (ctx.pathTag === "circle") {
    // mic-vocal ball — <circle cx=16 cy=7 r=5>
    return (
      String(ctx.pathAttrs.cx) === "16" &&
      String(ctx.pathAttrs.cy) === "7" &&
      String(ctx.pathAttrs.r) === "5"
    );
  }
  if (ctx.pathTag === "path") {
    return MIC_BODY_PATH_DS.includes(String(ctx.pathAttrs.d));
  }
  return false;
}

export const micBody: Motion = {
  matches: isMicBodyPath,
  factory: (ctx) => ({
    rest: { scale: 1 },
    active: {
      scale: MIC_BODY_KEYFRAMES.scale,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        ease: ctx.easing,
        repeat: ctx.repeat,
        times: MIC_BODY_KEYFRAMES.times,
      },
    },
  }),
};
