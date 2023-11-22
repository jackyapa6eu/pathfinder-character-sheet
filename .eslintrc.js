module.exports = {
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: ['eslint-config-prettier'],
  plugins: ['eslint-plugin-prettier'],
  rules: {
    'prettier/prettier': 'error',
  },
};
