export default defineI18nConfig(() => ({
  legacy: false,
  fallbackLocale: 'en',
  datetimeFormats: {
    en: { planDay: { weekday: 'long', month: 'short', day: 'numeric', timeZone: 'UTC' } },
    pt: { planDay: { weekday: 'long', month: 'short', day: 'numeric', timeZone: 'UTC' } },
    es: { planDay: { weekday: 'long', month: 'short', day: 'numeric', timeZone: 'UTC' } },
    fr: { planDay: { weekday: 'long', month: 'short', day: 'numeric', timeZone: 'UTC' } },
    nl: { planDay: { weekday: 'long', month: 'short', day: 'numeric', timeZone: 'UTC' } },
  },
}))
