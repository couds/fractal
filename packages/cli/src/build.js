const Webpack = require('webpack');
const { merge } = require('webpack-merge');

const commonConfig = require('./webpack/webpack.common');
const serverConfig = require('./webpack/webpack.server');
const clientConfig = require('./webpack/webpack.client');

module.exports = async ({ pwd, output, client, server, shared, name, webpack }) => {
  console.log('Building client assets');
  const assets = {};
  await Promise.all(
    [true, false].map((includeReact) => {
      return new Promise((resolve, reject) => {
        const clientWebpack = Webpack(
          webpack(
            merge(
              commonConfig(),
              clientConfig({
                name,
                context: pwd,
                entry: client,
                outputDir: `${output}/client`,
                includeReact,
                shared,
              }),
            ),
          ),
        );
        clientWebpack.run((err, stats) => {
          if (err || stats.hasErrors()) {
            reject(err || stats.toJson().errors[0]);
          }
          Object.values(stats.toJson().entrypoints).forEach((entrypoint) => {
            assets[entrypoint.name] = assets[entrypoint.name] || {};
            entrypoint.assets.forEach((asset) => {
              assets[entrypoint.name][asset.name] = `${(asset.size / 1024).toFixed(2)}kb`;
            });
          });

          resolve();
        });
      });
    }),
  );
  if (server) {
    console.log('Building server assets');
    await new Promise((resolve, reject) => {
      const clientWebpack = Webpack(
        webpack(
          merge(
            commonConfig(),
            serverConfig({
              name,
              context: pwd,
              entry: server,
              outputDir: `${output}/server`,
            }),
          ),
        ),
      );
      clientWebpack.run((err, stats) => {
        if (err || stats.hasErrors()) {
          reject(err || stats.toJson().errors[0]);
        }
        resolve();
      });
    });
  } else {
    console.log('No server entrypoint set, skiping server build');
  }
  console.log(assets);
};
