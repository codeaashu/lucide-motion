import { compose } from "../compose";
import { receiptBody } from "../motions/receipt-body";
import { receiptModifierReveal } from "../motions/receipt-modifier-reveal";

/**
 * `receipt-euro` — the receipt sways (`receiptBody`) while the currency
 * symbol draws in at the first sway apex via
 * `receiptModifierReveal`, inheriting both the sway and the
 * opacity so the printed content stays anchored to the paper.
 */
export default compose({
  motions: [receiptBody, receiptModifierReveal],
  defaults: { duration: 0.7, easing: "easeInOut", stagger: 0 },
  transformOrigin: "10px 2px",
});
