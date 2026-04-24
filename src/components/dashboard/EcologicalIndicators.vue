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
          :show-legend="hasProjection"
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
          :value="eco.forest.current"
          :max="100"
          track-color="#00ff88"
          :size="140"
          :font-size="26"
          :unit="t('dashboard.forest_remaining')"
          :aria-label="`${t('dashboard.forest_title')} : ${eco.forest.current}%`"
        >
          <span class="text-2xl font-black text-eb-green">{{ eco.forest.current }}%</span>
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
          :values="eco.energyMix.categories.map(c => c.value)"
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
          :show-legend="hasProjection"
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
import { useSimulationStore, SIM_LABELS, BASELINE_CO2, BASELINE_TEMP } from '@/store/simulation.store'
import type { EcologicalCharts, ChartDataset } from '@/types/index'

const { t } = useI18n()
const gameStore = useGameStore()
const simulationStore = useSimulationStore()
const { cumulativeCo2, cumulativeCo2Pessimist, cumulativeTemp, cumulativeTempPessimist } = storeToRefs(simulationStore)

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

// Années de projection > 2024 et ≤ currentYear
const projectionYearsAfter2024 = computed<number[]>(() => {
  const year = gameStore.currentYear
  if (year <= 2024) return []
  const years = SIM_LABELS.filter(y => y > 2024 && y <= year)
  if (!SIM_LABELS.includes(year)) years.push(year)
  return years.sort((a, b) => a - b)
})

const hasProjection = computed(() => projectionYearsAfter2024.value.length > 0)

// ─── CO₂ ──────────────────────────────────────────────────────────────────────

const co2Labels = computed<number[]>(() => [
  ...props.eco.co2.timeSeries.years,
  ...projectionYearsAfter2024.value,
])

const co2Datasets = computed<ChartDataset[]>(() => {
  const histYears  = props.eco.co2.timeSeries.years
  const histValues = props.eco.co2.timeSeries.values
  const projYears  = projectionYearsAfter2024.value
  const nullsBefore = Array<null>(histYears.length - 1).fill(null)

  const round1 = (v: number) => Math.round(v * 10) / 10
  const decided   = [round1(interpolateAtYear(2024, SIM_LABELS, cumulativeCo2.value)),
                     ...projYears.map(y => round1(interpolateAtYear(y, SIM_LABELS, cumulativeCo2.value)))]
  const pessimist = [round1(interpolateAtYear(2024, SIM_LABELS, cumulativeCo2Pessimist.value)),
                     ...projYears.map(y => round1(interpolateAtYear(y, SIM_LABELS, cumulativeCo2Pessimist.value)))]

  const datasets: ChartDataset[] = [
    {
      label:           t('dashboard.co2_dataset'),
      data:            [...histValues, ...projYears.map(() => null)],
      borderColor:     '#ff5050',
      backgroundColor: 'rgba(255,80,80,0.08)',
      fill:            true,
      borderDash:      [],
    },
  ]

  if (hasProjection.value) {
    datasets.push(
      {
        label:           t('dashboard.scenario_decided'),
        data:            [...nullsBefore, ...decided],
        borderColor:     '#ff5050',
        backgroundColor: 'rgba(255,80,80,0.05)',
        fill:            false,
        borderDash:      [6, 3],
        pointRadius:     2,
      },
      {
        label:           t('dashboard.scenario_pessimist'),
        data:            [...nullsBefore, ...pessimist],
        borderColor:     'rgba(255,80,80,0.45)',
        backgroundColor: 'transparent',
        fill:            false,
        borderDash:      [2, 4],
        pointRadius:     0,
      },
    )
  }

  return datasets
})

// ─── Température ──────────────────────────────────────────────────────────────

const tempLabels = computed<number[]>(() => [
  ...props.eco.temperature.timeSeries.years,
  ...projectionYearsAfter2024.value,
])

const tempDatasets = computed<ChartDataset[]>(() => {
  const histYears  = props.eco.temperature.timeSeries.years
  const histValues = props.eco.temperature.timeSeries.values
  const projYears  = projectionYearsAfter2024.value
  const nullsBefore = Array<null>(histYears.length - 1).fill(null)

  const round2 = (v: number) => Math.round(v * 100) / 100
  const decided   = [round2(interpolateAtYear(2024, SIM_LABELS, cumulativeTemp.value)),
                     ...projYears.map(y => round2(interpolateAtYear(y, SIM_LABELS, cumulativeTemp.value)))]
  const pessimist = [round2(interpolateAtYear(2024, SIM_LABELS, cumulativeTempPessimist.value)),
                     ...projYears.map(y => round2(interpolateAtYear(y, SIM_LABELS, cumulativeTempPessimist.value)))]

  const datasets: ChartDataset[] = [
    {
      label:           t('dashboard.temp_dataset'),
      data:            [...histValues, ...projYears.map(() => null)],
      borderColor:     '#fb923c',
      backgroundColor: 'rgba(251,146,60,0.2)',
      fill:            true,
      borderDash:      [],
    },
  ]

  if (hasProjection.value) {
    datasets.push(
      {
        label:           t('dashboard.scenario_decided'),
        data:            [...nullsBefore, ...decided],
        borderColor:     '#fb923c',
        backgroundColor: 'rgba(251,146,60,0.08)',
        fill:            false,
        borderDash:      [6, 3],
        pointRadius:     2,
      },
      {
        label:           t('dashboard.scenario_pessimist'),
        data:            [...nullsBefore, ...pessimist],
        borderColor:     'rgba(251,146,60,0.4)',
        backgroundColor: 'transparent',
        fill:            false,
        borderDash:      [2, 4],
        pointRadius:     0,
      },
    )
  }

  return datasets
})
</script>
