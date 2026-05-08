<template>
  <main class="max-w-screen-2xl mx-auto px-4 py-6" id="main-content" tabindex="-1">
    <div class="mb-8">
      <h1 class="text-2xl font-black text-white mb-1">{{ t('correlations.title') }}</h1>
      <p class="text-sm text-slate-400 leading-relaxed">
        {{ t('correlations.intro') }}
      </p>
    </div>

    <!-- Placeholder fonctionnalité à venir -->
    <EbCard extra-class="text-center py-20">
      <div class="flex flex-col items-center gap-4">
        <i class="fa fa-diagram-project text-5xl text-eb-border" aria-hidden="true"></i>
        <h2 class="text-xl font-black text-slate-400">{{ t('correlations.coming_soon') }}</h2>
        <p class="text-sm text-slate-500 max-w-md leading-relaxed">
          {{ t('correlations.coming_desc') }}
        </p>

        <!-- Squelette du sélecteur -->
        <div class="mt-4 w-full max-w-lg border border-dashed border-eb-border rounded-xl p-6 opacity-40">
          <div class="text-xs text-slate-500 uppercase tracking-wider mb-3">
            <i class="fa fa-sliders mr-1" aria-hidden="true"></i> {{ t('correlations.selector') }}
          </div>
          <div class="flex flex-wrap gap-2">
            <div
              v-for="item in placeholderItems"
              :key="item"
              class="text-xs px-3 py-1 rounded-full bg-eb-mid border border-eb-border text-slate-500 cursor-not-allowed"
              aria-disabled="true"
            >{{ item }}</div>
          </div>
          <div class="mt-4 h-40 bg-eb-mid rounded-lg border border-eb-border flex items-center justify-center">
            <span class="text-xs text-slate-600">Zone graphique de corrélation</span>
          </div>
        </div>
      </div>
    </EbCard>

  </main>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import EbCard from '@/components/layout/EbCard.vue'

const { t } = useI18n()

const placeholderItems: string[] = [
  'CO₂', 'Température', 'Biodiversité', 'Forêt', 'Eau douce',
  'Azote', 'Sécurité alim.', 'Inégalités',
]
</script>
