import en from '../../i18n/locales/en.json'
import es from '../../i18n/locales/es.json'
import fr from '../../i18n/locales/fr.json'
import nl from '../../i18n/locales/nl.json'
import pt from '../../i18n/locales/pt.json'
import { describe, expect, it } from 'vitest'

function messageKeys(value: unknown, prefix = ''): string[] {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return [prefix]

  return Object.entries(value).flatMap(([key, nested]) =>
    messageKeys(nested, prefix ? `${prefix}.${key}` : key),
  )
}

describe('locale catalogs', () => {
  it('provide the same message keys for every supported locale', () => {
    const englishKeys = messageKeys(en).sort()

    for (const catalog of [pt, es, fr, nl]) {
      expect(messageKeys(catalog).sort()).toEqual(englishKeys)
    }
  })
})
