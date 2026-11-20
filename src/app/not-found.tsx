import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { pageHref } from "@/lib/site";

export const metadata: Metadata = { title: "No page here" };

export default function NotFound() {
  return (
    <Container className="py-32 text-center">
      <p className="font-mono text-xs font-medium tracking-[0.14em] text-accent uppercase">404</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-0.035em]">There&apos;s no page here.</h1>
      <p className="mt-4 text-muted">It may have moved. Try the search above.</p>
      <a
        href={pageHref()}
        className="mt-8 inline-flex h-10 items-center rounded-full bg-accent px-5 text-sm font-semibold text-accent-fg transition hover:bg-accent-hover"
      >
        All docs
      </a>
    </Container>
  );
}
