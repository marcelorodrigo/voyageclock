import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import App from '../../app/app.vue'
import LanguageSuggestion from '../../app/components/LanguageSuggestion.vue'
import LanguageSwitcher from '../../app/components/LanguageSwitcher.vue'
import {
  dismissedLanguageSuggestionStorageKey,
  preferredLocaleStorageKey,
} from '../../app/utils/languagePreference'

const { navigateToMock } = vi.hoisted(() => ({ navigateToMock: vi.fn() }))
mockNuxtImport('navigateTo', () => navigateToMock)

const LanguagePreferenceHarness = defineComponent({
  setup() {
    const {
      isReady,
      suggestedLocale,
      suggestedLocaleName,
      selectLocale,
      dismissSuggestion,
    } = useLanguagePreference()
    const { locale } = useI18n()

    return () => h('div', [
      h('output', { 'data-testid': 'is-ready' }, String(isReady.value)),
      h('output', { 'data-testid': 'suggested-locale' }, suggestedLocale.value ?? ''),
      h('output', { 'data-testid': 'suggested-locale-name' }, suggestedLocaleName.value ?? ''),
      h('button', { onClick: dismissSuggestion }, 'Dismiss'),
      h('button', { onClick: () => suggestedLocale.value && selectLocale(suggestedLocale.value) }, 'Accept'),
      h('button', { 'data-testid': 'select-unsupported', onClick: () => selectLocale('xx') }, 'Select unsupported'),
      h('button', { 'data-testid': 'switch-locale', onClick: () => { locale.value = 'pt' } }, 'Switch locale'),
    ])
  },
})

beforeEach(() => {
  localStorage.clear()
  navigateToMock.mockClear()
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

  it('exposes a ready state and a display name for the suggested language', async () => {
    const component = await mountSuspended(LanguagePreferenceHarness)

    expect(component.get('[data-testid="is-ready"]').text()).toBe('true')
    expect(component.get('[data-testid="suggested-locale"]').text()).toBe('es')
    expect(component.get('[data-testid="suggested-locale-name"]').text()).toBe('Español')
    component.unmount()
  })

  it('ignores unsupported locales and clears the suggestion when the locale changes', async () => {
    const component = await mountSuspended(LanguagePreferenceHarness)

    await component.get('[data-testid="select-unsupported"]').trigger('click')
    expect(localStorage.getItem(preferredLocaleStorageKey)).toBeNull()
    expect(component.get('[data-testid="suggested-locale"]').text()).toBe('es')

    await component.get('[data-testid="switch-locale"]').trigger('click')
    expect(component.get('[data-testid="suggested-locale"]').text()).toBe('')
    component.unmount()
  })

  it('applies a saved language preference and redirects to its localized path', async () => {
    localStorage.setItem(preferredLocaleStorageKey, 'es')

    const component = await mountSuspended(LanguagePreferenceHarness, { route: '/' })
    await flushPromises()

    expect(navigateToMock).toHaveBeenCalledWith('/es')
    expect(component.get('[data-testid="is-ready"]').text()).toBe('true')
    expect(component.get('[data-testid="suggested-locale"]').text()).toBe('')
    component.unmount()
  })

  it('keeps the saved language when the path is already localized', async () => {
    localStorage.setItem(preferredLocaleStorageKey, 'es')

    const component = await mountSuspended(LanguagePreferenceHarness, { route: '/es/science' })
    await flushPromises()

    expect(navigateToMock).not.toHaveBeenCalled()
    expect(component.get('[data-testid="is-ready"]').text()).toBe('true')
    expect(component.get('[data-testid="suggested-locale"]').text()).toBe('')
    component.unmount()
  })

  it('falls back to the suggestion flow when the saved language is unsupported', async () => {
    localStorage.setItem(preferredLocaleStorageKey, 'xx')

    const component = await mountSuspended(LanguagePreferenceHarness)
    await flushPromises()

    expect(component.get('[data-testid="is-ready"]').text()).toBe('true')
    expect(component.get('[data-testid="suggested-locale"]').text()).toBe('es')
    component.unmount()
  })

  it('suggests the browser language when navigator.languages is empty', async () => {
    Object.defineProperty(navigator, 'languages', { configurable: true, value: [] })

    const component = await mountSuspended(LanguagePreferenceHarness)

    expect(component.get('[data-testid="suggested-locale"]').text()).toBe('es')
    component.unmount()
  })

  it('treats unreadable storage as absent', async () => {
    const getItem = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage blocked')
    })

    const component = await mountSuspended(LanguagePreferenceHarness)

    expect(component.get('[data-testid="suggested-locale"]').text()).toBe('es')
    getItem.mockRestore()
    component.unmount()
  })

  it('renders the suggestion inside the app shell and applies an accepted choice', async () => {
    const component = await mountSuspended(App, { route: '/' })
    await flushPromises()

    const suggestion = component.findComponent(LanguageSuggestion)
    expect(suggestion.exists()).toBe(true)
    expect(suggestion.text()).toContain('Español')

    await suggestion.get('button').trigger('click')
    await flushPromises()

    expect(localStorage.getItem(preferredLocaleStorageKey)).toBe('es')
    component.unmount()
  })
})
