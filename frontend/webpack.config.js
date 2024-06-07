const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.js", // Adjust the entry point as needed
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  resolve: {
    fallback: {
      util: require.resolve("util/"),
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
        // exclude: [/node_modules\/@twilio\/audioplayer/],
        exclude: [
          // Ensure the path is correctly formatted for Windows
          path.resolve(__dirname, "node_modules/@twilio/audioplayer"),
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      // Add other loaders as needed
    ],
  },
};
