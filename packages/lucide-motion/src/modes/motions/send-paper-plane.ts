import { matchPathDOneOf, type Motion } from "../compose";

/**
 * Paper-plane bodies + creases in `send` and `send-horizontal`.
 * The plane briefly flies in the direction it's facing, fades
 * out as it recedes "into the distance," then respawns at the
 * rest position — the classic "your message has been sent"
 * confirmation gesture.
 *
 * **Real-life motion**: a paper plane launches and disappears
 * past the viewer's frame. Implemented as:
 *
 * 1. Translate forward in the plane's facing direction (`x +`,
 *    `y −` for `send`'s diagonal up-right; `x +` only for
 *    `send-horizontal`'s rightward orientation).
 * 2. Hold briefly at the far position while opacity fades to 0
 *    (the plane leaves the frame).
 * 3. Snap back to (0, 0) while still invisible (the "respawn"
 *    — the plane is ready for the next send).
 * 4. Fade back in at the rest position.
 *
 * Direction comes from `iconName`. Translate magnitude is small
 * enough (≤ 1.8 units) to keep the plane's stroke inside the
 * 24×24 viewBox even at the far position — `send`'s tip already
 * sits at (~21.85, ~2.15), so generous translation would clip.
 *
 * Scale dips slightly toward `0.88` at the far position to read
 * as perspective foreshortening (contraction-only per principle
 * 3) and recovers when the plane respawns.
 */
const PLANE_PATHS = [
  // send — diagonal plane body + crease
  "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
  "m21.854 2.147-10.94 10.939",
  // send-horizontal — rightward plane body + crease
  "M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z",
  "M6 12h16",
];

export const SEND_PLANE_TIMES = [0, 0.45, 0.5, 0.55, 0.8, 1];

export const sendPaperPlane: Motion = {
  matches: matchPathDOneOf(...PLANE_PATHS),
  factory: (ctx) => {
    const isHorizontal = ctx.iconName === "send-horizontal";
    const dx = isHorizontal ? 2 : 1.6;
    const dy = isHorizontal ? 0 : -1.6;
    return {
      rest: { x: 0, y: 0, opacity: 1, scale: 1 },
      active: {
        // forward → hold → snap back (invisible) → stay at rest
        x: [0, dx, dx, 0, 0, 0],
        y: [0, dy, dy, 0, 0, 0],
        // visible → visible → invisible → invisible → visible → visible
        opacity: [1, 1, 0, 0, 1, 1],
        // contraction at the far position reads as perspective
        scale: [1, 0.88, 0.88, 1, 1, 1],
        transition: {
          duration: ctx.duration,
          delay: ctx.delay + ctx.index * ctx.stagger,
          repeat: ctx.repeat,
          x: { inherit: true, ease: "easeOut", times: SEND_PLANE_TIMES },
          y: { inherit: true, ease: "easeOut", times: SEND_PLANE_TIMES },
          opacity: { inherit: true, ease: "easeOut", times: SEND_PLANE_TIMES },
          scale: { inherit: true, ease: "easeOut", times: SEND_PLANE_TIMES },
        },
      },
    };
  },
};
