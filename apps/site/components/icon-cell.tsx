"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type MouseEvent,
} from "react";
import { Check, type DrawIconProps, type ModeName } from "lucide-motion";
import { cn } from "@/lib/utils";

type IconComponent = ComponentType<Omit<DrawIconProps, "nodes">>;

interface IconCellProps {
  name: string;
  component: string;
  Icon: IconComponent;
  /** Animation mode applied to the icon. Defaults to `"draw"`. */
  mode?: ModeName;
}

export function IconCell({ name, component, Icon, mode = "draw" }: IconCellProps) {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    []
  );

  const handleCopy = async (e: MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    try {
      await navigator.clipboard.writeText(`<${component} />`);
      setCopied(true);
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopied(false), 1200);
      button.blur();
    } catch {
      // ignore — clipboard can fail in insecure contexts
    }
  };

  return (
    <div
      data-motion-icon-group
      className={cn(
        "group relative isolate flex aspect-square flex-col items-center justify-between gap-2",
        "border-b border-r border-border bg-transparent px-3 py-5",
        "text-foreground transition-colors duration-300 ease-out",
        "hover:bg-accent hover:text-primary",
        // Keep stroke color pinned to primary while the icon is still
        // drawing, even after the cursor has left the cell. Avoids the
        // mid-animation color snap-back.
        "has-data-[motion-state=drawing]:text-primary"
      )}
    >
      {/* Whole-cell link sits behind the icon and name. Clicking anywhere
          on the cell navigates, EXCEPT the name button which overlays it
          and intercepts clicks to copy instead. */}
      <Link
        href={`/icons/${name}`}
        title={`${name} — view details`}
        aria-label={`${name} — view details`}
        className="absolute inset-0 z-0 focus-visible:outline focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-primary"
      />
      <span className="pointer-events-none relative z-0 flex flex-1 items-center justify-center">
        <Icon size={48} strokeWidth={1.75} trigger="parent-hover" mode={mode} />
      </span>
      <button
        type="button"
        onClick={handleCopy}
        title={copied ? "Copied!" : `Copy <${component} />`}
        aria-label={copied ? `Copied <${component} />` : `Copy <${component} />`}
        className={cn(
          "relative z-10 flex w-full min-w-0 cursor-pointer items-center justify-center gap-1 text-center text-xs uppercase tracking-[0.08em]",
          "transition-colors duration-200 ease-out",
          "focus-visible:text-primary focus-visible:outline-none",
          copied
            ? "text-primary"
            : "text-muted-foreground group-hover:text-foreground hover:!text-primary"
        )}
      >
        {copied ? (
          <>
            <Check
              size={12}
              strokeWidth={2.5}
              trigger="manual"
              aria-hidden
              className="shrink-0"
            />
            <span className="truncate">copied</span>
          </>
        ) : (
          <span className="truncate">{name}</span>
        )}
      </button>
    </div>
  );
}
