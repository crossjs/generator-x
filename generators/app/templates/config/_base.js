import { resolve } from 'path'
import _debug from 'debug'

const debug = _debug('plato:config:base')

const config = {
  env: process.env.NODE_ENV || 'development',

  pkg: require('../package.json'),

  // theme name
  theme: 'default',

  // ----------------------------------
  // Project Structure
  // ----------------------------------
  path_base: resolve(__dirname, '../'),
  dir_src: 'src',
  dir_dist: 'dist',
  dir_test: 'test',

  // ----------------------------------
  // Server Configuration
  // ----------------------------------
  server_host: '0.0.0.0', // binds to all hosts
  server_port: process.env.PORT || 3000,

  // ----------------------------------
  // Compiler Configuration
  // ----------------------------------
  compiler_devtool: 'source-map',
  compiler_hash_type: 'hash',
  compiler_html_minify: false,
  compiler_public_path: '',
  compiler_vendor: [
    'vue',
    'vue-router',
    'vuex',
    'vuex-actions',
    'vuex-localstorage'
  ]
}

// ------------------------------------
// Environment
// ------------------------------------
config.globals = {
  __DEV__: config.env === 'development',
  __PROD__: config.env === 'production',
  __TEST__: config.env === 'test'
}

// ------------------------------------
// Validate Vendor Dependencies
// ------------------------------------
config.compiler_vendor = config.compiler_vendor
  .filter(dep => {
    if (config.pkg.dependencies.hasOwnProperty(dep)) {
      return true
    }

    debug(
      'Package "' + dep + '" was not found as an npm dependency in package.json; ' +
      'it won\'t be included in the webpack vendor bundle.\n' +
      'Consider removing it from compiler_vendor in "./config/_base.js"'
    )
  })

// ------------------------------------
// Utilities
// ------------------------------------
config.paths = (() => {
  const base = (...args) =>
    resolve.apply(resolve, [config.path_base, ...args])

  return {
    base,
    src: base.bind(null, config.dir_src),
    dist: base.bind(null, config.dir_dist),
    test: base.bind(null, config.dir_test)
  }
})()

export default config
