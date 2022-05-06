const { dependencies } = require("./package.json");

module.exports = {
  shared: {
    react: {
      requiredVersion: dependencies["react"],
      singleton: true,
    },
    "react-dom": {
      requiredVersion: dependencies["react-dom"],
      singleton: true,
    },
    "react-router-dom": {
      requiredVersion: dependencies["react-router-dom"],
      singleton: true,
    },
  },
};
