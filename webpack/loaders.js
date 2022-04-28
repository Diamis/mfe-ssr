const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const postcssImport = require("postcss-import");
const autoprefixer = require("autoprefixer");
const tailwindcss = require("tailwindcss");
const configs = require("../utils/configs");

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

const usePostcss = () => ({
  loader: "postcss-loader",
  options: {
    postcssOptions: {
      ident: "postcss",
      config: configs.postCssConfig,
      plugins: [
        postcssImport,
        tailwindcss({ configs: configs.tailwindConfig }),
        autoprefixer,
      ],
    },
  },
});

const useCss = (modules) => ({
  loader: "css-loader",
  options: { sourceMap: true, modules, importLoaders: 1 },
});

const cssLoaderServer = {
  test: /\.css$/,
  exclude: /\.module\.css$/,
  use: [useCss(), usePostcss()],
};

const cssModuleLoaderServer = {
  test: /\.module\.css$/,
  use: [MiniCssExtractPlugin.loader, useCss(true), usePostcss()],
};

const cssLoaderClient = {
  test: /\.css$/,
  exclude: /\.module\.css$/,
  use: [MiniCssExtractPlugin.loader, useCss(false), usePostcss()],
};

const cssModuleLoaderClient = {
  test: /\.module\.css$/,
  use: [MiniCssExtractPlugin.loader, useCss(true), usePostcss()],
};

const clientLoader = [
  { oneOf: [mjsLoader, babelLoader, cssLoaderClient, cssModuleLoaderClient] },
];

const serverLoader = [
  { oneOf: [mjsLoader, babelLoader, cssLoaderServer, cssModuleLoaderServer] },
];

module.exports = { clientLoader, serverLoader };
