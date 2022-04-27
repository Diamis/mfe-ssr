import { join } from "path";
import { readFileSync } from "fs";
import rimraf from "rimraf";
import React from "react";
import express from "express";
import webpack from "webpack";
import { renderToPipeableStream } from "react-dom/server";
import hotMiddleware from "webpack-hot-middleware";
import devMiddleware from "webpack-dev-middleware";
import ModuleFederationPlugin from "webpack/lib/container/ModuleFederationPlugin";

import { dependencies } from "../../package.json";
import { getAppConfig } from "../../utils/configs";
import makeClientConfig from "../../webpack/webpack.client";
import makeServerConfig from "../../webpack/webpack.server";

const app = express();
const paths = getAppConfig();

rimraf.sync(paths.appHost.dist);

const configClient = makeClientConfig({
  entry: [
    "webpack-hot-middleware/client",
    join(paths.appRemote.root, "client.jsx"),
  ],
  output: {
    path: join(paths.appRemote.dist, "client"),
    publicPath: "http://localhost:3002/",
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "remote2",
      filename: "remoteEntry.js",
      exposes: {
        "./app": "./app/remote/app",
      },
      shared: ["react", "react-dom"],
    }),
  ],
});

const configServer = makeServerConfig({
  entry: [join(paths.appRemote.root, "app.jsx")],
  output: {
    path: join(paths.appRemote.dist, "server"),
    library: { type: "commonjs2" },
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "remote2",
      filename: "remoteEntry.js",
      library: { type: "commonjs2" },
      exposes: {
        "./app": "./app/remote/app",
      },
      shared: [
        {
          react: dependencies.react,
          "react-dom": dependencies["react-dom"],
        },
      ],
    }),
  ],
});

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

  const dist = paths.appRemote.dist;
  const dev = devMiddleware(compilerClient, {
    writeToDisk: true,
    publicPath: "/",
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

    const manifest = readFileSync(join(dist, "client/manifest.json"), "utf8");
    const moduleMap = JSON.parse(manifest);
    const { default: App } = require(join(dist, "server/main.js"));

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
    app.listen(3002, () => console.log("http://localhost:3002"));
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
