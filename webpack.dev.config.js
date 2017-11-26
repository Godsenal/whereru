var webpack = require('webpack');

module.exports = {
  entry: [
    './src/index.js',
    'webpack-dev-server/client?http://0.0.0.0:3001',
    'webpack/hot/only-dev-server'
  ],
  output: {
    path: '/',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  devServer: {
    hot: true,
    filename: 'bundle.js',
    publicPath: '/',
    historyApiFallback: true,
    contentBase: './public',
    proxy: {
        "**": "http://localhost:3000"
    }
  },
  module: {
    loaders: [
      {
        test: /.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
            presets: ["react","env"],
            plugins: ["react-hot-loader/babel"]
        }
      },
      { 
        test: /\.jsx$/, 
        loader: 'babel-loader', 
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        include: [/node_modules/,/style\/quill/],
        loader: 'style-loader!css-loader'
        //loader: 'style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
      },
      {
        test: /\.css$/,
        exclude: [/node_modules/,/style\/quill/],
        loader: 'style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
      },
      {
        test: /\.scss$/,
        use:
        [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options:
            {
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options:
            {
              sourceMap: true
            }
          }]
      }
    ]
  }
}