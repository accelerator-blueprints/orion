module.exports = {
  transform: {
    '^.+\\.jsx?$': '<rootDir>/jest-preprocess.js',
  },
  testPathIgnorePatterns: ['node_modules', '.cache'],
  transformIgnorePatterns: ['node_modules/(?!(gatsby)/)'],
  globals: {
    __PATH_PREFIX__: '',
  },
  testURL: 'http://localhost',
  setupFiles: ['<rootDir>/loadershim.js', '<rootDir>/src/setupTests.js'],
}
