const configs = require("../utils/configs");

module.exports = {
  extensions: [".tsx", ".ts", ".jsx", ".js", ".json", ".mjs", ".css"],
  alias: {
    "@src": configs.appRoot,
  },
};
