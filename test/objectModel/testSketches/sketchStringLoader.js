/* POLYFILL ********************************************************
* LETS US USE require.context to load all strings
*/

// This condition actually should detect if it's an Node environment
if (typeof require.context === 'undefined') {
    const fs = require('fs');
    const path = require('path');

    require.context = (base = '.', scanSubDirectories = false, regularExpression = /\.js$/) => {
      const files = {};

      function readDirectory(directory) {
        fs.readdirSync(directory).forEach((file) => {
          const fullPath = path.resolve(directory, file);

          if (fs.statSync(fullPath).isDirectory()) {
            if (scanSubDirectories) readDirectory(fullPath);

            return;
          }

          if (!regularExpression.test(fullPath)) return;

          files[fullPath] = true;
        });
      }

      readDirectory(path.resolve(__dirname, base));

      function Module(file) {
        return require(file);
      }

      Module.keys = () => Object.keys(files);

      return Module;
    };
  }
/* POLYFILL END *********************************************************/


var context = require.context('./', true, /\.(string)$/);

var strings = {};
context.keys().forEach((filename)=>{
  // take filename only
    let fileKey = /^.*\\(.*)$/.exec(filename)[1];
  // remove .string
  fileKey = fileKey.replace(".string", "")
  // attach to dictionary
  strings[fileKey] = context(filename);
});

export default strings
