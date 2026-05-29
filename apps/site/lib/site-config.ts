import { manifest } from "lucide-motion/manifest";

export const ICON_COUNT = manifest.length;

export const siteConfig = {
  name: "Lucide Motion",
  description: `Animated React components for all ${ICON_COUNT.toLocaleString()} Lucide icons. Drop in lucide-motion for lucide-react and get hover, click, and imperative motion out of the box.`,
  url: "https://lucide-motion.aashuu.tech",
  ogImage: "/og.png",
  keywords: [
    "lucide",
    "lucide motion",
    "lucide-react",
    "lucide-motion",
    "lucide-react alternative",
    "lucide-react replacement",
    "animated react icons",
    "react icons",
    "animated icons",
    "motion",
    "framer motion",
    "svg icons",
    "icon library",
    "react components",
  ],
  github: {
    owner: "codeaashu",
    repo: "lucide-motion",
    branch: "main",
  },
} as const;

export function docsGithubUrl(pagePath: string): string {
  const { owner, repo, branch } = siteConfig.github;
  return `https://github.com/${owner}/${repo}/blob/${branch}/content/docs/${pagePath}`;
}
