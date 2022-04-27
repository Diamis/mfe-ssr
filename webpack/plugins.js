import ModuleFederationPlugin from "webpack/lib/container/ModuleFederationPlugin";
import { WebpackManifestPlugin } from "webpack-manifest-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

import configs from "../utils/configs";

const appName = process.env.APP_NAME || "host";
const configuration = require(configs.configuration);

export default (isServer = false) => {
  let remotes;
  let library;

  if (isServer) {
    library = { type: "commonjs2" };
  } else {
    library = { type: "var", name: appName };
    remotes = (configuration.remotes || []).reduce((rmts, curr) => {
      const uri = curr.location.replace(/\/$/, "");
      rmts[curr.name] = `${curr.name}@${uri}/remoteEntry.js`;

      return rmts;
    }, {});
  }

  return [
    new WebpackManifestPlugin({ fileName: "manifest.json" }),
    new MiniCssExtractPlugin({
      filename: "style/[name].css",
      chunkFilename: "style/[id].css",
    }),
    new ModuleFederationPlugin({
      name: appName,
      filename: "remoteEntry.js",
      library,
      remotes,
      exposes: configuration.exposes || {},
      shared: configuration.shared || [],
    }),
  ];
};
