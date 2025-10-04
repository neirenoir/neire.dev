import { Router } from "../lib/router.ts";
import { assemble } from "../lib/responses.ts";
import { serveDir } from "jsr:@std/http/file-server";
import { join } from "jsr:@std/path/join";

import home from "./home/home.ts";
import about from "./about/about.ts";
import experience from "./experience/experience.ts";
import portfolio from "./portfolio/portfolio.ts";
import demos from "./demos/demos.ts";
import contact from "./contact/contact.ts";
import curriculum from "./curriculum.ts";

export default new Router(
  [
    {
      pattern: new URLPattern({ pathname: "/static/*" }),
      content: async (req) => {
        const root = import.meta.dirname || Deno.cwd();
        return await serveDir(req, {
          fsRoot: join(root, "static"),
          urlRoot: "static",
          showDirListing: true,
        });
      },
    },
    {
      pattern: new URLPattern({ pathname: "/" }),
      content: async (req) => await assemble(req, home),
      children: [
        {
          pattern: new URLPattern({ pathname: "/about" }),
          content: async (req) => await assemble(req, about),
        },
        {
          pattern: new URLPattern({ pathname: "/experience" }),
          content: async (req) => await assemble(req, experience),
        },
        {
          pattern: new URLPattern({ pathname: "/portfolio" }),
          content: async (req) => await assemble(req, portfolio),
        },
        {
          pattern: new URLPattern({ pathname: "/demos" }),
          content: async (req) => await assemble(req, demos),
        },
        {
          pattern: new URLPattern({ pathname: "/contact" }),
          content: async (req) => await assemble(req, contact),
        },
        {
          pattern: new URLPattern({ pathname: "/curriculum" }),
          content: async (req) => await assemble(req, curriculum),
        },
      ],
    },
  ],
);
