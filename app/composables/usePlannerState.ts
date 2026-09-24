import type { AdaptationPlan } from '~/types/travel'

export function usePlannerState() {
  return useState<AdaptationPlan | undefined>('voyageclock-plan', () => undefined)
}
