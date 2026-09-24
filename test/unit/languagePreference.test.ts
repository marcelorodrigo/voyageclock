import { describe, expect, it } from 'vitest'
import {
  findSupportedLocale,
  getSavedLocaleRedirect,
  isSupportedLocale,
  isLocalePrefixedPath,
  type SupportedLocale,
} from '../../app/utils/languagePreference'

const locales: SupportedLocale[] = [
  { code: 'en', language: 'en' },
  { code: 'pt', language: 'pt-BR' },
  { code: 'es', language: 'es' },
  { code: 'fr', language: 'fr' },
  { code: 'nl', language: 'nl' },
]
const localeCodes = locales.map(locale => locale.code)

describe('language preference', () => {
  it('matches the first supported browser language, including regional variants', () => {
    expect(findSupportedLocale(['de-DE', 'es-MX', 'fr-FR'], locales)).toBe('es')
  })

  it('matches Brazilian Portuguese through its configured locale language', () => {
    expect(findSupportedLocale(['pt-BR', 'es'], locales)).toBe('pt')
  })

  it('does not suggest a language when no browser preference is supported', () => {
    expect(findSupportedLocale(['de-DE', 'ja-JP'], locales)).toBeUndefined()
  })

  it('recognizes only configured non-default prefixes as explicit locale paths', () => {
    expect(isLocalePrefixedPath('/pt/science', localeCodes, 'en')).toBe(true)
    expect(isLocalePrefixedPath('/science', localeCodes, 'en')).toBe(false)
    expect(isLocalePrefixedPath('/en/science', localeCodes, 'en')).toBe(false)
  })

  it('applies saved preferences on unprefixed paths only', () => {
    expect(getSavedLocaleRedirect('es', 'en', '/science', localeCodes, 'en')).toBe('es')
    expect(getSavedLocaleRedirect('es', 'en', '/', localeCodes, 'en')).toBe('es')
    expect(getSavedLocaleRedirect('es', 'pt', '/pt/science', localeCodes, 'en')).toBeUndefined()
  })

  it('ignores unsupported or already active saved locales', () => {
    expect(isSupportedLocale('xx', localeCodes)).toBe(false)
    expect(getSavedLocaleRedirect('xx', 'en', '/', localeCodes, 'en')).toBeUndefined()
    expect(getSavedLocaleRedirect('en', 'en', '/', localeCodes, 'en')).toBeUndefined()
  })
})
