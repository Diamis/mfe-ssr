const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const configs = require("../utils/configs");

function normalizeRemotes(remotes) {
  if (Array.isArray(remotes)) {
    remotes = remotes.reduce((rmts, curr) => {
      let uri = curr.location.replace(/\/$/, "");
      uri = uri.replace(/^https?:/, "");

      rmts[curr.name] = `${curr.name}@${uri}/remoteEntry.js`;

      return rmts;
    }, {});
  }
  return remotes;
}

module.exports = (isServer = false) => {
  const name = process.env.APP_NAME || "host";
  let { exposes, remotes, shared } = require(configs.configuration);

  let library;

  if (isServer) {
    library = { type: "commonjs2" };
  } else {
    library = { type: "var", name };
  }

  const moduleFederationConfig = { library, name, filename: "remoteEntry.js" };
  if (remotes || exposes) {
    moduleConfig["remotes"] = normalizeRemotes(remotes);
    moduleConfig["exposes"] = exposes;
    moduleConfig["shared"] = shared;
  }

  return [
    new CleanWebpackPlugin({
      verbose: true,
      //important elsewise minifest.json is deleted
      cleanOnceBeforeBuildPatterns: ["**/*", "!manifest.json"],
    }),
    new MiniCssExtractPlugin({
      filename: "style/[name].css",
      chunkFilename: "style/[id].css",
    }),
    new WebpackManifestPlugin({
      fileName: "manifest.json",
    }),
    new ModuleFederationPlugin(moduleFederationConfig),
  ];
};
