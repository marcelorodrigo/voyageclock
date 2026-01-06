import { createConfigForNuxt } from '@nuxt/eslint-config'

export default createConfigForNuxt({
  features: {
    stylistic: true, // Enable ESLint Stylistic rules for formatting
  },
})
