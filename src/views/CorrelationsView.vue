<template>
  <main class="max-w-screen-xl mx-auto px-4 py-6" id="main-content" tabindex="-1">

    <div class="mb-8">
      <h1 class="text-2xl font-black text-white mb-1">Corrélations entre indicateurs</h1>
      <p class="text-sm text-slate-400 leading-relaxed">
        Superposez et comparez plusieurs indicateurs planétaires et sociétaux sur une même vue temporelle.
      </p>
    </div>

    <!-- Placeholder fonctionnalité à venir -->
    <EbCard extra-class="text-center py-20">
      <div class="flex flex-col items-center gap-4">
        <i class="fa fa-diagram-project text-5xl text-eb-border" aria-hidden="true"></i>
        <h2 class="text-xl font-black text-slate-400">Fonctionnalité à venir</h2>
        <p class="text-sm text-slate-500 max-w-md leading-relaxed">
          Cette section permettra de sélectionner plusieurs indicateurs et de les superposer
          sur un même graphique interactif pour analyser leurs corrélations temporelles.
        </p>

        <!-- Squelette du sélecteur -->
        <div class="mt-4 w-full max-w-lg border border-dashed border-eb-border rounded-xl p-6 opacity-40">
          <div class="text-xs text-slate-500 uppercase tracking-wider mb-3">
            <i class="fa fa-sliders mr-1" aria-hidden="true"></i> Sélection d'indicateurs (à implémenter)
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

        <p class="text-xs text-slate-600 mt-2">
          TODO: implémenter la sélection multi-indicateurs + superposition Chart.js (dataset dynamique)
        </p>
      </div>
    </EbCard>

  </main>
</template>

<script setup lang="ts">
import EbCard from '@/components/layout/EbCard.vue'

const placeholderItems: string[] = [
  'CO₂', 'Température', 'Biodiversité', 'Forêt', 'Eau douce',
  'Azote', 'Sécurité alim.', 'Inégalités',
]
</script>
