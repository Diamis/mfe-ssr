const path = require("path");

module.exports = (webpackConfig) => {
  const outputPath = webpackConfig.output.path;
  const manifest = require(path.join(outputPath, "manifest.json"));
  return manifest;
};
