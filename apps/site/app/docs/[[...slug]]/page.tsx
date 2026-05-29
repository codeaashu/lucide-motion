import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from "fumadocs-ui/layouts/docs/page";
import { createRelativeLink } from "fumadocs-ui/mdx";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getMDXComponents } from "@/components/mdx";
import { docsGithubUrl, siteConfig } from "@/lib/site-config";
import { source } from "@/lib/source";

export default async function Page(props: PageProps<"/docs/[[...slug]]">) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = `${page.url}.mdx`;
  const githubUrl = docsGithubUrl(page.path);
  const isLanding = !params.slug || params.slug.length === 0;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>
        {isLanding ? (
          <span className="inline-flex items-center gap-3">
            <Image
              src="/web-app-manifest-192x192.png"
              alt=""
              width={40}
              height={40}
              className="size-9"
            />
            {page.data.title}
          </span>
        ) : (
          page.data.title
        )}
      </DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <div className="flex flex-row items-center gap-2 border-b pb-4">
        <MarkdownCopyButton markdownUrl={markdownUrl}/>
        <ViewOptionsPopover
          markdownUrl={markdownUrl}
          githubUrl={githubUrl}
        />
      </div>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(
  props: PageProps<"/docs/[[...slug]]">
): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const title = page.data.title;
  const description = page.data.description;
  const url = page.url;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} — ${siteConfig.name}`,
      description,
      url,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${siteConfig.name}`,
      description,
    },
  };
}
