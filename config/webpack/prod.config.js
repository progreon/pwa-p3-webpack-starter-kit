const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const common = require('./common.config.js');
const config = require('../app.config')(true);
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(common(config), {
  mode: 'production',
  devtool: 'source-map',
  devServer: {
    historyApiFallback: true,
    contentBase: './dist'
  },
  plugins: [
    new UglifyJSPlugin({
      cache: true,
      parallel: true,
      sourceMap: true // set to true if you want JS source maps
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new FaviconsWebpackPlugin({
      logo: path.resolve(__dirname, '../../src/polymer-logo.png'),
      prefix: 'icons-[hash]/',
      emitStats: true,
      statsFilename: 'iconstats-[hash].json',
      persistentCache: true,
      inject: true,
      title: config.app.name,
      icons: {
        android: true,
        appleIcon: true,
        appleStartup: true,
        coast: false,
        favicons: true,
        firefox: true,
        opengraph: false,
        twitter: false,
        yandex: false,
        windows: false
      }
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[chunkhash].css',
      chunkFilename: '[id].[chunkhash].css'
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'css-loader'
        ]
      }
    ]
  }
});