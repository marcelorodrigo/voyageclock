import { describe, expect, it } from 'vitest'
import { createGuidance } from '../../app/utils/planner/guidance'

describe('createGuidance', () => {
  const base = {
    bedtime: '22:30',
    wakeTime: '06:30',
    direction: 'eastward' as const,
    stage: 'preflight' as const,
    usesCaffeine: true,
    lightTimingUncertain: false,
    explanation: { key: 'guidance.tripDirectional' },
  }

  it('provides directional preparation guidance and caffeine cutoff', () => {
    const guidance = createGuidance(base)
    expect(guidance.sleep).toMatchObject({ key: 'guidance.sleepShift', params: { movement: { key: 'movements.earlier' } } })
    expect(guidance.light.key).toBe('guidance.lightPreflightEast')
    expect(guidance.caffeine).toMatchObject({ key: 'guidance.caffeine', params: { cutoff: '14:30' } })
    expect(guidance.explanation).toEqual({ key: 'guidance.tripDirectional' })
  })

  it('qualifies light guidance when biological timing is uncertain', () => {
    expect(createGuidance({ ...base, lightTimingUncertain: true }).light.key).toBe('guidance.lightUncertain')
  })

  it('does not show caffeine guidance to non-users', () => {
    expect(createGuidance({ ...base, usesCaffeine: false }).caffeine).toBeUndefined()
  })

  it('offers local daytime guidance for a minimal shift', () => {
    expect(createGuidance({ ...base, direction: 'minimal' }).light.key).toBe('guidance.lightMinimal')
  })
})
