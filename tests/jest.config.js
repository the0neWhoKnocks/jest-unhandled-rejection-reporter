const conf = {
  automock: false,
  globals: {
    window: true,
    DOMException: true,
  },
  reporters: [
    'default',
    '../reporter',
  ],
  roots: [
    'src',
  ],
  setupFilesAfterEnv: [
    './testSetupFile.js',
  ],
  testEnvironment: 'jsdom',
};

module.exports = conf;
