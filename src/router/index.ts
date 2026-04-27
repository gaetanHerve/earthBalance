import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

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
    path: '/mitigation-policies',
    name: 'mitigationPolicies',
    component: () => import('@/views/PolitiquesView.vue'),
    meta: { title: 'Politiques — EarthBalance' },
  },
  {
    path: '/mitigation-policies/:id',
    name: 'policyDetail',
    component: () => import('@/views/PolicyDetailView.vue'),
    meta: { title: 'Politique — EarthBalance' },
  },
  {
    path: '/correlations',
    name: 'correlations',
    component: () => import('@/views/CorrelationsView.vue'),
    meta: { title: 'Corrélations — EarthBalance' },
  },
  {
    path: '/simulateur',
    name: 'simulateur',
    component: () => import('@/views/SimulateurView.vue'),
    meta: { title: 'Simulateur — EarthBalance' },
  },
  {
    path: '/carte-systemique',
    name: 'systemicMap',
    component: () => import('@/views/SystemicMapView.vue'),
    meta: { title: 'Carte systémique — EarthBalance' },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.afterEach((to) => {
  document.title = (to.meta.title as string | undefined) ?? 'EarthBalance'
})

export default router
