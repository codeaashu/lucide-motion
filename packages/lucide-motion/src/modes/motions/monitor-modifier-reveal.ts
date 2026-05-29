import { matchAnyPath, type Motion } from "../compose";
import { MONITOR_SCREEN_KEYFRAMES } from "./monitor-chassis";

/**
 * Monitor-family wildcard reveal — every non-chassis path reveals at
 * the screen's first-swivel apex, then inherits BOTH the screen's
 * rotate and opacity for the rest of the cycle so payloads swivel and
 * dim WITH the display (principle 2 — cohesion).
 *
 * Catches whatever's left after `monitorChassis` claims the screen
 * and stand:
 *
 * - State markers: `monitor-check`'s tick, `monitor-x`'s strokes,
 *   `monitor-up` / `monitor-down`'s arrows.
 * - Payload glyphs: `monitor-cog`'s teeth + hub circle,
 *   `monitor-cloud`'s cloud body, `monitor-dot`'s notification dot,
 *   `monitor-play`'s triangle, `monitor-pause`'s two bars,
 *   `monitor-stop`'s filled rect, `monitor-off`'s diagonal slash.
 * - Composite second-device anatomy: `monitor-smartphone`'s phone
 *   rect + stand, `monitor-speaker`'s speaker tower + dots.
 *
 * Branches by element type for the reveal mechanism:
 *
 * - `<path>` / `<line>` → `strokeDasharray` + `strokeDashoffset`
 *   draw-in over the measured `ctx.pathLength` (cleared on
 *   `transitionEnd` so the resting stroke stays solid and seam-free,
 *   matching Lucide's static SVG visually, per `src/modes/draw.ts`).
 * - `<circle>` / `<rect>` → `scale` from 0, pivoted at the element's
 *   own `fill-box` centre so the reveal stamps in place rather than
 *   sliding from the signature's screen-pivot.
 *
 * Reveal completes at `t = 0.25` — exactly when the screen reaches
 * its first swivel apex (max −6°). The payload appears AS the screen
 * turns away, then holds drawn through the recovery.
 *
 * Opacity tracks `MONITOR_SCREEN_KEYFRAMES.opacity` from 0 instead of
 * 1: the payload emerges to match the screen's first dim (0.72), then
 * brightens with the screen recovery, dims again at the second beat,
 * and settles back at full. This gives sub-icons the same continuous
 * kinetic life as the host display.
 *
 * Rotate inherits the screen's swivel directly — uniform in-plane
 * rotation around a fixed pivot is safe to direct-inherit per
 * principle 2's first branch (no orientation distortion). For the
 * composite second-device variants (`monitor-smartphone`,
 * `monitor-speaker`), the secondary device's offset centre translates
 * by ~0.5 viewBox units at peak; accepted as the lesser evil
 * compared to leaving in-screen payloads static while the screen
 * swivels around them.
 *
 * Place this LAST in the compose `motions` list — `matchAnyPath` is
 * greedy and would otherwise claim the chassis.
 */
export const monitorModifierReveal: Motion = {
  matches: matchAnyPath,
  factory: (ctx) => {
    const isShape = ctx.pathTag === "circle" || ctx.pathTag === "rect";
    if (isShape) {
      return {
        rest: {
          scale: 1,
          opacity: 1,
          rotate: 0,
          transformBox: "fill-box",
          transformOrigin: "center",
        },
        active: {
          scale: [0, 0, 1],
          // Reveal to the screen's first-dim opacity (0.72), then track
          // the screen for the rest of the cycle.
          opacity: [0, 0, 0.72, 1, 0.88, 1],
          // Inherit screen swivel for continuous kinetic life.
          rotate: MONITOR_SCREEN_KEYFRAMES.rotate,
          transformBox: "fill-box",
          transformOrigin: "center",
          transition: {
            duration: ctx.duration,
            delay: ctx.delay + ctx.index * ctx.stagger,
            repeat: ctx.repeat,
            scale: { inherit: true, ease: "easeOut", times: [0, 0.1, 0.25] },
            opacity: {
              inherit: true,
              ease: "easeOut",
              times: [0, 0.1, 0.25, 0.5, 0.75, 1],
            },
            rotate: {
              inherit: true,
              ease: "easeInOut",
              times: MONITOR_SCREEN_KEYFRAMES.times,
            },
          },
        },
      };
    }
    return {
      rest: {
        strokeDasharray: 0,
        strokeDashoffset: 0,
        opacity: 1,
        rotate: 0,
      },
      active: {
        strokeDasharray: ctx.pathLength,
        strokeDashoffset: [ctx.pathLength, ctx.pathLength, 0],
        opacity: [0, 0, 0.72, 1, 0.88, 1],
        rotate: MONITOR_SCREEN_KEYFRAMES.rotate,
        transition: {
          duration: ctx.duration,
          delay: ctx.delay + ctx.index * ctx.stagger,
          repeat: ctx.repeat,
          strokeDasharray: { duration: 0 },
          strokeDashoffset: { inherit: true, ease: "easeOut", times: [0, 0.1, 0.25] },
          opacity: {
            inherit: true,
            ease: "easeOut",
            times: [0, 0.1, 0.25, 0.5, 0.75, 1],
          },
          rotate: {
            inherit: true,
            ease: "easeInOut",
            times: MONITOR_SCREEN_KEYFRAMES.times,
          },
        },
        transitionEnd: {
          strokeDasharray: 0,
          strokeDashoffset: 0,
        },
      },
    };
  },
};
