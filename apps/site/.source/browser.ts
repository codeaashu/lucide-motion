// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  docs: create.doc("docs", {"accessibility.mdx": () => import("../content/docs/accessibility.mdx?collection=docs"), "animation.mdx": () => import("../content/docs/animation.mdx?collection=docs"), "api.mdx": () => import("../content/docs/api.mdx?collection=docs"), "custom-motion.mdx": () => import("../content/docs/custom-motion.mdx?collection=docs"), "defaults.mdx": () => import("../content/docs/defaults.mdx?collection=docs"), "getting-started.mdx": () => import("../content/docs/getting-started.mdx?collection=docs"), "index.mdx": () => import("../content/docs/index.mdx?collection=docs"), "leave-behavior.mdx": () => import("../content/docs/leave-behavior.mdx?collection=docs"), "modes.mdx": () => import("../content/docs/modes.mdx?collection=docs"), "motion-state.mdx": () => import("../content/docs/motion-state.mdx?collection=docs"), "triggers.mdx": () => import("../content/docs/triggers.mdx?collection=docs"), "usage.mdx": () => import("../content/docs/usage.mdx?collection=docs"), }),
};
export default browserCollections;