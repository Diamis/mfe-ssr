function smartRequire(moduleName) {
  if (process.env.NODE_ENV !== 'production') {
    const module = require.cache[moduleName];
    if (module) {
      const { main, children } = module;
      // remove self from own parents
      if (main && main.children) {
        main.children = main.children.filter((x) => x !== m);
      }
      // remove self from own children
      if (children) {
        children.forEach((c) => {
          if (c.main && c.main === module) {
            c.main = null;
          }
        });
      }

      delete require.cache[moduleName];
    }
  }

  return require(moduleName);
}

module.exports = smartRequire;
