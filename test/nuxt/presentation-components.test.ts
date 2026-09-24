import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import HomeFeatureItem from '../../app/components/HomeFeatureItem.vue'
import HomeHeroIllustration from '../../app/components/HomeHeroIllustration.vue'
import PlanDayCard from '../../app/components/PlanDayCard.vue'
import ScienceSection from '../../app/components/ScienceSection.vue'
import type { PlanDay } from '../../app/types/travel'

describe('presentation components', () => {
  it('renders science section content with its selected tone', async () => {
    const component = await mountSuspended(ScienceSection, {
      props: { icon: '☾', title: 'Protect sleep', tone: 'blue' },
      slots: { default: '<p>Keep a steady sleep schedule.</p>' },
    })

    expect(component.get('section h2').text()).toBe('Protect sleep')
    expect(component.get('section > span').classes()).toContain('text-[#5a72a8]')
    expect(component.get('section p').text()).toBe('Keep a steady sleep schedule.')
  })

  it('renders a timeline day with local date, timezone, and optional caffeine guidance', async () => {
    const day: PlanDay = {
      date: '2027-06-11',
      timeZone: 'America/New_York',
      stage: 'arrival',
      label: 'Arrival day',
      guidance: {
        sleep: 'Aim to sleep around 23:00.',
        wake: 'Wake around 07:00 local time.',
        light: 'Get outdoor light during destination daytime.',
        caffeine: 'Avoid caffeine after 15:00.',
        explanation: 'Follow destination-local time.',
      },
    }
    const component = await mountSuspended(PlanDayCard, { props: { day } })

    expect(component.get('li time').text()).toBe('Friday, Jun 11')
    expect(component.text()).toContain('America/New York local time')
    expect(component.text()).toContain('Avoid caffeine after 15:00.')
  })

  it('omits caffeine guidance when the day has no caffeine recommendation', async () => {
    const day: PlanDay = {
      date: '2027-06-11',
      timeZone: 'UTC',
      stage: 'arrival',
      label: 'Arrival day',
      guidance: {
        sleep: 'Aim to sleep around 23:00.',
        wake: 'Wake around 07:00 local time.',
        light: 'Get outdoor light during destination daytime.',
        explanation: 'Follow destination-local time.',
      },
    }
    const component = await mountSuspended(PlanDayCard, { props: { day } })

    expect(component.text()).not.toContain('☕')
  })

  it('renders a home feature with its selected tone', async () => {
    const component = await mountSuspended(HomeFeatureItem, {
      props: {
        icon: '☀',
        title: 'Light, well-timed',
        description: 'Understand when everyday light may help.',
        tone: 'gold',
      },
    })

    expect(component.get('article h2').text()).toBe('Light, well-timed')
    expect(component.get('article p').text()).toBe('Understand when everyday light may help.')
    expect(component.get('article > span').classes()).toContain('text-[#bd8d2b]')
  })

  it('renders the accessible home hero illustration', async () => {
    const component = await mountSuspended(HomeHeroIllustration)

    expect(component.get('[aria-label="Illustration of a clock over a horizon"]').exists()).toBe(true)
    expect(component.text()).toContain('HOME TIME')
    expect(component.text()).toContain('YOUR NEXT CHAPTER')
  })
})
