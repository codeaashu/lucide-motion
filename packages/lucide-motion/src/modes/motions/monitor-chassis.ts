import { matchPathDOneOf, type Motion } from "../compose";

/**
 * Monitor chassis — the host motion for every icon built around the
 * Lucide monitor display (14 icons today: `monitor`, `monitor-check`,
 * `monitor-cloud`, `monitor-cog`, `monitor-dot`, `monitor-down`,
 * `monitor-off`, `monitor-pause`, `monitor-play`, `monitor-stop`,
 * `monitor-up`, `monitor-x`, plus the device-pair composites
 * `monitor-smartphone` and `monitor-speaker`).
 *
 * Three anatomical roles, matched per-path:
 *
 * - **Screen** — the display rectangle. Standard form is
 *   `<rect width=20 height=14 x=2 y=3 rx=2>` (9 variants); Lucide
 *   reshapes it to a path in composites where a payload cuts the
 *   corner (`monitor-cog`, `monitor-dot`, `monitor-smartphone`) and
 *   splits it into two fragments in `monitor-off`.
 * - **Stand stem** — short vertical (`M12 17v4` as a path, or as a
 *   `<line>` in the base `monitor`). Rigid stand, doesn't swivel.
 * - **Stand base** — short horizontal (`M8 21h8` as a path, or as a
 *   `<line>` in the base `monitor`). Rigid stand, doesn't swivel.
 *
 * **Real-life referent (abstract archetype — device interaction).**
 * A desktop monitor's signature physical gesture is the swivel on
 * its stand: the screen pivots side-to-side at the stand-top joint
 * while the stand stays planted. Implemented as a damped left-right
 * rotation around `(12, 17)` (the joint), paired with an opacity
 * dip phase-locked to the swivel apexes so the display reads as
 * "screen turning to face you while flickering slightly," not just
 * "icon wiggling." Stand stays anchored (no rotation — rotating it
 * around its own top would translate the base visibly).
 *
 * Sub-icons inherit BOTH the rotate and the opacity via the family
 * modifier-reveal (principle 2 — cohesion). In-plane uniform
 * rotation around a fixed pivot is safe to direct-inherit; for the
 * composite second-device variants (`monitor-smartphone`,
 * `monitor-speaker`) the secondary device's centre is offset from
 * the pivot, so direct inheritance translates it by ~0.5 viewBox
 * units at peak swivel. Acceptable trade — the alternative (leave
 * those secondaries static during the screen's swivel) reads as
 * the in-screen payloads sliding off a moving display, which is
 * worse.
 *
 * Pivot at `(12, 17)`: top of the stand, which is also where a
 * real monitor's tilt/swivel joint sits. Top-of-screen corners at
 * ±6° rotation move to y ≈ 2.03 — comfortably inside the 24×24
 * viewBox after accounting for stroke radius 1.
 *
 * Exports `MONITOR_SCREEN_KEYFRAMES` so the family modifier-reveal
 * can inherit both the rotate and opacity curves and stay phase-
 * locked with the screen swivel.
 *
 * Closed cycle: every keyframe array starts AND ends at the rest
 * value (principle 4).
 */
const MONITOR_SCREEN_PATHS = [
  // monitor-cog body (corner cut for the gear circle at top-right)
  "M22 13v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7",
  // monitor-dot body (corner cut for the notification dot)
  "M22 12.307V15a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8.693",
  // monitor-off — lower-left casing fragment
  "M17 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 1.184-1.826",
  // monitor-off — upper-right casing fragment
  "M8.656 3H20a2 2 0 0 1 2 2v10a2 2 0 0 1-.293 1.042",
  // monitor-smartphone — monitor body cut to make room for the phone
  "M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8",
];

const MONITOR_STAND_PATHS = [
  // Standard stand (8 variants where stand is a <path>)
  "M12 17v4",
  "M8 21h8",
];

const matchScreenPath = matchPathDOneOf(...MONITOR_SCREEN_PATHS);
const matchStandPath = matchPathDOneOf(...MONITOR_STAND_PATHS);

const isStandardScreenRect = (ctx: {
  pathTag: string;
  pathAttrs: Record<string, string | number>;
}) =>
  ctx.pathTag === "rect" &&
  String(ctx.pathAttrs.x) === "2" &&
  String(ctx.pathAttrs.y) === "3" &&
  String(ctx.pathAttrs.width) === "20" &&
  String(ctx.pathAttrs.height) === "14";

const isStandardStandLine = (ctx: {
  pathTag: string;
  pathAttrs: Record<string, string | number>;
}) => {
  if (ctx.pathTag !== "line") return false;
  const x1 = String(ctx.pathAttrs.x1);
  const x2 = String(ctx.pathAttrs.x2);
  const y1 = String(ctx.pathAttrs.y1);
  const y2 = String(ctx.pathAttrs.y2);
  return (
    (x1 === "12" && x2 === "12" && y1 === "17" && y2 === "21") ||
    (x1 === "8" && x2 === "16" && y1 === "21" && y2 === "21")
  );
};

export const MONITOR_SCREEN_KEYFRAMES = {
  // Damped left-right swivel around the stand-top joint (12, 17). Peak
  // angle ±6° keeps the top-screen corners safely inside the 24×24
  // viewBox: y ≈ 2.03 at peak, leaving ~1 unit of margin for the
  // stroke radius. Settles back to 0 through a smaller return swing
  // so the motion reads as damped (signature characteristic of bell
  // shell rocking, applied here to a horizontal pivot axis).
  rotate: [0, -6, 4, -2, 0],
  // Opacity dip phase-locked to the swivel apexes. Screen flickers
  // slightly as it angles away from the viewer, brightens as it
  // returns to centre. Sub-icons share this curve via the modifier-
  // reveal so payloads dim WITH the screen rather than sitting
  // statically bright while the display swivels.
  opacity: [1, 0.72, 1, 0.88, 1],
  times: [0, 0.25, 0.5, 0.75, 1],
};

export const monitorChassis: Motion = {
  matches: (ctx) =>
    isStandardScreenRect(ctx) ||
    matchScreenPath(ctx) ||
    matchStandPath(ctx) ||
    isStandardStandLine(ctx),
  factory: (ctx) => {
    const isScreen = isStandardScreenRect(ctx) || matchScreenPath(ctx);
    if (isScreen) {
      return {
        rest: { rotate: 0, opacity: 1 },
        active: {
          rotate: MONITOR_SCREEN_KEYFRAMES.rotate,
          opacity: MONITOR_SCREEN_KEYFRAMES.opacity,
          transition: {
            duration: ctx.duration,
            delay: ctx.delay,
            repeat: ctx.repeat,
            ease: "easeInOut",
            times: MONITOR_SCREEN_KEYFRAMES.times,
          },
        },
      };
    }
    // Stand stem/base — opacity dip in lockstep with the screen, but
    // no rotation (rotating the stand around (12, 17) would translate
    // the base visibly off the icon's centreline and break the rigid
    // attachment to the ground).
    return {
      rest: { opacity: 1 },
      active: {
        opacity: MONITOR_SCREEN_KEYFRAMES.opacity,
        transition: {
          duration: ctx.duration,
          delay: ctx.delay,
          repeat: ctx.repeat,
          ease: "easeInOut",
          times: MONITOR_SCREEN_KEYFRAMES.times,
        },
      },
    };
  },
};
