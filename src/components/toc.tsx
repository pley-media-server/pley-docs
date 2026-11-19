import type { Heading } from "@/lib/markdown";

/** The page's sections and subsections, beside it on wide screens. */
export function Toc({ headings }: { headings: Heading[] }) {
  if (headings.length < 2) return null;
  return (
    <nav aria-label="On this page">
      <h2 className="font-mono text-[0.7rem] font-medium tracking-[0.14em] text-subtle uppercase">On this page</h2>
      <ul className="mt-3 space-y-2 border-l border-line text-[0.8125rem] leading-snug">
        {headings.map((heading) => (
          <li key={heading.id} className={heading.depth === 3 ? "pl-7" : "pl-4"}>
            <a href={`#${heading.id}`} className="-ml-px block text-muted transition hover:text-fg">
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
