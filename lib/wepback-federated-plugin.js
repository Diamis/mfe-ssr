const { Template } = require("webpack");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

class FederatedPlugin {
  /**
   *
   * @param {{ dir?: string; }} options
   */
  constructor(options) {
    this.options = options || {};
  }

  /**
   *
   * @param {import("webpack").Compiler} compiler
   */
  apply(compiler) {
    const dir = this.options.dir || process.cwd();
    const moduleFederationPlugin = compiler.options.plugins.find(
      (plugin) => plugin instanceof ModuleFederationPlugin
    );

    if (!moduleFederationPlugin) {
      return;
    }

    const target = compiler.options.target;
    const moduleFederationOptions = moduleFederationPlugin._options || {};

    if (target === "node") {
      const { remotes = {} } = moduleFederationOptions;
      moduleFederationOptions.remotes = Object.values(remotes).map((remote) => {
        if (!remote.startsWith("http") && !remote.startsWith("//")) {
          return remote;
        }

        return {
          external: `external (async function() {
              return fetch(${remote}).then(res => {
                  console.log('res', res)
              }).cath(err => {
                  console.log('err', err)
              })
          })`,
        };
      });
    }
    console.log("moduleFederationOptions", moduleFederationOptions);
  }
}

module.exports = FederatedPlugin;
