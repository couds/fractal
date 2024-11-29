const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');

module.exports = ({ pwd }) => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'clientEntry',
        message: 'Where is your client entry point script (relative to your package.json)',
        default() {
          return './src/index.js';
        },
        validate(value) {
          const file = path.resolve(pwd, value);
          return fs.existsSync(file) || `${file} not found`;
        },
      },
      {
        type: 'confirm',
        name: 'hasServer',
        message: 'Your Microfrontend will support SSR?',
      },
      {
        type: 'input',
        name: 'serverEntry',
        message: 'Where is your client entry point script (relative to your package.json)',
        when(answers) {
          return answers.hasServer;
        },
        default() {
          return './src/server.js';
        },
        validate(value) {
          const file = path.resolve(pwd, value);
          return fs.existsSync(file) || `${file} not found`;
        },
      },
      {
        type: 'input',
        name: 'output',
        message: 'Output directory (relative to your package.json)',
        default() {
          return './dist';
        },
      },
    ])

    .then((answers) => {
      const setup = {
        entry: {
          client: answers.clientEntry,
          ...(answers.hasServer && { server: answers.serverEntry }),
        },
        output: answers.output,
      };
      fs.writeFileSync(path.resolve(pwd, '.fractalrc.json'), JSON.stringify(setup, null, 2));
    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        // Something else went wrong
      }
    });
};
