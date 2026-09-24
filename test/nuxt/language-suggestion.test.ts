import { beforeEach, describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h } from 'vue'
import LanguageSuggestion from '../../app/components/LanguageSuggestion.vue'
import LanguageSwitcher from '../../app/components/LanguageSwitcher.vue'
import {
  dismissedLanguageSuggestionStorageKey,
  preferredLocaleStorageKey,
} from '../../app/utils/languagePreference'

const LanguagePreferenceHarness = defineComponent({
  setup() {
    const { suggestedLocale, dismissSuggestion, selectLocale } = useLanguagePreference()

    return () => h('div', [
      h('output', { 'data-testid': 'suggested-locale' }, suggestedLocale.value ?? ''),
      h('button', { onClick: dismissSuggestion }, 'Dismiss'),
      h('button', { onClick: () => suggestedLocale.value && selectLocale(suggestedLocale.value) }, 'Accept'),
    ])
  },
})

beforeEach(() => {
  localStorage.clear()
  Object.defineProperty(navigator, 'languages', { configurable: true, value: ['es-ES'] })
  Object.defineProperty(navigator, 'language', { configurable: true, value: 'es-ES' })
})

describe('language suggestion', () => {
  it('shows translated suggestion text and emits accept or dismiss actions', async () => {
    const component = await mountSuspended(LanguageSuggestion, {
      props: { language: 'Español' },
    })

    expect(component.get('aside').text()).toContain('Español')
    expect(component.get('button').text()).toBe('Switch to Español')

    await component.get('button').trigger('click')
    await component.findAll('button')[1].trigger('click')

    expect(component.emitted('accept')).toHaveLength(1)
    expect(component.emitted('dismiss')).toHaveLength(1)
  })

  it('suggests the first supported browser language and remembers a dismissal', async () => {
    const component = await mountSuspended(LanguagePreferenceHarness)

    expect(component.get('[data-testid="suggested-locale"]').text()).toBe('es')
    await component.get('button').trigger('click')

    expect(localStorage.getItem(dismissedLanguageSuggestionStorageKey)).toBe('true')
    expect(component.get('[data-testid="suggested-locale"]').text()).toBe('')

    component.unmount()
    const nextVisit = await mountSuspended(LanguagePreferenceHarness)
    expect(nextVisit.get('[data-testid="suggested-locale"]').text()).toBe('')
    nextVisit.unmount()
  })

  it('remembers an accepted language choice', async () => {
    const component = await mountSuspended(LanguagePreferenceHarness)

    expect(component.get('[data-testid="suggested-locale"]').text()).toBe('es')
    await component.findAll('button')[1].trigger('click')

    expect(localStorage.getItem(preferredLocaleStorageKey)).toBe('es')
    component.unmount()
  })

  it('remembers a language selected manually', async () => {
    const component = await mountSuspended(LanguageSwitcher)

    await component.get('select').setValue('fr')

    expect(localStorage.getItem(preferredLocaleStorageKey)).toBe('fr')
    component.unmount()
  })
})
