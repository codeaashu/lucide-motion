import { matchAnyPath, type Motion } from "../compose";

/**
 * The rounded-square frame fragments + corner arrow in
 * `rotate-cw-square` and `rotate-ccw-square`. The frame depicts the
 * selection being rotated; the arrow at the top shows the rotation
 * direction. Both paths and arrow turn together as one rigid body
 * — the canonical "rotate-selection-by-90°" gesture.
 *
 * **Real-life motion**: a quarter turn in the named direction,
 * hold briefly at the apex, ease back to rest. Same semantic as
 * `rotateArcCycle` but without contraction: the frame's furthest
 * corners sit at (4, 5) and (20, 20), radii ≈ 10.6 and 11.3 from
 * (12, 12) — well inside the 24×24 viewBox's inscribed circle of
 * radius 12. Pure rotation never pushes the strokes outside.
 *
 * Direction comes from `iconName`: cw variants rotate +90, ccw
 * variants rotate -90.
 */
export const ROTATE_SQUARE_KEYFRAMES: {
  rotateMagnitude: number[];
  times: number[];
} = {
  // 0 → 1 (apex, multiplied by direction) → 1 (hold) → 0 (rest).
  rotateMagnitude: [0, 1, 1, 0],
  times: [0, 0.45, 0.6, 1],
};

export const rotateSquareSpin: Motion = {
  matches: matchAnyPath,
  factory: (ctx) => {
    const direction = ctx.iconName.includes("ccw") ? -1 : 1;
    const apex = 90 * direction;
    return {
      rest: { rotate: 0 },
      active: {
        rotate: ROTATE_SQUARE_KEYFRAMES.rotateMagnitude.map((m) => m * apex),
        transition: {
          duration: ctx.duration,
          delay: ctx.delay + ctx.index * ctx.stagger,
          repeat: ctx.repeat,
          ease: "easeInOut",
          times: ROTATE_SQUARE_KEYFRAMES.times,
        },
      },
    };
  },
};
