module.exports = {
    transformIgnorePatterns: [
      "/node_modules/(?!(reactstrap)/)",
      "/node_modules/(?!(bootstrap)/)",
      "/node_modules/(?!(react-hook-form)/)",
      "/node_modules/(?!(axios)/)",
    ],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    transform: {
        '^.+\\.jsx?$': 'babel-jest', // Transpile JavaScript files using Babel
      },
  };
  