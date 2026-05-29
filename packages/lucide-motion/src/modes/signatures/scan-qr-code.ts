import { compose } from "../compose";
import { scanCornersFrame } from "../motions/scan-corners-frame";
import { scanQrModules } from "../motions/scan-qr-modules";

/**
 * `scan-qr-code` — viewfinder brackets lock on while the QR
 * modules pulse sequentially. Each module dims to 0.3 opacity at
 * its own slot (`ctx.index * 0.1` stagger) — the decoder reading
 * the symbol module by module. Matches both `<path>` finder
 * fragments and the `<rect>` finder pattern.
 */
export default compose({
  motions: [scanCornersFrame, scanQrModules],
  defaults: { duration: 1.2, easing: "easeInOut", stagger: 0 },
  transformOrigin: "12px 12px",
});
