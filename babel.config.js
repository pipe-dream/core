module.exports = function(api) {
  api.cache(true);

  const plugins = [];

  if (process.env["NODE_ENV"] === 'test') {
    plugins.push(...[
      [
        "transform-es2015-modules-commonjs"
      ],
      ["module-resolver", {
        "root": ["./src"],
        "alias": {
          "test": "./test"
        }
      }]
    ]);
  }
  return {plugins};
};
