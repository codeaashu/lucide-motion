import { compose } from "../compose";
import { receiptBody } from "../motions/receipt-body";

/**
 * `receipt` — bare receipt outline. The receiptBody motion sways
 * the receipt ±3° around its top edge (10, 2) — the imagined
 * print slot — paired with a phase-locked opacity dim. Reads as
 * the receipt dangling from a thermal printer.
 *
 * Every other receipt-* composite reuses receiptBody as the host
 * and layers `receiptModifierReveal` for currency symbols and
 * text lines, which inherit both the sway and the opacity.
 */
export default compose({
  motions: [receiptBody],
  defaults: { duration: 0.7, easing: "easeInOut", stagger: 0 },
  transformOrigin: "10px 2px",
});
