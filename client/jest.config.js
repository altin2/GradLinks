module.exports = {
  preset: "ts-jest",            // TypeScript support
  testEnvironment: "jsdom",     // simulates browser
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",   // mock CSS imports
    "\\.(png|jpg|jpeg|gif|svg)$": "<rootDir>/__mocks__/fileMock.js" // mock image imports
  },
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": "babel-jest"
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"], // RTL setup
};
