<template>
  <header class="bg-gradient-to-r from-eb-dark to-eb-mid border-b border-eb-border sticky top-0 z-50">

    <!-- Barre principale -->
    <div class="max-w-screen-2xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

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
          <ul class="flex items-center gap-1 list-none p-0 m-0">
            <li v-for="link in navLinks" :key="link.to">
              <AppTooltip :text="link.description" position="bottom">
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
              </AppTooltip>
            </li>

            <!-- Sous-menu Outils -->
            <li ref="toolsRef" class="relative" @focusout="onToolsFocusOut">
              <AppTooltip :text="t('nav.tools_desc')" position="bottom">
                <button
                  ref="toolsTriggerRef"
                  class="text-xs px-3 py-1.5 rounded-full border transition-all focus-visible:ring-2 focus-visible:ring-eb-cyan outline-none flex items-center gap-1"
                  :class="isToolsActive || toolsOpen
                    ? 'border-eb-cyan text-eb-cyan bg-eb-cyan/10'
                    : 'border-eb-border text-slate-400 hover:border-eb-cyan/50 hover:text-slate-200'"
                  :aria-expanded="toolsOpen"
                  :aria-label="t('nav.tools_aria')"
                  @click="toolsOpen = !toolsOpen"
                  @keydown.escape.prevent="closeTools()"
                >
                  <i class="fa fa-layer-group mr-1" aria-hidden="true"></i>
                  {{ t('nav.tools') }}
                  <i
                    class="fa fa-chevron-down text-[9px] ml-0.5 transition-transform duration-150"
                    :class="toolsOpen ? 'rotate-180' : ''"
                    aria-hidden="true"
                  ></i>
                </button>
              </AppTooltip>

              <div
                v-if="toolsOpen"
                class="absolute top-full left-0 mt-1.5 min-w-[200px] bg-eb-card border border-eb-border rounded-xl shadow-2xl z-50 py-1.5"
                @keydown.escape.prevent="closeTools()"
              >
                <router-link
                  v-for="link in toolsLinks"
                  :key="link.to"
                  :to="link.to"
                  class="flex items-center gap-2.5 px-3 py-2 mx-1 text-xs rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-eb-cyan outline-none"
                  :class="$route.path === link.to
                    ? 'text-eb-cyan bg-eb-cyan/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'"
                  :aria-current="$route.path === link.to ? 'page' : undefined"
                >
                  <i :class="['fa', link.icon, 'w-4 text-center text-[11px] shrink-0']" aria-hidden="true"></i>
                  <div class="min-w-0">
                    <div>{{ link.label }}</div>
                    <div v-if="link.description" class="text-[10px] text-slate-600 truncate mt-0.5">{{ link.description }}</div>
                  </div>
                </router-link>
              </div>
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

        <!-- Badge phase courante (visible pour tous) -->
        <AppTooltip :text="t(`phase.${gameStore.phase}_desc`)" position="bottom">
          <span
            class="text-[10px] px-2 py-0.5 rounded-full border font-semibold uppercase tracking-wide shrink-0"
            :class="{
              'border-slate-600 text-slate-400 bg-slate-800/40': gameStore.phase === 'discussion',
              'border-eb-cyan/50 text-eb-cyan bg-eb-cyan/10':    gameStore.phase === 'vote',
              'border-eb-green/50 text-eb-green bg-eb-green/10': gameStore.phase === 'results',
            }"
          >
            <i class="fa mr-1 text-[9px]" :class="{
              'fa-comments':      gameStore.phase === 'discussion',
              'fa-check-to-slot': gameStore.phase === 'vote',
              'fa-chart-bar':     gameStore.phase === 'results',
            }" aria-hidden="true"></i>
            {{ t(`phase.${gameStore.phase}`) }}
          </span>
        </AppTooltip>

        <!-- Bouton Voter -->
        <AppTooltip :text="t('phase.vote_action_desc')" position="bottom">
          <button
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all focus-visible:ring-2 focus-visible:ring-eb-cyan outline-none"
            :class="canVote
              ? 'border-eb-cyan/60 text-eb-cyan bg-eb-cyan/10 hover:bg-eb-cyan/20 hover:border-eb-cyan cursor-pointer'
              : 'border-slate-700/60 text-slate-600 cursor-not-allowed'"
            :aria-label="t('phase.vote_action_desc')"
            :aria-disabled="!canVote"
            @click="canVote && router.push('/mitigation-policies')"
          >
            <i class="fa fa-check-to-slot text-[10px]" aria-hidden="true"></i>
            {{ t('phase.vote_action') }}
          </button>
        </AppTooltip>

        <!-- Admin -->
        <div v-if="isAdmin" class="flex items-center gap-2 pl-3 border-l border-eb-border/60" :aria-label="t('header.admin_section')">

          <!-- Bouton toggle Admin -->
          <button
            class="flex items-center gap-1 text-[9px] text-slate-600 uppercase tracking-widest font-semibold hover:text-slate-400 transition-colors focus-visible:ring-1 focus-visible:ring-slate-500 rounded outline-none cursor-pointer"
            :aria-expanded="adminOpen"
            :aria-label="t('header.admin_toggle')"
            @click="adminOpen = !adminOpen"
          >
            <i class="fa fa-gear text-[10px]" aria-hidden="true"></i>
            Admin
            <i class="fa fa-chevron-down text-[8px] ml-0.5 transition-transform duration-150" :class="adminOpen ? 'rotate-180' : ''" aria-hidden="true"></i>
          </button>

          <template v-if="adminOpen">

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

            <!-- Bouton d'avancement de phase -->
            <AppTooltip
              v-if="gameStore.phase === 'discussion'"
              :text="activeBallot || ballotProposals.length === 3 ? t('phase.start_vote') : t('phase.start_vote_no_proposals_desc')"
              position="bottom"
            >
              <button
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs transition-all focus-visible:ring-2 focus-visible:ring-eb-cyan outline-none cursor-pointer"
                :class="activeBallot || ballotProposals.length === 3
                  ? 'border-eb-cyan/40 text-eb-cyan hover:bg-eb-cyan/10 hover:border-eb-cyan'
                  : 'border-amber-600/40 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500'"
                :aria-label="activeBallot || ballotProposals.length === 3 ? t('phase.start_vote') : t('phase.start_vote_no_proposals')"
                @click="gameStore.startVote()"
              >
                <i class="fa fa-check-to-slot" aria-hidden="true"></i>
                {{ activeBallot || ballotProposals.length === 3 ? t('phase.start_vote') : t('phase.start_vote_no_proposals') }}
              </button>
            </AppTooltip>

            <button
              v-else-if="gameStore.phase === 'vote'"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs transition-all focus-visible:ring-2 focus-visible:ring-amber-400 outline-none"
              :class="canCloseVote
                ? 'border-amber-500/50 text-amber-400 hover:bg-amber-500/10 hover:border-amber-400 cursor-pointer'
                : 'border-slate-700 text-slate-600 cursor-not-allowed opacity-50'"
              :disabled="!canCloseVote"
              :aria-label="t('phase.close_vote')"
              :aria-disabled="!canCloseVote"
              @click="canCloseVote && gameStore.closeVote()"
            >
              <i class="fa fa-forward-step" aria-hidden="true"></i>
              {{ t('phase.close_vote') }}
            </button>

            <button
              v-else-if="gameStore.phase === 'results'"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs transition-all focus-visible:ring-2 focus-visible:ring-eb-green outline-none border-eb-green/40 text-eb-green hover:bg-eb-green/10 hover:border-eb-green cursor-pointer"
              :aria-label="t('phase.next_round')"
              @click="gameStore.endRound()"
            >
              <i class="fa fa-rotate-right" aria-hidden="true"></i>
              {{ t('phase.next_round') }}
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

          </template>
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

          <!-- Groupe Outils -->
          <li class="pt-1">
            <p class="text-[10px] text-slate-600 uppercase tracking-widest font-semibold px-3 pb-1" aria-hidden="true">
              <i class="fa fa-layer-group mr-1"></i>{{ t('nav.tools') }}
            </p>
            <ul class="space-y-1 list-none p-0 m-0 pl-3">
              <li v-for="link in toolsLinks" :key="link.to">
                <router-link
                  :to="link.to"
                  class="flex items-center gap-3 px-3 py-2 rounded-lg border transition-all focus-visible:ring-2 focus-visible:ring-eb-cyan outline-none text-sm"
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
          </li>
        </ul>
      </nav>

      <!-- Recherche + contraste + langue -->
      <div class="flex items-center gap-3 pt-1 border-t border-eb-border">
        <AppSearch class="flex-1" align="left" />
        <AppContrastToggle />
        <AppLangToggle />
      </div>

      <!-- Session info + phase -->
      <div class="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-eb-border">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse-dot inline-block" aria-hidden="true"></span>
          {{ t('header.session_label') }} <span class="text-eb-green font-bold ml-1">#{{ gameStore.sessionNumber }}</span>
        </div>
        <span
          class="text-[10px] px-2 py-0.5 rounded-full border font-semibold uppercase tracking-wide"
          :class="{
            'border-slate-600 text-slate-400 bg-slate-800/40': gameStore.phase === 'discussion',
            'border-eb-cyan/50 text-eb-cyan bg-eb-cyan/10':    gameStore.phase === 'vote',
            'border-eb-green/50 text-eb-green bg-eb-green/10': gameStore.phase === 'results',
          }"
        >
          <i class="fa mr-1 text-[9px]" :class="{
            'fa-comments':      gameStore.phase === 'discussion',
            'fa-check-to-slot': gameStore.phase === 'vote',
            'fa-chart-bar':     gameStore.phase === 'results',
          }" aria-hidden="true"></i>
          {{ t(`phase.${gameStore.phase}`) }}
        </span>
        <div class="flex items-center gap-1">
          <i class="fa fa-users text-eb-cyan" aria-hidden="true"></i>
          <span class="font-bold text-eb-cyan" aria-live="polite">{{ playerCount.toLocaleString('fr-FR') }}</span>
          <span>{{ t('header.players') }}</span>
        </div>
      </div>

      <!-- Bouton Voter (mobile) -->
      <div class="pt-1 border-t border-eb-border">
        <button
          class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-semibold transition-all focus-visible:ring-2 focus-visible:ring-eb-cyan outline-none"
          :class="canVote
            ? 'border-eb-cyan/50 text-eb-cyan bg-eb-cyan/10 hover:bg-eb-cyan/20 cursor-pointer'
            : 'border-slate-700/60 text-slate-600 cursor-not-allowed'"
          :aria-label="t('phase.vote_action_desc')"
          :aria-disabled="!canVote"
          @click="canVote && (router.push('/mitigation-policies'), menuOpen = false)"
        >
          <i class="fa fa-check-to-slot" aria-hidden="true"></i>
          {{ t('phase.vote_action') }}
        </button>
      </div>

      <!-- Admin (collapsible) -->
      <div v-if="isAdmin" class="pt-1 border-t border-eb-border" :aria-label="t('header.admin_section')">
        <button
          class="flex items-center gap-1.5 text-[9px] text-slate-600 uppercase tracking-widest font-semibold hover:text-slate-400 transition-colors focus-visible:ring-1 focus-visible:ring-slate-500 rounded outline-none cursor-pointer px-1 py-0.5"
          :aria-expanded="adminOpen"
          :aria-label="t('header.admin_toggle')"
          @click="adminOpen = !adminOpen"
        >
          <i class="fa fa-gear text-[10px]" aria-hidden="true"></i>
          Admin
          <i class="fa fa-chevron-down text-[8px] transition-transform duration-150" :class="adminOpen ? 'rotate-180' : ''" aria-hidden="true"></i>
        </button>

        <div v-if="adminOpen" class="mt-2 space-y-2">
          <!-- Bascules toggle -->
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
            v-if="gameStore.phase === 'discussion'"
            class="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border text-sm transition-all focus-visible:ring-2 outline-none cursor-pointer"
            :class="activeBallot || ballotProposals.length === 3
              ? 'border-eb-cyan/40 text-eb-cyan hover:bg-eb-cyan/10 focus-visible:ring-eb-cyan'
              : 'border-amber-600/40 text-amber-400 hover:bg-amber-500/10 focus-visible:ring-amber-400'"
            :aria-label="activeBallot || ballotProposals.length === 3 ? t('phase.start_vote') : t('phase.start_vote_no_proposals')"
            @click="gameStore.startVote(); menuOpen = false"
          >
            <i class="fa fa-check-to-slot" aria-hidden="true"></i>
            {{ activeBallot || ballotProposals.length === 3 ? t('phase.start_vote') : t('phase.start_vote_no_proposals') }}
          </button>

          <button
            v-else-if="gameStore.phase === 'vote'"
            class="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border text-sm transition-all focus-visible:ring-2 focus-visible:ring-amber-400 outline-none"
            :class="canCloseVote
              ? 'border-amber-500/50 text-amber-400 hover:bg-amber-500/10 border-amber-400 cursor-pointer'
              : 'border-slate-700 text-slate-600 cursor-not-allowed opacity-50'"
            :disabled="!canCloseVote"
            :aria-label="t('phase.close_vote')"
            :aria-disabled="!canCloseVote"
            @click="canCloseVote && (gameStore.closeVote(), menuOpen = false)"
          >
            <i class="fa fa-forward-step" aria-hidden="true"></i>
            {{ t('phase.close_vote') }}
          </button>

          <button
            v-else-if="gameStore.phase === 'results'"
            class="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border text-sm transition-all focus-visible:ring-2 focus-visible:ring-eb-green outline-none border-eb-green/40 text-eb-green hover:bg-eb-green/10 cursor-pointer"
            :aria-label="t('phase.next_round')"
            @click="gameStore.endRound(); menuOpen = false"
          >
            <i class="fa fa-rotate-right" aria-hidden="true"></i>
            {{ t('phase.next_round') }}
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
import AppTooltip from '@/components/layout/AppTooltip.vue'
import { useGameStore } from '@/store/game.store'
import { useMitigationPoliciesStore } from '@/store/mitigationPolicies.store'
import { useTippingPointsStore } from '@/store/tippingPoints.store'

interface NavLink { to: string; label: string; icon: string; description?: string }

const { t } = useI18n()
const route  = useRoute()
const router = useRouter()
const gameStore = useGameStore()
const tpStore   = useTippingPointsStore()

const { activeBallot, hasVoted, isAdmin, ballotProposals } = storeToRefs(useMitigationPoliciesStore())
const canCloseVote = computed(() => (activeBallot.value?.totalVoters ?? 0) > 0)
const canVote = computed(() => gameStore.phase === 'vote' && !hasVoted.value)

function handleReset(): void {
  gameStore.resetGame()
  router.push('/')
  menuOpen.value = false
}

const menuOpen    = ref(false)
const adminOpen   = ref(false)
const playerCount = ref<number>(1)

const toolsOpen        = ref(false)
const toolsRef         = ref<HTMLElement | null>(null)
const toolsTriggerRef  = ref<HTMLButtonElement | null>(null)

const TOOLS_PATHS = ['/limites-planetaires', '/bascules', '/simulateur', '/carte-systemique']
const isToolsActive = computed(() => TOOLS_PATHS.includes(route.path))

const toolsLinks = computed<NavLink[]>(() => [
  { to: '/limites-planetaires', label: t('nav.limits'),         icon: 'fa-earth-europe',         description: t('search.items.limits.description')         },
  { to: '/bascules',            label: t('nav.tipping_points'), icon: 'fa-triangle-exclamation', description: t('search.items.tipping_points.description') },
  { to: '/simulateur',          label: t('nav.simulator'),      icon: 'fa-flask',                description: t('search.items.simulator.description')      },
  { to: '/carte-systemique',    label: t('nav.systemic_map'),   icon: 'fa-share-nodes',          description: t('search.items.systemic_map.description')   },
])

function closeTools(): void {
  toolsOpen.value = false
  toolsTriggerRef.value?.focus()
}

function onToolsFocusOut(e: FocusEvent): void {
  if (!toolsRef.value?.contains(e.relatedTarget as Node)) {
    toolsOpen.value = false
  }
}

const navLinks = computed<NavLink[]>(() => {
  const links: NavLink[] = [
    { to: '/',                    label: t('nav.overview'),  icon: 'fa-circle-nodes',    description: t('search.items.overview.description')  },
    { to: '/mitigation-policies', label: t('nav.policies'),  icon: 'fa-vote-yea',        description: t('search.items.policies.description')  },
    { to: '/regles',              label: t('nav.rules'),     icon: 'fa-circle-question', description: t('rules.nav_desc')                      },
  ]
  if (gameStore.gameOver) {
    links.push({ to: '/bilan-2100', label: t('nav.bilan'), icon: 'fa-flag-checkered', description: t('search.items.end_game.description') })
  }
  return links
})

watch(() => route.path, () => { menuOpen.value = false; toolsOpen.value = false })
</script>

<style scoped>
.gradient-text {
  background: linear-gradient(90deg, #00ff88, #00e5ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
