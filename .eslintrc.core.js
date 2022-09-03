// basic eslint settings to use via CLI

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'airbnb',
    'plugin:@typescript-eslint/recommended',
    'airbnb-typescript', // must be below `@typescript-eslint/recommended`
    'plugin:prettier/recommended',
  ],
  rules: {
    'import/prefer-default-export': 'off',
    'import/no-default-export': 'error',
    'import/no-cycle': [
      'error',
      {
        maxDepth: 2,
      },
    ],
    'import/no-dynamic-require': 'off',
    'import/order': [
      'error',
      {
        groups: [['builtin', 'external'], 'internal', ['parent', 'sibling'], 'index'],
        'newlines-between': 'always',
      },
    ],
    'import/no-extraneous-dependencies': 'error',
    'global-require': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
    '@typescript-eslint/member-ordering': [
      'error',
      { default: ['constructor', 'field', 'method', 'signature'] },
    ],
    '@typescript-eslint/type-annotation-spacing': [
      'error',
      {
        before: false,
        after: true,
        overrides: {
          arrow: {
            before: true,
            after: true,
          },
        },
      },
    ],
    'class-methods-use-this': 'off',
    'no-unused-expressions': 'off',
    'no-console': [
      'error',
      {
        allow: ['info', 'warn', 'error'],
      },
    ],
    '@typescript-eslint/lines-between-class-members': [
      'error',
      'always',
      {
        exceptAfterSingleLine: true,
      },
    ],
    'no-undef': 'off',
    'func-names': [
      'error',
      'as-needed',
      {
        generators: 'never',
      },
    ],
    'consistent-return': 'off',
    'no-underscore-dangle': [2, { allowAfterThis: true }],
    '@typescript-eslint/no-use-before-define': [
      'error',
      { functions: false, classes: true, variables: true },
    ],
    '@typescript-eslint/ban-ts-comment': [
      'error',
      {
        'ts-ignore': 'allow-with-description',
      },
    ],
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/no-for-in-array': 'error',
    '@typescript-eslint/restrict-template-expressions': 'error',
  },
  overrides: [
    {
      files: ['**/*.test.ts'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
  env: {
    browser: true,
    node: true,
  },
  globals: {
    window: 'readonly',
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
      },
    },
  },
};
