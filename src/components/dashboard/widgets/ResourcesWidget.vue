<template>
  <EbCard :extra-class="summaryMode ? '' : 'col-span-1 md:col-span-2'">
    <div class="flex items-center justify-between mb-3">
      <div class="text-sm font-bold text-slate-200">
        <i class="fa fa-mountain text-slate-400 mr-2" aria-hidden="true"></i>
        {{ t('dashboard.resources_title') }}
      </div>
      <span class="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full">Gt</span>
    </div>

    <BarChart
      v-if="summaryMode"
      canvas-id="resourceBarChart"
      :labels="series.datasets.map(d => d.label)"
      :values="resourceBarValues"
      :colors="series.datasets.map(d => d.color)"
      :height="180"
      :aria-label="t('dashboard.resources_aria')"
    />

    <LineChart
      v-else
      canvas-id="resourceChart"
      :labels="resourceLabels"
      :datasets="resourceDatasets"
      :height="180"
      :show-legend="true"
      :current-year="gameStore.currentYear"
      :aria-label="t('dashboard.resources_aria')"
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
import type { EcologicalCharts, ChartDataset, ResourceKey } from '@/types/index'

const { t } = useI18n()

const props = defineProps<{
  series: EcologicalCharts['resources']
  summaryMode: boolean
}>()

const gameStore = useGameStore()
const simStore = useSimulationStore()
const { cumulativeResources, cumulativeResourcesPessimist } = storeToRefs(simStore)

const PROJECTION_YEARS = SIM_LABELS.filter(y => y > 2024)

const RESOURCE_KEY_MAP: Record<string, ResourceKey> = {
  'Minéraux':              'minerals',
  'Biomasse':              'biomass',
  'Combustibles fossiles': 'fossilFuels',
}

const resourceBarValues = computed<number[]>(() =>
  props.series.datasets.map(dataset => {
    const key = RESOURCE_KEY_MAP[dataset.label]
    if (!key) return dataset.values[dataset.values.length - 1]
    return Math.round(blendedAtYear(gameStore.currentYear, SIM_LABELS, cumulativeResources.value[key], cumulativeResourcesPessimist.value[key]) * 10) / 10
  })
)

const resourceLabels = computed<number[]>(() => [
  ...props.series.years,
  ...PROJECTION_YEARS,
])

const resourceDatasets = computed<ChartDataset[]>(() =>
  props.series.datasets.map(dataset => {
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
    const projValues = PROJECTION_YEARS.map(y =>
      round1(blendedAtYear(y, SIM_LABELS, cumulativeResources.value[key], cumulativeResourcesPessimist.value[key]))
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
