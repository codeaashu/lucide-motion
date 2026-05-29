import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Image from "next/image";
import { siteConfig } from "@/lib/site-config";

export function baseOptions(): BaseLayoutProps {
  const { owner, repo } = siteConfig.github;
  return {
    nav: {
      title: (
        <span className="inline-flex items-center gap-2 font-mono font-semibold tracking-tight">
          <Image
            src="/web-app-manifest-192x192.png"
            alt=""
            width={20}
            height={20}
            className="size-5"
          />
          {siteConfig.name}
        </span>
      ),
    },
    links: [
      { text: "Gallery", url: "/" },
      { text: "Playground", url: "/playground" },
      { text: "Docs", url: "/docs" },
    ],
    githubUrl: `https://github.com/${owner}/${repo}`,
  };
}
