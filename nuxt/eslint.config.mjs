// 1. External imports
import withNuxt from './.nuxt/eslint.config.mjs'

// 2. Internal imports

export default withNuxt({
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'vue/html-self-closing': [
      'error',
      {
        html: {
          component: 'always',
          normal: 'always',
          void: 'always',
        },
        math: 'always',
        svg: 'always',
      },
    ],
  },
})
