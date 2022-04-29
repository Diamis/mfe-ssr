const path = require('path');
const { merge } = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');

const { serverLoader: rules } = require('./loaders');
const resolve = require('./resolvers');
const plugins = require('./plugins');
const configs = require('../utils/configs');

module.exports = (webpackConfigs = {}) => {
  const { NODE_ENV } = process.env;
  const mode = NODE_ENV === 'production' ? 'production' : 'development';

  return merge(
    {
      mode,
      name: 'server',
      target: 'node',
      entry: [path.join(configs.appRoot, 'app')],
      output: {
        path: path.join(configs.dist, 'server'),
        library: { type: 'commonjs2' },
        filename: '[name].js',
      },
      externals: [nodeExternals()],
      resolve,
      plugins: plugins(true),
      module: { rules },
    },
    webpackConfigs,
  );
};
