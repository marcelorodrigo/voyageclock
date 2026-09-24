import { formatClockTime } from './timeZones'
import type { MessageDescriptor, PlanDirection, PlanGuidance } from '~/types/travel'

export function createGuidance(options: {
  bedtime: string
  wakeTime: string
  direction: PlanDirection
  stage: 'preflight' | 'destination'
  usesCaffeine: boolean
  lightTimingUncertain: boolean
  explanation: MessageDescriptor
}): PlanGuidance {
  const { bedtime, wakeTime, direction, stage, usesCaffeine, lightTimingUncertain, explanation } = options
  const movement = direction === 'eastward' ? 'earlier' : 'later'
  const sleep = stage === 'preflight' && (direction === 'eastward' || direction === 'westward')
    ? { key: 'guidance.sleepShift', params: { bedtime, wakeTime, movement: { key: `movements.${movement}` } } }
    : { key: 'guidance.sleepOpportunity', params: { bedtime, wakeTime } }

  let light: MessageDescriptor
  if (direction === 'minimal') {
    light = { key: 'guidance.lightMinimal' }
  } else if (lightTimingUncertain) {
    light = { key: 'guidance.lightUncertain' }
  } else if (stage === 'preflight') {
    light = direction === 'eastward'
      ? { key: 'guidance.lightPreflightEast' }
      : { key: 'guidance.lightPreflightWest' }
  } else {
    light = { key: 'guidance.lightDestination' }
  }

  const caffeine = usesCaffeine
    ? { key: 'guidance.caffeine', params: { cutoff: formatClockTime(bedtime, -480) } }
    : undefined

  return { sleep, wake: { key: 'guidance.wake', params: { wakeTime } }, light, caffeine, explanation }
}
