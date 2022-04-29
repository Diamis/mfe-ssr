require('@babel/register')({
  only: [/\.jsx?/],
  ignore: ['node_modules'],
});

const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');

const compiler = require('./compiler');
const renderMiddleware = require('./render').default;

module.exports = async function ({ port }) {
  let devMiddleware;
  const app = express();
  const PORT = port || process.env.PROT || 3000;
  const IS_DEV = process.env.NODE_ENV === 'development';

  if (IS_DEV) {
    await compiler.watch('server');

    const configClient = compiler.getConfig('client');
    const compileClient = compiler.getCompiler('client');
    devMiddleware = require('webpack-dev-middleware')(compileClient, {
      writeToDisk: true,
      publicPath: configClient.output.publicPath,
    });

    app.use(devMiddleware);
    app.use(require('webpack-hot-middleware')(compileClient));
  }

  app.use(compression());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());
  app.get('/', renderMiddleware);

  if (!IS_DEV) {
    await compiler.run('server');
    await compiler.run('client');
    app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
  }

  if (devMiddleware && typeof devMiddleware.waitUntilValid === 'function') {
    devMiddleware.waitUntilValid(() => {
      app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
    });
  }
};
