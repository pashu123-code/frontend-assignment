// So you need prepare follow files:
//   - frontend/index.js (@see react-indexjs.yasnippet)
//   - frontend/index.template.ejs (used by HtmlWebpackPlugin, @see html5-webpack.yasnippet)
//   - frontend/components/Sample/Sample.js
//   - frontend/components/Dashboard/Dashboard.js
//   - frontend/styles/ (storing global css files)
//   - package.json (@see package-reactjs.yasnippet)
//   - webpack.config.js
//   - .babelrc

if (!process.env.NODE_ENV) {
  // make webpack-dev-server happy to run the `webpack`
  process.env.NODE_ENV = 'development';
}

var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var webpack = require('webpack');
var path = require('path');

function getBundleJSFileName(prefix) {
  return (
    prefix + (process.env.NODE_ENV === 'production' ? '.[hash].js' : '.js')
  );
}

function getWebRootDir(child) {
  return process.env.NODE_ENV === 'development' ? child : '' + child;
}

function getDeploymentLocalDistDir() {
  return process.env.NODE_ENV === 'development'
    ? 'frontend-dist/js'
    : 'src/main/resources/static/js';
}

function getFilesToCopy() {
  var list = [
    { from: 'node_modules/bootstrap/dist/css/*', to: '../css/', flatten: true },
    {
      from: 'node_modules/bootstrap/dist/fonts/*',
      to: '../fonts/',
      flatten: true,
    },
    { from: 'node_modules/font-awesome/css/*', to: '../css/', flatten: true },
    {
      from: 'node_modules/font-awesome/fonts/*',
      to: '../fonts',
      flatten: true,
    },
  ];
  // if(process.env.NODE_ENV === 'development') {
  //   list.push({from:'src/main/resources/static/images/*', to: '../images', flatten:true});
  // }
  return list;
}

function getBundleJSFileName(prefix) {
  return (
    prefix + (process.env.NODE_ENV === 'production' ? '.[hash].js' : '.js')
  );
}

function getWebpackPlugins() {
  var arr = [
    new CopyWebpackPlugin(getFilesToCopy()),
    // full moment.js is too big. @see https://github.com/moment/moment/issues/2416
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV:
          process.env.NODE_ENV === 'production'
            ? '"production"'
            : '"development"',
      },
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin(
      'vendor',
      getBundleJSFileName('vendor')
    ),
    new HtmlWebpackPlugin({
      filename: '../index.html',
      template: path.resolve(__dirname, 'frontend/index.template.ejs'),
      inject: 'body',
      hash:
        process.env.NODE_ENV ===
        'production' /* web-dev-server does not cache js */,
      cssDir: getWebRootDir('/css'),
    }),
    // new webpack.optimize.DedupePlugin() // @see https://github.com/webpack/webpack/issues/1982
  ];

  // backend developers prefer debugging non-uglified js code during integration
  if (
    process.env.NODE_ENV === 'production' &&
    process.env.DEPLOYMENT !== 'staging'
  ) {
    arr.push(
      new webpack.optimize.UglifyJsPlugin({
        // Don't beautify output (enable for neater output)
        beautify: false,
        // Eliminate comments
        comments: false,
        screw_ie8: true,
        // Compression specific options
        compress: {
          warnings: false,
          // Drop console statements
          drop_console: true,
        },
        // Mangling specific options
        mangle: {
          // Don't mangle function names
          // keep_fnames: true // about 8% js file size increase
        },
      })
    );
  }
  arr.push(function() {
    this.plugin('done', function(stats) {
      require('fs').writeFileSync(
        path.join(__dirname, '..', 'stats.json'),
        JSON.stringify(stats.toJson())
      );
    });
  });
  return arr;
}

module.exports = {
  // we don't need source map in dev version because code is NOT uglified
  devtool:
    process.env.NODE_ENV === 'production' ? 'cheap-module-source-map' : null,
  entry: {
    app: './frontend/index.js',
    vendor: [
      'core-js',
      'react',
      'react-dom',
      'react-bootstrap',
      'redux',
      'react-redux',
    ],
  },
  output: {
    path: path.resolve(__dirname, getDeploymentLocalDistDir()),
    filename: getBundleJSFileName('bundle'),
    chunkFilename: getBundleJSFileName('[id].bundle'),
    publicPath: getWebRootDir('/js/'),
  },
  devServer: {
    historyApiFallback: true,
    compress: true, // less page loading time
  },
  plugins: getWebpackPlugins(),
  resolve: {
    extensions: ['', '.js', '.jsx'],
    modules: ['frontend', 'node_modules'],
    // root for es2015 import
    // @see http://moduscreate.com/es6-es2015-import-no-relative-path-webpack/
    root: [path.resolve('./frontend/components')],
  },

  module: {
    loaders: [
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&minetype=application/font-woff',
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
      },
      {
        test: /\.css$/,
        exclude: /node_modules|styles/,
        loader:
          'style-loader!css-loader?localIdentName=[name]__[local]__[hash:base64:5]&modules&importLoaders=1&sourceMap',
      },
      {
        test: /\.(s?css)$/,
        include: /styles/, // global css
        loader: 'css-loader|style-loader!css-loader',
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        loaders: ['style-loader', 'css-loader'],
      },
      {
        test: /\.jsx*$/,
        exclude: [/node_modules/, /.+\.config.js/],
        loader: 'babel',
      },
      {
        test: /\.(jpe?g|gif|png|svg)$/i,
        loader: 'url-loader?limit=10000',
      },
      {
        test: /\.font.(js|json)$/,
        loader: 'style!css!fontgen?embed&types=woff,eot,ttf',
      },
    ],
  },
};
// Local Variables:
// coding: utf-8
// tab-width: 2
// js-indent-level: 2
// js2-basic-offset: 2
// End:
// vim: set fs=javascript fenc=utf-8 et ts=2 sts=2 sw=2
