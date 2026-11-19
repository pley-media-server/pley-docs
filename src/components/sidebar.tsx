import { GROUPS } from "@/lib/docs";
import { pageHref } from "@/lib/site";

/** Every page, by group (src/lib/docs.ts), with the current one marked. */
export function Sidebar({ active }: { active?: string }) {
  return (
    <nav aria-label="Docs" className="space-y-8">
      {GROUPS.map((group) => (
        <div key={group.title}>
          <h2 className="px-3 font-mono text-[0.7rem] font-medium tracking-[0.14em] text-subtle uppercase">{group.title}</h2>
          <ul className="mt-3 space-y-0.5">
            {group.docs.map((doc) => {
              const current = doc.slug === active;
              return (
                <li key={doc.slug}>
                  <a
                    href={pageHref(doc.slug)}
                    aria-current={current ? "page" : undefined}
                    className={`block rounded-lg px-3 py-1.5 text-sm transition ${
                      current ? "bg-accent/10 font-medium text-accent" : "text-muted hover:bg-white/[0.04] hover:text-fg"
                    }`}
                  >
                    {doc.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
