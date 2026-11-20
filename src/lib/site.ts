/** The home page, and the path the docs are served under: keep it in step with next.config.ts and wrangler.jsonc. */
export const SITE_URL = "https://pley.media";
export const BASE_PATH = "/docs";
export const DOCS_URL = `${SITE_URL}${BASE_PATH}`;

/**
 * A page's address; the front page when there's no slug. Links between pages are plain <a> tags: each page is
 * static HTML, so Next's client-side navigation adds nothing.
 */
export const pageHref = (slug?: string) => (slug ? `${BASE_PATH}/${slug}/` : `${BASE_PATH}/`);

export const GITHUB = "https://github.com/pley-media-server/pley";
export const RELEASES = `${GITHUB}/releases`;
export const ISSUES = `${GITHUB}/issues`;

/** This site's repository, where the guides are. */
export const DOCS_REPO = "https://github.com/pley-media-server/pley-docs";

/** A permanent invite, landing in #welcome. */
export const DISCORD = "https://discord.gg/wSsVdRRnT3";

export const DESCRIPTION =
  "How to install, set up and use Pley, the free, open-source media server for movies, shows, music and live TV.";
