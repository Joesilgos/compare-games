import { Linter } from 'eslint';
import js from '@eslint/js';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';

const config = /** @type {Linter.FlatConfig[]} */ ([
  js.configs.recommended,
  {
    ignores: ['dist', 'node_modules', 'coverage'],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
      globals: {
        // Node.js globals
        process: true,
        Buffer: true,
        console: true,

        // Jest globals
        describe: true,
        it: true,
        jest: true,
        expect: true,
        beforeAll: true,
        beforeEach: true,
        afterAll: true,
        afterEach: true,
        test: true,

        // TypeScript specific
        __dirname: true,
        __filename: true,
        module: true,
        exports: true,
        require: true,
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
    },
    rules: {
      ...typescriptPlugin.configs.recommended.rules,
      ...prettier.rules,
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',  // Caso você queira permitir o uso de console.log sem alertas
    }
  },
]);

export default config;