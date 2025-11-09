import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import PlanInputView from '@/views/PlanInputView.vue'
import PlanResultsView from '@/views/PlanResultsView.vue'
import EducationView from '@/views/EducationView.vue'
import CircadianRhythmsView from '@/views/learn/CircadianRhythmsView.vue'
import HowJetLagWorksView from '@/views/learn/HowJetLagWorksView.vue'
import LightExposureView from '@/views/learn/LightExposureView.vue'
import SleepStrategiesView from '@/views/learn/SleepStrategiesView.vue'
import ExerciseActivityView from '@/views/learn/ExerciseActivityView.vue'
import NutritionSupplementsView from '@/views/learn/NutritionSupplementsView.vue'
import TravelDayTipsView from '@/views/learn/TravelDayTipsView.vue'
import FAQView from '@/views/learn/FAQView.vue'
import ScientificReferencesView from '@/views/learn/ScientificReferencesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/plan',
      name: 'plan-input',
      component: PlanInputView,
    },
    {
      path: '/plan/results',
      name: 'plan-results',
      component: PlanResultsView,
    },
    {
      path: '/learn',
      name: 'education',
      component: EducationView,
    },
    {
      path: '/learn/circadian-rhythms',
      name: 'circadian-rhythms',
      component: CircadianRhythmsView,
    },
    {
      path: '/learn/how-jet-lag-works',
      name: 'how-jet-lag-works',
      component: HowJetLagWorksView,
    },
    {
      path: '/learn/light-exposure',
      name: 'light-exposure',
      component: LightExposureView,
    },
    {
      path: '/learn/sleep-strategies',
      name: 'sleep-strategies',
      component: SleepStrategiesView,
    },
    {
      path: '/learn/exercise-activity',
      name: 'exercise-activity',
      component: ExerciseActivityView,
    },
    {
      path: '/learn/nutrition-supplements',
      name: 'nutrition-supplements',
      component: NutritionSupplementsView,
    },
    {
      path: '/learn/travel-day-tips',
      name: 'travel-day-tips',
      component: TravelDayTipsView,
    },
    {
      path: '/learn/faq',
      name: 'faq',
      component: FAQView,
    },
    {
      path: '/learn/scientific-references',
      name: 'scientific-references',
      component: ScientificReferencesView,
    },
  ],
})

export default router
