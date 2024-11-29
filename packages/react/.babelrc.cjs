module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        bugfixes: true,
        modules: process.env.TARGET === 'esm' ? false : process.env.TARGET,
      },
    ],
    ['@babel/preset-react'],
  ],
  plugins: [
    [
      'transform-react-remove-prop-types',
      {
        mode: 'remove',
        removeImport: true,
      },
    ],
  ],
};
