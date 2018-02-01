const path = require('path')

module.exports = {
  context: __dirname,
  entry: path.resolve(__dirname, '../src/index.js'),
  target: 'node',
  output: {
    path: path.resolve(__dirname, '../lib'),
    filename: 'feed-to-json.js',
    publicPath: '/',
    library: 'feed-to-json',
    libraryTarget: 'umd',

  },
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        include: path.resolve(__dirname, '../src'),
        test: /\.js$/,
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  node: {
    fs: 'empty'
  }
}
