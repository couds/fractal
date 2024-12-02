const { merge } = require('webpack-merge');
const { webpack: webpackBuilder } = require('webpack');
const nodemon = require('nodemon');
const path = require('path');

const commonConfig = require('./webpack/webpack.common');
const serverConfig = require('./webpack/webpack.server');
const clientConfig = require('./webpack/webpack.client');

const start = ({ output, client, server, shared, pwd, name, webpack }, params) => {
  if (server) {
    const webpackServer = webpack(
      merge(
        commonConfig({ name }),
        serverConfig({
          name,
          context: pwd,
          entry: server,
          outputDir: `${output}/server`,
        }),
      ),
    );
    const compiler = webpackBuilder(webpackServer);
    let serverStarted = false;

    compiler.watch(
      {
        clean: true,
      },
      (err, stats) => {
        if (err || stats.hasErrors()) {
          const info = stats ? stats.toJson() : { errors: [err] };
          info.errors.forEach((error) => {
            console.error(error);
          });
        }

        if (serverStarted) {
          return;
        }

        serverStarted = true;

        nodemon({
          exec: `node ${path.resolve(pwd, output, 'server/main.js')}`,
          ext: 'js',
          watch: webpackServer.output.path,
        });

        nodemon
          .on('start', () => {
            console.log('App has started');
          })
          .on('quit', () => {
            console.log('App has quit');
            process.exit();
          })
          .on('restart', (res) => {
            console.log('App restarted', res);
          });
      },
    );
  }

  const webpackClientlient = webpack(
    merge(
      commonConfig({ name }),
      clientConfig({
        includeReact: params.every((x) => {
          return x.toLowerCase() !== '--frameworkless';
        }),
        context: pwd,
        entry: client,
        outputDir: `${output}/client`,
        shared,
        name,
      }),
    ),
  );
  const clientCompiler = webpackBuilder(webpackClientlient);

  clientCompiler.watch(
    {
      // Example
      aggregateTimeout: 300,
      poll: undefined,
    },
    (err) => {
      console.log('Watching client');
      if (err) {
        console.error(err);
      }
    },
  );
};

module.exports = start;
