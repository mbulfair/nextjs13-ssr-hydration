import { createServer } from "http";
import { parse } from "url";
import next from "next";
// Import Stencil's Hydrate
import { renderToString } from "@matt/stencil-components/hydrate";

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
        const markup = await app.renderToHTML(req, res, pathname!, query);
        // Stencil
        const hydratedMarkup = await renderToString(markup, {
          prettyHtml: false,
          removeHtmlComments: false,
          clientHydrateAnnotations: true,
        });

        res.end(hydratedMarkup.html);
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
