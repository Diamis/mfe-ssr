import React from "react";
import { join } from "path";
import { StaticRouter } from "react-router-dom/server";
import { renderToPipeableStream } from "react-dom/server";

import Document from "./document";
import * as compiler from "./compiler";
import getManifest from "../utils/manifest";
import smartRequire from "../utils/smart-require";
import chankExtractor from "../lib/chunk-extractor";

export default (req, res) => {
  res.socket.on("error", (error) => {
    console.error("Fatal", error);
  });

  const context = {};
  const configServer = compiler.getConfig("server");
  const configClient = compiler.getConfig("client");

  const manifestServer = getManifest(configServer);
  const manifestClient = getManifest(configClient);

  const modulePath = join(configServer.output.path, "main.js");
  const { default: App } = smartRequire(modulePath);

  const extractor = chankExtractor(manifestClient);
  const styles = extractor.getStyleElements();

  let didError = false;
  let stream = renderToPipeableStream(
    <Document assets={{ styles }}>
      <StaticRouter location={req.url} context={context}>
        <App />
      </StaticRouter>
    </Document>,
    {
      bootstrapScripts: [manifestServer["main.js"]],
      onCompleteShell() {
        shouldInjectHead = true;
      },
      onShellReady() {
        res.statusCode = didError ? 500 : 200;
        res.set("Content-type", "text/html");
        res.set("X-Location", JSON.stringify(req.url));
        res.write("<!DOCTYPE html>");
        stream.pipe(res);
      },
      onError(x) {
        didError = true;
        console.error(x);
      },
    }
  );

  setTimeout(() => stream.abort(), 3000);
};
