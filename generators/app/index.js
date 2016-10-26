'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.Base.extend({
  prompting: function () {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the flawless ' + chalk.red('generator-x') + ' generator!'
    ));

    var prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'Name',
        default: 'PLATO'
      },
      {
        type: 'input',
        name: 'version',
        message: 'Version',
        default: '0.0.0'
      },
      {
        type: 'input',
        name: 'description',
        message: 'Description',
        default: 'Awesome!'
      }
    ];

    return this.prompt(prompts).then(function (props) {
      this.props = props;
    }.bind(this));
  },

  writing: function () {
    this.bulkDirectory(
      'cli', 'cli'
    );
    this.bulkDirectory(
      'config', 'config'
    );
    this.bulkDirectory(
      'src', 'src'
    );
    this.bulkDirectory(
      'test', 'test'
    );
    this.bulkCopy(
      '_babelrc', '.babelrc'
    );
    this.bulkCopy(
      '_editorconfig', '.editorconfig'
    );
    this.bulkCopy(
      '_eslintignore', '.eslintignore'
    );
    this.bulkCopy(
      '_eslintrc', '.eslintrc'
    );
    this.bulkCopy(
      '_gitignore', '.gitignore'
    );
    this.bulkCopy(
      '_stylelintrc', '.stylelintrc'
    );
    this.bulkCopy(
      '_travis.yml', '.travis.yml'
    );
    this.bulkCopy(
      'webpack.config.babel.js', 'webpack.config.babel.js'
    );
    this.template(
      '*.@(json|md)', './',
      this.props
    );
  },

  install: function () {
    this.spawnCommand('npm', ['run', 'gfw']);
  }
});
