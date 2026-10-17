import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: './coverage',
    },
    projects: [
      {
        test: {
          name: 'unit',
          include: ['test/unit/*.{test,spec}.ts'],
          environment: 'node',
        },
      },
      await defineVitestProject({
        test: {
          name: 'nuxt',
          include: ['test/nuxt/*.{test,spec}.ts'],
          environment: 'nuxt',
          setupFiles: ['./test/nuxt/setup.ts'],
          environmentOptions: {
            nuxt: {
              // Point the Nuxt test environment at the project root explicitly
              // so it does not depend on the current working directory.
              rootDir: fileURLToPath(new URL('.', import.meta.url)),
              // jsdom is used instead of the default happy-dom because Nuxt 4.6's
              // router prefetch scheduler throws on happy-dom's window.location.
              domEnvironment: 'jsdom',
            },
          },
        },
      }),
    ],
  },
})
