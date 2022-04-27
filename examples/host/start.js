process.env.NODE_ENV = "development";
process.env.APP_NAME = "test_host";
process.env.APP_DIST = "_dist/host";
process.env.APP_ROOT = "app/host";

import { join } from "path";
import { readFileSync } from "fs";
import React from "react";
import rimraf from "rimraf";
import express from "express";
import webpack from "webpack";
import { renderToPipeableStream } from "react-dom/server";
import hotMiddleware from "webpack-hot-middleware";
import devMiddleware from "webpack-dev-middleware";

import makeClientConfig from "../../webpack/webpack.client";
import makeServerConfig from "../../webpack/webpack.server";

const app = express();

const configClient = makeClientConfig();
const configServer = makeServerConfig();

rimraf.sync(join(configClient.output.path, "../"));

let compilerClient;
let compilerServer;

try {
  compilerClient = webpack(configClient);
  compilerServer = webpack(configServer);
} catch (error) {
  console.log(error.message);
}

watch();

async function watch() {
  await watchCompiler(compilerServer);

  const dist = configClient.output.path;
  const dev = devMiddleware(compilerClient, {
    writeToDisk: true,
    publicPath: configClient.output.publicPath,
  });

  app.use(dev);
  app.use(hotMiddleware(compilerClient));
  app.get("/", async (req, res) => {
    let didError = false;
    const { location } = req.query;
    res.set("X-Location", JSON.stringify(location));
    res.socket.on("error", (error) => {
      console.error("Fatal", error);
    });

    const manifest = readFileSync(join(dist, "manifest.json"), "utf8");
    const moduleMap = JSON.parse(manifest);
    const { default: App } = require(join(dist, "../server/main.js"));

    const stream = renderToPipeableStream(<App assets={moduleMap} />, {
      bootstrapScripts: [moduleMap["main.js"]],
      onShellReady() {
        res.statusCode = didError ? 500 : 200;
        res.set("Content-type", "text/html");
        stream.pipe(res);
      },
      onError(x) {
        didError = true;
        console.error(x);
      },
    });

    setTimeout(() => stream.abort(), 3000);
  });

  dev.waitUntilValid(() => {
    app.listen(3000, () => console.log("http://localhost:3000"));
  });
}

function watchCompiler(compiler) {
  return new Promise((resolve, reject) => {
    compiler.watch({ ignored: "node_modules" }, (err, stats) => {
      if (err || (stats && stats.hasErrors())) {
        const data = stats.toJson() || {};
        if (Array.isArray(data.errors)) {
          data.errors.forEach(({ message }) => console.log(message));
        }
        if (Array.isArray(data.warnings)) {
          data.warnings.forEach(({ message }) => console.log(message));
        }

        reject(stats);
      }
      resolve(stats);
    });
  });
}
