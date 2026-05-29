import { matchPathDOneOf, type Motion } from "../compose";

/**
 * Wifi wave arcs — Tier 2 radio-signal radiation from the lower
 * source point. Each level is hidden and contracted until its own
 * propagation slot, then draws in while scaling back to its full
 * Lucide radius. The result is a source -> inner -> middle -> outer
 * wavefront instead of a generic pulse.
 *
 * Exports `WIFI_SIGNAL_KEYFRAMES` so source dots and state markers can
 * align to the full-signal peak.
 */
export const WIFI_SIGNAL_KEYFRAMES = {
  fullSignalPeak: 0.72,
  scale: [0.52, 0.52, 1, 0.94, 1],
  opacity: [0, 0, 1, 0.7, 1],
  times: [0, 0.16, 0.38, 0.78, 1],
};

const INNER_ARCS = [
  "M8.5 16.429a5 5 0 0 1 7 0",
  "M8.5 15.429a5 5 0 0 1 2.413-1.31",
  "M8.5 16.429a5 5 0 0 1 3-1.406",
];

const MIDDLE_ARCS = [
  "M5 12.859a10 10 0 0 1 14 0",
  "M5 12.859a10 10 0 0 1 5.17-2.69",
  "M19 12.859a10 10 0 0 0-2.007-1.523",
  "M5 11.858a10 10 0 0 1 11.5-1.785",
  "M5 12.859a10 10 0 0 1 10.5-2.222",
  "M5 12.86a10 10 0 0 1 3-2.032",
];

const OUTER_ARCS = [
  "M2 8.82a15 15 0 0 1 20 0",
  "M2 7.82a15 15 0 0 1 20 0",
  "M2 8.82a15 15 0 0 1 4.177-2.643",
  "M22 8.82a15 15 0 0 0-11.288-3.764",
];

const ARC_PATHS = [...INNER_ARCS, ...MIDDLE_ARCS, ...OUTER_ARCS];

function arcLevel(d: string): number {
  if (INNER_ARCS.includes(d)) return 1;
  if (MIDDLE_ARCS.includes(d)) return 2;
  return 3;
}

function levelTimes(level: number): number[] {
  const start = level === 1 ? 0.14 : level === 2 ? 0.28 : 0.42;
  const full = level === 1 ? 0.36 : level === 2 ? 0.54 : 0.72;
  return [0, start, full, 0.84, 1];
}

function startScale(level: number): number {
  if (level === 1) return 0.62;
  if (level === 2) return 0.48;
  return 0.36;
}

export const wifiSignalWave: Motion = {
  matches: matchPathDOneOf(...ARC_PATHS),
  factory: (ctx) => {
    const d = String(ctx.pathAttrs.d);
    const level = arcLevel(d);
    const scaleStart = startScale(level);
    const times = levelTimes(level);

    const L = ctx.pathLength;
    return {
      rest: {
        strokeDasharray: 0,
        strokeDashoffset: 0,
        scale: 1,
        opacity: 1,
      },
      active: {
        strokeDasharray: L,
        // Mirror the original [0, 0, 1, 1, 1] reveal.
        strokeDashoffset: [L, L, 0, 0, 0],
        scale: [scaleStart, scaleStart, 1, 0.94, 1],
        opacity: WIFI_SIGNAL_KEYFRAMES.opacity,
        transition: {
          duration: ctx.duration,
          delay: ctx.delay,
          repeat: ctx.repeat,
          strokeDasharray: { duration: 0 },
          strokeDashoffset: { inherit: true, ease: "easeOut", times },
          scale: { inherit: true, ease: "easeOut", times },
          opacity: { inherit: true, ease: "easeOut", times },
        },
        transitionEnd: { strokeDasharray: 0, strokeDashoffset: 0 },
      },
    };
  },
};
