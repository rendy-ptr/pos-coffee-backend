import eslintPluginPrettier from 'eslint-plugin-prettier';
import pluginTs from '@typescript-eslint/eslint-plugin';
import parserTs from '@typescript-eslint/parser';

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  {
    ignores: ['node_modules', 'dist'],
  },
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: parserTs,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': pluginTs,
      prettier: eslintPluginPrettier,
    },
    rules: {
      ...pluginTs.configs.recommended.rules,
      'prettier/prettier': 'error',
    },
  },
];
