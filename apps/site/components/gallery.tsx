"use client";

import { useMemo, useState, type ComponentType } from "react";
import { motion, useReducedMotion } from "motion/react";
import { manifest } from "lucide-motion/manifest";
import * as Icons from "lucide-motion";
import type { DrawIconProps, ModeName } from "lucide-motion";
import { IconCell } from "@/components/icon-cell";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ICON_COUNT } from "@/lib/site-config";

type IconComponent = ComponentType<Omit<DrawIconProps, "nodes">>;
const IconMap = Icons as unknown as Record<string, IconComponent | undefined>;

const ICON_COUNT_FORMATTED = ICON_COUNT.toLocaleString();
const PAGE_SIZE = 96;

const MODE_OPTIONS: ModeName[] = ["draw", "signature"];

export function Gallery() {
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [mode, setMode] = useState<ModeName>("draw");
  const [hideFallbacks, setHideFallbacks] = useState(false);
  const reduced = useReducedMotion();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const showSignedOnly = mode === "signature" && hideFallbacks;
    return manifest.filter((m) => {
      if (q && !m.name.includes(q)) return false;
      if (showSignedOnly && !m.hasSignature) return false;
      return true;
    });
  }, [query, mode, hideFallbacks]);

  const visible = filtered.slice(0, limit);

  return (
    <>
      {/* Sticky control bar — search + mode toggle. Pinned to --site-nav-height
          (defined in globals.css) so it tucks flush under the nav instead of
          slipping behind or leaving a gap. Updating the nav's height now only
          requires updating the CSS variable, not hunting magic numbers. */}
      <div className="sticky top-[var(--site-nav-height)] z-10 -mx-6 mt-8 border-b border-border bg-background/90 px-6 py-4 backdrop-blur sm:-mx-10 sm:px-10">
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex min-w-[220px] flex-1 items-center gap-2 border border-foreground bg-background px-3 py-2 text-sm focus-within:border-primary">
            <span className="text-muted-foreground">/</span>
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setLimit(PAGE_SIZE);
              }}
              placeholder={`search ${ICON_COUNT_FORMATTED} icons...`}
              className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
            />
          </label>
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            spacing={1}
            value={mode}
            onValueChange={(value) => {
              if (value) {
                setMode(value as ModeName);
                setLimit(PAGE_SIZE);
              }
            }}
            aria-label="Animation mode"
          >
            {MODE_OPTIONS.map((m) => (
              <ToggleGroupItem
                key={m}
                value={m}
                aria-label={`Mode ${m}`}
                className="rounded-none border-foreground bg-background text-[10px] uppercase tracking-[0.12em] text-foreground hover:bg-foreground/10 hover:text-foreground data-[state=on]:bg-foreground data-[state=on]:text-background"
              >
                {m}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>

      <div className="mt-12 space-y-4">
        {/* Result-count line doubles as the signature-filter affordance.
            Keeps the sticky bar fixed-width across mode changes; the
            counter + toggle live where the user reads "what am I
            looking at right now." */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <span>
            {query
              ? `${filtered.length.toLocaleString()} matches for "${query}"`
              : `${filtered.length.toLocaleString()} ${mode === "signature" && hideFallbacks ? "signed " : ""}icons · hover any to see it move`}
          </span>
          {mode === "signature" && (
            <span className="flex items-center gap-2">
              <span aria-hidden>·</span>
              <button
                type="button"
                onClick={() => {
                  setHideFallbacks((v) => !v);
                  setLimit(PAGE_SIZE);
                }}
                aria-pressed={hideFallbacks}
                title="Icons without a bespoke signature fall back to the draw animation."
                className="cursor-pointer underline-offset-2 transition-colors hover:text-foreground hover:underline focus-visible:text-foreground focus-visible:underline focus-visible:outline-none"
              >
                {hideFallbacks ? "Show All" : "Show Only Signed"}
              </button>
            </span>
          )}
        </div>

        {visible.length === 0 ? (
          <div className="border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
            no icons match &ldquo;{query}&rdquo;
          </div>
        ) : (
          <div className="grid grid-cols-4 border-l border-t border-border sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-6">
            {visible.map((m, i) => {
              const Icon = IconMap[m.component];
              if (!Icon) return null;
              return (
                <motion.div
                  key={m.name}
                  initial={reduced ? false : { opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15, margin: "0px 0px 4% 0px" }}
                  transition={{
                    duration: 1.3,
                    delay: reduced ? 0 : (i % 6) * 0.09,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <IconCell
                    name={m.name}
                    component={m.component}
                    Icon={Icon}
                    mode={mode}
                  />
                </motion.div>
              );
            })}
          </div>
        )}

        {limit < filtered.length && (
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={() => setLimit((n) => n + PAGE_SIZE)}
              className="border border-foreground px-5 py-2 text-xs uppercase tracking-[0.12em] transition-colors hover:bg-foreground hover:text-background"
            >
              Load more ({filtered.length - limit} left)
            </button>
          </div>
        )}
      </div>
    </>
  );
}
