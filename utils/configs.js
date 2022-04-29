const fs = require('fs');
const path = require('path');

const resolve = (str) => path.resolve(process.cwd(), str);

const getConfig = (configName) => {
  const configPath = path.resolve(process.cwd(), configName);
  try {
    if (fs.existsSync(configPath)) {
      return configPath;
    } else {
      return path.join(__dirname, '../', configName);
    }
  } catch {
    return path.join(__dirname, '../', configName);
  }
};

module.exports = {
  cwd: process.cwd(),
  dist: resolve(process.env.APP_DIST || 'dist'),
  appRoot: resolve(process.env.APP_ROOT || 'src'),
  babelConfig: getConfig('babel.config.js'),
  postCssConfig: getConfig('postcss.config.js'),
  configuration: getConfig('configuration.js'),
  tailwindConfig: getConfig('tailwind.config.js'),
};
