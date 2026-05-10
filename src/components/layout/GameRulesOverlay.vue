<template>
  <dialog
    ref="dialogEl"
    class="rules-dialog"
    tabindex="-1"
    :aria-label="t('rules.overlay_aria')"
    @close="onClose"
  >
    <div class="rules-inner">

      <!-- Titre -->
      <div class="rules-item flex flex-col items-center gap-2 mb-8" :style="{ animationDelay: '0s' }">
        <i class="fa fa-circle-question text-eb-cyan text-3xl" aria-hidden="true"></i>
        <h1 class="text-eb-cyan font-black tracking-widest text-sm uppercase">{{ t('rules.page_title') }}</h1>
      </div>

      <!-- Objectif -->
      <div class="rules-item rules-card border-eb-cyan/30 bg-eb-cyan/5" :style="{ animationDelay: '0.12s' }">
        <div class="rules-card-icon bg-eb-cyan/10 border-eb-cyan/40" aria-hidden="true">
          <i class="fa fa-bullseye text-eb-cyan"></i>
        </div>
        <div>
          <h2 class="rules-card-title text-white">{{ t('rules.objective_title') }}</h2>
          <p class="rules-card-body">{{ t('rules.objective_body') }}</p>
        </div>
      </div>

      <!-- Phases du tour -->
      <div class="rules-item rules-card border-eb-green/30 bg-eb-green/5" :style="{ animationDelay: '0.24s' }">
        <div class="rules-card-icon bg-eb-green/10 border-eb-green/40" aria-hidden="true">
          <i class="fa fa-rotate-right text-eb-green"></i>
        </div>
        <div class="flex-1 min-w-0">
          <h2 class="rules-card-title text-white">{{ t('rules.turns_title') }}</h2>
          <p class="rules-card-body mb-3">{{ t('rules.turns_body') }}</p>
          <div class="space-y-2">
            <div class="rounded-lg border border-slate-700/60 bg-slate-800/40 px-3 py-2">
              <span class="text-[11px] font-bold text-slate-300">
                <i class="fa fa-comments mr-1 text-slate-500" aria-hidden="true"></i>{{ t('rules.phase_discussion_title') }}
              </span>
              <p class="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{{ t('rules.phase_discussion_body') }}</p>
            </div>
            <div class="rounded-lg border border-eb-cyan/30 bg-eb-cyan/5 px-3 py-2">
              <span class="text-[11px] font-bold text-eb-cyan">
                <i class="fa fa-check-to-slot mr-1" aria-hidden="true"></i>{{ t('rules.phase_vote_title') }}
              </span>
              <p class="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{{ t('rules.phase_vote_body') }}</p>
            </div>
            <div class="rounded-lg border border-eb-green/30 bg-eb-green/5 px-3 py-2">
              <span class="text-[11px] font-bold text-eb-green">
                <i class="fa fa-chart-bar mr-1" aria-hidden="true"></i>{{ t('rules.phase_results_title') }}
              </span>
              <p class="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{{ t('rules.phase_results_body') }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Condorcet -->
      <div class="rules-item rules-card border-purple-500/30 bg-purple-900/10" :style="{ animationDelay: '0.36s' }">
        <div class="rules-card-icon bg-purple-900/20 border-purple-500/40" aria-hidden="true">
          <i class="fa fa-trophy text-purple-400"></i>
        </div>
        <div>
          <h2 class="rules-card-title text-white">{{ t('rules.condorcet_title') }}</h2>
          <p class="rules-card-body">{{ t('rules.condorcet_body') }}</p>
        </div>
      </div>

      <!-- Prérequis -->
      <div class="rules-item rules-card border-amber-500/30 bg-amber-900/10" :style="{ animationDelay: '0.48s' }">
        <div class="rules-card-icon bg-amber-900/20 border-amber-500/40" aria-hidden="true">
          <i class="fa fa-lock text-amber-400"></i>
        </div>
        <div>
          <h2 class="rules-card-title text-white">{{ t('rules.prerequisites_title') }}</h2>
          <p class="rules-card-body">{{ t('rules.prerequisites_body') }}</p>
        </div>
      </div>

      <!-- Points de bascule -->
      <div class="rules-item rules-card border-red-700/40 bg-red-950/15" :style="{ animationDelay: '0.60s' }">
        <div class="rules-card-icon bg-red-950/20 border-red-700/50" aria-hidden="true">
          <i class="fa fa-triangle-exclamation text-red-400"></i>
        </div>
        <div>
          <h2 class="rules-card-title text-white">{{ t('rules.tipping_title') }}</h2>
          <p class="rules-card-body">{{ t('rules.tipping_body') }}</p>
        </div>
      </div>

      <!-- Fin de partie -->
      <div class="rules-item rules-card border-eb-green/30 bg-eb-green/5" :style="{ animationDelay: '0.72s' }">
        <div class="rules-card-icon bg-eb-green/10 border-eb-green/40" aria-hidden="true">
          <i class="fa fa-flag-checkered text-eb-green"></i>
        </div>
        <div>
          <h2 class="rules-card-title text-white">{{ t('rules.end_title') }}</h2>
          <p class="rules-card-body">{{ t('rules.end_body') }}</p>
        </div>
      </div>

      <!-- Lien page complète -->
      <p class="rules-item text-xs text-slate-600 text-center mt-2" :style="{ animationDelay: '0.84s' }">
        {{ t('rules.overlay_full_rules') }}
        <router-link
          to="/regles"
          class="text-slate-500 hover:text-eb-cyan underline underline-offset-2 transition-colors focus-visible:ring-2 focus-visible:ring-eb-cyan rounded outline-none"
          @click="dismiss"
        >
          {{ t('nav.rules') }}
        </router-link>
      </p>

      <!-- CTA -->
      <div class="rules-item flex justify-center mt-8" :style="{ animationDelay: '0.96s' }">
        <button
          class="px-10 py-3 rounded-xl font-black text-base bg-eb-cyan text-eb-dark hover:bg-cyan-300 transition-colors focus-visible:ring-2 focus-visible:ring-white outline-none"
          @click="dismiss"
        >
          {{ t('rules.overlay_cta') }}
        </button>
      </div>

    </div>
  </dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { useGameStore } from '@/store/game.store'
import { STORAGE_KEYS } from '@/config/storageKeys'

const { t } = useI18n()
const gameStore = useGameStore()
const dialogEl  = ref<HTMLDialogElement | null>(null)

function openDialog(): void {
  const el = dialogEl.value
  if (!el) return
  el.showModal()
  nextTick(() => {
    el.scrollTop = 0
    el.focus()
  })
}

onMounted(() => {
  if (gameStore.rulesVisible) openDialog()
})

watch(
  () => gameStore.rulesVisible,
  (visible) => {
    if (visible) openDialog()
    else dialogEl.value?.close()
  },
)

function dismiss(): void {
  dialogEl.value?.close()
}

function onClose(): void {
  localStorage.setItem(STORAGE_KEYS.INTRO_SEEN, '1')
  gameStore.rulesVisible = false
}
</script>

<style scoped>
.rules-dialog {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100svh;
  max-width: none;
  max-height: none;
  margin: 0;
  border: none;
  padding: 0;
  background: transparent;
  overflow-y: auto;
}

.rules-dialog::backdrop {
  background: rgba(6, 10, 18, 0.97);
}

.rules-inner {
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 42rem;
  margin: 0 auto;
  padding: 3rem 1.5rem;
}

@keyframes rulesFadeIn {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.rules-item {
  opacity: 0;
  animation: rulesFadeIn 0.55s ease-out forwards;
  animation-fill-mode: both;
  margin-bottom: 0.75rem;
}

.rules-card {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  border-radius: 0.75rem;
  border-width: 1px;
  padding: 0.875rem 1rem;
}

.rules-card-icon {
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  border-width: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.125rem;
  font-size: 0.75rem;
}

.rules-card-title {
  font-size: 0.8125rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  line-height: 1.3;
}

.rules-card-body {
  font-size: 0.75rem;
  color: #94a3b8;
  line-height: 1.65;
}
</style>
