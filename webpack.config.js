const path = require("path");
const webpack = require("webpack");

const isProduction = process.env.NODE_ENV == "production";

const config = {
  entry: {
    "app1": "./src/app1/index.ts",
    "app2": "./src/app2/index.ts",
    "dummy-desktop-agent": "./src/dummy-desktop-agent/index.ts",
    "dummy-implementation": "./src/dummy-desktop-agent/implementation.ts",
    "WebC3": "./src/WebC3/index.ts"
  },
  devtool: "source-map",
  output: {
    filename: "[name].js",
    //globalObject: 'this',
    path: path.resolve(__dirname, "./dist"),
  },
  plugins: [
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
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
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
