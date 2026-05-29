import { matchPathDOneOf, type Motion } from "../compose";
import { WIFI_SIGNAL_KEYFRAMES } from "./wifi-signal-wave";

/**
 * Wifi source-dot pulse. The primary `M12 20h.01` dot is the emitter
 * at the bottom of the wifi symbol, so it flashes first and reaches
 * full size before the first arc draws in. The small partial dot used
 * by `wifi-sync` follows the gentler inner-wave contraction because it
 * is a signal remnant rather than the central source.
 */
const PRIMARY_SOURCE_D = "M12 20h.01";
const SOURCE_DOTS = [PRIMARY_SOURCE_D, "M8.5 16.429h.01"];

export const wifiSignalSource: Motion = {
  matches: matchPathDOneOf(...SOURCE_DOTS),
  factory: (ctx) => {
    const isPrimarySource = String(ctx.pathAttrs.d) === PRIMARY_SOURCE_D;

    return {
      rest: { scale: 1, opacity: 1 },
      active: {
        scale: isPrimarySource
          ? [0.35, 1, 0.72, 1]
          : WIFI_SIGNAL_KEYFRAMES.scale,
        opacity: isPrimarySource
          ? [0, 1, 0.72, 1]
          : WIFI_SIGNAL_KEYFRAMES.opacity,
        transition: {
          duration: ctx.duration,
          delay: ctx.delay,
          repeat: ctx.repeat,
          scale: {
            inherit: true,
            ease: "easeOut",
            times: isPrimarySource
              ? [0, 0.12, 0.46, 1]
              : WIFI_SIGNAL_KEYFRAMES.times,
          },
          opacity: {
            inherit: true,
            ease: "easeOut",
            times: isPrimarySource
              ? [0, 0.12, 0.46, 1]
              : WIFI_SIGNAL_KEYFRAMES.times,
          },
        },
      },
    };
  },
};
