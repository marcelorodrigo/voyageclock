import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'

export default defineConfig({
  test: {
    projects: [
      // Pure unit tests (Node env, no Nuxt runtime)
      {
        test: {
          name: 'unit',
          include: ['test/unit/**/*.{test,spec}.{ts,js}'],
          environment: 'node',
        },
      },
      // Nuxt runtime needed (e.g. component, composable, or integration tests)
      await defineVitestProject({
        test: {
          name: 'nuxt',
          include: ['test/nuxt/**/*.{test,spec}.{ts,js}'],
          environment: 'nuxt',
        },
      }),
    ],
  },
})
