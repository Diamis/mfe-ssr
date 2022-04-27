import fs from "fs";
import path from "path";

const resolve = (str) => path.resolve(process.cwd(), str);

const getConfig = (configName) => {
  const configPath = path.resolve(process.cwd(), configName);
  try {
    if (fs.existsSync(configPath)) {
      return configPath;
    }
  } catch {
    return path.join("../", configName);
  }
};

export default {
  dist: resolve(process.env.APP_DIST || "dist"),
  appRoot: resolve(process.env.APP_ROOT || "src"),
  babelConfig: getConfig("babel.config.js"),
  postCssConfig: getConfig("postcss.config.js"),
  configuration: getConfig("configuration.js"),
};
