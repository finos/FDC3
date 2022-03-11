const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const isProduction = process.env.NODE_ENV == "production";

const config = {
  entry: './src/index.js',
  mode: 'development',
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
      filename: "index.html",
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ["buffer", "Buffer"],
    }),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    fallback: {
      util: require.resolve("util/"),
      stream: require.resolve("stream-browserify/"),
      buffer: require.resolve("buffer/"),
    }
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
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
