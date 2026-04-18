<template>
  <main class="max-w-screen-xl mx-auto px-4 py-6 space-y-8" id="main-content" tabindex="-1">
    <!-- Intro + légende statuts -->
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black text-white mb-1">Les 9 Limites Planétaires</h1>
        <p class="text-sm text-slate-400 max-w-2xl leading-relaxed">
          Concept défini par Rockström et al. (2009) — ces limites définissent un espace de développement
          sûr pour l'humanité. Dépasser ces seuils risque de provoquer des changements environnementaux
          abrupts et irréversibles.
        </p>
      </div>
      <div class="flex gap-3 text-xs shrink-0">
        <span class="flex items-center gap-1 bg-red-900/30 text-red-400 border border-red-700/30 px-2 py-1 rounded-full">
          <span class="w-2 h-2 rounded-full bg-red-400 inline-block" aria-hidden="true"></span>
          Dépassé ({{ limitsByStatus.depasse.length }})
        </span>
        <span class="flex items-center gap-1 bg-yellow-900/30 text-yellow-400 border border-yellow-700/30 px-2 py-1 rounded-full">
          <span class="w-2 h-2 rounded-full bg-yellow-400 inline-block" aria-hidden="true"></span>
          Zone risque ({{ limitsByStatus.zone_incertitude.length }})
        </span>
        <span class="flex items-center gap-1 bg-green-900/30 text-eb-green border border-green-700/30 px-2 py-1 rounded-full">
          <span class="w-2 h-2 rounded-full bg-eb-green inline-block" aria-hidden="true"></span>
          Sûr ({{ limitsByStatus.safe.length }})
        </span>
      </div>
    </div>

    <!-- Graphique radar global -->
    <section aria-labelledby="radar-title">
      <SectionTitle id="radar-title" title="Vue Radar Globale" icon="fa-circle-nodes" color-class="text-eb-cyan" />
      <EbCard>
        <RadarChart
          v-if="radarData"
          canvas-id="globalRadar"
          :labels="radarData.labels"
          :values="radarData.values"
          :height="420"
          aria-label="Graphique radar des 9 limites planétaires montrant le niveau de dépassement de chaque limite"
        />
        <div v-else class="flex items-center justify-center text-slate-500 text-sm" :style="{ height: '420px' }">
          <i class="fa fa-spinner fa-spin mr-2" aria-hidden="true"></i>
          Chargement du radar…
        </div>
        <p class="text-xs text-slate-500 text-center mt-2">
          Valeurs normalisées : ratio current/seuil — ligne pointillée jaune = seuil critique (ratio ×1)
          · Points rouges = dépassement · Points verts = en limite
        </p>
      </EbCard>
    </section>

    <!-- 9 fiches individuelles -->
    <section aria-labelledby="limits-grid-title">
      <SectionTitle id="limits-grid-title" title="Fiches Détaillées" icon="fa-table-cells" color-class="text-eb-green" />

      <div v-if="loading" class="text-center py-12 text-slate-500">
        <i class="fa fa-spinner fa-spin text-2xl mb-2" aria-label="Chargement en cours"></i>
        <p>Chargement des données…</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <PlanetaryLimitCard
          v-for="limit in limits"
          :key="limit.id"
          :limit="limit"
        />
      </div>
    </section>

  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { usePlanetsStore } from '@/store/planets.store'

import SectionTitle       from '@/components/layout/SectionTitle.vue'
import EbCard             from '@/components/layout/EbCard.vue'
import RadarChart         from '@/components/charts/RadarChart.vue'
import PlanetaryLimitCard from '@/components/limits/PlanetaryLimitCard.vue'

const store = usePlanetsStore()
const { limits, radarData, loading, limitsByStatus } = storeToRefs(store)

onMounted(() => store.fetchAll())
</script>
