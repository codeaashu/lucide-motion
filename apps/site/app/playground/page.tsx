import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/fade-in";
import { Playground } from "@/components/playground";
import { siteConfig } from "@/lib/site-config";

const DESCRIPTION =
  "Interactive feature reference for Lucide Motion. Hover or click each demo to see every animation knob — timing, triggers, leave behavior, custom variants, MotionIconConfig, and reduced-motion handling.";

export const metadata: Metadata = {
  title: `Playground — ${siteConfig.name}`,
  description: DESCRIPTION,
  alternates: { canonical: "/playground" },
  openGraph: {
    title: `Playground — ${siteConfig.name}`,
    description: DESCRIPTION,
    url: "/playground",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Playground — ${siteConfig.name}`,
    description: DESCRIPTION,
  },
};

export default function PlaygroundPage() {
  return (
    <div
      className="min-h-screen bg-background font-mono text-foreground"
      style={{
        backgroundImage:
          "radial-gradient(circle at 1px 1px, color-mix(in oklch, var(--foreground) 8%, transparent) 1px, transparent 0)",
        backgroundSize: "22px 22px",
      }}
    >
      <div className="mx-auto w-full max-w-[1180px] px-6 py-12 sm:px-10">
        {/* Header */}
        <header className="space-y-5 border-b border-border pb-10">
          <FadeIn delay={0} y={6}>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Live feature reference
            </div>
          </FadeIn>
          <FadeIn delay={0.08}>
            <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
              Playground
            </h1>
          </FadeIn>
          <FadeIn delay={0.18}>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Every animation knob the library exposes, in one hoverable page.
              Timing, triggers, leave behavior, custom variants, the{" "}
              <code className="text-[0.95em]">MotionIconConfig</code>{" "}
              provider, <code className="text-[0.95em]">absoluteStrokeWidth</code>
              , and reduced-motion handling — each as its own self-contained demo
              with the exact prop shown beneath it. Use it to verify behavior,
              compare presets, or copy a pattern into your app.
            </p>
          </FadeIn>
        </header>

        {/* Playground */}
        <section className="mt-12">
          <Playground />
        </section>

        {/* Footer */}
        <footer className="mt-20 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          <span>Hover any demo · live preview</span>
          <Link
            href="/docs/api"
            className="hover:text-primary hover:underline underline-offset-4"
          >
            Full API reference ↗
          </Link>
        </footer>
      </div>
    </div>
  );
}
