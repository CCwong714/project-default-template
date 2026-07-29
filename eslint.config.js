import js from '@eslint/js'
import vitest from '@vitest/eslint-plugin'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import importPlugin from 'eslint-plugin-import'
import jestDom from 'eslint-plugin-jest-dom'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import promisePlugin from 'eslint-plugin-promise'
import globals from 'globals'
import reactPlugin from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import sonarjs from 'eslint-plugin-sonarjs'
import testingLibrary from 'eslint-plugin-testing-library'
import tseslint from 'typescript-eslint'
import unusedImports from 'eslint-plugin-unused-imports'
import { defineConfig, globalIgnores } from 'eslint/config'

const restrictedRelativeImportsPattern = {
  group: ['./*', './**', '../*', '../**', '@/*', '@/**'],
  message:
    'Use imports rooted at src/... instead of relative paths or aliases.',
}

const createRestrictedImportsRule = (additionalPatterns = []) => [
  'error',
  {
    patterns: [restrictedRelativeImportsPattern, ...additionalPatterns],
  },
]

const codeQualityRules = {
  'array-callback-return': 'error',
  complexity: ['error', { max: 15, variant: 'modified' }],
  curly: ['error', 'all'],
  eqeqeq: ['error', 'always', { null: 'ignore' }],
  'max-depth': ['error', 4],
  'max-params': ['error', 4],
  'no-alert': 'error',
  'no-console': ['error', { allow: ['warn', 'error'] }],
  'no-eval': 'error',
  'no-implied-eval': 'error',
  'no-multi-assign': 'error',
  'no-nested-ternary': 'error',
  'no-new-func': 'error',
  'no-unneeded-ternary': 'error',
  'object-shorthand': 'error',
  'prefer-object-spread': 'error',
  radix: 'error',
  'sonarjs/cognitive-complexity': ['error', 15],
  'sonarjs/no-collapsible-if': 'error',
  'sonarjs/no-duplicated-branches': 'error',
  'sonarjs/no-identical-expressions': 'error',
  'sonarjs/no-identical-functions': 'error',
  'sonarjs/no-nested-template-literals': 'error',
}

const typeAwareRules = {
  ...codeQualityRules,
  '@typescript-eslint/await-thenable': 'error',
  '@typescript-eslint/consistent-type-imports': [
    'error',
    { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
  ],
  '@typescript-eslint/consistent-type-exports': 'error',
  '@typescript-eslint/no-confusing-void-expression': 'error',
  '@typescript-eslint/no-deprecated': 'warn',
  '@typescript-eslint/no-explicit-any': 'error',
  '@typescript-eslint/no-floating-promises': 'error',
  '@typescript-eslint/no-import-type-side-effects': 'error',
  '@typescript-eslint/no-misused-promises': [
    'error',
    { checksVoidReturn: { attributes: false } },
  ],
  '@typescript-eslint/no-restricted-types': [
    'error',
    {
      types: {
        unknown: {
          message:
            'Use a concrete domain type, generic constraint, or validated union instead.',
        },
      },
    },
  ],
  '@typescript-eslint/no-unnecessary-condition': 'warn',
  '@typescript-eslint/no-unnecessary-type-assertion': 'error',
  '@typescript-eslint/no-unnecessary-type-constraint': 'error',
  '@typescript-eslint/no-unsafe-argument': 'error',
  '@typescript-eslint/no-unsafe-assignment': 'error',
  '@typescript-eslint/no-unsafe-call': 'error',
  '@typescript-eslint/no-unsafe-member-access': 'error',
  '@typescript-eslint/no-unsafe-return': 'error',
  '@typescript-eslint/only-throw-error': 'error',
  '@typescript-eslint/prefer-nullish-coalescing': 'warn',
  '@typescript-eslint/prefer-optional-chain': 'warn',
  '@typescript-eslint/require-await': 'error',
  '@typescript-eslint/restrict-plus-operands': [
    'error',
    { allowNumberAndString: false },
  ],
  '@typescript-eslint/restrict-template-expressions': [
    'error',
    { allowNumber: true, allowBoolean: false, allowNullish: false },
  ],
  '@typescript-eslint/return-await': ['error', 'always'],
  '@typescript-eslint/switch-exhaustiveness-check': 'error',
  '@typescript-eslint/use-unknown-in-catch-callback-variable': 'off',
  'no-void': ['error', { allowAsStatement: true }],
  'promise/always-return': 'off',
  'promise/catch-or-return': 'error',
  'promise/no-nesting': 'warn',
  'promise/no-return-wrap': 'error',
}

export default defineConfig([
  globalIgnores([
    '.agents',
    '.next',
    'coverage',
    'dist',
    'node_modules',
    'output',
    '**/*.d.ts',
  ]),
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      importPlugin.flatConfigs.recommended,
      promisePlugin.configs['flat/recommended'],
      reactPlugin.configs.flat.recommended,
      reactPlugin.configs.flat['jsx-runtime'],
      jsxA11y.flatConfigs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: {
      'simple-import-sort': simpleImportSort,
      sonarjs,
      'unused-imports': unusedImports,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      ...typeAwareRules,
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'typeAlias',
          format: ['PascalCase'],
          custom: {
            regex: '^T[A-Z]',
            match: true,
          },
        },
      ],
      '@typescript-eslint/no-unused-vars': 'off',
      'import/no-default-export': 'off',
      'import/no-duplicates': 'error',
      'import/order': 'off',
      'import/no-unresolved': 'off',
      'no-restricted-imports': createRestrictedImportsRule(),
      'react/prop-types': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': 'error',
      'sort-imports': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_',
        },
      ],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['*.{ts,mts,cts}', 'scripts/**/*.{ts,mts,cts}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      importPlugin.flatConfigs.recommended,
      promisePlugin.configs['flat/recommended'],
    ],
    plugins: {
      'simple-import-sort': simpleImportSort,
      sonarjs,
      'unused-imports': unusedImports,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      ...typeAwareRules,
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'typeAlias',
          format: ['PascalCase'],
          custom: {
            regex: '^T[A-Z]',
            match: true,
          },
        },
      ],
      '@typescript-eslint/no-unused-vars': 'off',
      'import/no-default-export': 'off',
      'import/no-duplicates': 'error',
      'import/order': 'off',
      'import/no-unresolved': 'off',
      'no-restricted-imports': createRestrictedImportsRule(),
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': 'error',
      'sort-imports': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: ['src/**/*.{test,spec}.{ts,tsx}', 'src/**/__tests__/**/*.{ts,tsx}'],
    extends: [
      vitest.configs.recommended,
      testingLibrary.configs['flat/react'],
      jestDom.configs['flat/recommended'],
    ],
  },
  {
    files: ['src/features/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': createRestrictedImportsRule([
        {
          group: ['src/app', 'src/app/**'],
          message:
            'Feature modules must not depend on the app composition layer.',
        },
      ]),
    },
  },
  {
    files: ['src/shared/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': createRestrictedImportsRule([
        {
          group: ['src/app', 'src/app/**', 'src/features', 'src/features/**'],
          message: 'Shared modules must not depend on app or feature modules.',
        },
      ]),
    },
  },
  {
    files: ['eslint.config.js'],
    extends: [js.configs.recommended],
    plugins: {
      sonarjs,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
    },
    rules: {
      ...codeQualityRules,
      'import/no-default-export': 'off',
    },
  },
  eslintConfigPrettier,
])
