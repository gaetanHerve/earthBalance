<template>
  <section aria-labelledby="ecological-title">
    <SectionTitle
      id="ecological-title"
      title="Indicateurs Écologiques"
      icon="fa-leaf"
      color-class="text-eb-green"
    />

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

      <!-- CO2 — ligne sur 2 colonnes -->
      <EbCard v-if="isVisible('co2')" extra-class="col-span-1 md:col-span-2">
        <div class="flex items-center justify-between mb-3">
          <div class="text-sm font-bold text-slate-200">
            <i class="fa fa-smog text-red-400 mr-2" aria-hidden="true"></i>Émissions CO₂ mondiales
          </div>
          <span class="text-xs bg-red-900/40 text-red-400 px-2 py-0.5 rounded-full">GtCO₂/an</span>
        </div>
        <LineChart
          canvas-id="co2Chart"
          :labels="eco.co2.timeSeries.years"
          :datasets="[{
            label: 'Émissions CO₂',
            data: eco.co2.timeSeries.values,
            borderColor: '#ff5050',
            backgroundColor: 'rgba(255,80,80,0.08)',
            fill: true,
          }]"
          :height="180"
          aria-label="Évolution des émissions mondiales de CO2 de 1990 à 2024"
        />
      </EbCard>

      <!-- Forêt — jauge -->
      <EbCard v-if="isVisible('forest')" extra-class="flex flex-col items-center justify-center">
        <div class="text-sm font-bold text-slate-200 mb-3">
          <i class="fa fa-tree text-eb-green mr-2" aria-hidden="true"></i>Forêt mondiale restante
        </div>
        <GaugeChart
          canvas-id="forestGauge"
          :value="eco.forest.current"
          :max="100"
          track-color="#00ff88"
          :size="140"
          :font-size="26"
          unit="restante"
          :aria-label="`Forêt mondiale restante : ${eco.forest.current}%`"
        >
          <span class="text-2xl font-black text-eb-green">{{ eco.forest.current }}%</span>
          <span class="text-xs text-slate-500 mt-0.5">restante</span>
        </GaugeChart>
        <div class="mt-3 text-xs text-slate-500 text-center">
          Référence 1990 : 100% · Seuil critique : {{ eco.forest.criticalThreshold }}%
        </div>
      </EbCard>

      <!-- Mix énergétique -->
      <EbCard v-if="isVisible('energyMix')">
        <div class="text-sm font-bold text-slate-200 mb-3">
          <i class="fa fa-bolt text-yellow-400 mr-2" aria-hidden="true"></i>Mix énergétique mondial
        </div>
        <BarChart
          canvas-id="energyChart"
          :labels="eco.energyMix.categories.map(c => c.label)"
          :values="eco.energyMix.categories.map(c => c.value)"
          :colors="eco.energyMix.categories.map(c => c.color)"
          :height="180"
          :y-max="40"
          aria-label="Mix énergétique mondial par source en pourcentage"
        />
      </EbCard>

      <!-- Température — ligne sur 2 colonnes -->
      <EbCard v-if="isVisible('temperature')" extra-class="col-span-1 md:col-span-2">
        <div class="flex items-center justify-between mb-3">
          <div class="text-sm font-bold text-slate-200">
            <i class="fa fa-thermometer-half text-orange-400 mr-2" aria-hidden="true"></i>
            Anomalie de température globale (°C)
          </div>
          <span class="text-xs bg-orange-900/40 text-orange-400 px-2 py-0.5 rounded-full">vs. pré-industriel</span>
        </div>
        <LineChart
          canvas-id="tempChart"
          :labels="eco.temperature.timeSeries.years"
          :datasets="[{
            label: 'Anomalie °C',
            data: eco.temperature.timeSeries.values,
            borderColor: '#fb923c',
            backgroundColor: 'rgba(251,146,60,0.2)',
            fill: true,
          }]"
          :height="180"
          aria-label="Évolution de l'anomalie de température globale depuis 1990"
        />
      </EbCard>

      <!-- Ressources naturelles — aire sur 2 colonnes -->
      <EbCard v-if="isVisible('resources')" extra-class="col-span-1 md:col-span-2">
        <div class="flex items-center justify-between mb-3">
          <div class="text-sm font-bold text-slate-200">
            <i class="fa fa-mountain text-slate-400 mr-2" aria-hidden="true"></i>
            Extraction de ressources naturelles
          </div>
          <span class="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full">Gt/an</span>
        </div>
        <LineChart
          canvas-id="resourceChart"
          :labels="eco.resources.years"
          :datasets="eco.resources.datasets.map(d => ({
            label: d.label,
            data: d.values,
            borderColor: d.color,
            backgroundColor: d.bgColor,
            fill: true,
          }))"
          :height="180"
          :show-legend="true"
          aria-label="Évolution de l'extraction de ressources naturelles par type depuis 1990"
        />
      </EbCard>

    </div>
  </section>
</template>

<script setup lang="ts">
import SectionTitle from '@/components/layout/SectionTitle.vue'
import EbCard from '@/components/layout/EbCard.vue'
import LineChart from '@/components/charts/LineChart.vue'
import GaugeChart from '@/components/charts/GaugeChart.vue'
import BarChart from '@/components/charts/BarChart.vue'

import type { EcologicalCharts } from '@/types/index'

const props = withDefaults(defineProps<{
  eco:            EcologicalCharts
  visibleWidgets?: string[]
}>(), { visibleWidgets: () => [] })

function isVisible(id: string): boolean {
  return props.visibleWidgets.includes(id)
}
</script>
