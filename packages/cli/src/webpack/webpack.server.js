const path = require('path');
const webpack = require('webpack');

module.exports = ({ entry, outputDir, context, name } = {}) => {
  return {
    context,
    node: {
      __filename: false,
      __dirname: false,
    },
    target: 'node',
    entry,
    output: {
      path: path.resolve(context, outputDir),
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ['null-loader'],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.MF_NAME': JSON.stringify(name),
      }),
    ],
    resolve: {},
    externals: {},
  };
};
