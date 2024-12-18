module.exports = {
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest', // Usa Babel para transformar archivos JS/TS
    },
    transformIgnorePatterns: [
      '/node_modules/(?!(axios)/)', // Permite transformar módulos ESM como axios
    ],
  };
  