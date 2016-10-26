// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  'default e2e tests' (browser) {
    browser
    .url('http://localhost:3000')
      .waitForElementVisible('#container', 5000)
      .assert.containsText('#container', 'Hello Plato!')
      // there is no router-view tag in vue 2
      .assert.elementCount('.router-view', 0)
      .end()
  }
}
