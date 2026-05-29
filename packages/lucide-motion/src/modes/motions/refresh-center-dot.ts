import type { Motion } from "../compose";
import { REFRESH_ARC_KEYFRAMES } from "./refresh-arc-cycle";

/**
 * The notification dot at the centre of `refresh-ccw-dot` —
 * `<circle cx="12" cy="12" r="1">`. In Lucide's UI vocabulary a
 * `*-dot` variant means "this surface has a pending indicator",
 * so for refresh the dot reads as fresh content waiting to be
 * pulled in by the next cycle.
 *
 * **Real-life motion**: the dot is the persistent anchor that the
 * spinning wheel turns around. It doesn't rotate (rotating a
 * point at the rotation pivot would be visually invisible anyway,
 * since the dot sits exactly at (12, 12) — the host's transform
 * origin), but it shares the host's pinch by inheriting
 * `REFRESH_ARC_KEYFRAMES.scale` and dims its opacity while the
 * action is in flight. Reads as "the indicator quietly holds
 * its ground while the wheel turns around it, dim during the
 * action and bright at rest."
 *
 * **Coupling pattern**: the host motion ({@link import("./refresh-arc-cycle").refreshArcCycle})
 * transforms `scale` (uniform) + `rotate`. Uniform scale is
 * directly inheritable — the dot pinches with the wheel and shares
 * the same kinetic peak. Rotate is skipped on purpose: a circle
 * at the rotation pivot has rotational symmetry, so inheriting
 * rotate would only add invisible work to the animation. Opacity
 * is synthesized to carry the dot's own "in-flight vs at rest"
 * narrative.
 *
 * Matched by geometry (cx=12, cy=12, r=1) — if Lucide reshapes
 * the dot, this falls through to the family wildcard and the dev
 * warning surfaces it.
 *
 * **ViewBox safety**: scale stays at or below 1, opacity is
 * bounds-safe by construction, and the dot's pivot is its own
 * centre — no clipping concerns at any frame.
 */
export const refreshCenterDot: Motion = {
  matches: (ctx) =>
    ctx.pathTag === "circle" &&
    String(ctx.pathAttrs.cx) === "12" &&
    String(ctx.pathAttrs.cy) === "12" &&
    String(ctx.pathAttrs.r) === "1",
  factory: (ctx) => ({
    rest: { scale: 1, opacity: 1 },
    active: {
      // Inherit the wheel's pinch rhythm directly — the dot
      // contracts and expands in lockstep with the arcs.
      scale: REFRESH_ARC_KEYFRAMES.scale,
      // Synthesized opacity arc — dim during the spin, bright at
      // rest. Bright dot = "fresh data ready"; dim dot = "action
      // in flight, indicator stepping aside."
      opacity: [1, 0.55, 0.55, 1],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        repeat: ctx.repeat,
        scale: {
          inherit: true,
          ease: "easeInOut",
          times: REFRESH_ARC_KEYFRAMES.times,
        },
        opacity: {
          inherit: true,
          ease: "easeInOut",
          times: REFRESH_ARC_KEYFRAMES.times,
        },
      },
    },
  }),
};
