// 1. External imports
import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// 2. Internal imports

export default tseslint.config(
  {
    ignores: ['dist/**'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
);
