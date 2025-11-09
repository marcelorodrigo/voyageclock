import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import PlanInputView from '@/views/PlanInputView.vue'
import PlanResultsView from '@/views/PlanResultsView.vue'

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
  ],
})

export default router
