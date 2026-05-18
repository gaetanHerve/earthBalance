import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'overview',
    component: () => import('@/views/OverviewView.vue'),
    meta: { title: 'Vue d\'ensemble — EarthBalance' },
  },
  {
    path: '/dashboard',
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
    path: '/bascules',
    name: 'tippingPoints',
    component: () => import('@/views/TippingPointsView.vue'),
    meta: { title: 'Points de bascule — EarthBalance' },
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
  {
    path: '/bilan-2100',
    name: 'bilan2100',
    component: () => import('@/views/GameEndView.vue'),
    meta: { title: 'Bilan 2100 — EarthBalance' },
  },
  {
    path: '/regles',
    name: 'rules',
    component: () => import('@/views/RulesView.vue'),
    meta: { title: 'Règles du jeu — EarthBalance' },
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
