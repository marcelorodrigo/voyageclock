import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { Temporal } from '@js-temporal/polyfill'
import TripPlannerForm from '../../app/components/TripPlannerForm.vue'
import PlanTimeline from '../../app/components/PlanTimeline.vue'
import HomePage from '../../app/pages/index.vue'
import PlanPage from '../../app/pages/plan.vue'
import SciencePage from '../../app/pages/science.vue'
import { generatePlan } from '../../app/utils/planner/generatePlan'
import type { TripInput } from '../../app/types/travel'

describe('planner form functional flow', () => {
  it('creates a trip plan and reports invalid trip input to travelers', async () => {
    const component = await mountSuspended(TripPlannerForm, {
      props: { now: '2027-06-01T12:00:00Z' },
    })

    await component.findAll('input[type="datetime-local"]')[0]!.setValue('2027-05-01T09:00')
    await component.findAll('input[type="datetime-local"]')[1]!.setValue('2027-05-01T10:00')
    await component.get('form').trigger('submit')
    expect(component.get('[role="alert"]').text()).toBe('Departure must be in the future.')

    await component.findAll('input[type="datetime-local"]')[0]!.setValue('2027-06-10T09:00')
    await component.findAll('input[type="datetime-local"]')[1]!.setValue('2027-06-10T22:00')
    await component.get('form').trigger('submit')
    expect(component.emitted('planned')).toHaveLength(1)
    expect(component.text()).not.toContain('Departure must be in the future.')
  })

  it('offers IANA timezones beyond the initial popular destinations', async () => {
    const component = await mountSuspended(TripPlannerForm)

    expect(component.get('select').find('option[value="Africa/Abidjan"]').exists()).toBe(true)
  })

  it('renders all requested day stages and plan cautions', async () => {
    const input: TripInput = {
      originTimeZone: 'America/New_York',
      destinationTimeZone: 'Asia/Tokyo',
      departureLocal: '2027-06-10T09:00',
      arrivalLocal: '2027-06-11T22:00',
      usualBedtime: '23:00',
      usualWakeTime: '07:00',
      usesCaffeine: true,
    }
    const plan = generatePlan(input, Temporal.Instant.from('2027-06-01T12:00Z'))
    const component = await mountSuspended(PlanTimeline, { props: { plan } })

    expect(component.text()).toContain('Preparation day 1')
    expect(component.text()).toContain('Arrival day')
    expect(component.text()).toContain('Day after arrival')
    expect(component.text()).toContain('Precise light seek/avoid times are not estimated')
    expect(component.text()).toContain('not medical advice')
  })

  it('keeps date labels aligned with local trip dates across the international date line', async () => {
    const input: TripInput = {
      originTimeZone: 'Pacific/Honolulu',
      destinationTimeZone: 'Pacific/Kiritimati',
      departureLocal: '2027-06-10T09:00',
      arrivalLocal: '2027-06-11T15:00',
      usualBedtime: '23:00',
      usualWakeTime: '07:00',
      usesCaffeine: false,
    }
    const plan = generatePlan(input, Temporal.Instant.from('2027-06-01T12:00Z'))
    const component = await mountSuspended(PlanTimeline, { props: { plan } })

    expect(component.text()).toContain('Friday, Jun 11')
  })

  it('renders the home page with a clear call to action', async () => {
    const component = await mountSuspended(HomePage)
    expect(component.text()).toContain('Arrive ready')
    expect(component.text()).toContain('Start planning')
  })

  it('renders the planner page with trip form and science context', async () => {
    const component = await mountSuspended(PlanPage)
    expect(component.text()).toContain('A few details about your trip')
    expect(component.find('form').exists()).toBe(true)
    expect(component.text()).toContain('Why light timing matters')
  })

  it('renders the science page with sources and limitations', async () => {
    const component = await mountSuspended(SciencePage)
    expect(component.text()).toContain('Light can shift your clock in either direction')
    expect(component.text()).toContain('What this plan can—and can’t—tell you')
    expect(component.findAll('a[target="_blank"]')).toHaveLength(4)
  })
})
