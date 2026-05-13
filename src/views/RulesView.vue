<template>
  <main class="max-w-screen-2xl mx-auto px-4 py-6 space-y-8" id="main-content" tabindex="-1">

    <!-- En-tête -->
    <div>
      <h1 class="text-2xl font-black text-white mb-1">{{ t('rules.page_title') }}</h1>
      <p class="text-sm text-slate-400 max-w-2xl leading-relaxed">{{ t('rules.page_subtitle') }}</p>
    </div>

    <!-- Contenu -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

      <!-- Objectif -->
      <EbCard class="lg:col-span-2">
        <div class="flex items-start gap-4">
          <div class="shrink-0 w-10 h-10 rounded-full border border-eb-cyan/40 bg-eb-cyan/10 flex items-center justify-center mt-0.5" aria-hidden="true">
            <i class="fa fa-bullseye text-eb-cyan"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-white mb-2">{{ t('rules.objective_title') }}</h2>
            <p class="text-sm text-slate-300 leading-relaxed">{{ t('rules.objective_body') }}</p>
          </div>
        </div>
      </EbCard>

      <!-- Déroulement d'un tour -->
      <EbCard class="lg:col-span-2">
        <div class="flex items-start gap-4">
          <div class="shrink-0 w-10 h-10 rounded-full border border-eb-green/40 bg-eb-green/10 flex items-center justify-center mt-0.5" aria-hidden="true">
            <i class="fa fa-rotate-right text-eb-green"></i>
          </div>
          <div class="flex-1 min-w-0">
            <h2 class="text-base font-bold text-white mb-1">{{ t('rules.turns_title') }}</h2>
            <p class="text-sm text-slate-400 mb-4">{{ t('rules.turns_body') }}</p>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">

              <!-- Phase discussion -->
              <div class="rounded-lg border border-slate-700/60 bg-slate-800/40 p-3 space-y-1.5">
                <div class="flex items-center gap-2">
                  <span class="w-6 h-6 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center shrink-0" aria-hidden="true">
                    <i class="fa fa-comments text-slate-400 text-[10px]"></i>
                  </span>
                  <h3 class="text-sm font-bold text-slate-200">{{ t('rules.phase_discussion_title') }}</h3>
                </div>
                <p class="text-xs text-slate-400 leading-relaxed">{{ t('rules.phase_discussion_body') }}</p>
              </div>

              <!-- Phase vote -->
              <div class="rounded-lg border border-eb-cyan/30 bg-eb-cyan/5 p-3 space-y-1.5">
                <div class="flex items-center gap-2">
                  <span class="w-6 h-6 rounded-full bg-eb-cyan/20 border border-eb-cyan/40 flex items-center justify-center shrink-0" aria-hidden="true">
                    <i class="fa fa-check-to-slot text-eb-cyan text-[10px]"></i>
                  </span>
                  <h3 class="text-sm font-bold text-eb-cyan">{{ t('rules.phase_vote_title') }}</h3>
                </div>
                <p class="text-xs text-slate-400 leading-relaxed">{{ t('rules.phase_vote_body') }}</p>
              </div>

              <!-- Phase résultats -->
              <div class="rounded-lg border border-eb-green/30 bg-eb-green/5 p-3 space-y-1.5">
                <div class="flex items-center gap-2">
                  <span class="w-6 h-6 rounded-full bg-eb-green/20 border border-eb-green/40 flex items-center justify-center shrink-0" aria-hidden="true">
                    <i class="fa fa-chart-bar text-eb-green text-[10px]"></i>
                  </span>
                  <h3 class="text-sm font-bold text-eb-green">{{ t('rules.phase_results_title') }}</h3>
                </div>
                <p class="text-xs text-slate-400 leading-relaxed">{{ t('rules.phase_results_body') }}</p>
              </div>

            </div>
          </div>
        </div>
      </EbCard>

      <!-- Méthode de Condorcet -->
      <EbCard>
        <div class="flex items-start gap-4">
          <div class="shrink-0 w-10 h-10 rounded-full border border-purple-500/40 bg-purple-900/20 flex items-center justify-center mt-0.5" aria-hidden="true">
            <i class="fa fa-trophy text-purple-400"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-white mb-2">{{ t('rules.condorcet_title') }}</h2>
            <p class="text-sm text-slate-300 leading-relaxed">{{ t('rules.condorcet_body') }}</p>
          </div>
        </div>
      </EbCard>

      <!-- Prérequis -->
      <EbCard>
        <div class="flex items-start gap-4">
          <div class="shrink-0 w-10 h-10 rounded-full border border-amber-500/40 bg-amber-900/20 flex items-center justify-center mt-0.5" aria-hidden="true">
            <i class="fa fa-lock text-amber-400"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-white mb-2">{{ t('rules.prerequisites_title') }}</h2>
            <p class="text-sm text-slate-300 leading-relaxed">{{ t('rules.prerequisites_body') }}</p>
          </div>
        </div>
      </EbCard>

      <!-- Points de bascule -->
      <EbCard>
        <div class="flex items-start gap-4">
          <div class="shrink-0 w-10 h-10 rounded-full border border-red-700/50 bg-red-950/20 flex items-center justify-center mt-0.5" aria-hidden="true">
            <i class="fa fa-triangle-exclamation text-red-400"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-white mb-2">{{ t('rules.tipping_title') }}</h2>
            <p class="text-sm text-slate-300 leading-relaxed">{{ t('rules.tipping_body') }}</p>
          </div>
        </div>
      </EbCard>

      <!-- Rôle facilitateur -->
      <EbCard>
        <div class="flex items-start gap-4">
          <div class="shrink-0 w-10 h-10 rounded-full border border-eb-border bg-eb-dark flex items-center justify-center mt-0.5" aria-hidden="true">
            <i class="fa fa-gear text-slate-400"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-white mb-2">{{ t('rules.admin_title') }}</h2>
            <p class="text-sm text-slate-300 leading-relaxed">{{ t('rules.admin_body') }}</p>
          </div>
        </div>
      </EbCard>

      <!-- Fin de partie -->
      <EbCard class="lg:col-span-2">
        <div class="flex items-start gap-4">
          <div class="shrink-0 w-10 h-10 rounded-full border border-eb-green/40 bg-eb-green/10 flex items-center justify-center mt-0.5" aria-hidden="true">
            <i class="fa fa-flag-checkered text-eb-green"></i>
          </div>
          <div>
            <h2 class="text-base font-bold text-white mb-2">{{ t('rules.end_title') }}</h2>
            <p class="text-sm text-slate-300 leading-relaxed">{{ t('rules.end_body') }}</p>
          </div>
        </div>
      </EbCard>

    </div>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import EbCard from '@/components/layout/EbCard.vue'

const { t } = useI18n()
</script>
