const webpack = require('webpack');
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = (config) => ({
  entry: {
    // app
    app: './src/main.js',
    // polyfills
    ...config.app.transpile && { babel: 'babel-polyfill' }, // IE11
    'wc/webcomponents-loader': path.resolve(__dirname, '../../node_modules/@webcomponents/webcomponentsjs/webcomponents-loader'), // IE11, Edge, Firefox, Safari<11
    polyfills: './src/polyfills.js'
  },
  output: {
    filename: 'scripts/[name].[chunkhash].bundle.js',
    chunkFilename: 'scripts/components/[id].[chunkhash].js',
    path: path.resolve(__dirname, '../..', config.outputDir)
  },
  resolve: {
    alias: {
      App: path.resolve(__dirname, '../../src/app/'),
      Core: path.resolve(__dirname, '../../src/app/core/'),
      CoreActions: path.resolve(__dirname, '../../src/app/core/actions/'),
      CoreComponents: path.resolve(__dirname, '../../src/app/core/components/'),
      CoreReducers: path.resolve(__dirname, '../../src/app/core/reducers/'),
      SharedComponents: path.resolve(__dirname, '../../src/app/shared/components/'),
      Shared: path.resolve(__dirname, '../../src/app/shared')
    }
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      // cacheGroups: {
      //   vendor: {
      //     test: /[\\/]node_modules[\\/]/,
      //     name: 'vendors',
      //     chunks: 'all'
      //   }
      // },
      chunks: 'all'
    },
    minimizer: [
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins: [
    ...config.bundleAnalyzer.enabled ? [new BundleAnalyzerPlugin({
      analyzerHost: 'localhost',
      analyzerPort: config.bundleAnalyzer.port
    })] : [],
    // new webpack.HashedModuleIdsPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NamedChunksPlugin((chunk) => {
      if (chunk.name) {
        return chunk.name;
      } else {
        var a = [];
        chunk._modules.forEach(m => a.push(m.id.replace(/.*\/(.*?)\..*?$/, '$1')));
        // chunk._modules.forEach(m => a.push(path.relative(m.context, m.request)));
        return a.join("_");
      }
    }),
    { // TODO: name-all-modules-plugin?
      apply(compiler) {
        compiler.plugin("compilation", (compilation) => {
          compilation.plugin("before-module-ids", (modules) => {
            modules.forEach((module) => {
              if (module.id !== null) {
                return;
              }
              module.id = module.identifier();
            });
          });
        });
      }
    },
    new CleanWebpackPlugin([config.outputDir], { root: path.resolve(__dirname, '../../') }),
    // copy custom static assets
    new CopyWebpackPlugin([
      // Custom Elements ES5 adapter
      {
        from: path.resolve(__dirname, '../../node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js'),
        to: './scripts/wc',
        flatten: true,
      },
      // WebComponents Polyfills
      {
        from: path.resolve(__dirname, '../../node_modules/@webcomponents/webcomponentsjs/bundles/**/*'),
        to: './scripts/wc/bundles',
        flatten: true,
      },
    ]),
    new HtmlWebpackPlugin({
      config,
      inject: true,
      // template: `!!handlebars-loader!${path.resolve(__dirname, '../../src/index.hbs')}`,
      template: path.resolve(__dirname, '../../src/index.html'),
      cache: false,
      minify: {
        collapseWhitespace: true,
        preserveLineBreaks: true
      }
    }),
    new ManifestPlugin(),
    new WorkboxPlugin.GenerateSW({
      // these options encourage the ServiceWorkers to get in there fast
      // and not allow any straggling "old" SWs to hang around
      clientsClaim: true,
      skipWaiting: true,
      navigateFallback: '/index.html'
    })
  ],
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(csv|tsv)$/,
        use: [
          'csv-loader'
        ]
      },
      {
        test: /\.xml$/,
        use: [
          'xml-loader'
        ]
      }
    ]
  }
});
