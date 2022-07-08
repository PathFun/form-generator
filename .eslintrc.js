module.exports = {
  env: {
    browser: true,
    node: true,
    commonjs: true,
    amd: true,
    es6: true
  },
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly',
    Promise: 'readonly',
    test: true,
    expect: true,
    describe: true,
    vi: true
  },
  extends: 'eslint:recommended',
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: '2020',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ['vue', 'prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        semi: true,
        singleQuote: true,
        printWidth: 120
      }
    ],
    'vue/multi-word-component-names': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 1 : 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 1 : 0,
    'no-unused-vars': 0,
    'linkbreak-style': ['off', 'windows']
  }
};
