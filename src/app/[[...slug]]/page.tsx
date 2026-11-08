import { notFound } from "next/navigation";
import { DocsSite } from "@/components/DocsSite";
import { ArticlePage, HomePage } from "@/components/DocsPages";
import { getDocumentation } from "@/lib/docs";

export async function generateStaticParams() {
  const docs = await getDocumentation();
  return [
    { slug: [] },
    ...docs.pages.map((page) => ({ slug: page.href.split("/").filter(Boolean) })),
  ];
}

export const dynamicParams = false;

export default async function DocsPage({params}:{params:Promise<{slug?:string[]}>}) {
  const [{slug}, docs] = await Promise.all([params,getDocumentation()]);
  if (!slug?.length) return <DocsSite categories={docs.categories} pages={docs.pages} activeHref="/">
    <HomePage categories={docs.categories} pages={docs.pages} />
  </DocsSite>;

  const category = docs.categories.find((item)=>item.slug===slug[0]);
  if (!category) notFound();
  const requested = slug.slice(1).join("/") || "index";
  const page = category.pages.find((item)=>item.slug===requested || item.slug===requested+"/index");
  if (!page) notFound();
  return <DocsSite categories={docs.categories} pages={docs.pages} activeCategory={category.slug} activeHref={page.href}>
    <ArticlePage page={page} category={category} pages={docs.pages} />
  </DocsSite>;
}
