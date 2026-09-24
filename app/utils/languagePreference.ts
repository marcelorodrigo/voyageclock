export interface SupportedLocale {
  code: string
  language?: string
  name?: string
}

export const preferredLocaleStorageKey = 'voyageclock-preferred-locale'
export const dismissedLanguageSuggestionStorageKey = 'voyageclock-language-suggestion-dismissed'

export function findSupportedLocale(
  browserLanguages: readonly string[],
  supportedLocales: readonly SupportedLocale[],
): string | undefined {
  for (const browserLanguage of browserLanguages) {
    const normalizedLanguage = browserLanguage.toLowerCase()
    const exactMatch = supportedLocales.find(locale =>
      [locale.code, locale.language].some(language => language?.toLowerCase() === normalizedLanguage),
    )

    if (exactMatch) return exactMatch.code

    const baseLanguage = normalizedLanguage.split('-')[0]
    const baseMatch = supportedLocales.find(locale =>
      [locale.code, locale.language].some(language => language?.toLowerCase().split('-')[0] === baseLanguage),
    )

    if (baseMatch) return baseMatch.code
  }

  return undefined
}

export function isLocalePrefixedPath(pathname: string, localeCodes: readonly string[], defaultLocale: string): boolean {
  const firstSegment = pathname.split('/').filter(Boolean)[0]

  return Boolean(firstSegment && firstSegment !== defaultLocale && localeCodes.includes(firstSegment))
}

export function isSupportedLocale(value: string | null, supportedLocaleCodes: readonly string[]): value is string {
  return Boolean(value && supportedLocaleCodes.includes(value))
}

export function getSavedLocaleRedirect(
  savedLocale: string | null,
  currentLocale: string,
  pathname: string,
  supportedLocaleCodes: readonly string[],
  defaultLocale: string,
): string | undefined {
  if (!isSupportedLocale(savedLocale, supportedLocaleCodes) || savedLocale === currentLocale) return undefined
  if (isLocalePrefixedPath(pathname, supportedLocaleCodes, defaultLocale)) return undefined

  return savedLocale
}
