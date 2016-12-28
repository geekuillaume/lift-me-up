const webpack = require('webpack');

const webpackConfig = {
  entry: './scripts/index.js',
  output: {
    filename: 'bundle.js',
    path: './dist'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
    // inside your code for any environment checks; UglifyJS will automatically
    // drop any unreachable code.
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
    new webpack.optimize.DedupePlugin(),
  ],
  target: 'web', // Make web variables accessible to webpack, e.g. window
  devtool: 'source-map',
  watchOptions: {
    ignored: /node_modules/,
  }
}

if (process.env.NODE_ENV === 'production') {
  webpackConfig.devtool = null;
  webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false, // ...but do not show warnings in the console (there is a lot of them)
    },
  }))
}

module.exports = webpackConfig
