import { BASE_PATH } from "@/lib/site";

/**
 * Pagefind's search: a button (and Ctrl/⌘ K) that opens a dialog. It searches the index `pagefind --site out`
 * writes after the build, so it's missing in `next dev`. Its script and styles are in the layout's <head>, its
 * colours in the --pf-* variables in globals.css.
 *
 * The elements are raw HTML, so React doesn't hydrate them: Pagefind fills them in itself, often before React
 * starts, and React would take what it added for a mismatch.
 */
const ELEMENTS = [
  `<pagefind-config bundle-path="${BASE_PATH}/pagefind/" base-url="${BASE_PATH}/"></pagefind-config>`,
  `<pagefind-modal-trigger placeholder="Search"></pagefind-modal-trigger>`,
  `<pagefind-modal reset-on-close></pagefind-modal>`,
].join("");

export function Search() {
  return <div className="contents" dangerouslySetInnerHTML={{ __html: ELEMENTS }} />;
}
