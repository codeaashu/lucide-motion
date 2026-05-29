import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import { ServerCodeBlock } from "fumadocs-ui/components/codeblock.rsc";
import * as Icons from "lucide-motion";
import iconNodes from "lucide-static/icon-nodes.json";
import type { DrawIconProps, IconNode } from "lucide-motion";
import { IconHero } from "@/components/icon-detail/icon-hero";
import { TimingPresets } from "@/components/icon-detail/timing-presets";
import { getAllSlugs, getIcon } from "@/lib/icon-data";

type IconComponent = ComponentType<Omit<DrawIconProps, "nodes">>;
const IconMap = Icons as unknown as Record<string, IconComponent | undefined>;
const nodesByName = iconNodes as unknown as Record<string, IconNode[] | undefined>;

export function generateStaticParams() {
  return getAllSlugs().map((name) => ({ name }));
}

export async function generateMetadata(
  props: PageProps<"/icons/[name]">
): Promise<Metadata> {
  const { name } = await props.params;
  const icon = getIcon(name);
  if (!icon) return {};

  const title = `${icon.name} icon`;
  const description = `Animated React component for the Lucide "${icon.name}" icon. Drop-in replacement for lucide-react with hover-to-draw motion${
    icon.tags.length ? `. Tags: ${icon.tags.slice(0, 6).join(", ")}.` : "."
  }`;
  const path = `/icons/${icon.name}`;

  return {
    title,
    description,
    keywords: [icon.name, `${icon.name} icon`, "lucide", "lucide-react", "lucide-motion", ...icon.tags],
    alternates: { canonical: path },
    openGraph: {
      title: `${icon.name} — Lucide Motion`,
      description,
      url: path,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${icon.name} — Lucide Motion`,
      description,
    },
  };
}

export default async function IconPage(props: PageProps<"/icons/[name]">) {
  const { name } = await props.params;
  const icon = getIcon(name);
  if (!icon) notFound();

  const Icon = IconMap[icon.component];
  const nodes = nodesByName[icon.name];
  if (!Icon || !nodes) notFound();

  return (
    <div
      className="min-h-screen bg-background font-mono text-foreground"
      style={{
        backgroundImage:
          "radial-gradient(circle at 1px 1px, color-mix(in oklch, var(--foreground) 8%, transparent) 1px, transparent 0)",
        backgroundSize: "22px 22px",
      }}
    >
      <div className="mx-auto w-full max-w-4xl px-6 py-12 sm:px-10">
        {/* Header */}
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">{icon.name}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Animated React component — <code>{icon.component}</code> /{" "}
              <code>{icon.component}Icon</code>
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href={`https://lucide.dev/icons/${icon.name}`}
              target="_blank"
              rel="noreferrer"
              className="border border-border px-3 py-1.5 text-xs uppercase tracking-[0.12em] transition-colors hover:bg-foreground hover:text-background hover:border-foreground"
            >
              View on Lucide ↗
            </a>
            <a
              href={`https://github.com/lucide-icons/lucide/blob/main/icons/${icon.name}.svg`}
              target="_blank"
              rel="noreferrer"
              className="border border-border px-3 py-1.5 text-xs uppercase tracking-[0.12em] transition-colors hover:bg-foreground hover:text-background hover:border-foreground"
            >
              Source ↗
            </a>
          </div>
        </header>

        {/* Hero */}
        <section className="mt-10">
          <IconHero Icon={Icon} name={icon.name} />
        </section>

        {/* Imports */}
        <section className="mt-12 space-y-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Import
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Tree-shakable named import — only the icons you reference end up
              in your bundle.
            </p>
          </div>
          <ServerCodeBlock
            lang="tsx"
            code={`import { ${icon.component} } from "lucide-motion";`}
          />
          <p className="mt-4 text-xs text-muted-foreground">
            Also exported as{" "}
            <code className="border border-border bg-secondary px-1.5 py-0.5 text-[0.9em]">
              {icon.component}Icon
            </code>{" "}
            for the Lucide-suffix naming convention.
          </p>
        </section>

        {/* Quick start */}
        <section className="mt-12 space-y-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Quick start
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Drop the component into your JSX. The default trigger plays the
              draw animation on hover.
            </p>
          </div>
          <div className="grid items-center gap-6 sm:grid-cols-[1fr_auto]">
            <ServerCodeBlock
              lang="tsx"
              code={`import { ${icon.component} } from "lucide-motion";

<${icon.component} size={32} />`}
            />
            <div className="flex items-center justify-center border border-border bg-background/40 p-6 sm:px-10">
              <Icon size={32} />
            </div>
          </div>
        </section>

        {/* Timing presets */}
        <section className="mt-12 space-y-3">
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Timing presets · hover to play
          </div>
          <TimingPresets Icon={Icon} />
        </section>

        {/* Tags */}
        {icon.tags.length > 0 && (
          <section className="mt-12 space-y-3">
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Tags
            </div>
            <div className="flex flex-wrap gap-1.5">
              {icon.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-border bg-background/40 px-2 py-0.5 text-[11px] text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Related */}
        {icon.related.length > 0 && (
          <section className="mt-12 space-y-3">
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Related icons
            </div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {icon.related.map((rel) => {
                const RelatedIcon = IconMap[rel.component];
                if (!RelatedIcon) return null;
                return (
                  <Link
                    key={rel.name}
                    href={`/icons/${rel.name}`}
                    className="flex aspect-square flex-col items-center justify-between gap-1.5 border border-border bg-background/40 px-3 py-4 text-foreground transition-colors hover:bg-secondary/60 hover:text-primary"
                  >
                    <span className="flex flex-1 items-center justify-center">
                      <RelatedIcon size={24} strokeWidth={1.75} />
                    </span>
                    <span className="block w-full truncate text-center text-[10px] uppercase tracking-[0.06em] text-muted-foreground">
                      {rel.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Raw node data */}
        <section className="mt-12 space-y-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Raw node data
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              The icon&apos;s underlying SVG node tree — useful if you need to
              render or transform it yourself instead of using the component.
            </p>
          </div>
          <details className="space-y-3">
            <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
              Show IconNode[]
            </summary>
            <ServerCodeBlock
              lang="json"
              code={JSON.stringify(nodes, null, 2)}
            />
          </details>
        </section>

        {/* Footer */}
        <footer className="mt-16 border-t border-border pt-6 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          <Link
            href="/"
            className="hover:text-primary hover:underline underline-offset-4"
          >
            ← Back to gallery
          </Link>
        </footer>
      </div>
    </div>
  );
}
