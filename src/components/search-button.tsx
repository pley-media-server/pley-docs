"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const isMac = () => /Mac|iPhone|iPad/.test(navigator.platform);

type Modal = Element & { open?: () => void };

/** The front page's search box: it opens the header's search dialog (src/components/search.tsx). */
export function SearchButton() {
  const mac = useSyncExternalStore(subscribe, isMac, () => false);
  return (
    <button
      type="button"
      onClick={() => (document.querySelector("pagefind-modal") as Modal | null)?.open?.()}
      className="card flex h-14 w-full max-w-xl items-center gap-3 rounded-2xl px-5 text-left text-muted transition hover:border-line-strong hover:text-fg"
    >
      <svg viewBox="0 0 24 24" className="size-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <span className="flex-1">Search the docs</span>
      <kbd className="rounded-md border border-line-strong px-1.5 py-0.5 font-mono text-xs text-subtle max-sm:hidden">{mac ? "⌘" : "Ctrl"} K</kbd>
    </button>
  );
}
