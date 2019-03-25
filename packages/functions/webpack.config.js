const fs = require('fs')

const srcDir = `${__dirname}/src`

const functionNames = fs
  .readdirSync(srcDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name)

const entries = functionNames.reduce(
  (acc, f) => ({ ...acc, [f]: `${srcDir}/${f}/index.js` }),
  {}
)

module.exports = {
  entry: entries,
  target: 'node',
  output: {
    path: `${__dirname}/build`,
    filename: '[name].bundle.js',
    libraryTarget: 'umd',
  },
  optimization: {
    minimize: false,
  },
}