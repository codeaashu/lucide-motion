import { compose } from "../compose";
import { chartAxes } from "../motions/chart-axes";
import {
  chartNetworkLink,
  chartNetworkNode,
} from "../motions/chart-network-activity";

/**
 * `chart-network` — three connection lines + three node circles +
 * L-axes. A packet of activity hops through the network: connection
 * lines briefly dim (signal in flight), nodes pulse with a small
 * uniform contraction (node activates), both sequenced left-to-right
 * by Lucide path order.
 */
export default compose({
  motions: [chartNetworkLink, chartNetworkNode, chartAxes],
  defaults: { duration: 1.0, easing: "easeInOut", stagger: 0.08 },
});
