import { compose } from "../compose";
import { scanCornersFrame } from "../motions/scan-corners-frame";

/**
 * `scan` — bare viewfinder brackets. The four corners contract
 * uniformly toward (12, 12), hold the lock, then release —
 * paired with a phase-locked opacity dim that reads as the
 * scanner working.
 *
 * Variant-specific payloads (focus reticle, fullscreen rect,
 * scan-line sweep, barcode bars, eye blink, face wink, heart
 * beat, magnifier wobble, QR module pulse, text-line read) layer
 * on top in their own signatures — each with bespoke physics, no
 * generic draw-in.
 */
export default compose({
  motions: [scanCornersFrame],
  defaults: { duration: 1.1, easing: "easeInOut", stagger: 0 },
  transformOrigin: "12px 12px",
});
