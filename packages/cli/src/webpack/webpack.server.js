const path = require('path');

module.exports = ({ entry, outputDir, context } = {}) => {
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
        {
          test: /\.(woff2|png|jpg|gif|ttf)$/,
          use: ['null-loader'],
        },
      ],
    },
    plugins: [],
    resolve: {},
    externals: {},
  };
};
