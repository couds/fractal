const webpack = require('webpack');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = ({ name }) => {
  const babelLoader = {
    loader: 'babel-loader',
    options: {
      presets: [
        [
          '@babel/preset-react',
          {
            runtime: 'automatic',
          },
        ],
        ['@babel/preset-typescript'],
      ],
      plugins: ['babel-plugin-macros'],
    },
  };
  return {
    devtool: isProduction ? 'source-map' : 'cheap-source-map',
    mode: isProduction ? 'production' : 'development',
    module: {
      rules: [
        {
          test: /\.(t|j)sx?$/,
          use: [babelLoader],
        },
        {
          test: /\.svg$/,
          use: ['@svgr/webpack'],
        },
      ],
    },
    externals: {},
    plugins: [
      new webpack.DefinePlugin({
        'process.env.FRACTAL_NAME': JSON.stringify(name),
      }),
    ],
    resolve: {
      extensions: ['.ts', '.js', '.tsx', '.jsx', '.json', '.wasm'],
    },
  };
};
