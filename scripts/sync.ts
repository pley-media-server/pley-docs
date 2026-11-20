// Fetches Pley's docs into content/pley (docs/*.md, docs/images/, the install guides in deploy/) with a shallow,
// sparse clone, so only those files are downloaded, and copies their pictures to public/pley/.
//
//   bun scripts/sync.ts               the master branch on GitHub
//   bun scripts/sync.ts --if-missing  only if content/pley is missing (for `bun run dev`)
//
// PLEY_REF picks another branch or tag. PLEY_REPO points at another clone: a URL or a local folder.
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = resolve(import.meta.dir, "..");
const CONTENT = join(ROOT, "content", "pley");
const PICTURES = join(ROOT, "public", "pley");

const repo = process.env.PLEY_REPO || "https://github.com/pley-media-server/pley.git";
const ref = process.env.PLEY_REF || "master";

/** What's fetched. src/lib/docs.ts lists the pages. */
const PATTERNS = ["/docs/*.md", "/docs/images/", "/deploy/**/README.md"];

if (process.argv.includes("--if-missing") && existsSync(join(CONTENT, "source.json"))) process.exit(0);

function git(args: string[], cwd?: string) {
  const result = Bun.spawnSync(["git", ...args], { cwd, stdout: "pipe", stderr: "inherit" });
  if (result.exitCode !== 0) {
    console.error(`git ${args[0]} failed`);
    process.exit(1);
  }
  return result.stdout.toString().trim();
}

// A shallow clone of a local folder needs a file:// address.
const source = existsSync(repo) ? pathToFileURL(resolve(repo)).href : repo;

rmSync(CONTENT, { recursive: true, force: true });
mkdirSync(dirname(CONTENT), { recursive: true });
git(["clone", "--quiet", "--depth=1", "--filter=blob:none", "--sparse", "--branch", ref, source, CONTENT]);
git(["sparse-checkout", "set", "--no-cone", ...PATTERNS], CONTENT);
const sha = git(["rev-parse", "HEAD"], CONTENT);
rmSync(join(CONTENT, ".git"), { recursive: true, force: true });

// The commit the docs came from, for links to GitHub. Not the repository's address: a local path stays local.
writeFileSync(join(CONTENT, "source.json"), `${JSON.stringify({ ref, sha }, null, 2)}\n`);

// Pictures, served next to the pages at /docs/pley/<path in the Pley repository>.
rmSync(PICTURES, { recursive: true, force: true });
const PICTURE = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".avif"]);
let pictures = 0;
for (const entry of readdirSync(CONTENT, { recursive: true, withFileTypes: true })) {
  if (!entry.isFile() || !PICTURE.has(extname(entry.name).toLowerCase())) continue;
  const from = join(entry.parentPath, entry.name);
  const to = join(PICTURES, relative(CONTENT, from));
  mkdirSync(dirname(to), { recursive: true });
  cpSync(from, to);
  pictures++;
}

console.log(`Pley's docs at ${sha.slice(0, 9)} (${ref}), with ${pictures} pictures`);
