#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

const pkg = require(process.env.npm_package_json);

const pwd = path.dirname(process.env.npm_package_json);

const [, , cmd, ...params] = process.argv;

const configFile = ['.fractalrc.js', '.fractalrc.json']
  .map((file) => {
    return path.resolve(pwd, file);
  })
  .find((file) => {
    return fs.existsSync(file);
  });

let config;

if (fs.existsSync(configFile)) {
  config = require(configFile);
} else {
  config = pkg.fractal;
}

const getConfig = () => {
  if (!config?.entry?.client) {
    console.error(
      'No configuration found, check that you have either "fractal" field on your package.json, .fractalrc.json or .fractalrc.js configuration file with at least entry.client',
    );
    process.exit(1);
  }
  return {
    pwd,
    name: config.name || pkg.name,
    client: config.entry.client,
    server: config.entry.server && config.entry.server,
    output: config.output || './dist',
    shared: config.shared,
    webpack:
      config.webpack ||
      ((idem) => {
        return idem;
      }),
  };
};

const commands = {
  init: () => {
    require('./init')({ pwd });
  },
  build: () => {
    require('./build')(getConfig(), params);
  },
  watch: () => {
    require('./watch')(getConfig(), params);
  },
};

if (!commands[cmd]) {
  console.warn(`Invalid command "${cmd}", use build or watch`);

  process.exit(1);
}

commands[cmd](params);
