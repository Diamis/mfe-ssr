const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const { clientLoader: rules } = require('./loaders');
const resolve = require('./resolvers');
const plugins = require('./plugins');
const configs = require('../utils/configs');

module.exports = (webpackConfigs = {}) => {
  const { NODE_ENV } = process.env;
  const mode = NODE_ENV === 'production' ? 'production' : 'development';
  const isDev = mode === 'development';
  const entry = path.join(configs.appRoot, 'index');

  return merge(
    {
      mode,
      name: 'client',
      target: 'web',
      entry: isDev ? ['webpack-hot-middleware/client', entry] : [entry],
      output: {
        path: path.join(configs.dist, 'client'),
        filename: '[name].js',
        publicPath: '/',
      },
      resolve,
      plugins: [
        ...plugins(false),
        isDev && new ReactRefreshPlugin(),
        new webpack.HotModuleReplacementPlugin(),
      ].filter(Boolean),
      module: { rules },
    },
    webpackConfigs,
  );
};
