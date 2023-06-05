import { createServer } from "http";
import { parse } from "url";
import next from "next";
// Import Stencil's Hydrate
import {
  renderToString,
  createWindowFromHtml,
} from "@matt/stencil-components/hydrate";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      const { pathname, query } = parsedUrl;

      if (
        pathname?.startsWith("/_next") ||
        pathname?.startsWith("/__next") ||
        pathname?.startsWith("/favicon.ico") ||
        pathname?.endsWith("svg")
      ) {
        await handle(req, res, parsedUrl);
      } else {
        const html = (await app.renderToHTML(
          req,
          res,
          pathname!,
          query
        )) as string;

        // generate a 'DOM' and insert next generated html into it
        const win = createWindowFromHtml("", "stencil-ssr");
        const document = win.document;
        const bodyElement = document.body;
        const headElement = document.head;

        const nextHeader = html.match(
          /(?<=<head([^>]+)?>)((.|\n)*?)(?=<\/head>)/g
        );
        const nextBody = /<body([^>]+)?>((.|\n)*?)<\/body>/g.exec(html);

        if (nextHeader) {
          // head
          headElement.innerHTML = nextHeader[0];
        }

        if (nextBody) {
          // main body content
          if (nextBody[2]) bodyElement.innerHTML = nextBody[2];
          // body tag attributes
          if (nextBody[1]) {
            const el = document.createElement("html");
            el.innerHTML = `<div ${nextBody[1]}></div>`;

            const attrs = Array.from(
              el.getElementsByTagName("div")[0].attributes
            );
            attrs.forEach((attr) =>
              bodyElement.setAttribute(attr.name, attr.value)
            );
          }
        }

        // hydrate stencil components mpw
        await renderToString(document);

        // pick out stencil style tags and add them to body so next leaves them alone
        headElement
          .querySelectorAll("style[sty-id]")
          .forEach((stencilStyle) => {
            bodyElement.append(stencilStyle);
          });

        return res.end(document.documentElement.outerHTML);
      }
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  }).listen(port);
  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? "development" : process.env.NODE_ENV
    }`
  );
});
