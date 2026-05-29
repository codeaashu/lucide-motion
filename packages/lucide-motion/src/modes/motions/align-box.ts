import type { Motion } from "../compose";

/**
 * Box reveal cascade for the align family — each box scales in
 * from 0 with opacity, sequenced by its position along the
 * alignment axis. Reads as items snapping into alignment one by
 * one, in the order they distribute along the axis.
 *
 * Cascade axis comes from the icon name:
 *
 * - Name contains `horizontal` → boxes vary by x (side by side);
 *   cascade left → right.
 * - Name contains `vertical` → boxes vary by y (stacked);
 *   cascade top → bottom.
 *
 * Box slot:
 *
 * - First box (smaller axis position) → slot 0 (`t ∈ [0, 0.5]`)
 * - Second box (larger axis position) → slot 1 (`t ∈ [0.4, 0.9]`)
 *
 * Slots intentionally overlap so the second box starts emerging
 * while the first is still settling — handoff feels continuous
 * rather than discrete. `easeInOut` on every value so each box
 * eases both into and out of motion (no snap).
 *
 * Boxes are detected as `<rect>` elements OR `<path>` elements
 * with an arc (`a`/`A`) command — in Lucide's align icons the
 * `align-center-*` variants render their rounded boxes as paths
 * with arc corners rather than rects. Position thresholding at
 * the icon midpoint (12) sorts the two boxes; multi-element
 * boxes (the `align-center-*` half-pair paths) share their slot
 * because both halves sit in the same x or y range.
 *
 * Scale pivot is each element's own `fill-box` centre so the box
 * grows in place rather than sliding from the icon centre. The
 * scale + opacity reveal completes by `t = 0.6`, leaving the rest
 * of the cycle for the reference line's opacity dim to finish.
 *
 * Placed AFTER `alignReferenceLine` in each align signature so
 * lines are claimed first; this motion catches everything else.
 *
 * Closed cycle: scale and opacity both end at 1.
 */
const ALIGN_ICON_RE = /^align-/;

const hasArc = (d: string): boolean => /[aA]/.test(d);

const isBoxElement = (ctx: {
  iconName: string;
  pathTag: string;
  pathAttrs: Record<string, string | number>;
}): boolean => {
  if (!ALIGN_ICON_RE.test(ctx.iconName)) return false;
  if (ctx.pathTag === "rect") return true;
  if (ctx.pathTag === "path") {
    return hasArc(String(ctx.pathAttrs.d ?? ""));
  }
  return false;
};

const firstCoord = (ctx: {
  pathTag: string;
  pathAttrs: Record<string, string | number>;
}): { x: number; y: number } => {
  if (ctx.pathTag === "rect") {
    return {
      x: Number(ctx.pathAttrs.x ?? 0),
      y: Number(ctx.pathAttrs.y ?? 0),
    };
  }
  const d = String(ctx.pathAttrs.d ?? "");
  const m = d.match(
    /^[mM]\s*(-?\d+(?:\.\d+)?)[\s,]+(-?\d+(?:\.\d+)?)/
  );
  if (!m) return { x: 0, y: 0 };
  return { x: Number(m[1]), y: Number(m[2]) };
};

export const alignBox: Motion = {
  matches: isBoxElement,
  factory: (ctx) => {
    const axis = ctx.iconName.includes("horizontal") ? "x" : "y";
    const c = firstCoord(ctx);
    const val = axis === "x" ? c.x : c.y;
    const slot = val < 12 ? 0 : 1;
    // Slot 0: [0, 0.5]; slot 1: [0.4, 0.9]. Slight overlap so the
    // second box begins emerging while the first is still settling
    // — keeps the cascade continuous rather than discrete.
    const start = slot === 0 ? 0 : 0.4;
    const end = slot === 0 ? 0.5 : 0.9;
    return {
      rest: {
        scale: 1,
        opacity: 1,
        transformBox: "fill-box",
        transformOrigin: "center",
      },
      active: {
        scale: [0, 0, 1, 1],
        opacity: [0, 0, 1, 1],
        transformBox: "fill-box",
        transformOrigin: "center",
        transition: {
          duration: ctx.duration,
          delay: ctx.delay,
          repeat: ctx.repeat,
          scale: {
            inherit: true,
            ease: "easeInOut",
            times: [0, start, end, 1],
          },
          opacity: {
            inherit: true,
            ease: "easeInOut",
            times: [0, start, end, 1],
          },
        },
      },
    };
  },
};
