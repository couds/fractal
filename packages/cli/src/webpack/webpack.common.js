const webpack = require('webpack');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = () => {
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
          test: /\.tsx?$/,
          use: [
            babelLoader,
            {
              loader: 'ts-loader',
              options: {
                compilerOptions: {
                  noEmit: false,
                },
                transpileOnly: true,
              },
            },
          ],
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
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
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
    ],
    resolve: {
      extensions: ['.ts', '.js', '.tsx', '.jsx', '.json', '.wasm'],
    },
  };
};
