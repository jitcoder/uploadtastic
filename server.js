const express = require('express');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config.js');

config.plugins.push(new webpack.HotModuleReplacementPlugin());
//config.plugins.push(new webpack.NoErrorsPlugin());

process.env.NODE_ENV = 'development';

new WebpackDevServer(webpack(config), {
  hot: true,
  stats: { colors: true },
  progress: true,
  contentBase: 'public/',
  historyApiFallback: true,
  proxy: {
    '/api*': 'http://localhost:3000'
  },
  publicPath: config.output.publicPath
}).listen(8080, '0.0.0.0', (e) => {
  if (e) {
    console.log(e);
  }

  console.log('[WebpackDevServer] Listening on 0.0.0.0:8080');
});


const app = express();

app.get('/api', (req, res) => {
  res.json({
    shouts: [
      'Hello World!',
      'This is React and Webpack...',
      'They make development fun',
      'Another shout'
    ]
  });
});

app.listen(3000, '0.0.0.0', (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('[Express] running on localhost:3000');
});
