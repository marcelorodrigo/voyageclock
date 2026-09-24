import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import SiteHeader from '../../app/components/SiteHeader.vue'

describe('site header', () => {
  it('toggles the mobile navigation and exposes its expanded state', async () => {
    const component = await mountSuspended(SiteHeader)
    const menuButton = component.get('button[aria-controls="mobile-navigation"]')

    expect(menuButton.attributes('aria-expanded')).toBe('false')
    expect((component.get('#mobile-navigation').element as HTMLElement).style.display).toBe('none')

    await menuButton.trigger('click')

    expect(menuButton.attributes('aria-expanded')).toBe('true')
    expect((component.get('#mobile-navigation').element as HTMLElement).style.display).not.toBe('none')
  })

  it('closes the mobile navigation when a navigation link is activated', async () => {
    const component = await mountSuspended(SiteHeader)
    await component.get('button[aria-controls="mobile-navigation"]').trigger('click')

    await component.get('#mobile-navigation a[href$="/science"]').trigger('click')

    expect(component.get('button[aria-controls="mobile-navigation"]').attributes('aria-expanded')).toBe('false')
    expect((component.get('#mobile-navigation').element as HTMLElement).style.display).toBe('none')
  })

  it('closes the mobile navigation on Escape and restores focus to the menu button', async () => {
    const component = await mountSuspended(SiteHeader, { attachTo: document.body })
    const menuButton = component.get('button[aria-controls="mobile-navigation"]')
    await menuButton.trigger('click')
    const scienceLink = component.get('#mobile-navigation a[href$="/science"]')
    scienceLink.element.focus()

    expect(document.activeElement).toBe(scienceLink.element)

    await scienceLink.trigger('keydown', { key: 'Escape' })

    expect(menuButton.attributes('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(menuButton.element)
    component.unmount()
  })
})
