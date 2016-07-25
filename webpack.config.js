const path = require('path');
// const webpack = require('webpack');

function defineApplication(appPath) {
  const sources = [];
  if (process.env.NODE_ENV !== 'production') {
    sources.push('webpack-dev-server/client?http://localhost:8080');
    sources.push('webpack/hot/dev-server');
  }
  sources.push('babel-polyfill');
  sources.push(appPath);

  return sources;
}

module.exports = {
  entry: {
    index: defineApplication('apps/index')
  },
  output: {
    publicPath: '/assets/js',
    path: path.join(__dirname, 'public/assets/js'),
    filename: '[name].js'
  },
  plugins: [],
  debug: true,
  devtool: 'inline-source-map',
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass']
      },
      {
        test: /\.jsx?$/,
        loaders: ['react-hot', 'babel'],
        include: path.resolve(__dirname, 'src')
      },
      {
        test: /\.html$/,
        loader: 'raw-loader'
      }
    ]
  },
  resolve: {
    root: [path.join(__dirname, 'src')],
    extensions: ['', '.js', '.jsx']
  }
};
