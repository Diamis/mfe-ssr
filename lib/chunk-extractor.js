const path = require("path");
const React = require("react");

const EXTENSION_TYPES = {
  ".js": "script",
  ".mjs": "script",
  ".css": "style",
};

function reduceManifest(prev, curr) {
  const [key, chunk] = curr;
  const ext = path.extname(key);
  const type = EXTENSION_TYPES[ext];
  if (!Array.isArray(prev[type])) {
    prev[type] = [];
  }

  prev[type].push(chunk);
  return prev;
}

function assetToStyleElement(url) {
  return <link key={url} rel="stylesheet" href={url} />;
}

function chunkExtract(manifest) {
  const assets = Object.entries(manifest || {}).reduce(reduceManifest, {});
  return {
    getStyleElements() {
      const { style = [] } = assets;
      return style.map(assetToStyleElement);
    },
  };
}

module.exports = chunkExtract;
