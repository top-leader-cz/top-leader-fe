const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const CircularDependencyPlugin = require("circular-dependency-plugin");
const visualizer = require("circular-dependency-plugin-visualizer");
const path = require("path");

module.exports = function () {
  return {
    webpack: {
      //   plugins: [new BundleAnalyzerPlugin({ analyzerMode: "server" })],
      plugins: [
        // new CircularDependencyPlugin({
        //   // exclude detection of files based on a RegExp
        //   exclude: /node_modules/,
        //   // include specific files based on a RegExp
        //   //   include: /dir/,
        //   // add errors to webpack instead of warnings
        //   //   failOnError: true,
        //   // allow import cycles that include an asyncronous import,
        //   // e.g. via import(/* webpackMode: "weak" */ './file.js')
        //   allowAsyncCycles: false,
        //   // set the current working directory for displaying module paths
        //   cwd: process.cwd(),
        // }),
        new CircularDependencyPlugin(
          visualizer(
            {
              exclude: /node_modules/,
              cwd: process.cwd(),
            },
            {
              filepath: path.join(
                __dirname,
                "circular-dependency-visualization.html"
              ),
            }
          )
        ),
      ],
    },
  };
};

// // webpack.config.js
// const CircularDependencyPlugin = require("circular-dependency-plugin");
// const visualizer = require("circular-dependency-plugin-visualizer");

// module.exports = {
//   entry: "./src/index",
//   plugins: [
//     new CircularDependencyPlugin(
//       visualizer(
//         {
//           exclude: /node_modules/,
//           cwd: process.cwd(),
//         },
//         {
//           filepath: path.join(
//             __dirname,
//             "circular-dependency-visualization.html"
//           ),
//         }
//       )
//     ),
//   ],
// };
