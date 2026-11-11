import ReactMarkdown, { type Components } from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { localMediaHref, resolveDocHref, stripFrontmatter, type DocPage } from "@/lib/docs";
import { sitePath } from "@/lib/site-path";

const schema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames || []), "details", "summary", "figure", "figcaption", "picture", "source"],
  attributes: {
    ...defaultSchema.attributes,
    "*": [...(defaultSchema.attributes?.["*"] || []), "className", "id", "align"],
    a: [...(defaultSchema.attributes?.a || []), "className", "target", "rel"],
    img: [...(defaultSchema.attributes?.img || []), "width", "height", "loading", "className"],
    table: [...(defaultSchema.attributes?.table || []), "dataView"],
    source: ["srcSet", "media", "type"], details: ["open"],
  },
};

const hintStyle: Record<string,{icon:string;label:string}> = {
  danger: { icon: "⚠️", label: "Attention" },
  warning: { icon: "⚠️", label: "À savoir" },
  info: { icon: "💡", label: "Information" },
  success: { icon: "✅", label: "À retenir" },
};

function escapeHTML(value: string) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function prepareLegacyMarkdown(source: string, current: DocPage, pages: DocPage[]) {
  let markdown = source.replace(/\r\n/g, "\n");
  if ((current.slug === "index" || current.slug.endsWith("/index")) && /^#\s+Accueil\s*#*\s*\n+/m.test(markdown)) markdown = markdown.replace(/^#\s+Accueil\s*#*\s*\n+/m, "");

  markdown = markdown.replace(/\{% content-ref url="([^"]+)" %\}([\s\S]*?)\{% endcontent-ref %\}/g, (_match, url: string, inner: string) => {
    const resolved = resolveDocHref(url, current, pages) || url;
    const target = pages.find((page) => page.href === resolved);
    const fallback = inner.match(/\[([^\]]+)\]\([^)]+\)/)?.[1]?.replace(/\.md$/i, "");
    const title = escapeHTML(target?.title || fallback || "Lire le guide");
    const href = escapeHTML(target?.href || resolved);
    const description = target?.description ? `<small>${escapeHTML(target.description)}</small>` : "";
    return `\n\n<div class="doc-reference"><a class="doc-reference-link" href="${href}"><strong>${title}</strong>${description}<span aria-hidden="true">→</span></a></div>\n\n`;
  });

  markdown = markdown.replace(/\{% hint style="([^"]+)" %\}([\s\S]*?)\{% endhint %\}/g, (_match, style: string, inner: string) => {
    const kind = hintStyle[style] || hintStyle.info;
    const lines = inner.trim().split("\n");
    const heading = lines[0]?.match(/^#{1,6}\s+(.+)$/);
    const title = heading?.[1]?.replace(/[*_`]/g, "").trim() || kind.label;
    const body = (heading ? lines.slice(1) : lines).join("\n").trim();
    const quoted = body ? body.split("\n").map((line) => line ? `> ${line}` : ">").join("\n") : "";
    return `\n\n> ${kind.icon} **${title}**${quoted ? `\n>\n${quoted}` : ""}\n\n`;
  });

  markdown = markdown
    .replace(/\{% code(?:\s+title="[^"]*")?\s*%\}/g, "")
    .replace(/\{% endcode %\}/g, "")
    .replace(/\{% tabs %\}/g, "")
    .replace(/\{% tab title="([^"]+)" %\}/g, "\n\n### $1\n\n")
    .replace(/\{% endtab %\}/g, "\n\n")
    .replace(/\{% endtabs %\}/g, "\n\n")
    .replace(/\{% stepper %\}/g, "\n\n")
    .replace(/\{% step %\}/g, "\n\n---\n\n")
    .replace(/\{% endstep %\}/g, "\n\n")
    .replace(/\{% endstepper %\}/g, "\n\n")
    .replace(/\{% columns(?:\s+[^%]+)? %\}/g, "\n\n")
    .replace(/\{% column(?:\s+[^%]+)? %\}/g, "\n\n")
    .replace(/\{% endcolumn %\}/g, "\n\n")
    .replace(/\{% endcolumns %\}/g, "\n\n");

  return markdown;
}

export default function MarkdownDocument({page,pages}:{page:DocPage;pages:DocPage[]}) {
  const components: Components = {
    a({href,children,node:_node,...props}) {
      const rawHref = typeof href === "string" ? href : "";
      const localImage = Boolean(rawHref) && !/^(?:[a-z][a-z\d+.-]*:|\/\/|\/)/i.test(rawHref) && /\.(?:avif|gif|jpe?g|png|svg|webp)(?:[?#]|$)/i.test(rawHref);
      const resolved = (localImage ? localMediaHref(rawHref,page) : resolveDocHref(href,page,pages) || href) || "#";
      const external = /^(?:https?:)?\/\//i.test(resolved);
      const label = typeof children === "string" ? children : Array.isArray(children) ? children.filter((item) => typeof item === "string").join("") : "";
      if (localImage) return <a href={resolved} {...props} aria-label={"Agrandir " + (label || "image de documentation")}><img src={resolved} alt={label} loading="lazy" /></a>;
      const target = pages.find((candidate) => candidate.href === resolved);
      const filenameOnly = /^[^/]+\.md$/i.test(label.trim());
      const rendered = filenameOnly ? "Ouvrir le guide →" : children;
      return <a href={external ? resolved : sitePath(resolved)} {...(external?{target:"_blank",rel:"noreferrer"}:{})} {...props} aria-label={filenameOnly ? "Ouvrir : " + (target?.title || label) : undefined}>{rendered}</a>;
    },
    source({srcSet,node:_node,...props}) {
      const rewritten = typeof srcSet === "string" ? srcSet.split(",").map((candidate) => {
        const trimmed = candidate.trim();
        const descriptorMatch = trimmed.match(/^(.*?)(?:\s+(\d+(?:\.\d+)?[wx]))?$/);
        const url = descriptorMatch?.[1]?.trim() || trimmed;
        const descriptor = descriptorMatch?.[2];
        return localMediaHref(url,page) + (descriptor ? " " + descriptor : "");
      }).join(", ") : srcSet;
      return <source srcSet={rewritten} {...props} />;
    },
    img({src,alt,node:_node,...props}) {
      return <img src={localMediaHref(typeof src==="string"?src:undefined,page)} alt={alt||""} loading="lazy" {...props} />;
    },
    table({children,node:_node,...props}) {
      return <div className="table-scroll"><table {...props}>{children}</table></div>;
    },
    blockquote({children,node:_node,...props}) {
      return <blockquote {...props}>{children}</blockquote>;
    },
  };
  const content = prepareLegacyMarkdown(stripFrontmatter(page.content),page,pages);
  return <div className="markdown-body"><ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw,[rehypeSanitize,schema],rehypeSlug] as any} components={components}>{content}</ReactMarkdown></div>;
}
