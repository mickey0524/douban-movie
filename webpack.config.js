var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var ROOT = path.resolve(__dirname);
var isProduction = process.env.NODE_ENV === 'production';

var entry = {
  home: `${ROOT}/client/pagelet/home/index.js`,
  detail: `${ROOT}/client/pagelet/detail/index.js`
};

var config = {
  entry,
  output: {
    path: path.resolve(__dirname, './app/static/'),
    filename: 'js/pages/[name].js'
  },
  resolve: {
    modules: [path.join(__dirname, "node_modules")]
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            // 通过 loader 参数激活 source maps
            {
              loader: 'css-loader',
              options: { sourceMap: true, importLoaders: 1 }
            },
            {
              loader: 'less-loader',
              options: { sourceMap: true }
            }
          ]
        })
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: 'css-loader'
        })
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['jsx-loader', 'babel-loader']
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      }
    ]
  },
  devtool: isProduction ? false : '#eval-source-map',
  plugins: [
    new ExtractTextPlugin({
      filename: "css/pages/[name].css",
      disable: false,
      allChunks: true
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      filename: 'js/pages/common.js'
    })
  ]
}

if (isProduction) {
  config.plugins = config.plugins.concat([
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]);
}

module.exports = config;