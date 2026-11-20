import { Logo } from "@/components/logo";
import { Search } from "@/components/search";
import { Container, GithubIcon } from "@/components/ui";
import { GITHUB, pageHref, SITE_URL } from "@/lib/site";

export function Header() {
  return (
    <header className="sticky inset-x-0 top-0 z-50 border-b border-line bg-bg/80 backdrop-blur-xl backdrop-saturate-150">
      <Container className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-1">
          <a href={SITE_URL} className="rounded-lg" aria-label="Pley home page">
            <Logo id="logo-header" />
          </a>
          <span aria-hidden className="mx-2 h-5 w-px bg-line-strong" />
          <a href={pageHref()} className="rounded-lg text-[1.05rem] font-medium tracking-[-0.02em] text-muted transition hover:text-fg">
            Docs
          </a>
        </div>

        <div className="flex items-center gap-2">
          <Search />
          <a
            href={GITHUB}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-2 rounded-full px-3 text-sm font-medium text-muted transition hover:bg-white/[0.05] hover:text-fg max-sm:hidden"
          >
            <GithubIcon className="size-[18px]" />
            <span className="max-md:sr-only">GitHub</span>
          </a>
        </div>
      </Container>
    </header>
  );
}
