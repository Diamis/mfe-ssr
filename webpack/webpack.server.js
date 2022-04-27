import path from "path";
import { merge } from "webpack-merge";
import nodeExternals from "webpack-node-externals";

import { serverLoader as rules } from "./loaders";
import resolvers from "./resolvers";
import plugins from "./plugins";
import configs from "../utils/configs";

export default (webpackConfigs = {}) => {
  const { NODE_ENV } = process.env;
  const mode = NODE_ENV === "production" ? "production" : "development";

  return merge(
    {
      mode,
      name: "server",
      target: "node",
      entry: [path.join(configs.appRoot, "app")],
      output: {
        path: path.join(configs.dist, "server"),
        filename: "[name].js",
      },
      externals: [nodeExternals()],
      resolvers,
      plugins: plugins(true),
      module: { rules },
    },
    webpackConfigs
  );
};
