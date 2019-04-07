const path = require('path')

const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')

module.exports = (env, argv) => ({
  mode: argv && argv.mode || 'development',
  devtool: (argv && argv.mode || 'development') === 'production' ? 'source-map' : 'eval',

  entry: './src/main.js',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },

  node: false,

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ],
        exclude: /\.module\.css$/
      },
      {
        test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
        loader: 'url-loader?limit=100000'
      }
    ]
  },

  resolve: {
    extensions: [
      '.js',
      '.vue',
      '.json'
    ],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': path.resolve(__dirname, 'src')
    }
  },

  plugins: [
    new CleanWebpackPlugin(['dist']),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public', 'index.html'),
      inject: true
    }),
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, 'public'),
      to: path.resolve(__dirname, 'dist'),
      toType: 'dir'
    }]),
    new SWPrecacheWebpackPlugin({
      cacheId: 'my-pwa-vue-app',
      filename: 'service-worker-cache.js',
      staticFileGlobs: ['dist/**/*.{js,css,png,txt,map,html}', '/'],
      minify: true,
      stripPrefix: 'dist/',
      dontCacheBustUrlsMatching: /\.\w{6}\./
    })
  ],

  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      maxSize: 0,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    },
    runtimeChunk: {
      name: entrypoint => `runtime~${entrypoint.name}`
    },
    mangleWasmImports: true,
    removeAvailableModules: true,
    removeEmptyChunks: true,
    mergeDuplicateChunks: true
  },

  devServer: {
      compress: true,
      host: 'localhost',
      //https: true,
      open: true,
      overlay: true,
      port: 8080,
      proxy: {
        // proxy all requests starting with /api to jsonplaceholder
        '/cuida24': 'http://localhost:8000/',
      }
      //proxy: {
        //'/cuida24*': {
          //// Forward frontend dev server request for /api to django dev server
          //target: 'http://localhost:8000/',
        //}
      //}
  }
});
