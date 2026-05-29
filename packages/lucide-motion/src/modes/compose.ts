import type { Variants } from "motion/react";
import { draw } from "./draw";
import type { Mode, ModeContext, ModeDefaults } from "./types";

/**
 * A self-describing per-path motion. `matches(ctx)` decides whether this
 * motion drives the current path; `factory(ctx)` produces the Motion
 * variants for it. Motion modules live in `src/modes/motions/` and are
 * imported by signature files, which assemble them via {@link compose}.
 *
 * Most motions match a specific path by its SVG attributes (e.g. a known
 * `d` string for a `<path>`, or `cx`/`cy`/`r` for a `<circle>`). A few
 * "whole-icon" motions match every path of an icon — see
 * {@link matchAnyPath}.
 */
export interface Motion {
  /** Returns true if this motion should drive the path described by `ctx`. */
  matches: (ctx: ModeContext) => boolean;
  /** Produce Motion variants for the path. Must expose `rest` and `active`. */
  factory: (ctx: ModeContext) => Variants;
}

/** Options accepted by {@link compose}. */
export interface ComposeOptions {
  /**
   * Per-path motions, tried in order. The first motion whose `matches`
   * returns true for the current path provides its variants. Put more
   * specific motions earlier in the list than general ones.
   */
  motions: Motion[];
  /**
   * Timing defaults the resulting Mode prefers. Layers between
   * `MotionIconConfig` and the engine's built-in defaults.
   */
  defaults?: ModeDefaults;
  /**
   * Pivot point in viewBox units. Defaults to `"12px 12px"` (icon center).
   * Set, for example, to `"12px 4px"` for a top-mounted pivot like a bell.
   */
  transformOrigin?: string;
  /**
   * Whether the engine sets `transformOrigin` / `transformBox` on each
   * animated child. Defaults to `true` since most composed signatures use
   * transforms (rotate, scale, translate). Pass `false` only if your
   * signature animates non-transform properties exclusively.
   */
  needsTransformOrigin?: boolean;
}

/** Matches a `<path>` element by its `d` attribute. The common case. */
export const matchPathD =
  (d: string) =>
  (ctx: ModeContext): boolean =>
    ctx.pathTag === "path" && ctx.pathAttrs.d === d;

/**
 * Matches a `<path>` element whose `d` attribute is one of the given
 * strings. Used when the same motion should drive several visually-similar
 * paths — e.g. the bell shell takes slightly different `d` values across
 * `bell`, `bell-plus`, `bell-minus`, etc., but the same rocking physics
 * applies to all of them.
 */
export const matchPathDOneOf =
  (...ds: string[]) =>
  (ctx: ModeContext): boolean =>
    ctx.pathTag === "path" && ds.includes(String(ctx.pathAttrs.d));

/**
 * Matches any path of any icon — useful for "whole-icon" signatures where
 * every child should run the same motion (e.g. a loader where all rays
 * rotate together). Place these last in the motions list so more specific
 * matches get tried first.
 */
export const matchAnyPath = (_ctx: ModeContext): boolean => true;

/**
 * Tracks unmatched (icon, index, pathTag) triplets that have already
 * produced a warning so we don't spam the console on every render.
 */
const warnedUnmatchedPaths = new Set<string>();

/**
 * Build a {@link Mode} from a list of {@link Motion}s. The resulting
 * factory dispatches each path to the first motion whose `matches`
 * predicate returns true. Paths that don't match anything fall back to the
 * default `"draw"` mode's factory (so the path still animates rather than
 * going static), and emit a one-time dev warning so coverage gaps surface
 * during development. The warning is dead-code-eliminated in production.
 */
export function compose(opts: ComposeOptions): Mode {
  return {
    factory: (ctx) => {
      for (const motion of opts.motions) {
        if (motion.matches(ctx)) {
          return motion.factory(ctx);
        }
      }
      if (process.env.NODE_ENV !== "production") {
        const key = `${ctx.iconName}:${ctx.index}:${ctx.pathTag}`;
        if (!warnedUnmatchedPaths.has(key)) {
          warnedUnmatchedPaths.add(key);
          console.warn(
            `[lucide-motion] No motion matched path ${ctx.index} (<${ctx.pathTag}>) of icon "${ctx.iconName}" in a composed signature. Falling back to mode="draw" for this path.`
          );
        }
      }
      return draw.factory(ctx);
    },
    defaults: opts.defaults,
    needsTransformOrigin: opts.needsTransformOrigin ?? true,
    transformOrigin: opts.transformOrigin,
  };
}

/**
 * Test-only: clear the unmatched-path warning cache between test runs.
 * Not exported from the package barrel.
 */
export function __resetComposeWarnings(): void {
  warnedUnmatchedPaths.clear();
}
