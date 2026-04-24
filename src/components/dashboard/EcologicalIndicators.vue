<template>
  <section aria-labelledby="ecological-title">
    <SectionTitle
      id="ecological-title"
      :title="t('dashboard.eco_title')"
      icon="fa-leaf"
      color-class="text-eb-green"
    />

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

      <!-- CO2 -->
      <EbCard v-if="isVisible('co2')" extra-class="col-span-1 md:col-span-2">
        <div class="flex items-center justify-between mb-3">
          <div class="text-sm font-bold text-slate-200">
            <i class="fa fa-smog text-red-400 mr-2" aria-hidden="true"></i>{{ t('dashboard.co2_title') }}
          </div>
          <span class="text-xs bg-red-900/40 text-red-400 px-2 py-0.5 rounded-full">GtCO₂/an</span>
        </div>
        <LineChart
          canvas-id="co2Chart"
          :labels="co2Labels"
          :datasets="co2Datasets"
          :height="180"
          :current-year="gameStore.currentYear"
          :aria-label="t('dashboard.co2_aria')"
        />
      </EbCard>

      <!-- Forêt — jauge -->
      <EbCard v-if="isVisible('forest')" extra-class="flex flex-col items-center justify-center">
        <div class="text-sm font-bold text-slate-200 mb-3">
          <i class="fa fa-tree text-eb-green mr-2" aria-hidden="true"></i>{{ t('dashboard.forest_title') }}
        </div>
        <GaugeChart
          canvas-id="forestGauge"
          :value="forestCurrent"
          :max="100"
          track-color="#00ff88"
          :size="140"
          :font-size="26"
          :unit="t('dashboard.forest_remaining')"
          :aria-label="`${t('dashboard.forest_title')} : ${forestCurrent}%`"
        >
          <span class="text-2xl font-black text-eb-green">{{ forestCurrent }}%</span>
          <span class="text-xs text-slate-500 mt-0.5">{{ t('dashboard.forest_remaining') }}</span>
        </GaugeChart>
        <div class="mt-3 text-xs text-slate-500 text-center">
          {{ t('dashboard.forest_ref', { threshold: eco.forest.criticalThreshold }) }}
        </div>
      </EbCard>

      <!-- Mix énergétique -->
      <EbCard v-if="isVisible('energyMix')">
        <div class="text-sm font-bold text-slate-200 mb-3">
          <i class="fa fa-bolt text-yellow-400 mr-2" aria-hidden="true"></i>{{ t('dashboard.energy_title') }}
        </div>
        <BarChart
          canvas-id="energyChart"
          :labels="eco.energyMix.categories.map(c => c.label)"
          :values="energyMixValues"
          :colors="eco.energyMix.categories.map(c => c.color)"
          :height="180"
          :y-max="40"
          :aria-label="t('dashboard.energy_aria')"
        />
      </EbCard>

      <!-- Température -->
      <EbCard v-if="isVisible('temperature')" extra-class="col-span-1 md:col-span-2">
        <div class="flex items-center justify-between mb-3">
          <div class="text-sm font-bold text-slate-200">
            <i class="fa fa-thermometer-half text-orange-400 mr-2" aria-hidden="true"></i>
            {{ t('dashboard.temp_title') }}
          </div>
          <span class="text-xs bg-orange-900/40 text-orange-400 px-2 py-0.5 rounded-full">{{ t('dashboard.temp_tag') }}</span>
        </div>
        <LineChart
          canvas-id="tempChart"
          :labels="tempLabels"
          :datasets="tempDatasets"
          :height="180"
          :current-year="gameStore.currentYear"
          :aria-label="t('dashboard.temp_aria')"
        />
      </EbCard>

      <!-- Ressources naturelles -->
      <EbCard v-if="isVisible('resources')" extra-class="col-span-1 md:col-span-2">
        <div class="flex items-center justify-between mb-3">
          <div class="text-sm font-bold text-slate-200">
            <i class="fa fa-mountain text-slate-400 mr-2" aria-hidden="true"></i>
            {{ t('dashboard.resources_title') }}
          </div>
          <span class="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full">Gt/an</span>
        </div>
        <LineChart
          canvas-id="resourceChart"
          :labels="resourceLabels"
          :datasets="resourceDatasets"
          :height="180"
          :show-legend="true"
          :current-year="gameStore.currentYear"
          :aria-label="t('dashboard.resources_aria')"
        />
      </EbCard>

    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import SectionTitle from '@/components/layout/SectionTitle.vue'
import EbCard from '@/components/layout/EbCard.vue'
import LineChart from '@/components/charts/LineChart.vue'
import GaugeChart from '@/components/charts/GaugeChart.vue'
import BarChart from '@/components/charts/BarChart.vue'

import { useGameStore } from '@/store/game.store'
import { useSimulationStore, SIM_LABELS } from '@/store/simulation.store'
import type { EcologicalCharts, ChartDataset, EnergyMixKey, ResourceKey } from '@/types/index'

const { t } = useI18n()
const gameStore = useGameStore()
const simulationStore = useSimulationStore()
const {
  cumulativeCo2, cumulativeCo2Pessimist,
  cumulativeTemp, cumulativeTempPessimist,
  cumulativeForest, cumulativeForestPessimist,
  cumulativeEnergyMix, cumulativeEnergyMixPessimist,
  cumulativeResources, cumulativeResourcesPessimist,
} = storeToRefs(simulationStore)

// Coefficient d'interpolation entre scénario décidé (0) et pessimiste (1).
// Valeur par défaut : 0.5 (intermédiaire). Rendre réactif plus tard si besoin.
const BLEND = 0.5

const props = withDefaults(defineProps<{
  eco:            EcologicalCharts
  visibleWidgets?: string[]
}>(), { visibleWidgets: () => [] })

function isVisible(id: string): boolean {
  return props.visibleWidgets.includes(id)
}

function interpolateAtYear(year: number, labels: number[], values: number[]): number {
  if (year <= labels[0]) return values[0]
  if (year >= labels[labels.length - 1]) return values[values.length - 1]
  for (let i = 0; i < labels.length - 1; i++) {
    if (year >= labels[i] && year <= labels[i + 1]) {
      const t = (year - labels[i]) / (labels[i + 1] - labels[i])
      return values[i] + t * (values[i + 1] - values[i])
    }
  }
  return values[values.length - 1]
}

function blendedAtYear(year: number, decided: number[], pessimist: number[]): number {
  const d = interpolateAtYear(year, SIM_LABELS, decided)
  const p = interpolateAtYear(year, SIM_LABELS, pessimist)
  return d * (1 - BLEND) + p * BLEND
}

// Années de projection > 2024 et ≤ currentYear
const projectionYearsAfter2024 = computed<number[]>(() => {
  const year = gameStore.currentYear
  if (year <= 2024) return []
  const years = SIM_LABELS.filter(y => y > 2024 && y <= year)
  if (!SIM_LABELS.includes(year)) years.push(year)
  return years.sort((a, b) => a - b)
})

// ─── CO₂ ──────────────────────────────────────────────────────────────────────

const co2Labels = computed<number[]>(() => [
  ...props.eco.co2.timeSeries.years,
  ...projectionYearsAfter2024.value,
])

const co2Datasets = computed<ChartDataset[]>(() => {
  const round1 = (v: number) => Math.round(v * 10) / 10
  const projValues = projectionYearsAfter2024.value.map(y =>
    round1(blendedAtYear(y, cumulativeCo2.value, cumulativeCo2Pessimist.value))
  )
  return [{
    label:           t('dashboard.co2_dataset'),
    data:            [...props.eco.co2.timeSeries.values, ...projValues],
    borderColor:     '#ff5050',
    backgroundColor: 'rgba(255,80,80,0.08)',
    fill:            true,
  }]
})

// ─── Température ──────────────────────────────────────────────────────────────

const tempLabels = computed<number[]>(() => [
  ...props.eco.temperature.timeSeries.years,
  ...projectionYearsAfter2024.value,
])

const tempDatasets = computed<ChartDataset[]>(() => {
  const round2 = (v: number) => Math.round(v * 100) / 100
  const projValues = projectionYearsAfter2024.value.map(y =>
    round2(blendedAtYear(y, cumulativeTemp.value, cumulativeTempPessimist.value))
  )
  return [{
    label:           t('dashboard.temp_dataset'),
    data:            [...props.eco.temperature.timeSeries.values, ...projValues],
    borderColor:     '#fb923c',
    backgroundColor: 'rgba(251,146,60,0.2)',
    fill:            true,
  }]
})

// ─── Forêt ────────────────────────────────────────────────────────────────────

const forestCurrent = computed<number>(() =>
  Math.round(blendedAtYear(gameStore.currentYear, cumulativeForest.value, cumulativeForestPessimist.value) * 10) / 10
)

// ─── Mix énergétique ─────────────────────────────────────────────────────────

const CATEGORY_KEY_MAP: Record<string, EnergyMixKey> = {
  'Charbon':    'coal',
  'Pétrole':   'oil',
  'Gaz':       'gas',
  'Nucléaire': 'nuclear',
  'Solaire':   'solar',
  'Éolien':   'wind',
  'Hydro':     'hydro',
  'Autres':    'autres',
}

const energyMixValues = computed<number[]>(() => {
  const raw = props.eco.energyMix.categories.map(cat => {
    const key = CATEGORY_KEY_MAP[cat.label]
    if (!key) return cat.value
    return blendedAtYear(gameStore.currentYear, cumulativeEnergyMix.value[key], cumulativeEnergyMixPessimist.value[key])
  })
  const total = raw.reduce((s, v) => s + v, 0)
  if (total <= 0) return raw
  return raw.map(v => Math.round(v / total * 1000) / 10)
})

// ─── Ressources naturelles ────────────────────────────────────────────────────

const RESOURCE_KEY_MAP: Record<string, ResourceKey> = {
  'Minéraux':              'minerals',
  'Biomasse':              'biomass',
  'Combustibles fossiles': 'fossilFuels',
}

const resourceLabels = computed<number[]>(() => [
  ...props.eco.resources.years,
  ...projectionYearsAfter2024.value,
])

const resourceDatasets = computed<ChartDataset[]>(() =>
  props.eco.resources.datasets.map(dataset => {
    const key = RESOURCE_KEY_MAP[dataset.label]
    if (!key) {
      return {
        label:           dataset.label,
        data:            [...dataset.values],
        borderColor:     dataset.color,
        backgroundColor: dataset.bgColor,
        fill:            true,
      }
    }
    const round1 = (v: number) => Math.round(v * 10) / 10
    const projValues = projectionYearsAfter2024.value.map(y =>
      round1(blendedAtYear(y, cumulativeResources.value[key], cumulativeResourcesPessimist.value[key]))
    )
    return {
      label:           dataset.label,
      data:            [...dataset.values, ...projValues],
      borderColor:     dataset.color,
      backgroundColor: dataset.bgColor,
      fill:            true,
    }
  })
)
</script>
