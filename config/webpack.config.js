const path = require('path')

const defaultConfig = {
  context: __dirname,
  entry: path.resolve(__dirname, '../src/index.js'),
  output: {},
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        include: path.resolve(__dirname, '../src'),
        exclude: /(node_modules)/,
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

const webConfig = Object.assign({}, defaultConfig, {
  target: 'web',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'feed-to-json-promise.web.js',
    publicPath: '/',
    library: 'feed-to-json-promise.web',
    libraryTarget: 'umd',
  }
})

const nodeConfig = Object.assign({}, defaultConfig, {
  target: 'node',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'feed-to-json-promise.node.js',
    publicPath: '/',
    library: 'feed-to-json-promise.node',
    libraryTarget: 'umd',
  }
})

module.exports = [webConfig, nodeConfig]
