import { matchAnyPath, type Motion } from "../compose";

/**
 * Vertex-sequence-pulse archetype — the canonical motion for
 * geometric-primitive icons whose subject has no real-world referent
 * (`triangle`, `circle`, `square`, `hexagon`, `pentagon`, `octagon`,
 * `diamond`, `astroid`, `cone`, `cylinder`, `dot`, `slash`, `spline`,
 * `shapes`, `line-squiggle`).
 *
 * The skill describes this as "each vertex pulses in clockwise order
 * staggered by 1/N of the cycle" — but the geometry comes through
 * Lucide as one closed path per shape, so per-vertex timing isn't
 * directly addressable. The implemented gesture is the visual
 * approximation: the whole shape resonates around its own bbox
 * centre — uniform `scale` contraction + tiny rotate wobble + opacity
 * dim — reading as the shape "humming" through one vertex cycle.
 *
 * Per-element `transformOrigin: "50% 50%"` + `transformBox:
 * "fill-box"` so each path resonates around its own centre, not the
 * icon centre. Drops cleanly into compound icons like `shapes` where
 * each individual shape pulses around its own middle.
 */
export const VERTEX_SEQUENCE_PULSE_KEYFRAMES: {
  scale: number[];
  rotate: number[];
  opacity: number[];
  times: number[];
} = {
  scale: [1, 0.92, 1],
  rotate: [0, -2, 1, 0],
  opacity: [1, 0.7, 1, 1],
  times: [0, 0.35, 0.7, 1],
};

export const vertexSequencePulse: Motion = {
  matches: matchAnyPath,
  factory: (ctx) => ({
    rest: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transformOrigin: "50% 50%",
      transformBox: "fill-box",
    },
    active: {
      scale: VERTEX_SEQUENCE_PULSE_KEYFRAMES.scale,
      rotate: VERTEX_SEQUENCE_PULSE_KEYFRAMES.rotate,
      opacity: VERTEX_SEQUENCE_PULSE_KEYFRAMES.opacity,
      transformOrigin: "50% 50%",
      transformBox: "fill-box",
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * ctx.stagger,
        repeat: ctx.repeat,
        scale: {
          inherit: true,
          ease: "easeInOut",
          times: VERTEX_SEQUENCE_PULSE_KEYFRAMES.times,
        },
        rotate: {
          inherit: true,
          ease: "easeInOut",
          times: VERTEX_SEQUENCE_PULSE_KEYFRAMES.times,
        },
        opacity: {
          inherit: true,
          ease: "easeInOut",
          times: VERTEX_SEQUENCE_PULSE_KEYFRAMES.times,
        },
      },
    },
  }),
};
