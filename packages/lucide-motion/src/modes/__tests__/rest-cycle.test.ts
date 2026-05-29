import { describe, expect, it } from "vitest";
import type { Variants } from "motion/react";
import type { ModeContext } from "../types";
import type { Motion } from "../compose";

// Eager-load every motion in the registry. `import.meta.glob` is Vite's
// build-time directory glob (vitest runs through Vite), so adding a new
// motion file is automatically covered without touching this test. The
// library's tsconfig intentionally doesn't include Vite's ImportMeta
// augmentation to keep the published types clean, so the call is locally
// `// @ts-expect-error`'d here.
// @ts-expect-error vite-only API; transformed before runtime
const motionModules = import.meta.glob("../motions/*.ts", {
  eager: true,
}) as Record<string, Record<string, unknown>>;

const baseCtx: ModeContext = {
  iconName: "audit",
  index: 0,
  pathTag: "path",
  pathAttrs: { d: "M0 0h24v24H0z" },
  duration: 0.6,
  delay: 0,
  stagger: 0.05,
  easing: "easeInOut",
  repeat: 0,
  pathLength: 100,
};

function isMotion(value: unknown): value is Motion {
  return (
    typeof value === "object" &&
    value !== null &&
    "matches" in value &&
    "factory" in value &&
    typeof (value as { factory: unknown }).factory === "function"
  );
}

function lastFrame(value: unknown): unknown {
  return Array.isArray(value) ? value[value.length - 1] : value;
}

/**
 * Holds true for every signature motion (and the default draw mode): when
 * the active animation runs to completion, every animated property must
 * land back at its rest value, either by ending its keyframe array at the
 * rest value OR by clearing the property in `transitionEnd`. Without this
 * invariant the icon visibly drifts away from its Lucide-original glyph
 * after a play, leaving it permanently off-model from Lucide's glyph.
 *
 * Best practice: author each motion's `active` keyframes as a closed cycle
 * that starts and ends at the rest value. Do not rely on an engine-level
 * snap-back — make the return part of the animation itself.
 */
function landsAtRest(prop: string, end: unknown, rest: unknown): boolean {
  // Rotations are visually equivalent modulo 360°. Motion also snaps to
  // the first keyframe on re-trigger, so a `[0, -360]` active that holds
  // at -360 between plays is indistinguishable from rest=0.
  if (
    prop === "rotate" &&
    typeof end === "number" &&
    typeof rest === "number"
  ) {
    return (end - rest) % 360 === 0;
  }
  // Everything else (scale, opacity, x, y, strokeDashoffset, ...) must
  // land at the literal rest value.
  return Object.is(end, rest) || JSON.stringify(end) === JSON.stringify(rest);
}

describe("motion rest-cycle invariant", () => {
  for (const [path, mod] of Object.entries(motionModules)) {
    for (const [exportName, value] of Object.entries(mod)) {
      if (!isMotion(value)) continue;
      const id = `${exportName} (${path.replace(/^\.\.\//, "")})`;

      it(`${id} active variant ends at rest`, () => {
        const variants = value.factory(baseCtx) as Variants;
        const rest = (variants.rest ?? {}) as Record<string, unknown>;
        const active = (variants.active ?? {}) as Record<string, unknown>;
        const transitionEnd =
          ((active.transitionEnd ?? {}) as Record<string, unknown>) ?? {};

        for (const [prop, activeValue] of Object.entries(active)) {
          // Styling fields and motion's per-property transition objects
          // are not animated values themselves.
          if (
            prop === "transition" ||
            prop === "transitionEnd" ||
            prop === "transformOrigin" ||
            prop === "transformBox"
          ) {
            continue;
          }

          // A `transitionEnd` entry for this prop overrides the active
          // animation's end value — that's the documented escape hatch
          // for the dasharray draw cleanup.
          const final =
            prop in transitionEnd ? transitionEnd[prop] : lastFrame(activeValue);

          expect(
            landsAtRest(prop, final, rest[prop]),
            `${id}: active.${prop} must land at rest.${prop} (got ${JSON.stringify(final)}, rest = ${JSON.stringify(rest[prop])}). Author the active keyframes as a closed cycle that returns to rest, or use transitionEnd to reset.`
          ).toBe(true);
        }
      });
    }
  }
});
