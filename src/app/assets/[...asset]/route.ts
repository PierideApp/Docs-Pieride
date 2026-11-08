import { readFile } from "node:fs/promises";
import path from "node:path";
import { readdir } from "node:fs/promises";

const ROOT = path.resolve(process.cwd(), "docs");
const TYPES: Record<string,string> = {".avif":"image/avif",".gif":"image/gif",".jpeg":"image/jpeg",".jpg":"image/jpeg",".png":"image/png",".svg":"image/svg+xml",".webp":"image/webp"};

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Array<{asset:string[]}>> {
  async function collect(directory: string, prefix: string[] = []): Promise<Array<{asset:string[]}>> {
    let entries;
    try { entries = await readdir(directory, { withFileTypes: true }); } catch { return []; }
    const result: Array<{asset:string[]}> = [];
    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue;
      const parts = [...prefix, entry.name];
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) result.push(...await collect(absolute, parts));
      else if (entry.isFile() && TYPES[path.extname(entry.name).toLowerCase()]) result.push({asset:parts});
    }
    return result;
  }
  return collect(ROOT);
}

export async function GET(_request:Request,{params}:{params:Promise<{asset:string[]}>}) {
  const {asset}=await params;
  if(!asset.length||asset.some((part)=>!part||part==="."||part===".."||part.includes("\\")||part.includes("\0"))) return new Response("Introuvable",{status:404});
  const absolute=path.resolve(ROOT,...asset),relative=path.relative(ROOT,absolute);
  if(relative.startsWith(".."+path.sep)||path.isAbsolute(relative)||/\.md$/i.test(relative)) return new Response("Introuvable",{status:404});
  const type=TYPES[path.extname(absolute).toLowerCase()];
  if(!type) return new Response("Introuvable",{status:404});
  try {
    const bytes=await readFile(absolute);
    return new Response(new Uint8Array(bytes),{headers:{"Content-Type":type,"Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}});
  } catch { return new Response("Introuvable",{status:404}); }
}
