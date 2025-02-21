import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.browser, chrome: 'readonly' }, // Ensure `chrome` is treated as a global object
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/no-explicit-any': [
        'off', // You can change this to 'off' to disable the rule completely
        {
          fixToUnknown: false, // Don't automatically fix `any` to `unknown`
          ignoreRestArgs: true, // Allow `any` for rest arguments if needed
        },
      ],
      // You can further customize other rules here as needed
    },
  }
)
