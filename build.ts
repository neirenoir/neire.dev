// Ensure build/ exists
import { exists } from "jsr:@std/fs/exists";
import { copy } from "jsr:@std/fs/copy";
import { basename, dirname, join } from "@std/path";
import routes from "./pages/routes.ts";
import { Route } from "./lib/router.ts";

const BUILD_DIR = "build/";
const STATIC_DIR = "pages/static/";
const DUMMY_URL = "http://localhost/";

// Clear build if it already exists
if (await exists(BUILD_DIR)) {
  await Deno.remove(BUILD_DIR, { recursive: true });
}
await Deno.mkdir("build/");

// Copy static/ as-is
await copy(STATIC_DIR, join(BUILD_DIR, "static"));

// Find the root route
const root = routes.roots.find((item) => {
  return item.pattern.pathname == "/";
});

if (root == null) {
  throw new Error("FATAL: root route not found");
}

// Rendering index.html
{
  const res = await routes.resolve(
    new Request(join(DUMMY_URL, root.pattern.pathname)),
  );
  await Deno.writeFile(join(BUILD_DIR, "index.html"), res.body!);
}

// Rendering the rest
{
  // deno-lint-ignore no-inner-declarations
  async function recRender(node: Route) {
    const path = node.pattern.pathname;
    const res = await routes.resolve(
      new Request(join(DUMMY_URL, path)),
    );
    const dir = dirname(path);
    const file = basename(path);
    if (!(await exists(join(BUILD_DIR, dir)))) {
      Deno.mkdir(join(BUILD_DIR, dir), { recursive: true });
    }
    await Deno.writeFile(
      join(BUILD_DIR, dir, file + ".html"),
      res.body!,
    );
    node.children?.forEach(recRender);
  }
  root.children?.forEach(recRender);
}
