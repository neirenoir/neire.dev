import { isBodyInit } from "./responses.ts";
import { AcceptableResponseBodies } from "./responses.ts";

export interface Route {
  readonly pattern: URLPattern;
  readonly content?: (
    req: Request,
  ) => Promise<AcceptableResponseBodies | Response>;
  readonly middleware?:
    ((req: Request, res: Response) => Promise<[Request, Response]>)[];
  readonly children?: Route[];
}

export class Router {
  readonly roots: Route[];
  readonly httpCodes: Map<number, (req: Request) => ReadableStream>;

  constructor(roots: Route[]) {
    this.roots = roots;
    this.httpCodes = new Map<number, (req: Request) => ReadableStream>();
  }

  public async resolve(request: Request): Promise<Response> {
    const httpCodes = this.httpCodes;

    function response404(req: Request): Response {
      return new Response(
        httpCodes.get(404)?.call(null, req) || "404 - Not Found",
        {
          status: 404,
          statusText: "Not Found",
        },
      );
    }

    async function response200(req: Request, res: Response, route: Route) {
      if (route.content == null) {
        return response404(req);
      }

      const content = await route.content(req);
      if (content instanceof Response) {
        return content;
      }
      return new Response(
        isBodyInit(content) ? content : JSON.stringify(content),
        {
          status: 200,
          statusText: "OK",
          headers: res.headers,
        },
      );
    }

    async function recResolve(
      route: Route,
      request: Request,
    ): Promise<Response> {
      let req: Request = request;
      let res: Response = new Response();
      // Check each middleware for potential not-okay results that must be
      // early returns
      if (route.middleware != null) {
        for (const middleware of route.middleware) {
          const [midReq, midRes] = await middleware(req, res);
          if (!midRes.ok) {
            return new Response(
              (midRes.body != null)
                ? midRes.body
                : httpCodes.get(midRes.status)?.call(null, req),
              {
                status: midRes.status,
                statusText: midRes.statusText,
                headers: midRes.headers,
              },
            );
          }
          req = midReq;
          res = midRes;
        }
      }

      if (route.pattern.test(req.url)) {
        // Exact match. Return this
        return response200(req, res, route);
      }

      // Check whether there are any children matching this same route
      // If that's the case, explore that child further
      // Otherwise, keep the current route
      if (route.children != null) {
        for (const child of route.children) {
          const partial = new URLPattern({
            pathname: child.pattern.pathname + "*",
          });
          if (partial.test(req.url)) {
            return recResolve(child, req);
          }
        }
      }

      return response404(req);
    }

    for (const root of this.roots) {
      const partial = new URLPattern({
        pathname: root.pattern.pathname + "*",
      });

      if (partial.test(request.url)) {
        return await recResolve(root, request);
      }
    }

    // When all else fails, 404
    return response404(request);
  }
}
