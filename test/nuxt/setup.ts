import { beforeAll } from 'vitest'

// jsdom does not implement `window.matchMedia`, which components rely on
// (e.g. SiteHeader's desktop breakpoint listener). happy-dom used to provide
// it; the nuxt project now runs under jsdom to keep Nuxt 4.6's router
// prefetch scheduler from throwing on an invalid `window.location`.
beforeAll(() => {
  if (typeof window === 'undefined' || typeof window.matchMedia === 'function') return

  window.matchMedia = (query: string): MediaQueryList => {
    const listeners = new Set<(event: MediaQueryListEvent) => void>()

    const mediaQueryList = {
      matches: false,
      media: query,
      onchange: null,
      addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
        listeners.add(listener)
      },
      removeEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
        listeners.delete(listener)
      },
      addListener: (listener: (event: MediaQueryListEvent) => void) => {
        listeners.add(listener)
      },
      removeListener: (listener: (event: MediaQueryListEvent) => void) => {
        listeners.delete(listener)
      },
      dispatchEvent: () => true,
    } as unknown as MediaQueryList

    return mediaQueryList
  }
})
