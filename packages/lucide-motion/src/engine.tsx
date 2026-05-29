"use client";

/**
 * The animation engine for `lucide-motion`.
 *
 * Generated per-icon components (`src/generated/*`) are thin wrappers around
 * `<DrawIcon />`. Users typically import the icon they want by name -
 * `import { Heart } from "lucide-motion"` - and never touch this file
 * directly. It is exported as the low-level escape hatch for consumers who
 * want to build their own icon from raw Lucide node data.
 */

import {
  createContext,
  useContext,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type Ref,
  type RefObject,
  type SVGAttributes,
} from "react";
import {
  motion,
  useAnimationControls,
  useInView,
  useReducedMotion,
  type Easing,
  type SVGMotionProps,
  type Variants,
} from "motion/react";
import {
  resolveMode,
  type Mode,
  type ModeDefaults,
  type ModeFactory,
  type ModeName,
} from "./modes";
type AnimationControls = ReturnType<typeof useAnimationControls>;

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

/** Lucide's icon-node format: a tuple of [tagName, attrs]. */
export type IconNode = [tag: string, attrs: Record<string, string | number>];

export type Trigger =
  | "hover"
  | "click"
  | "mount"
  | "in-view"
  | "parent-hover"
  | "manual";

export type OnLeave = "complete" | "snap" | "redraw";

export type ReducedMotion = "system" | "always" | "never";

/**
 * Lifecycle phase the icon broadcasts via `data-motion-state` on the rendered
 * `<svg>`. Consumers style against it with CSS so host color/transforms can
 * stay in sync with the internal draw — for example, keeping a parent's
 * `hover:text-primary` pinned for the full draw under `onLeave="complete"`.
 *
 * Only two phases: either the stroke is currently animating, or it isn't.
 * Anything more complex ("has been clicked", "post-draw glow") composes from
 * this state plus standard CSS pseudo-classes (`:hover`, `:focus-visible`)
 * or the consumer's own React state.
 */
export type MotionState = "resting" | "drawing";

/** Imperative handle exposed via `ref` when `trigger="manual"`. */
export interface MotionIconHandle {
  /** Play the active animation. */
  play: () => void;
  /** Snap back to the rest state. */
  reset: () => void;
  /** The underlying SVG element. */
  node: SVGSVGElement | null;
}

/** Subset of `DrawIconProps` that can be set globally via `<MotionIconConfig />`. */
export interface MotionIconConfigValue {
  size?: number;
  color?: string;
  strokeWidth?: number;
  absoluteStrokeWidth?: boolean;
  duration?: number;
  delay?: number;
  stagger?: number;
  easing?: Easing | Easing[];
  repeat?: number;
  trigger?: Trigger;
  onLeave?: OnLeave;
  reducedMotion?: ReducedMotion;
  mode?: ModeName | ModeFactory;
}

/**
 * Props for `<DrawIcon />` and every generated icon component. Extends
 * React's standard SVG attributes so consumers retain access to `className`,
 * `style`, `onClick`, `aria-*`, and `data-*`.
 */
export interface DrawIconProps
  extends Omit<
    SVGAttributes<SVGSVGElement>,
    | "ref"
    | "children"
    | "mode"
    // The engine owns these — motion-dom's animation lifecycle drives
    // `data-motion-state`. Accepting consumer-supplied handlers would
    // race with the internal handlers, so they're stripped before the
    // passthrough. Omit them from the public type so TypeScript doesn't
    // suggest them on `<DrawIcon />` or any generated icon.
    | "onAnimationStart"
    | "onAnimationComplete"
  > {
  /** Lucide icon node array. Generated icons fill this in for you. */
  nodes: IconNode[];
  /** Pixel size of the icon. Default: 24. */
  size?: number;
  /** Stroke color. Default: `currentColor`. */
  color?: string;
  /** Stroke width. Default: 2. */
  strokeWidth?: number;
  /** When true, the stroke stays pixel-constant regardless of `size`. */
  absoluteStrokeWidth?: boolean;
  /** Animation duration in seconds. Default: 0.55. */
  duration?: number;
  /** Animation delay in seconds before each stroke draws. Default: 0. */
  delay?: number;
  /** Per-stroke delay increment (cascade). Default: 0.12. */
  stagger?: number;
  /** Motion easing. Accepts named curves or a cubic bezier tuple. */
  easing?: Easing | Easing[];
  /** Repeat count. `0` plays once, `Infinity` loops. Default: 0. */
  repeat?: number;
  /** When/how the animation fires. Default: `"hover"`. */
  trigger?: Trigger;
  /** Behavior when hover/parent-hover ends. Default: `"complete"`. */
  onLeave?: OnLeave;
  /** Respect, force on, or force off the OS reduced-motion preference. */
  reducedMotion?: ReducedMotion;
  /**
   * Named motion preset, or a factory `(ctx) => Variants`. `"draw"` (default)
   * runs the stroke-on animation; `"signature"` plays the per-icon-specific
   * animation (falls back to `"draw"` if none is registered). The `variants`
   * prop, if set, wins over `mode`.
   */
  mode?: ModeName | ModeFactory;
  /**
   * Lucide name of the icon being rendered. Set automatically by every
   * generated icon component; only relevant if you're using `<DrawIcon />`
   * directly with raw nodes. Used by `mode="signature"` to look up the
   * per-icon animation and to identify the source in dev warnings.
   */
  iconName?: string;
  /**
   * The signature mode used when `mode="signature"`. Every generated icon
   * with a registered signature sets this automatically; direct
   * `<DrawIcon />` users can supply their own to make an arbitrary node
   * set respond to `mode="signature"`.
   */
  signature?: Mode;
  /** Escape hatch: replace the default draw variants entirely. */
  variants?: Variants | ((index: number) => Variants);
  /** Imperative ref handle (React 19 ref-as-prop). */
  ref?: Ref<MotionIconHandle>;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SVG_BASE = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * For `trigger="parent-hover"`, the icon walks up the DOM to find the nearest
 * element carrying this attribute and binds to its hover events. Exported so
 * consumers can reference it without hardcoding the string.
 */
export const PARENT_HOVER_ATTR = "data-motion-icon-group";
const PARENT_HOVER_SELECTOR = `[${PARENT_HOVER_ATTR}]`;

// `mode` is intentionally excluded — it's not a scalar with a default value,
// it's a discriminated union resolved by `resolveMode`. Resolution still
// honors the same priority order (prop > MotionIconConfig > built-in).
const DEFAULTS = {
  size: 24,
  color: "currentColor",
  strokeWidth: 2,
  absoluteStrokeWidth: false,
  duration: 0.55,
  delay: 0,
  stagger: 0.12,
  easing: "easeInOut" as Easing,
  repeat: 0,
  trigger: "hover" as Trigger,
  onLeave: "complete" as OnLeave,
  reducedMotion: "system" as ReducedMotion,
} satisfies Required<Omit<MotionIconConfigValue, "mode">>;

type DefaultKey = keyof typeof DEFAULTS;
type Resolved = { [K in DefaultKey]: (typeof DEFAULTS)[K] };

// ---------------------------------------------------------------------------
// Context provider for app-wide defaults
// ---------------------------------------------------------------------------

const MotionIconContext = createContext<MotionIconConfigValue | null>(null);

interface MotionIconConfigProps extends MotionIconConfigValue {
  children: ReactNode;
}

/**
 * Provides default props for every `<DrawIcon />` in the subtree. Per-icon
 * props always win; nested providers merge inner over outer.
 *
 * @example
 * <MotionIconConfig duration={0.3} trigger="hover">
 *   <App />
 * </MotionIconConfig>
 */
export function MotionIconConfig({
  children,
  ...config
}: MotionIconConfigProps) {
  const parent = useContext(MotionIconContext);

  // Stabilize the provider value's identity so consumers don't re-render on
  // every parent render. Listing each config field individually is verbose
  // but lets React compare them by reference — which is the right behavior
  // for function-valued props like `easing` and `mode` that an earlier
  // `JSON.stringify(config)` approach silently collapsed to the same key.
  const value = useMemo<MotionIconConfigValue>(
    () => ({ ...parent, ...config }),
    [
      parent,
      config.size,
      config.color,
      config.strokeWidth,
      config.absoluteStrokeWidth,
      config.duration,
      config.delay,
      config.stagger,
      config.easing,
      config.repeat,
      config.trigger,
      config.onLeave,
      config.reducedMotion,
      config.mode,
    ]
  );

  return (
    <MotionIconContext.Provider value={value}>
      {children}
    </MotionIconContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Prop & mode resolution
// Resolution order for timing props: prop > MotionIconConfig > mode.defaults
// > engine DEFAULTS. The `mode` itself is resolved separately via
// `resolveMode` since it has no scalar default value.
// ---------------------------------------------------------------------------

function resolveProps(
  props: DrawIconProps,
  ctx: MotionIconConfigValue,
  modeDefaults?: ModeDefaults
): Resolved {
  const out = {} as Resolved;
  const p = props as unknown as Record<DefaultKey, unknown>;
  const c = ctx as unknown as Record<DefaultKey, unknown>;
  const m = (modeDefaults ?? {}) as Record<DefaultKey, unknown>;
  for (const key of Object.keys(DEFAULTS) as DefaultKey[]) {
    const fromProps = p[key];
    const fromCtx = c[key];
    const fromMode = m[key];
    const value =
      fromProps !== undefined
        ? fromProps
        : fromCtx !== undefined
          ? fromCtx
          : fromMode !== undefined
            ? fromMode
            : DEFAULTS[key];
    // Safe: each DefaultKey resolves to its own typed slot in DEFAULTS.
    (out as Record<DefaultKey, unknown>)[key] = value;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Trigger plumbing
// ---------------------------------------------------------------------------

function applyLeave(controls: AnimationControls, mode: OnLeave): void {
  if (mode === "redraw") {
    controls.start("active");
  } else if (mode === "complete") {
    // Let the in-progress animation play out - explicit no-op.
  } else {
    // "snap": cancel the running animation and jump to rest.
    controls.start("rest", { duration: 0 });
  }
}

interface TriggerEffectsArgs {
  trigger: Trigger;
  onLeave: OnLeave;
  controls: AnimationControls;
  svgRef: RefObject<SVGSVGElement | null>;
  isReduced: boolean;
}

/**
 * Internal subscriber for `trigger="in-view"`. Mounted by `DrawIcon` only
 * when the trigger is `"in-view"`, so we don't subscribe an IntersectionObserver
 * for every icon on the page when most of them use other triggers (hover,
 * click, parent-hover, etc.). Renders nothing — it exists purely for its
 * hooks lifecycle.
 */
function InViewSubscriber({
  svgRef,
  controls,
  isReduced,
}: {
  svgRef: RefObject<SVGSVGElement | null>;
  controls: AnimationControls;
  isReduced: boolean;
}): null {
  const inView = useInView(svgRef);

  // Replay every time the icon scrolls back into view. Reset to rest on exit
  // so the keyframe array re-fires from 0 on the next entry.
  useEffect(() => {
    if (isReduced) return;
    if (inView) controls.start("active");
    else controls.start("rest", { duration: 0 });
  }, [inView, controls, isReduced]);

  return null;
}

function useTriggerEffects({
  trigger,
  onLeave,
  controls,
  svgRef,
  isReduced,
}: TriggerEffectsArgs): void {
  // mount: fire exactly once, on first paint, and only if the trigger is
  // "mount" at that moment. The ref guards against the effect re-running when
  // `trigger` / `isReduced` / `controls` change later — a runtime trigger swap
  // or an OS reduced-motion toggle would otherwise replay the draw. "mount"
  // means first paint, so a later switch *into* "mount" intentionally does not
  // fire. (Also collapses React StrictMode's double-invoke to a single play.)
  const mountFired = useRef(false);
  useEffect(() => {
    if (mountFired.current) return;
    mountFired.current = true;
    if (isReduced) return;
    if (trigger === "mount") controls.start("active");
  }, [trigger, controls, isReduced]);

  // in-view handled by <InViewSubscriber /> (rendered conditionally in
  // DrawIcon) so we don't run useInView for every icon on the page.

  // parent-hover: bind to mouseenter/mouseleave on the nearest ancestor that
  // carries [data-motion-icon-group].
  useEffect(() => {
    if (isReduced) return;
    if (trigger !== "parent-hover") return;
    const parent = svgRef.current?.closest(PARENT_HOVER_SELECTOR);
    if (!parent) return;
    const enter = () => controls.start("active");
    const leave = () => applyLeave(controls, onLeave);
    parent.addEventListener("mouseenter", enter);
    parent.addEventListener("mouseleave", leave);
    return () => {
      parent.removeEventListener("mouseenter", enter);
      parent.removeEventListener("mouseleave", leave);
    };
  }, [trigger, controls, isReduced, onLeave, svgRef]);
}

type MotionProps = Pick<
  SVGMotionProps<"svg">,
  "initial" | "animate" | "onHoverStart" | "onHoverEnd"
>;

function getMotionProps(
  trigger: Trigger,
  onLeave: OnLeave,
  controls: AnimationControls,
  isReduced: boolean
): MotionProps {
  if (isReduced) {
    return { initial: "rest", animate: "rest" };
  }
  if (trigger === "hover") {
    return {
      initial: "rest",
      animate: controls,
      onHoverStart: () => controls.start("active"),
      onHoverEnd: () => applyLeave(controls, onLeave),
    };
  }
  // mount, in-view, click, manual, parent-hover - all driven via controls.
  return { initial: "rest", animate: controls };
}

// ---------------------------------------------------------------------------
// DrawIcon
// ---------------------------------------------------------------------------

/**
 * The animated SVG primitive. Every generated icon component is a thin
 * wrapper that supplies its own `nodes` and forwards `ref` plus all props.
 *
 * @example
 * <Heart size={24} className="text-rose-500" />
 *
 * @example
 * // Imperative control via ref:
 * const iconRef = useRef<MotionIconHandle>(null);
 * <Heart trigger="manual" ref={iconRef} />
 * <button onClick={() => iconRef.current?.play()}>play</button>
 */
export function DrawIcon(props: DrawIconProps) {
  const {
    nodes,
    variants,
    className,
    style,
    onClick,
    ref,
    mode: modeProp,
    iconName: iconNameProp,
    signature,
    ...passthrough
  } = props;
  const iconName = iconNameProp ?? "";

  const ctx = useContext(MotionIconContext) ?? {};
  const resolvedMode = resolveMode(modeProp ?? ctx.mode, iconName, signature);
  const r = resolveProps(props, ctx, resolvedMode.defaults);

  // Lucide-parity: keep stroke pixel-constant when absoluteStrokeWidth is set.
  const effectiveStrokeWidth = r.absoluteStrokeWidth
    ? (r.strokeWidth * 24) / r.size
    : r.strokeWidth;

  const systemReduced = useReducedMotion();
  const isReduced =
    r.reducedMotion === "always" ||
    (r.reducedMotion !== "never" && !!systemReduced);

  const controls = useAnimationControls();
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Broadcast lifecycle phase as `data-motion-state` so consumers can sync
  // host CSS (e.g. parent `hover:text-primary`) with the draw, which can
  // outlive the hover under `onLeave="complete"`. Two states only:
  // "drawing" while the active animation is in flight, "resting" otherwise.
  const [motionState, setMotionState] = useState<MotionState>("resting");
  const handleAnimationStart = (def: unknown) => {
    if (def === "active") setMotionState("drawing");
    else if (def === "rest") setMotionState("resting");
  };
  const handleAnimationComplete = (def: unknown) => {
    // Only the active variant ending means "draw is finished". Listening to
    // `rest` completion is unsafe: paths like trigger=click and
    // onLeave="snap" fire a synchronous rest followed by active, and motion
    // can deliver rest-complete AFTER active-start has set state to
    // "drawing", which would clobber it back to "resting" mid-draw. The
    // rest-start handler above already lands the state correctly.
    if (def === "active") setMotionState("resting");
  };

  // Imperative handle for trigger="manual".
  useImperativeHandle<MotionIconHandle, MotionIconHandle>(
    ref,
    () => ({
      play: () => {
        // Under reduced motion the svg's `animate` is the static "rest"
        // label, not `controls`, so `controls` is bound to no component.
        // Calling start() then would trip motion's "no component is using
        // these animation controls" warning and do nothing — so no-op.
        if (isReduced) return;
        controls.start("active");
      },
      reset: () => {
        if (isReduced) return;
        controls.start("rest");
      },
      // Getter so `node` reads `svgRef.current` lazily on access. The
      // deps list below intentionally omits `svgRef` (refs don't
      // belong in deps), so a property-style `node: svgRef.current`
      // would capture the value at factory time and go stale if the
      // svg were ever replaced without unmounting the React component.
      // SVG DOM identity is stable in practice today, but the getter
      // costs nothing and guards against future structural changes.
      get node() {
        return svgRef.current;
      },
    }),
    [controls, isReduced]
  );

  useTriggerEffects({
    trigger: r.trigger,
    onLeave: r.onLeave,
    controls,
    svgRef,
    isReduced,
  });

  const motionProps = getMotionProps(
    r.trigger,
    r.onLeave,
    controls,
    isReduced
  );

  // Reset to rest synchronously so the active keyframe array re-fires from
  // its first frame on every activation (click or keyboard).
  const replayClick = () => {
    controls.start("rest", { duration: 0 });
    controls.start("active");
  };

  const handleClick = (e: MouseEvent<SVGSVGElement>) => {
    if (!isReduced && r.trigger === "click") replayClick();
    onClick?.(e);
  };

  const mergedStyle: CSSProperties = {
    cursor: r.trigger === "click" ? "pointer" : undefined,
    ...style,
  };

  // Transform-based signatures (rotate / scale / translate) need each animated
  // child's transform origin set in viewBox coordinates. Default origin is the
  // icon center; a mode can override it for physics-aware pivots (e.g. a bell
  // rocking from its top mount). `transformBox: "view-box"` also makes
  // translation/scale values relative to user units so the motion scales with
  // `size`.
  const childStyle: CSSProperties | undefined = resolvedMode.needsTransformOrigin
    ? {
        transformOrigin: resolvedMode.transformOrigin ?? "12px 12px",
        transformBox: "view-box",
      }
    : undefined;

  // Strip prop names we've already consumed so they don't leak onto the DOM.
  const cleanedPassthrough: Record<string, unknown> = {
    ...(passthrough as unknown as Record<string, unknown>),
  };
  for (const key of Object.keys(DEFAULTS) as DefaultKey[]) {
    delete cleanedPassthrough[key];
  }
  // Lifecycle handlers and the state attribute are owned by the engine. The
  // SVGAttributes base type makes these assignable from userland but they
  // collide with the motion-redefined callbacks of the same name, so swallow
  // any passthrough copies and let the engine's handlers be authoritative.
  delete cleanedPassthrough.onAnimationStart;
  delete cleanedPassthrough.onAnimationComplete;
  delete cleanedPassthrough["data-motion-state"];

  // Keyboard a11y for standalone click-triggered icons. With `trigger="click"`
  // the icon is interactive, but an <svg> is neither focusable nor keyboard-
  // operable by default. Unless the consumer supplied their own role/tabIndex/
  // onKeyDown (e.g. they wrap the icon in a real <button>), make it behave like
  // a button: focusable, and activatable with Enter/Space. Decorative triggers
  // (hover/mount/in-view/parent-hover/manual) get none of this.
  const consumerOnKeyDown = cleanedPassthrough.onKeyDown as
    | ((e: KeyboardEvent<SVGSVGElement>) => void)
    | undefined;
  const a11yProps: {
    role?: string;
    tabIndex?: number;
    onKeyDown?: (e: KeyboardEvent<SVGSVGElement>) => void;
  } = {};
  if (r.trigger === "click") {
    a11yProps.role = (cleanedPassthrough.role as string | undefined) ?? "button";
    a11yProps.tabIndex =
      (cleanedPassthrough.tabIndex as number | undefined) ?? 0;
    a11yProps.onKeyDown = (e: KeyboardEvent<SVGSVGElement>) => {
      consumerOnKeyDown?.(e);
      if (e.defaultPrevented) return;
      if (e.key === "Enter" || e.key === " ") {
        // Emulate native button activation: route Enter/Space through a real
        // click so the keyboard path is identical to a pointer click — it
        // replays the draw AND fires the consumer's onClick (which a bare
        // replay would skip, breaking the role="button" contract). Space
        // would otherwise scroll the page; Enter is inert on <svg>.
        e.preventDefault();
        e.currentTarget.dispatchEvent(
          new MouseEvent("click", { bubbles: true, cancelable: true })
        );
      }
    };
  }

  return (
    <>
      {r.trigger === "in-view" && (
        <InViewSubscriber
          svgRef={svgRef}
          controls={controls}
          isReduced={isReduced}
        />
      )}
      <motion.svg
        // Spreads first; explicit props after so our overrides always win.
        {...SVG_BASE}
        {...motionProps}
        {...cleanedPassthrough}
        {...a11yProps}
        ref={svgRef}
        width={r.size}
        height={r.size}
        stroke={r.color}
        strokeWidth={effectiveStrokeWidth}
        className={className}
        onClick={handleClick}
        onAnimationStart={handleAnimationStart}
        onAnimationComplete={handleAnimationComplete}
        data-motion-state={motionState}
        style={mergedStyle}
      >
      {nodes.map((node, i) => {
        const [Tag, attrs] = node;
        return (
          <AnimatedNode
            key={i}
            tag={Tag}
            attrs={attrs}
            index={i}
            iconName={iconName}
            timing={r}
            modeFactory={resolvedMode.factory}
            variantsOverride={variants}
            childStyle={childStyle}
          />
        );
      })}
      </motion.svg>
    </>
  );
}

DrawIcon.displayName = "DrawIcon";

// ---------------------------------------------------------------------------
// AnimatedNode
//
// One per Lucide IconNode. Owns a ref to the rendered SVG geometry element,
// measures its real `getTotalLength()` on mount, and feeds the result into
// the mode factory. This lets the default `draw` mode animate
// `stroke-dashoffset` against a real dash array (and clear both at rest)
// instead of using Motion's `pathLength` shortcut, which permanently writes
// `pathLength="1"` + `stroke-dasharray="1 1"` to the DOM and produces a
// visible seam on closed-loop paths (gear, cloud, heart, ...).
// ---------------------------------------------------------------------------

interface AnimatedNodeProps {
  tag: string;
  attrs: Record<string, string | number>;
  index: number;
  iconName: string;
  timing: Pick<
    Resolved,
    "duration" | "delay" | "stagger" | "easing" | "repeat"
  >;
  modeFactory: (ctx: import("./modes").ModeContext) => Variants;
  variantsOverride: DrawIconProps["variants"];
  childStyle: CSSProperties | undefined;
}

function AnimatedNode({
  tag,
  attrs,
  index,
  iconName,
  timing,
  modeFactory,
  variantsOverride,
  childStyle,
}: AnimatedNodeProps) {
  const ref = useRef<SVGGeometryElement | null>(null);
  // Real measured length once mounted. `0` only on the synchronous first
  // render before useLayoutEffect runs; that render never reaches an active
  // variant, so modes can rely on a real positive length whenever the draw
  // actually plays.
  const [pathLength, setPathLength] = useState(0);

  // `attrs` is in the deps so a path that changes shape re-measures. For
  // generated icons `attrs` is a module-level constant, so this runs once;
  // it only re-fires for the `<DrawIcon nodes={dynamic} />` escape hatch when
  // a consumer swaps node geometry, where re-measuring is the correct
  // behavior. `getTotalLength` is absent in non-DOM/SSR environments (and in
  // jsdom) — the typeof guard makes that a no-op, leaving pathLength at 0.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || typeof el.getTotalLength !== "function") return;
    try {
      const length = el.getTotalLength();
      if (length > 0 && length !== pathLength) setPathLength(length);
    } catch {
      // Degenerate geometry (zero-length path). Leave pathLength at 0 —
      // there's nothing to draw, and the rest variant still renders fine.
    }
  }, [tag, attrs, pathLength]);

  const MotionTag =
    (motion as unknown as Record<string, ElementType>)[tag] ?? motion.path;

  // Memoize the variants so the parent's `setMotionState` re-render (on every
  // animation start/complete) doesn't rebuild a fresh variants object and hand
  // motion a new reference mid-animation. Inputs are stable in the common case:
  // `modeFactory` is a module-level reference for `draw`/`signature`, `attrs`
  // is the generated icon's static node array, and the timing values are
  // primitives. (An inline `mode`/`variants` function re-derives, as expected.)
  const v = useMemo<Variants>(
    () =>
      typeof variantsOverride === "function"
        ? variantsOverride(index)
        : (variantsOverride ??
          modeFactory({
            iconName,
            index,
            pathTag: tag,
            pathAttrs: attrs,
            duration: timing.duration,
            delay: timing.delay,
            stagger: timing.stagger,
            easing: timing.easing,
            repeat: timing.repeat,
            pathLength,
          })),
    [
      variantsOverride,
      modeFactory,
      iconName,
      index,
      tag,
      attrs,
      timing.duration,
      timing.delay,
      timing.stagger,
      timing.easing,
      timing.repeat,
      pathLength,
    ]
  );

  return (
    <MotionTag
      ref={ref as Ref<SVGGeometryElement>}
      {...attrs}
      variants={v}
      style={childStyle}
    />
  );
}
