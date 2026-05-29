import { matchAnyPath, type Motion } from "../compose";
import { CALENDAR_FRAME_KEYFRAMES } from "./calendar-frame";

/**
 * Calendar-family wildcard reveal — a delayed stroke draw-in plus
 * the host body's y settle so every non-host path in a calendar-*
 * variant bobs *with* the frame instead of floating statically over
 * a pinned-and-settling calendar.
 *
 * Catches whatever's left after `calendarFrame` claims the body,
 * pins, and divider:
 * - calendar-plus / -minus / -check / -x marker strokes
 *   (and their `*-2` siblings where the marker sits at a
 *   different position inside the body)
 * - calendar-off's diagonal slash
 *
 * The reveal animates `strokeDashoffset` against the measured
 * `ctx.pathLength` and clears the dash attrs on `transitionEnd` so
 * the resting stroke stays solid and seam-free, matching Lucide's
 * static SVG visually.
 *
 * The reveal completes AT the body's settle peak (t = 0.4, the
 * moment the calendar lands) — the marker stamps the calendar in
 * step with the landing, then holds while the body rebounds. `y`
 * inherits the body bob so the marker travels with the page as one
 * rigid stamp.
 *
 * Place this LAST in the compose `motions` list — `matchAnyPath` is
 * greedy and would otherwise claim the body, pins, and divider.
 */
export const calendarModifierReveal: Motion = {
  matches: matchAnyPath,
  factory: (ctx) => ({
    rest: {
      strokeDasharray: 0,
      strokeDashoffset: 0,
      opacity: 1,
      y: 0,
    },
    active: {
      strokeDasharray: ctx.pathLength,
      strokeDashoffset: [ctx.pathLength, ctx.pathLength, 0],
      opacity: [0, 0, 1],
      // Bob in lockstep with the body so the marker stays anchored
      // to the calendar through the settle.
      y: CALENDAR_FRAME_KEYFRAMES.bodyY,
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        repeat: ctx.repeat,
        strokeDasharray: { duration: 0 },
        // Strike completes at t = 0.4 — exactly when the body
        // reaches its settle peak.
        strokeDashoffset: { inherit: true, ease: "easeOut", times: [0, 0.15, 0.4] },
        opacity: { inherit: true, ease: "easeOut", times: [0, 0.15, 0.4] },
        y: {
          inherit: true,
          ease: "easeInOut",
          times: CALENDAR_FRAME_KEYFRAMES.times,
        },
      },
      transitionEnd: {
        strokeDasharray: 0,
        strokeDashoffset: 0,
      },
    },
  }),
};
