var webpack = require('webpack');
var CompressionPlugin = require('compression-webpack-plugin');
module.exports = {
  entry: "./src/index.js",
  output: {
    path: __dirname + "/public",
    filename: "bundle.js"
  },
  devServer: {
    contentBase: __dirname + "/public",
    port: 8080
  },
  module: {
    loaders: [
      {
        test: /.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
            presets: ["react","env","stage-2"],
            plugins: ["react-hot-loader/babel",]
        }
      },
      { 
        test: /\.jsx$/, 
        loader: 'babel-loader', 
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: true,
              localIdentName: '[path][name]__[local]--[hash:base64:5]'
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: true,
              localIdentName: '[path][name]__[local]--[hash:base64:5]'
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
              modules: true,
              localIdentName: '[path][name]__[local]--[hash:base64:5]'
            },
          }]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({ //<--key to reduce React's size
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ],
};