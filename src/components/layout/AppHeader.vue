<template>
  <header class="bg-gradient-to-r from-eb-dark to-eb-mid border-b border-eb-border sticky top-0 z-50">

    <!-- Barre principale -->
    <div class="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

      <!-- Logo + titre -->
      <div class="flex items-center gap-3 shrink-0">
        <span class="text-3xl" aria-hidden="true">🌍</span>
        <div>
          <router-link
            to="/"
            class="font-black text-xl tracking-tight gradient-text focus-visible:ring-2 focus-visible:ring-eb-cyan rounded"
            aria-label="EarthBalance — Retour au dashboard"
          >
            EarthBalance
          </router-link>
          <div class="text-xs text-slate-500 hidden sm:block">Planetary Simulation Engine v2.4</div>
        </div>
      </div>

      <!-- Desktop : nav + contrôles (masqué sur mobile) -->
      <div class="hidden md:flex items-center gap-4 flex-wrap flex-1 justify-end">
        <nav aria-label="Navigation principale">
          <ul class="flex items-center gap-1 flex-wrap list-none p-0 m-0">
            <li v-for="link in navLinks" :key="link.to">
              <router-link
                :to="link.to"
                class="text-xs px-3 py-1.5 rounded-full border transition-all focus-visible:ring-2 focus-visible:ring-eb-cyan outline-none"
                :class="[
                  $route.path === link.to
                    ? 'border-eb-cyan text-eb-cyan bg-eb-cyan/10'
                    : 'border-eb-border text-slate-400 hover:border-eb-cyan/50 hover:text-slate-200'
                ]"
                :aria-current="$route.path === link.to ? 'page' : undefined"
              >
                <i :class="['fa', link.icon, 'mr-1']" aria-hidden="true"></i>
                {{ link.label }}
              </router-link>
            </li>
          </ul>
        </nav>

        <AppSearch />
        <AppContrastToggle />

        <div class="flex items-center gap-4 text-sm flex-wrap">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse-dot inline-block" aria-hidden="true"></span>
            <span class="text-slate-400">
              Session <span class="text-eb-green font-bold">#42</span> — 2024
            </span>
          </div>
          <div class="flex items-center gap-1 text-slate-400">
            <i class="fa fa-users text-eb-cyan text-xs" aria-hidden="true"></i>
            <span class="font-bold text-eb-cyan" aria-live="polite">{{ playerCount.toLocaleString('fr-FR') }}</span>
            <span>joueurs</span>
          </div>
          <div class="flex items-center gap-2" role="group" aria-label="Sélecteur d'horizon temporel">
            <span class="text-xs text-slate-500">
              <i class="fa fa-clock" aria-hidden="true"></i> Horizon :
            </span>
            <button
              v-for="h in horizons"
              :key="h.value"
              class="text-xs px-3 py-1 rounded-full border transition-all focus-visible:ring-2 focus-visible:ring-eb-cyan outline-none"
              :class="selectedHorizon === h.value
                ? 'bg-eb-cyan text-eb-dark border-eb-cyan font-bold'
                : 'bg-transparent text-slate-400 border-eb-border hover:border-eb-cyan/50'"
              :aria-pressed="selectedHorizon === h.value"
              @click="setHorizon(h.value)"
            >
              {{ h.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile : bouton hamburger -->
      <button
        class="md:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-eb-border text-slate-400 hover:text-slate-200 hover:border-eb-cyan/50 transition-colors focus-visible:ring-2 focus-visible:ring-eb-cyan outline-none"
        :aria-expanded="menuOpen"
        aria-controls="mobile-menu"
        :aria-label="menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'"
        @click="menuOpen = !menuOpen"
      >
        <i :class="['fa', menuOpen ? 'fa-xmark' : 'fa-bars', 'text-sm']" aria-hidden="true"></i>
      </button>

    </div>

    <!-- Panneau mobile -->
    <div
      v-if="menuOpen"
      id="mobile-menu"
      class="md:hidden border-t border-eb-border bg-eb-dark/95 px-4 py-4 space-y-5"
    >
      <!-- Navigation -->
      <nav aria-label="Navigation principale">
        <ul class="space-y-1 list-none p-0 m-0">
          <li v-for="link in navLinks" :key="link.to">
            <router-link
              :to="link.to"
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all focus-visible:ring-2 focus-visible:ring-eb-cyan outline-none text-sm"
              :class="[
                $route.path === link.to
                  ? 'border-eb-cyan text-eb-cyan bg-eb-cyan/10'
                  : 'border-transparent text-slate-400 hover:border-eb-border hover:text-slate-200'
              ]"
              :aria-current="$route.path === link.to ? 'page' : undefined"
            >
              <i :class="['fa', link.icon, 'w-4 text-center']" aria-hidden="true"></i>
              {{ link.label }}
            </router-link>
          </li>
        </ul>
      </nav>

      <!-- Recherche + contraste -->
      <div class="flex items-center gap-3 pt-1 border-t border-eb-border">
        <AppSearch class="flex-1" align="left" />
        <AppContrastToggle />
      </div>

      <!-- Session info -->
      <div class="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-eb-border">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse-dot inline-block" aria-hidden="true"></span>
          Session <span class="text-eb-green font-bold ml-1">#42</span>
          <span class="text-slate-600">— 2024</span>
        </div>
        <div class="flex items-center gap-1">
          <i class="fa fa-users text-eb-cyan" aria-hidden="true"></i>
          <span class="font-bold text-eb-cyan" aria-live="polite">{{ playerCount.toLocaleString('fr-FR') }}</span>
          <span>joueurs</span>
        </div>
      </div>

      <!-- Horizon temporel -->
      <div class="pt-1 border-t border-eb-border" role="group" aria-label="Sélecteur d'horizon temporel">
        <div class="text-xs text-slate-500 mb-2">
          <i class="fa fa-clock mr-1" aria-hidden="true"></i> Horizon temporel
        </div>
        <div class="flex gap-2 flex-wrap">
          <button
            v-for="h in horizons"
            :key="h.value"
            class="text-xs px-3 py-1.5 rounded-full border transition-all focus-visible:ring-2 focus-visible:ring-eb-cyan outline-none"
            :class="selectedHorizon === h.value
              ? 'bg-eb-cyan text-eb-dark border-eb-cyan font-bold'
              : 'bg-transparent text-slate-400 border-eb-border hover:border-eb-cyan/50'"
            :aria-pressed="selectedHorizon === h.value"
            @click="setHorizon(h.value)"
          >
            {{ h.label }}
          </button>
        </div>
      </div>
    </div>

  </header>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { usePlanetsStore } from '@/store/planets.store'
import AppSearch from '@/components/layout/AppSearch.vue'
import AppContrastToggle from '@/components/layout/AppContrastToggle.vue'

interface NavLink { to: string; label: string; icon: string }
interface Horizon  { value: number; label: string }

const planetsStore = usePlanetsStore()
const { selectedHorizon } = storeToRefs(planetsStore)
const route = useRoute()

const menuOpen   = ref(false)
const playerCount = ref<number>(1247)

const navLinks: NavLink[] = [
  { to: '/',                    label: 'Dashboard',           icon: 'fa-gauge-high'      },
  { to: '/limites-planetaires', label: 'Limites Planétaires', icon: 'fa-earth-europe'    },
  { to: '/decisions',           label: 'Décisions',           icon: 'fa-vote-yea'        },
  { to: '/correlations',        label: 'Corrélations',        icon: 'fa-diagram-project' },
  { to: '/demo',                label: 'Simulateur',          icon: 'fa-flask'           },
]

const horizons: Horizon[] = [
  { value: 0,  label: "Aujourd'hui" },
  { value: 10, label: '+10 ans' },
  { value: 20, label: '+20 ans' },
  { value: 50, label: '+50 ans' },
]

function setHorizon(value: number): void {
  planetsStore.setHorizon(value)
}

// Fermeture automatique lors d'un changement de route
watch(() => route.path, () => { menuOpen.value = false })
</script>

<style scoped>
.gradient-text {
  background: linear-gradient(90deg, #00ff88, #00e5ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
