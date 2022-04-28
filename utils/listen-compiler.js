const chalk = require("chalk");

function log(name, data, color = "red") {
  const fn = chalk[color];
  return data
    .map(({ message }) => {
      message = message.replace("Error", fn("Error"));
      message = message.replace("not found", fn("not found"));
      return fn(`[${name}]`) + ` ${message}`;
    })
    .join("\n");
}

module.exports = function (compiler, name) {
  compiler.hooks.compile.tap("compiling", () => {
    console.log(chalk.green(`[${name}] Compiling...`));
  });

  return new Promise((resolve, reject) => {
    compiler.hooks.invalid.tap("invalid", (error) => {
      console.log(chalk.red(`[${name}] Invalid to compile.`));
      reject(error);
    });

    compiler.hooks.done.tap("done", (stats) => {
      const data = stats.toJson();
      const isSuccessful = !data.errors.length && !data.warnings.length;

      if (isSuccessful) {
        console.log(chalk.green(`[${name}] Compiled successfully!`));
        return resolve(compiler);
      }

      if (data.errors.length) {
        console.log(chalk.red(`[${name}] Failed to compile.`));
        console.log(log(name, data.errors, "red"));
      }

      if (data.warnings.length) {
        console.log(chalk.yellow(`[${name}] Compiled with warnings.`));
        console.log(log(name, data.warnings, "yellow"));
      }

      return reject(data);
    });
  });
};
