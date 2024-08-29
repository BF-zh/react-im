import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,
  jsx: true,
  typescript: true,
  rules: {
    'no-console': 'off',
  },
}, {
  files: ['packages/server/**/*.{js,ts,jsx,tsx}'],
  rules: {
    'ts/consistent-type-imports': 'off',
  },
})
