import { matchAnyPath, type Motion } from "../compose";
import { FOLDER_BODY_KEYFRAMES } from "./folder-body";

/**
 * Folder-family wildcard reveal — every non-body path reveals at
 * the body's first tilt apex, then inherits BOTH the body's rotate
 * and opacity for the rest of the cycle so payloads tilt and dim
 * WITH the folder (principle 2 — cohesion; monitor and mail are the
 * existing precedents).
 *
 * Catches whatever's left after `folderBody` claims the outline:
 *
 * - State markers: `-check` tick, `-x` strokes, `-plus` / `-minus`,
 *   `-up` / `-down` arrows.
 * - Payload glyphs: `-bookmark` ribbon, `-closed` divider line,
 *   `-code` chevrons, `-kanban` bars, `-archive` lines + circle,
 *   `-clock` arm + circle, `-cog` teeth + hub, `-git` connectors +
 *   circles, `-git-2` curve + circles, `-heart` curve, `-input` /
 *   `-output` / `-symlink` arrows + dividers, `-key` shackle +
 *   circle, `-lock` shackle + rect, `-pen` body, `-root` post +
 *   circle, `-search` / `-search-2` loupe + handle + circle,
 *   `-sync` arrows, `-dot` / `-open-dot` notification dots.
 *
 * Branches by element type:
 *
 * - `<path>` / `<line>` → `strokeDasharray` + `strokeDashoffset`
 *   draw-in over the measured `ctx.pathLength` (cleared on
 *   `transitionEnd`).
 * - `<circle>` / `<rect>` → `scale` from 0, pivoted at the
 *   element's own `fill-box` centre.
 *
 * Reveal completes at `t = 0.25` — exactly when the folder reaches
 * its first tilt apex. Opacity tracks `FOLDER_BODY_KEYFRAMES.opacity`
 * from 0 — `[0, 0, 0.78, 1, 0.9, 1]` — so the payload emerges into
 * the folder's first dim and breathes with the body through the
 * rest of the cycle.
 *
 * `rotate` inherits the body's tilt directly (uniform in-plane
 * rotation around a fixed pivot is safe to direct-inherit per
 * principle 2's first branch — no orientation distortion).
 *
 * Place this LAST in the compose `motions` list — `matchAnyPath` is
 * greedy and would otherwise claim the body.
 */
export const folderModifierReveal: Motion = {
  matches: matchAnyPath,
  factory: (ctx) => {
    const isShape = ctx.pathTag === "circle" || ctx.pathTag === "rect";
    // Sub-icons share the body's 3D tilt + scaleY + opacity via the
    // signature's global `transformOrigin` (12, 20) — the bottom-
    // centre pivot of the folder — so the whole icon hinges as one
    // 3D scene. Reveal mechanism (dasharray vs scale-from-fill-box)
    // is per element type as usual.
    if (isShape) {
      return {
        rest: {
          scale: 1,
          opacity: 1,
          rotateX: 0,
          scaleY: 1,
          transformBox: "fill-box",
          transformOrigin: "center",
          transformPerspective: 600,
        },
        active: {
          scale: [0, 0, 1],
          opacity: [0, 0, 0.7, 1],
          // 3D tilt + scaleY backup are NOT applied per-shape — they
          // need to share the icon-level pivot to stay coherent. The
          // shape just emerges via scale + opacity; the signature's
          // global transformOrigin handles the bend across the whole
          // icon when the body's transform cascades visually.
          //
          // (transformBox: "fill-box" overrides the global pivot for
          // the reveal scale only; rotateX/scaleY on shapes would
          // pivot at the shape's own centre and look detached from
          // the body's hinge. Skip them for shape payloads — they
          // still appear at the right scaled position because the
          // body's transform reshapes the viewBox area they sit in.)
          transformBox: "fill-box",
          transformOrigin: "center",
          transition: {
            duration: ctx.duration,
            delay: ctx.delay + ctx.index * ctx.stagger,
            repeat: ctx.repeat,
            scale: { inherit: true, ease: "easeOut", times: [0, 0.2, 0.4] },
            opacity: {
              inherit: true,
              ease: "easeOut",
              times: [0, 0.2, 0.4, 1],
            },
          },
        },
      };
    }
    // Path / line markers: share the body's 3D tilt + scaleY +
    // opacity directly. They pivot at the signature's icon-level
    // (12, 20) so the whole icon bends as one.
    return {
      rest: {
        strokeDasharray: 0,
        strokeDashoffset: 0,
        opacity: 1,
        rotateX: 0,
        scaleY: 1,
        transformPerspective: 600,
      },
      active: {
        strokeDasharray: ctx.pathLength,
        strokeDashoffset: [ctx.pathLength, ctx.pathLength, 0],
        opacity: [0, 0, 0.7, 1],
        rotateX: FOLDER_BODY_KEYFRAMES.rotateX,
        scaleY: FOLDER_BODY_KEYFRAMES.scaleY,
        transformPerspective: 600,
        transition: {
          duration: ctx.duration,
          delay: ctx.delay + ctx.index * ctx.stagger,
          repeat: ctx.repeat,
          strokeDasharray: { duration: 0 },
          strokeDashoffset: { inherit: true, ease: "easeOut", times: [0, 0.2, 0.4] },
          opacity: {
            inherit: true,
            ease: "easeOut",
            times: [0, 0.2, 0.4, 1],
          },
          rotateX: {
            inherit: true,
            ease: "easeInOut",
            times: FOLDER_BODY_KEYFRAMES.times,
          },
          scaleY: {
            inherit: true,
            ease: "easeInOut",
            times: FOLDER_BODY_KEYFRAMES.times,
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
