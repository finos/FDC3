/* eslint-disable */
const path = require('path');
const webpack = require('webpack');

const isProduction = process.env.NODE_ENV == 'production';

const config = {
  entry: {
    'fdc3-compliance': './src/test/index.ts',
    channel: './src/mock/channel.ts',
    general: './src/mock/general.ts',
    metadata: './src/mock/metadata.ts',
    'intent-a': './src/mock/intent-a.ts',
    'intent-b': './src/mock/intent-b.ts',
    'intent-c': './src/mock/intent-c.ts',
    'intent-d': './src/mock/intent-d.ts',
    'intent-e': './src/mock/intent-e.ts',
    'intent-f': './src/mock/intent-f.ts',
    'intent-g': './src/mock/intent-g.ts',
    'intent-h': './src/mock/intent-h.ts',
    'intent-i': './src/mock/intent-i.ts',
    'intent-j': './src/mock/intent-j.ts',
    'intent-k': './src/mock/intent-k.ts',
    basic: './src/mock/basic.ts',
    'open-a': './src/mock/open-a.ts',
  },
  devtool: 'source-map',
  output: {
    filename: '[name].js',
    //globalObject: 'this',
    path: path.resolve(__dirname, './dist/lib'),
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: 'ts-loader',
        exclude: [path.resolve(__dirname, '/node_modules/')],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
      util: require.resolve('util/'),
      stream: require.resolve('stream-browserify/'),
      buffer: require.resolve('buffer/'),
      window: false,
    },
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = 'production';
  } else {
    config.mode = 'development';
  }
  return config;
};
