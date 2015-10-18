import path from 'path';
import webpack from 'webpack';
import HtmlWebPackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import autoprefixer from 'autoprefixer';
import { execSync } from 'child_process';
import dotenv from 'dotenv';

dotenv.load({ silent: true });

const IS_DEBUG = process.env.PLUFF_DEBUG === 'true';

console.log('Building for ' + (IS_DEBUG ? 'DEVELOPMENT' : 'production') + '!');

// Get the current git commit hash.
const commitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();

// Plugins that are used for all environments.
const plugins = [
  new webpack.ProvidePlugin({
    _: 'lodash',
  }),
  // Prevent including all locales of moment.
  new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]),
  // Main static file.
  new HtmlWebPackPlugin({
    inject: 'head',
    template: 'app/index.htm',
    // Relative to `output.publicPath`.
    filename: '../index.html',
    commitHash,
  }),
  new ExtractTextPlugin('[name]-[contenthash:7].css', {
    allChunks: true,
  }),
];

if (!IS_DEBUG) {
  plugins.push(new webpack.optimize.DedupePlugin());
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    // UglifyJs produces nonsense warnings by default.
    compress: { warnings: false },
    // Mangling fucks up Angular.
    mangle: false,
  }));
  plugins.push(new webpack.optimize.OccurenceOrderPlugin());
}

export default {
  context: __dirname,
  entry: {
    bundle: 'boot.js',
  },
  devtool: IS_DEBUG ? '#eval' : null,
  debug: IS_DEBUG,
  output: {
    filename: '[name]-[hash:7].js',
    chunkFilename: '[name]-[id]-[chunkhash:7].js',
    path: path.join(__dirname, 'dist/static'),
    publicPath: 'static/',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel',
      }, {
        // Nasty hack to work around a bug in html-webpack-plugin / extract-text-webpack-plugin,
        // where the output is wrong if you're using an inline loader.
        test: /\.htm$/,
        loader: 'underscore-template-loader',
        query: {
          // html attributes that should be parsed as module.
          attributes: ['img:src', 'link:href'],
        },
      }, {
        test: /\.html$/,
        loader: 'raw',
      }, {
        test: /\.scss$/,
        // First compile with Sass and then Postcss.
        loader: ExtractTextPlugin.extract(
            'css?sourceMap!' +
            'postcss!' +
            'sass?sourceMap&outputStyle=compressed',
            // Paths in CSS are relative to dist/static/ instead of dist/
            { publicPath: '' }
        ),
      }, {
        test: /\.json$/,
        loader: 'json',
      }, {
        // Extract all non-CSS and non-JS assets.
        test: /\.(gif|png|jpe?g|svg|ico|woff|ttf)$/i,
        loader: 'file',
        query: {
          name: '[name]-[hash:7].[ext]',
        },
      },
    ],
  },
  plugins,
  resolveLoader: {
    root: path.join(__dirname, 'node_modules'),
  },
  resolve: {
    root: path.join(__dirname, 'app'),
    extensions: ['', '.js'],
    alias: {
      'angular-translate-cookie': 'angular-translate/dist/angular-translate-storage-cookie/angular-translate-storage-cookie',
    },
  },
  postcss() {
    return [
      autoprefixer({ browsers: ['last 1 versions'] }),
    ];
  },
  devServer: {
    historyApiFallback: true,
  },
};
