import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import App from '~/app.vue'

describe('Nuxt root app', () => {
  it('mounts the App root', async () => {
    const wrapper = await mountSuspended(App)
    expect(wrapper.html()).toContain('Voyage Clock')
  })
})
