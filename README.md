# Pley's docs

The docs for [Pley](https://github.com/pley-media-server/pley), at
[pley.media/docs](https://pley.media/docs). The guides for newcomers (Quick
start, All apps) are in `guides/`. Every other page is a Markdown file in
the Pley repository (`docs/` and the install guides in `deploy/`), fetched at
build time: to change one, change the file there.

Each guide states only what Pley's own docs say: check a change against them.

Built with Next.js 16, React 19 and Tailwind CSS 4, run with Bun, searched with
[Pagefind](https://pagefind.app), and hosted on Cloudflare as static files.

```sh
bun install
bun run dev        # http://localhost:3000/docs, without search
bun run preview    # the built site, with search: http://localhost:8787/docs
bun run check      # type-check
bun run lint
```

## How it's built

`bun run build` runs three steps:

1. `scripts/sync.ts` fetches Pley's docs into `content/pley/` with a shallow,
   sparse clone, and copies their pictures to `public/pley/`. Git ignores both
   folders. `PLEY_REF` picks a branch or tag (default: `master`). `PLEY_REPO`
   points at another clone, such as a local folder, to preview docs changes
   before they're pushed.
2. `next build` renders each page to `out/` (`src/lib/markdown.ts`) as GitHub
   would, except that links between docs stay on the site, links to other
   files open on GitHub, and code is highlighted.
3. `pagefind --site out` indexes the pages into `out/pagefind/`. Search runs
   in the browser with no server, loading only the parts of the index it
   needs.

`bun run dev` fetches the docs only if they're missing; `bun run sync` fetches
them again. Search needs the index, which only a build makes: try it with
`bun run preview`.

## Where things are

| Path | What |
|---|---|
| `guides/` | The guides written for this site |
| `src/lib/docs.ts` | The pages: each one's file, address, place in the sidebar, and what part of the file it shows |
| `src/lib/markdown.ts` | Markdown to HTML: titles, sections, links, pictures, tables, code |
| `src/app/[...slug]/page.tsx` | A page: sidebar, the doc, its sections, previous and next |
| `src/app/page.tsx` | The front page, `/docs` |
| `src/components/search.tsx` | The search button and dialog (Pagefind's Component UI) |
| `src/app/globals.css` | pley.media's colours, the docs' typography, the search's colours |
| `scripts/sync.ts` | Fetches Pley's docs |
| `wrangler.jsonc` | Cloudflare: the routes on pley.media and the static files |

To add a page, add its file to `GROUPS` in `src/lib/docs.ts`. A file outside
`guides/`, `docs/*.md` and `deploy/**/README.md` also needs a pattern in
`PATTERNS` in `scripts/sync.ts`.

A page can show part of a file (`shape` in `src/lib/docs.ts`): some of its
sections, under a title or intro written there. App pages show only Install
and Known limits; `deploy/README.md` becomes the Requirements, macOS, Linux
and Remote access pages. Links between docs go to the page that shows their
target, or to the file on GitHub when no page does.

## Deploying to Cloudflare

The site is a Worker with only static files, on two routes in the pley.media
zone: `pley.media/docs` and `pley.media/docs/*`. Workers on routes run before
the home page's Worker, which is on pley.media itself, so `/docs` is served
from here and everything else from the home page. Requests for static files
are free and don't count against the Workers request limits.

Once: `bunx wrangler login`.

Each time: `bun run deploy`. With Cloudflare's Git integration (Workers →
pley-docs → Settings → Build), use `bun run build` as the build command and
`bunx wrangler deploy` as the deploy command.

Changes in the Pley repository reach the site only on the next build and
deploy.
