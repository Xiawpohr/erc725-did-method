const path = require('path')

const libraryName = 'erc725did'
let outputFile = 'erc725did'
let mode, devtool

const config = (env) => {
  if (env === 'build') {
    mode = 'production'
    devtool = 'source-map'
    outputFile += '.min.js'
  } else {
    mode = 'development'
    devtool = 'inline-source-map'
    outputFile += '.js'
  }
  
  return {
    mode,
    entry: path.resolve(__dirname + '/src/index.js'),
    output: {
      path: path.resolve(__dirname, 'build/lib'),
      filename: outputFile,
      library: libraryName,
      libraryTarget: 'umd',
      globalObject: `(typeof self !== 'undefined' ? self : this)`
    }
  }
}

module.exports = config
