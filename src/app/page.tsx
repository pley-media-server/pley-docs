import { SearchButton } from "@/components/search-button";
import { Container } from "@/components/ui";
import { GROUPS } from "@/lib/docs";
import { pageHref } from "@/lib/site";

/** Where to start, by what you're here to do. */
const START = [
  { slug: "quick-start", title: "Run your own server", body: "Install Pley, create your account and add your media." },
  { slug: "apps", title: "Join a server", body: "Get the app for your TV, phone or computer, and sign in." },
  { slug: "moving-from-plex", title: "Move from Plex", body: "Bring over your libraries, profiles and watch history." },
];

/** The install guides, one click from the front page. */
const INSTALL = GROUPS.find((group) => group.title === "Install")?.docs ?? [];

const EYEBROW = "font-mono text-xs font-medium tracking-[0.14em] text-subtle uppercase";

/** The front page. Search leaves it out (no data-pagefind-body). */
export default function DocsHome() {
  return (
    <Container className="pt-16 sm:pt-24">
      <h1 className="text-[2.6rem] leading-none font-semibold tracking-[-0.035em] sm:text-6xl">Pley docs</h1>
      <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted">
        Set up Pley on your computer or NAS, then watch on your TV, phone and browser.
      </p>
      <div className="mt-8">
        <SearchButton />
      </div>

      <section className="mt-16">
        <h2 className={EYEBROW}>Start here</h2>
        <ul className="mt-5 grid gap-4 md:grid-cols-3">
          {START.map((item) => (
            <li key={item.slug}>
              <a href={pageHref(item.slug)} className="card group block h-full rounded-2xl p-6 transition hover:border-line-strong">
                <span className="flex items-center justify-between font-semibold text-fg">
                  {item.title}
                  <span aria-hidden className="text-subtle transition group-hover:translate-x-0.5 group-hover:text-accent">
                    →
                  </span>
                </span>
                <span className="mt-2 block text-sm leading-relaxed text-muted">{item.body}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="mr-2 text-sm text-muted">Install on</span>
          {INSTALL.map((doc) => (
            <a
              key={doc.slug}
              href={pageHref(doc.slug)}
              className="rounded-full px-3.5 py-1.5 text-sm font-medium text-fg ring-1 ring-line-strong transition ring-inset hover:bg-white/[0.05] hover:ring-accent/50"
            >
              {doc.label}
            </a>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className={EYEBROW}>All docs</h2>
        <div className="mt-6 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {GROUPS.map((group) => (
            <div key={group.title}>
              <h3 className="font-semibold text-fg">{group.title}</h3>
              <ul className="mt-3 space-y-2">
                {group.docs.map((doc) => (
                  <li key={doc.slug}>
                    <a href={pageHref(doc.slug)} className="text-sm text-muted transition hover:text-accent">
                      {doc.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <p className="mt-16 text-sm text-subtle">Pley is in development: keep backups of your data.</p>
    </Container>
  );
}
