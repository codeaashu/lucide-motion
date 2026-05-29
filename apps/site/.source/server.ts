// @ts-nocheck
import * as __fd_glob_12 from "../content/docs/usage.mdx?collection=docs"
import * as __fd_glob_11 from "../content/docs/triggers.mdx?collection=docs"
import * as __fd_glob_10 from "../content/docs/motion-state.mdx?collection=docs"
import * as __fd_glob_9 from "../content/docs/modes.mdx?collection=docs"
import * as __fd_glob_8 from "../content/docs/leave-behavior.mdx?collection=docs"
import * as __fd_glob_7 from "../content/docs/index.mdx?collection=docs"
import * as __fd_glob_6 from "../content/docs/getting-started.mdx?collection=docs"
import * as __fd_glob_5 from "../content/docs/defaults.mdx?collection=docs"
import * as __fd_glob_4 from "../content/docs/custom-motion.mdx?collection=docs"
import * as __fd_glob_3 from "../content/docs/api.mdx?collection=docs"
import * as __fd_glob_2 from "../content/docs/animation.mdx?collection=docs"
import * as __fd_glob_1 from "../content/docs/accessibility.mdx?collection=docs"
import { default as __fd_glob_0 } from "../content/docs/meta.json?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.docs("docs", "content/docs", {"meta.json": __fd_glob_0, }, {"accessibility.mdx": __fd_glob_1, "animation.mdx": __fd_glob_2, "api.mdx": __fd_glob_3, "custom-motion.mdx": __fd_glob_4, "defaults.mdx": __fd_glob_5, "getting-started.mdx": __fd_glob_6, "index.mdx": __fd_glob_7, "leave-behavior.mdx": __fd_glob_8, "modes.mdx": __fd_glob_9, "motion-state.mdx": __fd_glob_10, "triggers.mdx": __fd_glob_11, "usage.mdx": __fd_glob_12, });