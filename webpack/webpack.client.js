import path from "path";
import { merge } from "webpack-merge";

import { clientLoader as rules } from "./loaders";
import resolvers from "./resolvers";
import plugins from "./plugins";
import configs from "../utils/configs";

export default (webpackConfigs = {}) => {
  const { NODE_ENV } = process.env;
  const mode = NODE_ENV === "production" ? "production" : "development";
  const isDev = mode === "development";
  const entry = path.join(configs.appRoot, "index");

  return merge(
    {
      mode,
      name: "client",
      target: "web",
      entry: isDev ? ["webpack-hot-middleware/client", entry] : [entry],
      output: {
        path: path.join(configs.dist, "client"),
        filename: "[name].js",
      },
      resolvers,
      plugins: plugins(false),
      module: { rules },
    },
    webpackConfigs
  );
};
