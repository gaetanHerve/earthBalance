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
            :aria-label="`EarthBalance — ${t('header.tagline')}`"
          >
            EarthBalance
          </router-link>
          <div class="text-xs text-slate-500 hidden sm:block">{{ t('header.tagline') }}</div>
        </div>
      </div>

      <!-- Desktop : nav + contrôles (masqué sur mobile) -->
      <div class="hidden lg:flex items-center gap-4 flex-wrap flex-1 justify-end">
        <nav :aria-label="t('header.main_nav')">
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
        <AppLangToggle />

        <!-- Stats -->
        <div class="flex items-center gap-3 text-sm">

          <!-- Session -->
          <div class="flex items-center gap-2 text-xs text-slate-400">
            <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse-dot inline-block" aria-hidden="true"></span>
            {{ t('header.session_label') }} <span class="text-eb-green font-bold ml-1">#{{ gameStore.sessionNumber }}</span>
          </div>

          <!-- Année courante — game HUD -->
          <div
            class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-amber-500/30 bg-amber-950/20 select-none"
            :aria-label="`${t('header.year_aria')} ${gameStore.currentYear}`"
          >
            <i class="fa fa-hourglass-half text-amber-400 text-xs" aria-hidden="true"></i>
            <span class="text-slate-500 uppercase tracking-wider text-[10px] font-medium leading-none">{{ t('header.year_label') }}</span>
            <span class="text-amber-300 font-black text-sm tabular-nums leading-none" aria-live="polite">{{ gameStore.currentYear }}</span>
          </div>

          <!-- Joueurs -->
          <div class="flex items-center gap-1 text-xs text-slate-400">
            <i class="fa fa-users text-eb-cyan" aria-hidden="true"></i>
            <span class="font-bold text-eb-cyan" aria-live="polite">{{ playerCount.toLocaleString('fr-FR') }}</span>
            <span>{{ t('header.players') }}</span>
          </div>

        </div>

        <!-- Admin -->
        <div class="flex items-center gap-2 pl-3 border-l border-eb-border/60" :aria-label="t('header.admin_section')">
          <span class="text-[9px] text-slate-600 uppercase tracking-widest font-semibold" aria-hidden="true">Admin</span>

          <!-- Tipping Points toggle -->
          <button
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs transition-all focus-visible:ring-2 focus-visible:ring-eb-cyan outline-none"
            :class="tpStore.enabled
              ? 'border-red-700/50 text-red-400 hover:bg-red-500/10 hover:border-red-600 cursor-pointer'
              : 'border-slate-700 text-slate-500 hover:border-slate-600 cursor-pointer'"
            :aria-pressed="tpStore.enabled"
            :aria-label="t('tipping.toggle_aria')"
            @click="tpStore.toggleEnabled()"
          >
            <i class="fas text-[11px]" :class="tpStore.enabled ? 'fa-toggle-on' : 'fa-toggle-off'" aria-hidden="true"></i>
            {{ t('nav.tipping_points') }}
          </button>

          <!-- Fin de tour -->
          <button
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs transition-all focus-visible:ring-2 focus-visible:ring-amber-400 outline-none"
            :class="canEndRound
              ? 'border-amber-500/50 text-amber-400 hover:bg-amber-500/10 hover:border-amber-400 cursor-pointer'
              : 'border-slate-700 text-slate-600 cursor-not-allowed opacity-50'"
            :disabled="!canEndRound"
            :aria-label="t('header.end_round_aria')"
            :aria-disabled="!canEndRound"
            @click="canEndRound && gameStore.endRound()"
          >
            <i class="fa fa-forward-step" aria-hidden="true"></i>
            {{ t('header.end_round') }}
          </button>

          <!-- Réinitialiser -->
          <button
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs transition-all focus-visible:ring-2 focus-visible:ring-red-400 outline-none border-red-800/50 text-red-500 hover:bg-red-500/10 hover:border-red-500 cursor-pointer"
            :aria-label="t('header.reset_game_aria')"
            @click="handleReset()"
          >
            <i class="fa fa-rotate-left" aria-hidden="true"></i>
            {{ t('header.reset_game') }}
          </button>

        </div>
      </div>

      <!-- Année courante — visible uniquement sur mobile, dans la barre principale -->
      <div
        class="lg:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-amber-500/30 bg-amber-950/20 select-none ml-auto"
        :aria-label="`${t('header.year_aria')} ${gameStore.currentYear}`"
      >
        <i class="fa fa-hourglass-half text-amber-400 text-xs" aria-hidden="true"></i>
        <span class="text-amber-300 font-black text-sm tabular-nums leading-none" aria-live="polite">{{ gameStore.currentYear }}</span>
      </div>

      <!-- Mobile : bouton hamburger -->
      <button
        class="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-eb-border text-slate-400 hover:text-slate-200 hover:border-eb-cyan/50 transition-colors focus-visible:ring-2 focus-visible:ring-eb-cyan outline-none"
        :aria-expanded="menuOpen"
        aria-controls="mobile-menu"
        :aria-label="menuOpen ? t('header.close_menu') : t('header.open_menu')"
        @click="menuOpen = !menuOpen"
      >
        <i :class="['fa', menuOpen ? 'fa-xmark' : 'fa-bars', 'text-sm']" aria-hidden="true"></i>
      </button>

    </div>

    <!-- Panneau mobile -->
    <div
      v-if="menuOpen"
      id="mobile-menu"
      class="lg:hidden border-t border-eb-border bg-eb-dark/95 px-4 py-4 space-y-5"
    >
      <!-- Navigation -->
      <nav :aria-label="t('header.main_nav')">
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

      <!-- Recherche + contraste + langue -->
      <div class="flex items-center gap-3 pt-1 border-t border-eb-border">
        <AppSearch class="flex-1" align="left" />
        <AppContrastToggle />
        <AppLangToggle />
      </div>

      <!-- Session info -->
      <div class="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-eb-border">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse-dot inline-block" aria-hidden="true"></span>
          {{ t('header.session_label') }} <span class="text-eb-green font-bold ml-1">#{{ gameStore.sessionNumber }}</span>
        </div>
        <div class="flex items-center gap-1">
          <i class="fa fa-users text-eb-cyan" aria-hidden="true"></i>
          <span class="font-bold text-eb-cyan" aria-live="polite">{{ playerCount.toLocaleString('fr-FR') }}</span>
          <span>{{ t('header.players') }}</span>
        </div>
      </div>

      <!-- Admin -->
      <div class="pt-1 border-t border-eb-border space-y-2" :aria-label="t('header.admin_section')">
        <p class="text-[9px] text-slate-600 uppercase tracking-widest font-semibold px-1" aria-hidden="true">Admin</p>

        <!-- Basculements toggle -->
        <button
          class="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border text-sm transition-all focus-visible:ring-2 focus-visible:ring-eb-cyan outline-none"
          :class="tpStore.enabled
            ? 'border-red-700/50 text-red-400 hover:bg-red-500/10 hover:border-red-600 cursor-pointer'
            : 'border-slate-700 text-slate-500 hover:border-slate-600 cursor-pointer'"
          :aria-pressed="tpStore.enabled"
          :aria-label="t('tipping.toggle_aria')"
          @click="tpStore.toggleEnabled()"
        >
          <i class="fas" :class="tpStore.enabled ? 'fa-toggle-on' : 'fa-toggle-off'" aria-hidden="true"></i>
          {{ t('nav.tipping_points') }}
          <span class="text-xs opacity-60">({{ tpStore.enabled ? t('tipping.toggle_enabled') : t('tipping.toggle_disabled') }})</span>
        </button>

        <button
          class="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border text-sm transition-all focus-visible:ring-2 focus-visible:ring-amber-400 outline-none"
          :class="canEndRound
            ? 'border-amber-500/50 text-amber-400 hover:bg-amber-500/10 hover:border-amber-400 cursor-pointer'
            : 'border-slate-700 text-slate-600 cursor-not-allowed opacity-50'"
          :disabled="!canEndRound"
          :aria-label="t('header.end_round_aria')"
          :aria-disabled="!canEndRound"
          @click="canEndRound && (gameStore.endRound(), menuOpen = false)"
        >
          <i class="fa fa-forward-step" aria-hidden="true"></i>
          {{ t('header.end_round') }}
        </button>
        <button
          class="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border text-sm transition-all focus-visible:ring-2 focus-visible:ring-red-400 outline-none border-red-800/50 text-red-500 hover:bg-red-500/10 hover:border-red-500 cursor-pointer"
          :aria-label="t('header.reset_game_aria')"
          @click="handleReset()"
        >
          <i class="fa fa-rotate-left" aria-hidden="true"></i>
          {{ t('header.reset_game') }}
        </button>
      </div>

    </div>

  </header>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import AppSearch from '@/components/layout/AppSearch.vue'
import AppContrastToggle from '@/components/layout/AppContrastToggle.vue'
import AppLangToggle from '@/components/layout/AppLangToggle.vue'
import { useGameStore } from '@/store/game.store'
import { useMitigationPoliciesStore } from '@/store/mitigationPolicies.store'
import { useTippingPointsStore } from '@/store/tippingPoints.store'

interface NavLink { to: string; label: string; icon: string }

const { t } = useI18n()
const route  = useRoute()
const router = useRouter()
const gameStore = useGameStore()
const tpStore   = useTippingPointsStore()

const { activeBallot } = storeToRefs(useMitigationPoliciesStore())
const canEndRound = computed(() => (activeBallot.value?.totalVoters ?? 0) > 0)

function handleReset(): void {
  gameStore.resetGame()
  router.push('/')
  menuOpen.value = false
}

const menuOpen    = ref(false)
const playerCount = ref<number>(1)

const navLinks = computed<NavLink[]>(() => [
  { to: '/',                    label: t('nav.dashboard'),    icon: 'fa-gauge-high'      },
  { to: '/limites-planetaires', label: t('nav.limits'),       icon: 'fa-earth-europe'    },
  { to: '/mitigation-policies', label: t('nav.policies'),     icon: 'fa-vote-yea'        },
  { to: '/bascules',            label: t('nav.tipping_points'), icon: 'fa-triangle-exclamation' },
  { to: '/simulateur',          label: t('nav.simulator'),    icon: 'fa-flask'           },
  { to: '/carte-systemique',    label: t('nav.systemic_map'), icon: 'fa-share-nodes'     },
])

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
