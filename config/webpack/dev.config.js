const merge = require('webpack-merge');
const common = require('./common.config.js');
const config = require('../app.config')(false);
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = merge(common(config), {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    historyApiFallback: true,
    contentBase: './dist'
  },
  plugins: [
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
