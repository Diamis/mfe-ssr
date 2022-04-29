const path = require("path");

module.exports = {
  env: {
    browser: true,
    es2022: true,
    node: true,
    jest: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: path.join(process.cwd(), "tsconfig.json"),
    tsconfigRootDir: process.cwd(),
  },
  extends: [
    "prettier",
    "airbnb-typescript",
    "plugin:jest/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  plugins: ["react", "react-hooks", "jsx-a11y", "import", "prettier", "jest"],
  rules: {
    "react/prop-types": "off",
    "react/display-name": "off",
  },
  settings: {
    react: { version: "detect" },
  },
};
