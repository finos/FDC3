const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

const isProduction = process.env.NODE_ENV == "production";

const config = {
  entry: {
    FDC3Conformance: [
      "./src/initMocha.ts",
      "./src/test/fdc3.addContextListener.ts",
      "./src/test/fdc3.addIntentListener.ts",
      "./src/test/fdc3.broadcast.ts",
      "./src/test/fdc3.findIntent.ts",
      "./src/test/fdc3.findIntentsByContext.ts",
      "./src/test/fdc3.getCurrentChannel.ts",
      "./src/test/fdc3.getInfo.ts",
      "./src/test/fdc3.getOrCreateChannel.ts",
      "./src/test/fdc3.getSystemChannels.ts",
      "./src/test/fdc3.joinChannel.ts",
      "./src/test/fdc3.leaveCurrentChannel.ts",
      "./src/test/fdc3.open.ts",
      "./src/test/fdc3.raiseIntent.ts",
      "./src/test/fdc3.raiseIntentForContext.ts",

      /* Must be last so all the preceding files setup their tests first */
      "./src/FDC3Conformance.ts",
    ],
  },
  devtool: "inline-source-map",
  output: {
    path: path.resolve(__dirname, "build"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
      filename: "index.html",
    }),
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: "ts-loader",
        exclude: [path.resolve(__dirname, "/node_modules/")],
      }
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    fallback: {
      util: require.resolve("util/"),
      stream: require.resolve("stream-browserify/"),
      buffer: require.resolve("buffer/"),
    },
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return config;
};
