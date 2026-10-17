import { describe, expect, it, vi } from 'vitest'
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { Temporal } from '@js-temporal/polyfill'
import App from '../../app/app.vue'
import TripPlannerForm from '../../app/components/TripPlannerForm.vue'
import PlanTimeline from '../../app/components/PlanTimeline.vue'
import HomePage from '../../app/pages/index.vue'
import PlanPage from '../../app/pages/plan/index.vue'
import PlanResultPage from '../../app/pages/plan/result.vue'
import SciencePage from '../../app/pages/science.vue'
import { usePlannerState } from '../../app/composables/usePlannerState'
import { generatePlan } from '../../app/utils/planner/generatePlan'
import type { TripInput } from '../../app/types/travel'

const { navigateToMock } = vi.hoisted(() => ({ navigateToMock: vi.fn() }))
mockNuxtImport('navigateTo', () => navigateToMock)

describe('planner form functional flow', () => {
  it('creates a trip plan and reports invalid trip input to travelers', async () => {
    const component = await mountSuspended(TripPlannerForm, {
      props: { now: '2027-06-01T12:00:00Z' },
    })

    await component.findAll('select')[0]!.setValue('UTC')
    await component.findAll('select')[1]!.setValue('UTC')
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

  it('shows a generic message when plan creation fails unexpectedly', async () => {
    const component = await mountSuspended(TripPlannerForm, {
      props: { now: 'not-an-instant' },
    })

    await component.get('form').trigger('submit')

    expect(component.get('[role="alert"]').text()).toBe('We could not create this plan. Check your trip details.')
  })

  it('offers IANA timezones beyond the initial popular destinations', async () => {
    const component = await mountSuspended(TripPlannerForm)

    expect(component.get('select').find('option[value="Africa/Abidjan"]').exists()).toBe(true)
  })

  it('lists timezones in alphabetical order', async () => {
    const component = await mountSuspended(TripPlannerForm)

    const options = component.get('select').findAll('option').map(option => option.element.value)

    expect(options).toEqual([...options].sort())
    expect(options[0]).toBe('Africa/Abidjan')
    expect(options).toContain('Europe/Amsterdam')
  })

  it('selects the detected timezone as origin even when it is missing from the IANA list', async () => {
    const supportedSpy = vi.spyOn(Intl, 'supportedValuesOf')
      .mockReturnValue(['Africa/Abidjan', 'Europe/London'])
    const resolvedSpy = vi.spyOn(Intl.DateTimeFormat.prototype, 'resolvedOptions')
      .mockReturnValue({ timeZone: 'Europe/Kyiv' } as unknown as Intl.ResolvedDateTimeFormatOptions)

    try {
      const component = await mountSuspended(TripPlannerForm)
      const originSelect = component.get('select')

      expect(originSelect.find('option[value="Europe/Kyiv"]').exists()).toBe(true)
      expect((originSelect.element as HTMLSelectElement).value).toBe('Europe/Kyiv')
    } finally {
      supportedSpy.mockRestore()
      resolvedSpy.mockRestore()
    }
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

  it('navigates to the separate result page after creating a plan', async () => {
    navigateToMock.mockClear()
    usePlannerState().value = undefined
    const component = await mountSuspended(PlanPage, { route: '/plan' })

    await component.get('form').trigger('submit')
    await flushPromises()

    expect(usePlannerState().value).toBeDefined()
    expect(navigateToMock).toHaveBeenCalledWith('/plan/result')
    expect(component.findComponent(PlanTimeline).exists()).toBe(false)
  })

  it('renders a generated plan on its own result page', async () => {
    const plan = generatePlan({
      originTimeZone: 'America/New_York',
      destinationTimeZone: 'Asia/Tokyo',
      departureLocal: '2027-06-10T09:00',
      arrivalLocal: '2027-06-11T22:00',
      usualBedtime: '23:00',
      usualWakeTime: '07:00',
      usesCaffeine: true,
    }, Temporal.Instant.from('2027-06-01T12:00Z'))
    usePlannerState().value = plan

    const component = await mountSuspended(PlanResultPage, { route: '/plan/result' })

    expect(component.text()).toContain('Your plan is ready.')
    expect(component.text()).toContain('Preparation day 1')
    expect(component.get('a[href="/plan"]').text()).toContain('Plan another trip')
  })

  it('renders the result page inside the app shell when the router reaches the result route', async () => {
    const plan = generatePlan({
      originTimeZone: 'America/New_York',
      destinationTimeZone: 'Asia/Tokyo',
      departureLocal: '2027-06-10T09:00',
      arrivalLocal: '2027-06-11T22:00',
      usualBedtime: '23:00',
      usualWakeTime: '07:00',
      usesCaffeine: true,
    }, Temporal.Instant.from('2027-06-01T12:00Z'))
    usePlannerState().value = plan

    const component = await mountSuspended(App, { route: '/plan/result' })
    await flushPromises()

    expect(component.findComponent(PlanTimeline).exists()).toBe(true)
    expect(component.findComponent(TripPlannerForm).exists()).toBe(false)
  })

  it('returns to the planner when the result route has no in-memory plan', async () => {
    navigateToMock.mockClear()
    usePlannerState().value = undefined
    const component = await mountSuspended(PlanResultPage, { route: '/plan/result' })

    await flushPromises()

    expect(navigateToMock).toHaveBeenCalledWith('/plan', { replace: true })
    expect(component.findComponent(PlanTimeline).exists()).toBe(false)
  })

  it('renders the planner page with the trip form and science context', async () => {
    const component = await mountSuspended(PlanPage)
    expect(component.text()).toContain('A few details about your trip')
    expect(component.find('form').exists()).toBe(true)
    expect(component.text()).toContain('Why light timing matters')
    expect(component.findComponent(PlanTimeline).exists()).toBe(false)
  })

  it('renders the science page with sources and limitations', async () => {
    const component = await mountSuspended(SciencePage)
    expect(component.text()).toContain('Light can shift your clock in either direction')
    expect(component.text()).toContain('What this plan can—and can’t—tell you')
    expect(component.findAll('a[target="_blank"]')).toHaveLength(4)
  })
})
