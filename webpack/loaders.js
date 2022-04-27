import MiniCssExtractPlugin from "mini-css-extract-plugin";
import configs from "../utils/configs";

const mjsLoader = {
  test: /\.m?js$/,
  include: /node_modules/,
  type: "javascript/auto",
};

const babelLoader = {
  test: /\.(js|jsx|mjs|ts|tsx)$/,
  exclude: /node_modules/,
  use: [
    {
      loader: "babel-loader",
      options: { cacheDirectory: false },
    },
  ],
};

const usePostCSS = {
  loader: "postcss-loader",
  options: { config: { path: configs.postCssConfig } },
};

const cssLoaderServer = {
  test: /\.css$/,
  exclude: /node_modules/,
  use: [{ loader: "css-loader" }, usePostCSS],
};

const cssLoaderClient = {
  test: /\.css$/,
  exclude: /node_modules/,
  use: [
    {
      loader: MiniCssExtractPlugin.loader,
      options: { hot: true, reloadAll: true },
    },
    {
      loader: "css-loader",
      options: { sourceMap: true },
    },
    usePostCSS,
  ],
};

export const clientLoader = [
  { oneOf: [mjsLoader, babelLoader, cssLoaderClient] },
];

export const serverLoader = [
  { oneOf: [mjsLoader, babelLoader, cssLoaderServer] },
];

export default { clientLoader, serverLoader };
