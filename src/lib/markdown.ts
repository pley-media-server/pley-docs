import { posix } from "node:path";
import rehypeShiki from "@shikijs/rehype";
import type { Element, ElementContent, Root, RootContent } from "hast";
import { toString } from "hast-util-to-string";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { visit } from "unist-util-visit";

export type Heading = { depth: 2 | 3; id: string; text: string };

/** Where a file in the Pley repository is, from this site. Paths are from the root of the repository. */
export type Resolver = {
  /** The page on this site that shows the file, and the #fragment if given: its address and its name in the sidebar. */
  page(path: string, hash?: string): { href: string; label: string } | undefined;
  /** The file on GitHub. */
  file(path: string): string;
  /** A picture's address. */
  picture(path: string): string;
};

/** How much of a file a page shows. By default, all of it. */
export type Shape = {
  /** Replaces the file's own title (its first heading). */
  title?: string;
  /** Replaces the text between the file's title and its first section. */
  intro?: string;
  /** Only these sections (## headings), in the file's order. */
  sections?: string[];
  /** All but these sections. */
  omit?: string[];
};

/** Whether a page shows a section (a ## heading's text), or the text before the first one (null). */
export function shows(shape: Shape, section: string | null) {
  if (section === "Contents") return false; // the site lists a page's sections itself
  if (section === null) return !shape.intro && !shape.sections;
  return (!shape.sections || shape.sections.includes(section)) && !shape.omit?.includes(section);
}

export type Rendered = { title: string; description: string; html: string; headings: Heading[] };

/** A link to a file in Pley's repository on GitHub, written out in full: its path, and its #fragment. */
const GITHUB_LINK = /^https:\/\/github\.com\/pley-media-server\/pley\/(?:blob|tree)\/[^/]+\/([^#?]+)(#.*)?$/;

const ABSOLUTE = /^[a-z][a-z0-9+.-]*:|^\/\//i;

/** A relative link in `from`, as a path from the root of the repository and its #fragment. */
function resolve(url: string, from: string) {
  if (!url || url.startsWith("#") || ABSOLUTE.test(url)) return undefined;
  const hashAt = url.indexOf("#");
  const path = hashAt === -1 ? url : url.slice(0, hashAt);
  const hash = hashAt === -1 ? "" : url.slice(hashAt);
  const target = posix.normalize(path.startsWith("/") ? path.slice(1) : posix.join(posix.dirname(from), path));
  if (target.startsWith("..")) return undefined;
  return { path: target.replace(/\/$/, ""), hash };
}

const isElement = (node: RootContent | ElementContent, tag?: string): node is Element =>
  node.type === "element" && (tag === undefined || node.tagName === tag);

/** A list of links to the file's own sections, such as "- [Install](#install)": the site has its own. */
function isContentsList(node: RootContent) {
  if (!isElement(node, "ul")) return false;
  const items = node.children.filter((child) => isElement(child, "li"));
  const onlyLinks = (item: Element) =>
    item.children.every((child) =>
      isElement(child, "a") ? String(child.properties.href).startsWith("#") : !isElement(child) && /^[\s,:;]*$/.test(toString(child)),
    );
  return items.length > 1 && items.every(onlyLinks);
}

/** A short piece of Markdown written here (a page's intro), as HTML elements. */
function markdownToHast(markdown: string) {
  const processor = unified().use(remarkParse).use(remarkGfm).use(remarkRehype);
  return processor.runSync(processor.parse(markdown)) as Root;
}

const DESCRIPTION_LENGTH = 180;

function shorten(text: string) {
  const plain = text.replace(/\s+/g, " ").trim();
  if (plain.length <= DESCRIPTION_LENGTH) return plain;
  return `${plain.slice(0, plain.lastIndexOf(" ", DESCRIPTION_LENGTH))}…`;
}

/**
 * Renders one of Pley's Markdown files as GitHub would, for this site: its first heading becomes the page's
 * title, links between docs stay on the site, other files in the repository open on GitHub, and code is
 * highlighted when the site is built. `shape` trims it to the parts the page shows.
 */
export async function renderMarkdown(markdown: string, file: string, resolver: Resolver, shape: Shape = {}): Promise<Rendered> {
  let title = "";
  let description = "";
  const headings: Heading[] = [];

  const rewrite = () => (tree: Root) => {
    visit(tree, "element", (node) => {
      const props = node.properties;
      if (node.tagName === "a" && typeof props.href === "string") {
        const written = props.href;
        const relative = resolve(written, file);
        const onGithub = GITHUB_LINK.exec(written);
        const page = relative
          ? resolver.page(relative.path, relative.hash)
          : onGithub
            ? resolver.page(decodeURIComponent(onGithub[1]).replace(/\/$/, ""), onGithub[2])
            : undefined;
        if (page) props.href = page.href + (relative?.hash ?? onGithub?.[2] ?? "");
        else if (relative) props.href = resolver.file(relative.path) + relative.hash;
        // A link written as its own file name, "[LG.md](LG.md)", is named after its page here.
        const text = toString(node).trim();
        if (page && (text === written || text === written.split("#")[0] || /^[\w./-]+\.md$/.test(text))) {
          node.children = [{ type: "text", value: page.label }];
        }
      } else if (node.tagName === "img" && typeof props.src === "string") {
        const target = resolve(props.src, file);
        if (target) props.src = resolver.picture(target.path);
        props.loading = "lazy";
        props.decoding = "async";
      }
    });

    // Wide tables scroll on their own, not the page.
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "table" || !parent || index === undefined) return;
      parent.children[index] = { type: "element", tagName: "div", properties: { className: ["table-wrap"] }, children: [node] };
      return "skip";
    });
  };

  /** The file's first heading is the page's title; `shape` picks what follows it. */
  const trim = () => (tree: Root) => {
    const h1 = tree.children.findIndex((node) => isElement(node, "h1"));
    if (h1 !== -1) {
      title = toString(tree.children[h1]).trim();
      tree.children.splice(h1, 1);
    }
    if (shape.title) title = shape.title;

    let section: string | null = null; // null: before the first ## heading
    tree.children = tree.children.filter((node) => {
      if (isElement(node, "h2")) section = toString(node).trim();
      return shows(shape, section) && !(section === null && isContentsList(node));
    });
    if (shape.intro) tree.children.unshift(...markdownToHast(shape.intro).children);
  };

  /** The first paragraph describes the page, for search engines and the front page. */
  const describe = () => (tree: Root) => {
    const p = tree.children.find((node) => isElement(node, "p"));
    if (p) description = shorten(toString(p));
  };

  /** Links to a part of the file this page leaves out go to that part on GitHub. */
  const linkLeftOut = () => (tree: Root) => {
    const ids = new Set<string>();
    visit(tree, "element", (node) => {
      if (typeof node.properties.id === "string") ids.add(node.properties.id);
    });
    visit(tree, "element", (node) => {
      const href = node.properties.href;
      if (node.tagName !== "a" || typeof href !== "string" || !href.startsWith("#") || ids.has(decodeURIComponent(href.slice(1)))) return;
      node.properties.href = resolver.file(file) + href;
      node.properties.target = "_blank";
      node.properties.rel = ["noopener", "noreferrer"];
    });
  };

  /** A copy button on each code block; src/components/copy-code.tsx handles the clicks. */
  const copyButtons = () => (tree: Root) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "pre" || !parent || index === undefined) return;
      const button: Element = {
        type: "element",
        tagName: "button",
        properties: { type: "button", className: ["copy"], dataCopy: "", dataPagefindIgnore: "" },
        children: [{ type: "text", value: "Copy" }],
      };
      parent.children[index] = { type: "element", tagName: "div", properties: { className: ["code"] }, children: [node, button] };
      return "skip";
    });
  };

  const collectHeadings = () => (tree: Root) => {
    visit(tree, "element", (node) => {
      if ((node.tagName === "h2" || node.tagName === "h3") && typeof node.properties.id === "string") {
        headings.push({ depth: node.tagName === "h2" ? 2 : 3, id: node.properties.id, text: toString(node).trim() });
      }
    });
  };

  const html = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    // GitHub's own allowlist for HTML in Markdown, keeping ids as written so links to them still work.
    .use(rehypeSanitize, { ...defaultSchema, clobberPrefix: "" })
    .use(trim)
    .use(rewrite)
    .use(describe)
    .use(rehypeSlug)
    .use(linkLeftOut)
    .use(collectHeadings)
    .use(rehypeAutolinkHeadings, {
      behavior: "append",
      test: ["h2", "h3", "h4"],
      properties: { className: ["anchor"], ariaHidden: "true", tabIndex: -1, dataPagefindIgnore: "" },
      content: { type: "text", value: "#" },
    })
    .use(rehypeShiki, { theme: "github-dark-default", defaultLanguage: "text", fallbackLanguage: "text" })
    .use(copyButtons)
    .use(rehypeStringify)
    .process(markdown);

  return { title, description, html: String(html), headings };
}
