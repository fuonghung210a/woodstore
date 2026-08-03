module.exports = {
  root: true,
  ignorePatterns: ['**/dist/**', '**/.next/**', '**/node_modules/**', '**/*.config.js'],
  overrides: [
    {
      files: ['apps/product/**/*.ts', 'packages/database/**/*.ts'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      extends: ['eslint:recommended'],
      rules: {
        // The core rule does not understand TypeScript parameter properties.
        'no-unused-vars': 'off',
        // Type-only namespaces such as Express are resolved by TypeScript.
        'no-undef': 'off',
      },
      env: { node: true, jest: true },
    },
  ],
};
