const path = require('path')

module.exports = {
  context: __dirname,
  entry: path.resolve(__dirname, '../src/index.js'),
  target: 'web',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'eco-feed-to-json.js',
    publicPath: '/',
    library: 'eco-feed-to-json',
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
