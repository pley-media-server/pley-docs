"use client";

import { useEffect } from "react";

/** Copies a code block when its button (src/lib/markdown.ts) is pressed, and says so for a moment. */
export function CopyCode() {
  useEffect(() => {
    async function onClick(event: MouseEvent) {
      const button = (event.target as Element | null)?.closest<HTMLButtonElement>("button[data-copy]");
      const code = button?.parentElement?.querySelector("pre");
      if (!button || !code) return;
      try {
        await navigator.clipboard.writeText(code.innerText.replace(/\n$/, ""));
        button.textContent = "Copied";
      } catch {
        // No clipboard (an insecure address, say): the code can still be selected by hand.
        button.textContent = "Select it";
      }
      setTimeout(() => (button.textContent = "Copy"), 1600);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
