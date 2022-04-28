const wepback = require("webpack");
const listenCompiler = require("../utils/listen-compiler");
const makeClientConfig = require("../webpack/webpack.client");
const makeServerConfig = require("../webpack/webpack.server");

const webpackCompiler = { client: null, server: null };
const webpackConfigs = {
  client: makeClientConfig(),
  server: makeServerConfig(),
};

function getConfig(target) {
  return webpackConfigs[target];
}

function getCompiler(target) {
  const config = getConfig(target);
  const compiler = webpackCompiler[target];
  if (!compiler) {
    try {
      webpackCompiler[target] = wepback(config);
    } catch ({ message }) {
      console.log(message);
      process.exit(1);
    }
  }
  return webpackCompiler[target];
}

function watch(target) {
  const compiler = getCompiler(target);
  const promise = listenCompiler(compiler, target);

  compiler.watch({ ignore: "node_modules" }, () => {});
  return promise;
}

function run(target) {
  const compiler = getCompiler(target);
  const promise = listenCompiler(compiler, target);

  compiler.run(() => {});
  return promise;
}

module.exports = {
  run,
  watch,
  getConfig,
  getCompiler,
};
