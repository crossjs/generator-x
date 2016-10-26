'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

describe('generator-x:app', function () {
  before(function () {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts({
        name: 'name',
        description: 'description'
      })
      .toPromise();
  });

  it('creates files', function () {
    assert.file([
      'package.json'
    ]);
  });
});
