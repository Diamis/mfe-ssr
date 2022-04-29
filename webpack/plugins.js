const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const configs = require('../utils/configs');

module.exports = (isServer = false) => {
  const appName = process.env.APP_NAME || 'host';
  const configuration = require(configs.configuration);

  let remotes;
  let library;

  if (isServer) {
    library = { type: 'commonjs2' };
  } else {
    library = { type: 'var', name: appName };
  }

  remotes = (configuration.remotes || []).reduce((rmts, curr) => {
    let uri = curr.location.replace(/\/$/, '');
    uri = uri.replace(/^https?:/, '');

    rmts[curr.name] = `${curr.name}@${uri}/remoteEntry.js`;

    return rmts;
  }, {});

  return [
    new CleanWebpackPlugin({
      verbose: true,
      //important elsewise minifest.json is deleted
      cleanOnceBeforeBuildPatterns: ['**/*', '!manifest.json'],
    }),
    new MiniCssExtractPlugin({
      filename: 'style/[name].css',
      chunkFilename: 'style/[id].css',
    }),
    new WebpackManifestPlugin({
      fileName: 'manifest.json',
    }),
    new ModuleFederationPlugin({
      library,
      remotes,
      name: appName,
      filename: 'remoteEntry.js',
      exposes: configuration.exposes || {},
      shared: configuration.shared || [],
    }),
  ];
};
