import webpack from 'webpack'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import FaviconsWebpackPlugin from 'favicons-webpack-plugin'
import _debug from 'debug'
import config, { paths } from './config'

const { __DEV__, __PROD__, __TEST__ } = config.globals
const debug = _debug('plato:webpack')

debug('Create configuration.')

// https://webpack.js.org/how-to/upgrade-from-webpack-1/

const webpackConfig = {
  target: 'web',
  resolve: {
    modules: [paths.src(), 'node_modules'],
    descriptionFiles: ['package.json'],
    mainFields: ['main', 'browser'],
    mainFiles: ['index'],
    extensions: ['.css', '.js', '.json', '.vue'],
    enforceExtension: false,
    enforceModuleExtension: false,
    alias: {
      styles: paths.src(`themes/${config.theme}`)
    }
  },
  resolveLoader: {
    modules: ['node_modules'],
    descriptionFiles: ['package.json'],
    mainFields: ['main'],
    mainFiles: ['index'],
    extensions: ['.js'],
    enforceExtension: false,
    enforceModuleExtension: false,
    moduleExtensions: ['-loader']
  },
  node: {
    fs: 'empty',
    net: 'empty'
  },
  devtool: config.compiler_devtool,
  devServer: {
    host: config.server_host,
    port: config.server_port,
    // proxy is useful for debugging
    // proxy: {
    //   '/api': 'http://127.0.0.1:4040'
    // },
    compress: true,
    hot: true,
    noInfo: true
  },
  entry: {
    app: [
      // override native Promise
      'nuo',
      // to reduce built file size,
      // we load the specific polyfills with core-js
      // instead of the all-in-one babel-polyfill.
      'core-js/fn/array/find',
      'core-js/fn/array/find-index',
      'core-js/fn/object/assign',
      paths.src('index.js')],
    vendor: config.compiler_vendor
  },
  output: {
    path: paths.dist(),
    publicPath: config.compiler_public_path,
    filename: `[name].[${config.compiler_hash_type}].js`,
    chunkFilename: `[id].[${config.compiler_hash_type}].js`
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        exclude: /node_modules/,
        loader: 'eslint',
        options: {
          emitWarning: __DEV__,
          formatter: require('eslint-friendly-formatter')
        },
        enforce: 'pre'
      },
      {
        test: /\.vue$/,
        loader: 'vue',
        options: {
          loaders: {
            css: __PROD__ ? ExtractTextPlugin.extract({
              loader: 'css?sourceMap',
              fallbackLoader: 'vue-style'
            }) : 'vue-style!css?sourceMap',
            js: 'babel'
          }
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.html$/,
        loader: 'vue-html'
      },
      {
        test: /@[1-3]x\S*\.(png|jpg|gif)(\?.*)?$/,
        loader: 'file',
        options: {
          name: '[name].[ext]?[hash:7]'
        }
      },
      {
        test: /\.(png|jpg|gif|svg|woff2?|eot|ttf)(\?.*)?$/,
        // do NOT base64encode @1x/@2x/@3x images
        exclude: /@[1-3]x/,
        loader: 'url',
        options: {
          limit: 10000,
          name: '[name].[ext]?[hash:7]'
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin(config.globals),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: paths.src('index.ejs'),
      title: `${config.pkg.name} - ${config.pkg.description}`,
      hash: false,
      inject: true,
      minify: {
        collapseWhitespace: config.compiler_html_minify,
        minifyJS: config.compiler_html_minify
      }
    }),
    new CopyWebpackPlugin([{
      from: paths.src('static')
    }], {
      // ignore: ['*.ico', '*.md']
    })
  ]
}

// ------------------------------------
// Plugins
// ------------------------------------

const vueLoaderOptions = {
  postcss: pack => {
    return [
      require('postcss-import')({
        path: paths.src(`themes/${config.theme}`),
        // use webpack context
        addDependencyTo: pack
      }),
      require('postcss-url')({
        basePath: paths.src('static')
      }),
      require('postcss-cssnext')({
        // see: https://github.com/ai/browserslist#queries
        browsers: 'Android >= 4, iOS >= 7',
        features: {
          customProperties: {
            variables: require(paths.src(`themes/${config.theme}/variables`))
          }
        }
      }),
      require('postcss-flexible')({
        remUnit: 75
      }),
      require('postcss-browser-reporter')(),
      require('postcss-reporter')()
    ]
  },
  autoprefixer: false
}

if (__PROD__) {
  debug('Enable plugins for production (Dedupe & UglifyJS).')
  webpackConfig.plugins.push(
    new webpack.optimize.DedupePlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      options: {
        context: __dirname
      },
      vue: vueLoaderOptions
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        unused: true,
        dead_code: true,
        warnings: false
      },
      sourceMap: true
    }),
    // extract css into its own file
    new ExtractTextPlugin('[name].[contenthash].css')
  )
} else {
  debug('Enable plugins for live development (HMR, NoErrors).')
  webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.LoaderOptionsPlugin({
      debug: true,
      options: {
        context: __dirname
      },
      vue: vueLoaderOptions
    })
  )
}

// Don't split bundles during testing, since we only want import one bundle
if (!__TEST__) {
  webpackConfig.plugins.push(
    new FaviconsWebpackPlugin({
      logo: paths.src('assets/logo.svg'),
      prefix: 'icons-[hash:7]/',
      icons: {
        android: true,
        appleIcon: true,
        appleStartup: true,
        coast: false,
        favicons: true,
        firefox: false,
        opengraph: false,
        twitter: false,
        yandex: false,
        windows: false
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor']
    })
  )
}

export default webpackConfig
