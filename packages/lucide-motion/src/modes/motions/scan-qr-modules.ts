import { matchPathDOneOf, type Motion } from "../compose";
import type { ModeContext } from "../types";

/**
 * QR-code module fragments in `scan-qr-code`. Lucide draws four
 * paths and one rect:
 *
 * - `M17 12v4a1 1 0 0 1-1 1h-4` — lower-right finder frame
 * - `M17 8V7` — short upper stem
 * - `M7 17h.01` — lower-left dot
 * - `<rect x=7 y=7 width=5 height=5 rx=1>` — upper-left finder
 *
 * **Real-life referent — QR scanner reading modules sequentially.**
 * QR readers acquire the finder patterns first, then the data
 * cells. The four modules opacity-pulse in sequence — the upper-
 * left finder (the largest, most distinctive) fires first, then
 * the rest cascade through `ctx.index * 0.1` stagger as the
 * decoder reads the rest of the symbol.
 *
 * Each module dims to 0.3 opacity briefly at its own slot and
 * snaps back. Stays fully visible at rest. Matches both `<path>`
 * and `<rect>` payloads so the rect gets the same opacity pulse
 * without a separate scale-from-0 reveal.
 */
const QR_PATHS = [
  "M17 12v4a1 1 0 0 1-1 1h-4",
  "M17 8V7",
  "M7 17h.01",
];

const matchQrPath = matchPathDOneOf(...QR_PATHS);

const matchQrRect = (ctx: ModeContext): boolean =>
  ctx.pathTag === "rect" &&
  String(ctx.pathAttrs.x) === "7" &&
  String(ctx.pathAttrs.y) === "7" &&
  String(ctx.pathAttrs.width) === "5" &&
  String(ctx.pathAttrs.height) === "5";

export const scanQrModules: Motion = {
  matches: (ctx) => matchQrPath(ctx) || matchQrRect(ctx),
  factory: (ctx) => ({
    rest: { opacity: 1 },
    active: {
      opacity: [1, 1, 0.3, 1, 1],
      transition: {
        duration: ctx.duration,
        delay: ctx.delay + ctx.index * 0.1,
        repeat: ctx.repeat,
        ease: "easeInOut",
        times: [0, 0.3, 0.45, 0.8, 1],
      },
    },
  }),
};
