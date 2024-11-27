module.exports = {
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
}