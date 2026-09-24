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
    explanation: 'Move gradually.',
  }

  it('provides directional preparation guidance and caffeine cutoff', () => {
    const guidance = createGuidance(base)
    expect(guidance.sleep).toContain('earlier')
    expect(guidance.light).toContain('After waking')
    expect(guidance.caffeine).toContain('14:30')
    expect(guidance.explanation).toBe('Move gradually.')
  })

  it('qualifies light guidance when biological timing is uncertain', () => {
    expect(createGuidance({ ...base, lightTimingUncertain: true }).light).toContain('Exact light timing is uncertain')
  })

  it('does not show caffeine guidance to non-users', () => {
    expect(createGuidance({ ...base, usesCaffeine: false }).caffeine).toBeUndefined()
  })

  it('offers local daytime guidance for a minimal shift', () => {
    expect(createGuidance({ ...base, direction: 'minimal' }).light).toContain('local daytime')
  })
})
