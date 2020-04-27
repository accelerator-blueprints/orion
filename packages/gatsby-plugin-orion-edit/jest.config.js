module.exports = {
  globalSetup: './global-setup.js',
  transform: {
    '^.+\\.jsx?$': '<rootDir>/jest-preprocess.js',
  },
  setupFilesAfterEnv: [`./setup-tests.js`],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/file-mock.js',
  },
}