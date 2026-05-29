import { compose } from "../compose";
import { shareGraphLink, shareGraphNode } from "../motions/share-graph";

/**
 * `share-2` — 3-node broadcast graph. Source pulses, connection
 * lines shimmer in flight, destinations pulse — a packet hopping
 * through the graph. Sequenced by `ctx.index * stagger`.
 */
export default compose({
  motions: [shareGraphNode, shareGraphLink],
  defaults: { duration: 0.9, easing: "easeInOut", stagger: 0.08 },
});
