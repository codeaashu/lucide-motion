import { matchPathDOneOf, type Motion } from "../compose";

/**
 * Pen body — the diamond-shaped pen/pencil shaft Lucide draws across
 * the catalog. Canonical "edit" gesture: the pen wobbles in place as
 * if making small writing strokes mid-word, then settles.
 *
 * Per-variant `transformOrigin: "50% 50%"` + `transformBox:
 * "fill-box"` overrides the engine's default `view-box` setup just
 * for the pen path, so each pen rotates around its own bounding-box
 * centre regardless of where it sits in the icon. This means the
 * same motion drops cleanly into:
 *
 * - Standalone full-page pens (`pen`, `pencil`, `pen-line`,
 *   `pencil-line`) — wobble around the icon centre.
 * - Composite badge pens at the upper-right corner (`folder-pen`,
 *   `file-pen`, `file-pen-line`, `wifi-pen` — though wifi-pen
 *   keeps its bespoke `wifiPenWrite` for tighter signal sync).
 *
 * Closed cycle per principle 4: rotate, scale, opacity all start
 * AND end at the rest value.
 *
 * Exports `PEN_WRITE_KEYFRAMES` so the underline + eraser-tip
 * motions can phase-lock to the same wobble cadence.
 *
 * Place this FIRST in any pen-bearing signature so the pen body is
 * claimed by the wobble before the host family modifier-reveal
 * would draw it on as a state marker.
 */
export const PEN_WRITE_KEYFRAMES: {
  rotate: number[];
  scale: number[];
  opacity: number[];
  times: number[];
} = {
  rotate: [0, -4, 3, -1, 0],
  scale: [1, 0.96, 1, 0.98, 1],
  opacity: [1, 0.85, 1, 0.92, 1],
  times: [0, 0.25, 0.5, 0.75, 1],
};

const PEN_BODY_DS = [
  // Standalone — full-page diagonal pen/pencil body (shared d across
  // pen, pencil, pen-line, pencil-line).
  "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
  // Composite badge pens (one unique d per host position)
  // file-pen
  "M10.378 12.622a1 1 0 0 1 3 3.003L8.36 20.637a2 2 0 0 1-.854.506l-2.867.837a.5.5 0 0 1-.62-.62l.836-2.869a2 2 0 0 1 .506-.853z",
  // file-pen-line
  "M14.364 13.634a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506l4.013-4.009a1 1 0 0 0-3.004-3.004z",
  // folder-pen
  "M11.378 13.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z",
  // pen-off / pencil-off — broken-pen fragments. Same wobble gesture
  // applies (each fragment rotates around its own bbox centre via
  // the fill-box transformOrigin), reading as the broken pen still
  // trying to write.
  "m10 10-6.157 6.162a2 2 0 0 0-.5.833l-1.322 4.36a.5.5 0 0 0 .622.624l4.358-1.323a2 2 0 0 0 .83-.5L14 13.982",
  "m12.829 7.172 4.359-4.346a1 1 0 1 1 3.986 3.986l-4.353 4.353",
];

export const penWrite: Motion = {
  matches: matchPathDOneOf(...PEN_BODY_DS),
  factory: (ctx) => ({
    rest: {
      rotate: 0,
      scale: 1,
      opacity: 1,
      transformOrigin: "50% 50%",
      transformBox: "fill-box",
    },
    active: {
      rotate: PEN_WRITE_KEYFRAMES.rotate,
      scale: PEN_WRITE_KEYFRAMES.scale,
      opacity: PEN_WRITE_KEYFRAMES.opacity,
      transformOrigin: "50% 50%",
      transformBox: "fill-box",
      transition: {
        duration: ctx.duration,
        delay: ctx.delay,
        repeat: ctx.repeat,
        rotate: {
          inherit: true,
          ease: "easeInOut",
          times: PEN_WRITE_KEYFRAMES.times,
        },
        scale: {
          inherit: true,
          ease: "easeInOut",
          times: PEN_WRITE_KEYFRAMES.times,
        },
        opacity: {
          inherit: true,
          ease: "easeInOut",
          times: PEN_WRITE_KEYFRAMES.times,
        },
      },
    },
  }),
};
