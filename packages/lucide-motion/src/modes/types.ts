import type { Easing, Variants } from "motion/react";

/**
 * The timing + identity context a mode factory receives. The engine resolves
 * every value (prop > MotionIconConfig > mode.defaults > engine DEFAULTS)
 * before calling the factory, so factories never have to think about
 * fallback layers - just build the variant.
 */
export interface ModeContext {
  /** Stable lucide name of the icon (`"heart"`, `"circle-arrow-up"`). */
  iconName: string;
  /** Index of the SVG child path the factory is being asked to animate. */
  index: number;
  /**
   * Tag name of the SVG element being animated (`"path"`, `"circle"`,
   * `"rect"`, `"line"`, …). Lets motion modules match by element kind in
   * addition to attribute content.
   */
  pathTag: string;
  /**
   * Attributes of the SVG element being animated. For `<path>` elements
   * this includes the `d` string; for `<circle>` it's `cx`/`cy`/`r`; etc.
   * Motion modules use this to identify the specific path they animate.
   */
  pathAttrs: Record<string, string | number>;
  /** Resolved animation duration in seconds. */
  duration: number;
  /** Resolved delay in seconds before each stroke draws. */
  delay: number;
  /** Resolved per-stroke delay increment. */
  stagger: number;
  /** Resolved easing curve. */
  easing: Easing | Easing[];
  /** Resolved repeat count. `0` plays once; `Infinity` loops. */
  repeat: number;
  /**
   * Measured total length of the rendered SVG geometry element in user units,
   * from `getTotalLength()`. `0` only on the synchronous first render before
   * `useLayoutEffect` has run; that render never reaches an active variant
   * (the engine re-runs the factory with the real length before any
   * animation can fire), so modes can treat this as always-truthy when
   * sizing the active draw.
   */
  pathLength: number;
}

/**
 * A pure function that turns a {@link ModeContext} into Motion variants. Must
 * expose `rest` and `active` keys so the trigger system and
 * `data-motion-state` lifecycle continue to work.
 */
export type ModeFactory = (ctx: ModeContext) => Variants;

/**
 * Timing fields a mode can opt-in to defaulting differently from the engine.
 * Layers between `MotionIconConfig` and the engine's built-in `DEFAULTS`. Per-
 * icon props always win.
 */
export interface ModeDefaults {
  duration?: number;
  delay?: number;
  stagger?: number;
  easing?: Easing | Easing[];
  repeat?: number;
}

/**
 * A self-contained motion preset: the variant factory plus its preferred
 * timing defaults and whether it requires transform-origin centering.
 */
export interface Mode {
  /** Build the variants from a fully-resolved context. */
  factory: ModeFactory;
  /** Timing defaults the mode prefers (e.g. a spin defaults to linear easing). */
  defaults?: ModeDefaults;
  /**
   * Transform-based modes (rotate, scale, translate) need the SVG element's
   * transform origin set in viewBox coordinates. The engine sets
   * `transformOrigin: "12px 12px"; transformBox: "view-box"` on each animated
   * child when this is `true`.
   */
  needsTransformOrigin?: boolean;
  /**
   * Optional override for the transform origin used when `needsTransformOrigin`
   * is set. Defaults to `"12px 12px"` (icon center). Use a different pivot
   * for physics-aware modes — e.g. `"12px 4px"` makes a bell rock from its
   * mount instead of its center.
   */
  transformOrigin?: string;
}

/**
 * Built-in mode identifiers. `"signature"` is the special lookup mode that
 * uses the per-icon registry and falls back to `"draw"` when no entry exists.
 */
export type ModeName = "draw" | "signature";
