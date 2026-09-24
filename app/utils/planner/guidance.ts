import { formatClockTime } from './timeZones'
import type { PlanDirection, PlanGuidance } from '~/types/travel'

export function createGuidance(options: {
  bedtime: string
  wakeTime: string
  direction: PlanDirection
  stage: 'preflight' | 'destination'
  usesCaffeine: boolean
  lightTimingUncertain: boolean
  explanation: string
}): PlanGuidance {
  const { bedtime, wakeTime, direction, stage, usesCaffeine, lightTimingUncertain, explanation } = options
  const movement = direction === 'eastward' ? 'earlier' : 'later'
  const sleep = stage === 'preflight' && (direction === 'eastward' || direction === 'westward')
    ? `Aim to sleep around ${bedtime} and wake around ${wakeTime}, shifting your usual schedule ${movement} gradually.`
    : `Aim for a sleep opportunity around ${bedtime}–${wakeTime} local time while protecting your usual sleep duration.`

  let light: string
  if (direction === 'minimal') {
    light = 'Spend time outdoors during local daytime and keep your usual sleep routine.'
  } else if (lightTimingUncertain) {
    light = 'Exact light timing is uncertain for this timezone change. Favor ordinary daytime outdoor light, dim light before sleep, and avoid using bright-light devices to force a shift.'
  } else if (stage === 'preflight') {
    light = direction === 'eastward'
      ? 'After waking, get ordinary outdoor light when practical; dim bright indoor light before your earlier bedtime.'
      : 'Keep ordinary evening light while shifting later; make your sleep environment dark at bedtime.'
  } else {
    light = 'Get outdoor light during destination daytime when practical and keep light low as you approach planned sleep. Exact biological timing cannot be measured from these inputs.'
  }

  const caffeine = usesCaffeine
    ? `If you choose caffeine, use it earlier in your waking period; avoid it from ${formatClockTime(bedtime, -480)} onward (8 hours before planned sleep).`
    : undefined

  return { sleep, wake: `Wake around ${wakeTime} local time.`, light, caffeine, explanation }
}
