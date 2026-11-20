import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import GithubSlugger from "github-slugger";
import { toString } from "mdast-util-to-string";
import { cache } from "react";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { renderMarkdown, shows, type Heading, type Resolver, type Shape } from "@/lib/markdown";
import { BASE_PATH, DOCS_REPO, GITHUB, pageHref } from "@/lib/site";

/** One page: a Markdown file, or part of one, and where it lives on this site. */
export type DocEntry = {
  /** Its address under /docs, with no leading or trailing slash. */
  slug: string;
  /** A file in the Pley repository, or a guide in this one (guides/). Several pages may show parts of one file. */
  file: string;
  /** Its name in the sidebar and in links to it. */
  label: string;
  /** What the page shows of the file. By default, all of it. */
  shape?: Shape;
};

export type Group = { title: string; docs: DocEntry[] };

const LATEST_RELEASE = `${GITHUB}/releases/latest`;

/** An app's page: what it runs on, then how to install it and what it can't do yet. The rest stays on GitHub. */
const app = (intro: string): Shape => ({ intro, sections: ["Install", "Known limits"] });

/**
 * The sidebar, in order. Guides are written here; every other page is fetched from the Pley repository at build
 * time (scripts/sync.ts): edit it there.
 */
export const GROUPS: Group[] = [
  {
    title: "Get started",
    docs: [
      { slug: "quick-start", file: "guides/quick-start.md", label: "Quick start" },
      {
        slug: "requirements",
        file: "deploy/README.md",
        label: "Requirements",
        shape: { title: "Requirements", sections: ["What Pley needs"] },
      },
    ],
  },
  {
    title: "Install",
    docs: [
      { slug: "install/docker", file: "deploy/docker/README.md", label: "Docker" },
      { slug: "install/unraid", file: "deploy/unraid/README.md", label: "Unraid", shape: { omit: ["How the container runs"] } },
      { slug: "install/synology", file: "deploy/synology/README.md", label: "Synology", shape: { omit: ["How the package works"] } },
      { slug: "install/windows", file: "deploy/windows/README.md", label: "Windows", shape: { omit: ["Building the installer"] } },
      {
        slug: "install/macos",
        file: "deploy/README.md",
        label: "macOS",
        shape: {
          title: "Pley on macOS",
          intro: `Download the macOS archive for your Mac (Apple silicon or Intel) from the [latest release](${LATEST_RELEASE}), extract it, and run these commands in its folder.`,
          sections: ["macOS (launchd)", "Checking hardware transcoding", "The tray icon"],
        },
      },
      {
        slug: "install/linux",
        file: "deploy/README.md",
        label: "Linux",
        shape: {
          title: "Pley on Linux",
          intro: `Download the Linux archive (x86_64 or arm64) from the [latest release](${LATEST_RELEASE}), extract it, and run these commands in its folder. To run Pley in a container, use [Docker](docker/README.md) instead.`,
          sections: ["Linux (systemd)", "Checking hardware transcoding"],
        },
      },
    ],
  },
  {
    title: "Set up",
    docs: [
      {
        slug: "first-start",
        file: "docs/CONFIGURATION.md",
        label: "First start",
        shape: { title: "Setting up Pley", sections: ["First start"] },
      },
      { slug: "naming-media", file: "deploy/docker/media/README.md", label: "Naming your media" },
      { slug: "moving-from-plex", file: "docs/MOVING_FROM_PLEX.md", label: "Moving from Plex" },
      {
        slug: "remote-access",
        file: "deploy/README.md",
        label: "Remote access",
        shape: {
          title: "Remote access",
          intro: "What to open on your network, and how to reach Pley from outside it.",
          sections: ["Firewall and remote access", "Apps and reverse proxies"],
        },
      },
    ],
  },
  {
    title: "Apps",
    docs: [
      { slug: "apps", file: "guides/apps.md", label: "All apps" },
      {
        slug: "apps/android",
        file: "docs/ANDROID.md",
        label: "Android and Fire TV",
        shape: app(
          "For phones, tablets, Android TV, Google TV and Fire TV (Fire OS 7 and later), on Android 8 or later. It isn't in a store yet: you sideload it.",
        ),
      },
      {
        slug: "apps/samsung",
        file: "docs/TV_PLATFORMS.md",
        label: "Samsung TV",
        shape: app(
          "For Samsung TVs from 2018 on (Tizen 4.0 and later). It isn't in Samsung's store yet: you build it and install it in developer mode.",
        ),
      },
      {
        slug: "apps/lg",
        file: "docs/LG.md",
        label: "LG TV",
        shape: app(
          "For LG TVs with webOS 4.0 and later (from 2018 on). LG's store takes no native apps: you install it in Developer Mode, or on a rooted TV.",
        ),
      },
      {
        slug: "apps/roku",
        file: "docs/ROKU.md",
        label: "Roku",
        shape: app("For Roku players and Roku TVs. It isn't in Roku's channel store: you sideload it in developer mode."),
      },
      {
        slug: "apps/kodi",
        file: "docs/KODI.md",
        label: "Kodi",
        shape: app(
          "An add-on for Kodi 20 (Nexus) and later, on Windows, macOS, Linux, LibreELEC, CoreELEC and Android TV boxes. No add-on repository carries it yet: you install it from a zip.",
        ),
      },
    ],
  },
  {
    title: "Running Pley",
    docs: [
      { slug: "configuration", file: "docs/CONFIGURATION.md", label: "Configuration", shape: { omit: ["First start"] } },
      { slug: "quality", file: "docs/QUALITY.md", label: "Playback quality" },
      { slug: "storage", file: "docs/STORAGE.md", label: "Storage and backups" },
    ],
  },
  {
    title: "Reference",
    docs: [
      { slug: "features", file: "docs/FEATURES.md", label: "Features" },
      { slug: "compatibility", file: "docs/COMPATIBILITY.md", label: "Plex and Jellyfin compatibility" },
      { slug: "api", file: "docs/API.md", label: "Pley's API" },
    ],
  },
  {
    title: "Development",
    docs: [
      { slug: "development", file: "docs/DEVELOPMENT.md", label: "Building Pley" },
      { slug: "transcoder", file: "docs/TRANSCODER.md", label: "The transcoder" },
      { slug: "ffmpeg", file: "deploy/ffmpeg/README.md", label: "Pley's FFmpeg" },
      { slug: "releasing", file: "docs/RELEASING.md", label: "Releasing" },
    ],
  },
];

/** Where a link to a whole file goes when no page shows all of it. */
const WHOLE_FILE: Record<string, string> = { "deploy/README.md": "quick-start" };

export const DOCS: (DocEntry & { group: string })[] = GROUPS.flatMap((group) =>
  group.docs.map((doc) => ({ ...doc, group: group.title })),
);

const BY_FILE = new Map<string, DocEntry[]>();
for (const doc of DOCS) BY_FILE.set(doc.file, [...(BY_FILE.get(doc.file) ?? []), doc]);

const isGuide = (file: string) => file.startsWith("guides/");

/** Where scripts/sync.ts put Pley's docs, and their pictures. */
const CONTENT = join(process.cwd(), "content", "pley");
const PICTURES = join(process.cwd(), "public", "pley");

const readSource = (file: string) => readFileSync(isGuide(file) ? join(process.cwd(), file) : join(CONTENT, file), "utf8");

type Source = { ref: string; sha: string };

export const source = cache((): Source => {
  const file = join(CONTENT, "source.json");
  if (!existsSync(file)) throw new Error("Pley's docs aren't here yet: run `bun run sync`.");
  return JSON.parse(readFileSync(file, "utf8")) as Source;
});

/** A file on GitHub: a guide in this repository, anything else in Pley's, at the commit the docs came from. */
export const githubFile = (file: string) =>
  isGuide(file) ? `${DOCS_REPO}/blob/master/${file}` : `${GITHUB}/blob/${source().sha}/${file}`;

const anchors = new Map<DocEntry, Set<string>>();

/** The #fragments a page with a shape keeps, named as GitHub names them across the whole file. */
function anchorsOf(entry: DocEntry, shape: Shape) {
  let ids = anchors.get(entry);
  if (!ids) {
    ids = new Set();
    const slugger = new GithubSlugger();
    let section: string | null = null;
    for (const node of unified().use(remarkParse).use(remarkGfm).parse(readSource(entry.file)).children) {
      if (node.type !== "heading") continue;
      const text = toString(node).trim();
      const id = slugger.slug(text);
      if (node.depth === 1) continue;
      if (node.depth === 2) section = text;
      if (shows(shape, section)) ids.add(id);
    }
    anchors.set(entry, ids);
  }
  return ids;
}

/** Links between pages stay on this site, on the page that shows what they point at; the rest opens on GitHub. */
const RESOLVER: Resolver = {
  page: (path, hash) => {
    const entries = BY_FILE.get(path);
    if (!entries) return undefined;
    const id = hash ? decodeURIComponent(hash.slice(1)) : "";
    const entry = id
      ? entries.find((doc) => !doc.shape || anchorsOf(doc, doc.shape).has(id))
      : (entries.find((doc) => !doc.shape?.sections) ?? DOCS.find((doc) => doc.slug === WHOLE_FILE[path]) ?? entries[0]);
    return entry && { href: pageHref(entry.slug), label: entry.label };
  },
  file: githubFile,
  picture: (path) =>
    existsSync(join(PICTURES, path)) ? `${BASE_PATH}/pley/${path}` : `${GITHUB}/raw/${source().sha}/${path}`,
};

export type Doc = DocEntry & {
  group: string;
  title: string;
  description: string;
  html: string;
  headings: Heading[];
};

export const loadDoc = cache(async (slug: string): Promise<Doc | undefined> => {
  const entry = DOCS.find((doc) => doc.slug === slug);
  if (!entry) return undefined;
  const rendered = await renderMarkdown(readSource(entry.file), entry.file, RESOLVER, entry.shape);
  return { ...entry, ...rendered };
});
