import * as path from "jsr:@std/path";

export function configReader(
  basePath: string | undefined = undefined,
): <T>(path: string) => Promise<T> {
  const fullPath = (basePath == null || basePath == "") ? Deno.cwd() : basePath;
  return async function config<T>(relativePath: string): Promise<T> {
    return (await import(path.join(fullPath, relativePath))).default as T;
  };
}
