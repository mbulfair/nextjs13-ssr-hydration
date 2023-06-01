const stencil = require("@matt/stencil-components/hydrate");
const express = require("express");
const next = require("next");
const path = require("path");
const compression = require("compression");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = true;
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(compression());

  // static assets
  server.get("/_next/*", handle);
  server.get("/img/*", handle);
  server.get("/video/*", handle);
  server.get("/*.svg", handle);
  server.get("/__nextjs_original-stack-frame", handle);

  server.use(
    "/scripts/comp",
    express.static(
      path.join(__dirname, "../../node_modules/@matt/stencil-components/")
    )
  );

  server.all("/api/*", handle);

  server.all("*", async (req, res) => {
    const html = await app.renderToHTML(req, res, req.path, req.query);
    const renderedHtml = await stencil.renderToString(html, {
      prettyHtml: false,
      removeHtmlComments: false,
    });
    return res.send(renderedHtml.html);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
