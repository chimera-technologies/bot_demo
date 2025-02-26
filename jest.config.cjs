module.exports = {

    testEnvironment: "jsdom",
 
     transform: {
 
       '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
 
     },
     transformIgnorePatterns: [
      '/node_modules/', // Prevent transformation of node_modules
    ],
    moduleNameMapper: {
      '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock CSS imports
    },
 
     setupFilesAfterEnv: ['@testing-library/jest-dom',"<rootDir>/jest.setup.cjs"],
 
   };