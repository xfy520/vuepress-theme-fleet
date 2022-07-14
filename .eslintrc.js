const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  root: true,
  extends: 'vuepress',
  overrides: [
    {
      files: ['*.ts', '*.vue'],
      extends: ['vuepress-typescript', 'plugin:prettier/recommended'],
      parserOptions: {
        project: ['tsconfig.json'],
      },
      rules: {
        'import/order': 'off',
        'vue/multi-word-component-names': 'off',
      },
    },
    {
      files: ['*.vue'],
      rules: {},
    },
  ],
});
