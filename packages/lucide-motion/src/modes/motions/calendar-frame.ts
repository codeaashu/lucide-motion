import { matchPathDOneOf, type Motion } from "../compose";
import type { ModeContext } from "../types";

/**
 * Calendar frame — the host motion for every icon built around the
 * Lucide calendar shape (23 hosts today: `calendar`, `calendar-1`,
 * `calendar-clock`, `calendar-check`, `calendar-search`, ...,
 * plus the two `notepad-text*` variants that share the
 * pinned-at-top idiom). Four anatomical roles, matched per-path:
 *
 * - **Body** — a `<rect>` for the canonical eight hosts (and the
 *   `notepad-text` variant which uses a slightly smaller rect), plus
 *   13 partial-body `<path>` shapes used by composites where Lucide
 *   cuts the body to make room for an inset badge (calendar-cog,
 *   calendar-clock, calendar-arrow-up, calendar-fold, etc.). All
 *   share the same gentle paper-settle.
 * - **Left pin** (`M8 2v4`) and **right pin** (`M16 2v4`) — the two
 *   vertical strokes hanging above the body. Identical across 22
 *   and 23 hosts respectively. Both pluck UP briefly, like push-pins
 *   being engaged into the wall above the calendar.
 * - **Top divider** (`M3 10h18`) — horizontal line separating the
 *   header from the days area. Shared across 18 hosts. Bobs with
 *   the body (it IS the body's top shelf, conceptually).
 *
 * **Real-life physics**: a calendar being pinned to a wall. Two
 * opposing y beats give the gesture a "stretch" feel — pins lift up
 * (engaging into the wall above), body and divider settle down (the
 * calendar hangs into place under gravity), both return to rest
 * together on a shared `times` schedule.
 *
 * Pin tops reach y=1.5 at peak (well inside the viewBox top); body
 * bottom reaches y=22.3 + stroke radius 1 = y=23.3 (inside 24). The
 * pin-body overlap at the header (originally y=4 to y=6) shrinks
 * from 2 units to 1.2 units at peak, never breaking the seam.
 *
 * Exports `CALENDAR_FRAME_KEYFRAMES` so future calendar-family
 * motions (badge subjects, state-marker reveals) can phase-lock via
 * per-value `inherit: true`.
 */
const LEFT_PIN_D = "M8 2v4";
const RIGHT_PIN_D = "M16 2v4";
const DIVIDER_D = "M3 10h18";

// `calendar-off` cuts the divider into two stubs and adds a second
// partial body where the slash crosses through. These behave like
// the regular divider/body (bob with the host settle), so they
// route through the same y branches below.
const DIVIDER_OFF_LEFT_D = "M3 10h7";
const DIVIDER_OFF_RIGHT_D = "M21 10h-5.5";
const BODY_OFF_RIGHT_D = "M21 15.5V6a2 2 0 0 0-2-2H9.5";

// Every body-path shape that pairs with the pin idiom. Partial bodies
// each used by one composite where Lucide cuts the rect for an inset
// badge. The canonical body is the standard `<rect>` (handled below
// via `isCanonicalRect`).
const CALENDAR_BODY_PATHS = [
  "M21 11.354V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7.343", // calendar-arrow-down
  "M21 11.343V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9", // calendar-arrow-up
  "M21 14V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8", // calendar-check-2
  "M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5", // calendar-clock
  "M21 10.592V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6", // calendar-cog
  "M3 20a2 2 0 0 0 2 2h10a2.4 2.4 0 0 0 1.706-.706l3.588-3.588A2.4 2.4 0 0 0 21 16V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z", // calendar-fold
  "M12.127 22H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5.125", // calendar-heart
  "M21 15V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8.5", // calendar-minus
  "M4.2 4.2A2 2 0 0 0 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 1.82-1.18", // calendar-off (left body fragment)
  BODY_OFF_RIGHT_D, // calendar-off (right body fragment)
  "M21 12.598V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8.5", // calendar-plus
  "M21 11.75V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7.25", // calendar-search
  "M21 8.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4.3", // calendar-sync
  "M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8", // calendar-x-2
];

const matchCalendarBodyPath = matchPathDOneOf(...CALENDAR_BODY_PATHS);

/**
 * Canonical calendar body: `<rect x=3 y=4 width=18 height=18 rx=2>`.
 * Used by 8 hosts including the base `calendar` icon.
 */
function isCalendarRect(ctx: ModeContext): boolean {
  return (
    ctx.pathTag === "rect" &&
    String(ctx.pathAttrs.x) === "3" &&
    String(ctx.pathAttrs.y) === "4" &&
    String(ctx.pathAttrs.width) === "18" &&
    String(ctx.pathAttrs.height) === "18" &&
    String(ctx.pathAttrs.rx) === "2"
  );
}

/**
 * Notepad-text body: `<rect x=4 y=4 width=16 height=18 rx=2>` —
 * slightly inset from the calendar rect to leave room for the spiral
 * binding hint at the side. Different rect, same pinned-host motion.
 */
function isNotepadRect(ctx: ModeContext): boolean {
  return (
    ctx.pathTag === "rect" &&
    String(ctx.pathAttrs.x) === "4" &&
    String(ctx.pathAttrs.y) === "4" &&
    String(ctx.pathAttrs.width) === "16" &&
    String(ctx.pathAttrs.height) === "18" &&
    String(ctx.pathAttrs.rx) === "2"
  );
}

function isBody(ctx: ModeContext): boolean {
  return isCalendarRect(ctx) || isNotepadRect(ctx) || matchCalendarBodyPath(ctx);
}

function isPin(ctx: ModeContext): boolean {
  if (ctx.pathTag !== "path") return false;
  const d = String(ctx.pathAttrs.d);
  return d === LEFT_PIN_D || d === RIGHT_PIN_D;
}

function isDivider(ctx: ModeContext): boolean {
  if (ctx.pathTag !== "path") return false;
  const d = String(ctx.pathAttrs.d);
  return d === DIVIDER_D || d === DIVIDER_OFF_LEFT_D || d === DIVIDER_OFF_RIGHT_D;
}

/**
 * Shared timing for the host calendar frame. Other calendar-family
 * motions can inherit these values via per-value `inherit: true` to
 * phase-lock with the pluck-and-settle gesture.
 */
export const CALENDAR_FRAME_KEYFRAMES = {
  // Body + divider: gentle settle down. Closed cycle.
  bodyY: [0, 0.3, 0],
  // Pins: pluck up (opposite direction to body) — push-pins
  // engaging into the wall above the frame.
  pinY: [0, -0.5, 0],
  // Shared timing for body, divider, and pins so the stretch
  // reads as one coordinated gesture.
  times: [0, 0.4, 1],
};

export const calendarFrame: Motion = {
  matches: (ctx) => isPin(ctx) || isBody(ctx) || isDivider(ctx),
  factory: (ctx) => {
    if (isPin(ctx)) {
      return {
        rest: { y: 0 },
        active: {
          y: CALENDAR_FRAME_KEYFRAMES.pinY,
          transition: {
            duration: ctx.duration,
            delay: ctx.delay,
            repeat: ctx.repeat,
            ease: "easeInOut",
            times: CALENDAR_FRAME_KEYFRAMES.times,
          },
        },
      };
    }
    // Body or divider — both bob down on the same schedule.
    return {
      rest: { y: 0 },
      active: {
        y: CALENDAR_FRAME_KEYFRAMES.bodyY,
        transition: {
          duration: ctx.duration,
          delay: ctx.delay,
          repeat: ctx.repeat,
          ease: "easeInOut",
          times: CALENDAR_FRAME_KEYFRAMES.times,
        },
      },
    };
  },
};
