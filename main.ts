import { default as router } from "./pages/routes.ts";
import { configReader } from "./lib/config.ts";

const config = configReader();

Deno.serve(
  await config<Deno.ServeTcpOptions>("./config/server.ts"),
  (req: Request) => router.resolve(req),
);
