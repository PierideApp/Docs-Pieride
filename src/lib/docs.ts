import { readdir, readFile } from "node:fs/promises";
import { watch, type FSWatcher } from "node:fs";
import path from "node:path";
import { sitePath } from "@/lib/site-path";

const ROOT = path.resolve(process.cwd(), "docs");
export type DocPage = {
  source: string; slug: string; href: string; categorySlug: string; title: string;
  description: string; cover?: string; featured: boolean; content: string; searchText: string;
};
export type DocCategory = {
  slug: string; name: string; icon: string; accent: string; description: string; order: number; href: string; pages: DocPage[];
};
export type Documentation = { categories: DocCategory[]; pages: DocPage[] };
type DocumentationCache = { promise?: Promise<Documentation>; watcher?: FSWatcher; loadedAt?: number };
const cacheGlobal = globalThis as typeof globalThis & { __pierideDocumentationCache?: DocumentationCache };
const documentationCache = cacheGlobal.__pierideDocumentationCache ??= {};

export function stripFrontmatter(source: string) {
  return source.replace(/^---\s*\r?\n[\s\S]*?\r?\n---\s*(?:\r?\n|$)/, "");
}
function firstImage(source: string) {
  const markdown = stripFrontmatter(source).replace(/```[\s\S]*?```/g, "");
  const match = markdown.match(/!\[[^\]]*\]\(\s*(?:<([^>]+)>|([^\s)]+))/);
  return match?.[1] || match?.[2];
}
function field(source: string, name: string): string | undefined {
  return source.match(new RegExp("^" + name + ":\\s*[\"']?(.+?)[\"']?\\s*$", "m"))?.[1]?.trim();
}
function text(source: string) {
  return stripFrontmatter(source).replace(/\x60{3}[\s\S]*?\x60{3}/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\{%[\s\S]*?%\}/g, " ").replace(/<[^>]*>/g, " ").replace(/^#{1,6}\s+/gm, "").replace(/[*_~\x60>|]/g, " ").replace(/\s+/g, " ").trim();
}
function descriptionFrom(source: string) {
  const blocks = stripFrontmatter(source).replace(/\r\n/g, "\n").replace(/^\s*#{1,6}\s+.*$/gm, "").split(/\n\s*\n/);
  for (const block of blocks) {
    const value = block.trim();
    if (!value || /^<(?:figure|h[1-6])\b|^#{1,6}\s|^```|^\{%/i.test(value)) continue;
    const candidate = text(value);
    if (candidate.length > 25) return candidate.slice(0, 190);
  }
  return text(source).slice(0, 190);
}
function descriptionFromFrontmatter(front: string, source: string) {
  const direct = field(front, "description");
  if (direct && !/^(?:>|\|)[+-]?$/.test(direct)) return direct;
  const multiline = front.match(/^description:\s*(?:>|\|)[+-]?\s*\r?\n((?:[ \t]+.*(?:\r?\n|$))*)/m)?.[1];
  if (multiline) return multiline.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).join(" ").slice(0, 190);
  return descriptionFrom(source);
}
function titleFrom(source: string, relative: string, category: string) {
  const heading = stripFrontmatter(source).match(/^#\s+(.+?)\s*#*\s*$/m)?.[1];
  if (heading && heading.trim().toLocaleLowerCase("fr") !== "accueil") return heading.replace(/[*_\x60]/g, "").trim();
  const base = path.posix.basename(relative, ".md");
  if (base.toLowerCase() === "readme") {
    const folder = path.posix.basename(path.posix.dirname(relative));
    return folder === "." ? category : folder.replace(/[-_]/g, " ").replace(/\b\p{L}/gu, (x) => x.toLocaleUpperCase("fr"));
  }
  return base.toLowerCase() === "index" ? category : base.replace(/[-_]/g, " ").replace(/\b\p{L}/gu, (x) => x.toLocaleUpperCase("fr"));
}
function hrefFor(category: string, slug: string) {
  const cleanSlug = slug === "index" ? "" : slug.endsWith("/index") ? slug.slice(0, -6) : slug;
  return cleanSlug ? "/" + category + "/" + cleanSlug.split("/").map(encodeURIComponent).join("/") : "/" + category;
}
async function walk(dir: string, relative: string, out: string[]): Promise<void> {
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); } catch { return; }
  entries.sort((a,b) => a.name.localeCompare(b.name, "fr", {sensitivity:"base"}));
  for (const entry of entries) {
    if (entry.name.startsWith(".") || entry.name === "node_modules" || entry.name === "assets") continue;
    const rel = relative ? relative + "/" + entry.name : entry.name;
    if (entry.isDirectory()) await walk(path.join(dir, entry.name), rel, out);
    else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md") && entry.name.toLowerCase() !== "summary.md") out.push(rel);
  }
}

async function loadDocumentation(): Promise<Documentation> {
  let roots;
  try { roots = await readdir(ROOT, { withFileTypes: true }); } catch { return {categories:[],pages:[]}; }
  const categories: DocCategory[] = [];
  for (const root of roots.filter((item) => item.isDirectory() && !item.name.startsWith("."))) {
    const dir = path.join(ROOT, root.name);
    let config: Record<string, unknown>;
    try { config = JSON.parse(await readFile(path.join(dir, "category.json"), "utf8")); } catch { continue; }
    if (typeof config.name !== "string" || !config.name.trim()) continue;
    const sources: string[] = [];
    await walk(dir, "", sources);
    const pages = await Promise.all(sources.map(async (relative) => {
      const content = await readFile(path.join(dir, ...relative.split("/")), "utf8");
      const front = content.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/m)?.[1] || "";
      const pagePath = relative.replace(/\\/g, "/").replace(/\.md$/i, "");
      const basename = path.posix.basename(pagePath);
      const configuredSlug = field(front, "slug")?.replace(/^\/+|\/+$/g, "");
      const slug = configuredSlug || (basename.toLowerCase() === "readme"
        ? (path.posix.dirname(pagePath) === "." ? "index" : path.posix.join(path.posix.dirname(pagePath), "index"))
        : pagePath);
      return {
        source: root.name + "/" + relative.replace(/\\/g, "/"), slug, href: hrefFor(root.name, slug),
        categorySlug: root.name, title: field(front, "title") || titleFrom(content, relative, config.name as string),
        description: descriptionFromFrontmatter(front, content),
        cover: field(front, "cover") || firstImage(content), featured: field(front, "featured") === "true",
        content, searchText: text(content).slice(0, 12000),
      } satisfies DocPage;
    }));
    pages.sort((a,b) => a.slug === "index" ? -1 : b.slug === "index" ? 1 : a.title.localeCompare(b.title, "fr", {sensitivity:"base"}));
    categories.push({
      slug: root.name, name: config.name.trim(), icon: typeof config.icon === "string" ? config.icon : "book",
      accent: typeof config.accent === "string" && /^#[\da-f]{6}$/i.test(config.accent) ? config.accent : "#5b50e8",
      description: typeof config.description === "string" ? config.description : "",
      order: typeof config.order === "number" ? config.order : 99, href: "/" + root.name, pages,
    });
  }
  categories.sort((a,b) => a.order - b.order || a.name.localeCompare(b.name, "fr"));
  return {categories, pages: categories.flatMap((category) => category.pages)};
}

export function getDocumentation(): Promise<Documentation> {
  const isDevelopment = process.env.NODE_ENV === "development";
  if (isDevelopment && !documentationCache.watcher) {
    try {
      documentationCache.watcher = watch(ROOT, { recursive: true }, (_event, filename) => {
        const changed = filename?.toString() || "";
        if (!changed || /\.(?:md|json)$/i.test(changed)) {
          documentationCache.promise = undefined;
          documentationCache.loadedAt = undefined;
        }
      });
      documentationCache.watcher.on("error", () => {
        documentationCache.watcher?.close();
        documentationCache.watcher = undefined;
      });
    } catch {
      // The short development cache below is the fallback when recursive watch is unavailable.
    }
  }

  const fallbackExpired = isDevelopment && !documentationCache.watcher && Date.now() - (documentationCache.loadedAt || 0) > 1000;
  if (!documentationCache.promise || fallbackExpired) {
    documentationCache.promise = loadDocumentation().then((docs) => {
      documentationCache.loadedAt = Date.now();
      return docs;
    }).catch((error) => {
      documentationCache.promise = undefined;
      documentationCache.loadedAt = undefined;
      throw error;
    });
  }
  return documentationCache.promise;
}

export function resolveDocHref(href: string | undefined, current: DocPage, pages: DocPage[]) {
  if (!href) return href;
  const raw = href.trim();
  if (!raw || raw.startsWith("#")) return raw;
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(raw)) return raw;
  let pathname = raw, suffix = "";
  const cut = pathname.search(/[?#]/);
  if (cut >= 0) { suffix = pathname.slice(cut); pathname = pathname.slice(0, cut); }
  try { pathname = decodeURIComponent(pathname); } catch { return raw; }
  if (pathname.startsWith("/")) {
    const match = pages.find((page) => page.href === pathname);
    return match ? match.href + suffix : raw;
  }
  const target = path.posix.normalize(path.posix.join(path.posix.dirname(current.source), pathname));
  if (target === ".." || target.startsWith("../")) return raw;
  const candidates = [target];
  if (!/\.md$/i.test(target)) candidates.push(target + ".md", target.replace(/\/$/, "") + "/index.md", target.replace(/\/$/, "") + "/README.md");
  const match = candidates.map((candidate) => pages.find((page) => page.source.toLowerCase() === candidate.toLowerCase())).find(Boolean);
  return match ? match.href + suffix : raw;
}

export function localMediaHref(src: string | undefined, current: DocPage) {
  if (!src || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(src)) return src;
  if (src.startsWith("/")) return sitePath(src);
  const file = src.split(/[?#]/, 1)[0], suffix = src.slice(file.length);
  const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(current.source), file));
  if (resolved === ".." || resolved.startsWith("../")) return src;
  return sitePath("/assets/" + resolved.split("/").map(encodeURIComponent).join("/") + suffix);
}

