/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  rules: {
    "semi": 2,
    "vue/multi-word-component-names": "off",
    "vue/no-unused-vars": "error",
    "vue/no-console": [
      "warn",
      {
        allow: ["error", "warn"],
      },
    ],
  },
  parserOptions: {
    ecmaVersion: 'latest'
  }
};
