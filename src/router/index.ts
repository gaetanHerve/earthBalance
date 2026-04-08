import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { title: 'Dashboard — EarthBalance' },
  },
  {
    path: '/limites-planetaires',
    name: 'limits',
    component: () => import('@/views/LimitsView.vue'),
    meta: { title: 'Limites Planétaires — EarthBalance' },
  },
  {
    path: '/decisions',
    name: 'decisions',
    component: () => import('@/views/DecisionsView.vue'),
    meta: { title: 'Décisions Collectives — EarthBalance' },
  },
  {
    path: '/correlations',
    name: 'correlations',
    component: () => import('@/views/CorrelationsView.vue'),
    meta: { title: 'Corrélations — EarthBalance' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.afterEach((to) => {
  document.title = (to.meta.title as string | undefined) ?? 'EarthBalance'
})

export default router
