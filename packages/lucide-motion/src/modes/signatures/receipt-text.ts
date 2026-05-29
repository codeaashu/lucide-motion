import { compose } from "../compose";
import { receiptBody } from "../motions/receipt-body";
import { receiptModifierReveal } from "../motions/receipt-modifier-reveal";
import { receiptTextLines } from "../motions/receipt-text-lines";

/**
 * `receipt-text` — the receipt sways (`receiptBody`) while the
 * three text lines drop in one by one (`receiptTextLines`): top →
 * middle → bottom, like items being printed onto the receipt.
 *
 * Duration bumped to 0.95 so the three drops + the sway settle
 * read as a clear sequence.
 */
export default compose({
  motions: [receiptBody, receiptTextLines, receiptModifierReveal],
  defaults: { duration: 0.95, easing: "easeInOut", stagger: 0 },
  transformOrigin: "10px 2px",
});
