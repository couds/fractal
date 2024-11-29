const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = ({ includeReact = false, entry, outputDir, shared = {}, context, name: pkgName }) => {
  const name = typeof entry === 'string' ? pkgName : '[name]';
  return {
    entry,
    context,
    devServer: {
      static: {
        directory: outputDir,
      },
      compress: true,
      port: 9000,
      hot: false,
    },
    output: {
      path: path.resolve(context, outputDir),
      filename: `${name}${includeReact ? '' : '-frameworkless'}.js`,
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: `${name}.css`,
      }),
      new webpack.DefinePlugin({
        'process.env.MF_NAME': JSON.stringify(pkgName),
      }),
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
    ],
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
          sideEffects: true,
        },
      ],
    },
    resolve: {
      fallback: {
        'process/browser': require.resolve('process/browser'),
      },
    },
    externals: includeReact
      ? {}
      : {
          react: 'React',
          'react-dom': 'ReactDOM',
          ...shared,
        },
  };
};
