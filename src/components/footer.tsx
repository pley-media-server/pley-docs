import { Container } from "@/components/ui";
import { DISCORD, GITHUB, ISSUES, RELEASES, SITE_URL } from "@/lib/site";

const LINKS = [
  { href: SITE_URL, label: "pley.media" },
  { href: RELEASES, label: "Releases" },
  { href: ISSUES, label: "Report a bug" },
  { href: DISCORD, label: "Discord" },
  { href: GITHUB, label: "GitHub" },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line py-10">
      <Container className="flex flex-col gap-4 text-sm text-subtle sm:flex-row sm:items-center sm:justify-between">
        <p>Copyright © 2026 Pley Media</p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {LINKS.map((link) => (
            <li key={link.label}>
              <a href={link.href} className="transition hover:text-fg">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </footer>
  );
}
