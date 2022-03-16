const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

const isProduction = process.env.NODE_ENV == "production";

const config = {
  entry: {
    FDC3Conformance: "./src/FDC3Conformance.ts",
    silentRun: "./src/silentRun.ts",
  },
  devtool: "inline-source-map",
  output: {
    library: "FDC3Compliance",
    libraryTarget: "umd",
    libraryExport: "default",
    globalObject: 'this',
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
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    fallback: {
      util: require.resolve("util/"),
      stream: require.resolve("stream-browserify/"),
      buffer: require.resolve("buffer/"),
      window: false,
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
