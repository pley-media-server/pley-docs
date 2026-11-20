import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { Toc } from "@/components/toc";
import { Container } from "@/components/ui";
import { DOCS, githubFile, loadDoc } from "@/lib/docs";
import { pageHref } from "@/lib/site";

// Only the pages in src/lib/docs.ts exist; any other address is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return DOCS.map((doc) => ({ slug: doc.slug.split("/") }));
}

export async function generateMetadata({ params }: PageProps<"/[...slug]">): Promise<Metadata> {
  const doc = await loadDoc((await params).slug.join("/"));
  if (!doc) return {};
  const url = pageHref(doc.slug);
  return {
    title: doc.title,
    description: doc.description,
    alternates: { canonical: url },
    openGraph: { url, title: `${doc.title} · Pley docs`, description: doc.description },
  };
}

export default async function DocPage({ params }: PageProps<"/[...slug]">) {
  const doc = await loadDoc((await params).slug.join("/"));
  if (!doc) notFound();

  const index = DOCS.findIndex((entry) => entry.slug === doc.slug);
  const previous = DOCS[index - 1];
  const next = DOCS[index + 1];

  return (
    <Container className="grid gap-10 pt-8 lg:grid-cols-[230px_minmax(0,1fr)] lg:pt-12 xl:grid-cols-[230px_minmax(0,1fr)_210px]">
      <aside className="hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto pr-2 pb-10">
          <Sidebar active={doc.slug} />
        </div>
      </aside>

      <div className="min-w-0">
        <details className="card group mb-8 rounded-xl lg:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm">
            <span className="text-muted">
              {doc.group} <span className="text-subtle">/</span> <span className="font-medium text-fg">{doc.label}</span>
            </span>
            <span aria-hidden className="text-subtle transition group-open:rotate-180">
              ▾
            </span>
          </summary>
          <div className="border-t border-line px-1 py-5">
            <Sidebar active={doc.slug} />
          </div>
        </details>

        <article data-pagefind-body className="mx-auto max-w-[760px]">
          <p data-pagefind-ignore className="font-mono text-xs font-medium tracking-[0.14em] text-accent uppercase">
            {doc.group}
          </p>
          <h1 className="mt-3 text-balance text-[2.1rem] leading-[1.1] font-semibold tracking-[-0.035em] sm:text-[2.6rem]">
            {doc.title}
          </h1>
          <div className="prose mt-8" dangerouslySetInnerHTML={{ __html: doc.html }} />
        </article>

        <div className="mx-auto mt-16 max-w-[760px] border-t border-line pt-6">
          <a
            href={githubFile(doc.file)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted transition hover:text-fg"
          >
            {doc.shape ? "Full doc:" : "Source:"}{" "}
            <code className="font-mono text-[0.8125rem]">{doc.file}</code> on GitHub ↗
          </a>
          <nav aria-label="Previous and next pages" className="mt-8 grid gap-4 sm:grid-cols-2">
            {previous ? (
              <a href={pageHref(previous.slug)} className="card rounded-xl px-5 py-4 transition hover:border-line-strong">
                <span className="block text-xs text-subtle">Previous</span>
                <span className="mt-1 block font-medium text-fg">{previous.label}</span>
              </a>
            ) : (
              <span />
            )}
            {next ? (
              <a href={pageHref(next.slug)} className="card rounded-xl px-5 py-4 text-right transition hover:border-line-strong">
                <span className="block text-xs text-subtle">Next</span>
                <span className="mt-1 block font-medium text-fg">{next.label}</span>
              </a>
            ) : null}
          </nav>
        </div>
      </div>

      <aside className="hidden xl:block">
        <div className="sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto pb-10">
          <Toc headings={doc.headings} />
        </div>
      </aside>
    </Container>
  );
}
