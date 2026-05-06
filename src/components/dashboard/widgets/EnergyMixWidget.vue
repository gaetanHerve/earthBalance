<template>
  <EbCard :extra-class="summaryMode ? '' : 'col-span-1 md:col-span-2'">
    <div class="flex items-center justify-between mb-3">
      <div class="text-sm font-bold text-slate-200">
        <i class="fa fa-bolt text-yellow-400 mr-2" aria-hidden="true"></i>{{ t('dashboard.energy_title') }}
      </div>
      <span class="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full">TWh</span>
    </div>

    <BarChart
      v-if="summaryMode"
      canvas-id="energyChart"
      :labels="series.categories.map(c => c.label)"
      :values="energyMixValues"
      :colors="series.categories.map(c => c.color)"
      :height="180"
      :aria-label="t('dashboard.energy_aria')"
    />

    <LineChart
      v-else
      canvas-id="energyLineChart"
      :labels="energyMixLabels"
      :datasets="energyMixDatasets"
      :show-legend="true"
      :height="180"
      :current-year="gameStore.currentYear"
      :y-min="0"
      :aria-label="t('dashboard.energy_aria')"
    />
  </EbCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import EbCard from '@/components/layout/EbCard.vue'
import LineChart from '@/components/charts/LineChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import { useGameStore } from '@/store/game.store'
import { useSimulationStore, SIM_LABELS } from '@/store/simulation.store'
import { blendedAtYear } from '@/utils/timeSeries'
import type { EnergyMixChartSeries, ChartDataset, EnergyMixKey } from '@/types/index'

const { t } = useI18n()

const props = defineProps<{
  series: EnergyMixChartSeries
  summaryMode: boolean
}>()

const gameStore = useGameStore()
const simStore = useSimulationStore()
const { cumulativeEnergyMix, cumulativeEnergyMixPessimist } = storeToRefs(simStore)

const PROJECTION_YEARS = SIM_LABELS.filter(y => y > 2024)

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
  const totalTWh = simStore.totalEnergyTWhAt(gameStore.currentYear)
  return props.series.categories.map(cat => {
    const key = CATEGORY_KEY_MAP[cat.label]
    if (!key) return cat.value
    const pct = blendedAtYear(gameStore.currentYear, SIM_LABELS, cumulativeEnergyMix.value[key], cumulativeEnergyMixPessimist.value[key])
    return Math.round(pct / 100 * totalTWh)
  })
})

const energyMixLabels = computed<number[]>(() => [
  ...props.series.timeSeries.years,
  ...PROJECTION_YEARS,
])

const energyMixDatasets = computed<ChartDataset[]>(() =>
  props.series.categories.map(cat => {
    const key = CATEGORY_KEY_MAP[cat.label] as EnergyMixKey | undefined
    const historical = key
      ? props.series.timeSeries.byCategory[key]
      : props.series.timeSeries.years.map(() => cat.value)
    const projValues = key
      ? PROJECTION_YEARS.map(y => {
          const totalTWh = simStore.totalEnergyTWhAt(y)
          const pct = blendedAtYear(y, SIM_LABELS, cumulativeEnergyMix.value[key], cumulativeEnergyMixPessimist.value[key])
          return Math.round(pct / 100 * totalTWh)
        })
      : []
    return {
      label:           cat.label,
      data:            [...historical, ...projValues],
      borderColor:     cat.color,
      backgroundColor: 'transparent',
      fill:            false,
      tension:         0.3,
      pointRadius:     2,
    }
  })
)
</script>
