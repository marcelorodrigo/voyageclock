import { computed, onMounted, ref } from 'vue'
import {
  dismissedLanguageSuggestionStorageKey,
  findSupportedLocale,
  getSavedLocaleRedirect,
  isSupportedLocale,
  preferredLocaleStorageKey,
  type SupportedLocale,
} from '~/utils/languagePreference'

export function useLanguagePreference() {
  const { locale, locales, defaultLocale } = useI18n()
  const switchLocalePath = useSwitchLocalePath()
  const suggestedLocale = ref<string>()
  const isReady = ref(false)
  const supportedLocales = computed<SupportedLocale[]>(() => locales.value.map((item) => {
    if (typeof item === 'string') return { code: item }

    return { code: item.code, language: item.language, name: item.name }
  }))
  const supportedLocaleCodes = computed(() => supportedLocales.value.map(item => item.code))
  const suggestedLocaleName = computed(() =>
    supportedLocales.value.find(item => item.code === suggestedLocale.value)?.name ?? suggestedLocale.value,
  )

  function readStorage(key: string): string | null {
    try {
      return window.localStorage.getItem(key)
    }
    catch {
      return null
    }
  }

  function writeStorage(key: string, value: string): void {
    try {
      window.localStorage.setItem(key, value)
    }
    catch {
      // Storage can be unavailable in privacy-restricted browser contexts.
    }
  }

  async function selectLocale(targetLocale: string): Promise<void> {
    if (!isSupportedLocale(targetLocale, supportedLocaleCodes.value)) return

    writeStorage(preferredLocaleStorageKey, targetLocale)
    suggestedLocale.value = undefined

    const targetPath = switchLocalePath(targetLocale)
    if (targetPath) await navigateTo(targetPath)
  }

  function dismissSuggestion(): void {
    writeStorage(dismissedLanguageSuggestionStorageKey, 'true')
    suggestedLocale.value = undefined
  }

  onMounted(async () => {
    const savedLocale = readStorage(preferredLocaleStorageKey)

    if (isSupportedLocale(savedLocale, supportedLocaleCodes.value)) {
      const localeToApply = getSavedLocaleRedirect(
        savedLocale,
        locale.value,
        window.location.pathname,
        supportedLocaleCodes.value,
        defaultLocale,
      )

      if (localeToApply) {
        const targetPath = switchLocalePath(localeToApply)
        if (targetPath) await navigateTo(targetPath)
      }

      isReady.value = true
      return
    }

    if (readStorage(dismissedLanguageSuggestionStorageKey) === 'true') {
      isReady.value = true
      return
    }

    const browserLanguages = navigator.languages.length ? navigator.languages : [navigator.language]
    const browserLocale = findSupportedLocale(browserLanguages, supportedLocales.value)

    if (browserLocale && browserLocale !== locale.value) suggestedLocale.value = browserLocale
    isReady.value = true
  })

  return {
    isReady,
    suggestedLocale,
    suggestedLocaleName,
    selectLocale,
    dismissSuggestion,
  }
}
