module.exports = {
    transformIgnorePatterns: [
      "/node_modules/(?!axios|reactstrap|bootstrap|react-hook-form)/",
    ],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    transform: {
        '^.+\\.jsx?$': 'babel-jest', // Transpile JavaScript files using Babel
    },
    extensionsToTreatAsEsm: '.jsx',
  };
  