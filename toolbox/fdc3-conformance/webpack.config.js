const path = require('path');
const webpack = require('webpack');

const isProduction = process.env.NODE_ENV == 'production';

const config = {
  entry: {
    'fdc3-compliance-v1.2': './src/test/v1.2/index.ts',
    'channel-v1.2': './src/mock/v1.2/channel.ts',
    'general-v1.2': './src/mock/v1.2/general.ts',
    'intent-a-v1.2': './src/mock/v1.2/intent-a.ts',
    'intent-b-v1.2': './src/mock/v1.2/intent-b.ts',
    'intent-c-v1.2': './src/mock/v1.2/intent-c.ts',
    'fdc3-compliance-v2.0': './src/test/v2.0/index.ts',
    'channel-v2.0': './src/mock/v2.0/channel.ts',
    'general-v2.0': './src/mock/v2.0/general.ts',
    'metadata-v2.0': './src/mock/v2.0/metadata.ts',
    'intent-a-v2.0': './src/mock/v2.0/intent-a.ts',
    'intent-b-v2.0': './src/mock/v2.0/intent-b.ts',
    'intent-c-v2.0': './src/mock/v2.0/intent-c.ts',
    'intent-d-v2.0': './src/mock/v2.0/intent-d.ts',
    'intent-e-v2.0': './src/mock/v2.0/intent-e.ts',
    'intent-f-v2.0': './src/mock/v2.0/intent-f.ts',
    'intent-g-v2.0': './src/mock/v2.0/intent-g.ts',
    'intent-h-v2.0': './src/mock/v2.0/intent-h.ts',
    'intent-i-v2.0': './src/mock/v2.0/intent-i.ts',
    'intent-j-v2.0': './src/mock/v2.0/intent-j.ts',
    'intent-k-v2.0': './src/mock/v2.0/intent-k.ts',
    'basic-v2.0': './src/mock/v2.0/basic.ts',
    'open-a-v2.0': './src/mock/v2.0/open-a.ts',
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
