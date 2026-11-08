const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/+$/, "") || "";

export function sitePath(path: string | undefined) {
  if (!path || !path.startsWith("/") || path.startsWith("//") || !basePath) return path;
  if (path === basePath || path.startsWith(basePath + "/")) return path;
  return basePath + path;
}
