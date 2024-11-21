module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'standard',
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    /* 'no-console': 'warn', */
    'no-debugger': 'warn',
    indent: [
      'error',
      2
    ],
    'linebreak-style': ['error', process.platform === 'win32' ? 'windows' : 'unix'],
    'max-len': [
      'error', { code: 130 }
    ],
    'no-unused-vars': ['error', { vars: 'all', args: 'after-used', ignoreRestSiblings: false }],
    'no-multiple-empty-lines': ['error', { max: 1 }],
    quotes: [
      'error',
      'single'
    ],
    semi: [
      'error',
      'never'
    ],
    eqeqeq: ['error', 'always'],
    'comma-dangle': ['error', 'never']
  }
};