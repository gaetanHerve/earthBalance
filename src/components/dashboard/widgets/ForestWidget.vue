<template>
  <EbCard :extra-class="summaryMode ? 'flex flex-col items-center justify-center' : 'col-span-1 md:col-span-2'">
    <div class="flex items-center justify-between mb-3 w-full">
      <div class="text-sm font-bold text-slate-200">
        <i class="fa fa-tree text-eb-green mr-2" aria-hidden="true"></i>{{ t('dashboard.forest_title') }}
      </div>
      <span v-if="!summaryMode" class="text-xs bg-green-900/40 text-green-400 px-2 py-0.5 rounded-full">% prim.</span>
    </div>

    <template v-if="summaryMode">
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
        {{ t('dashboard.forest_ref', { threshold: series.criticalThreshold }) }}
      </div>
    </template>

    <LineChart
      v-else
      canvas-id="forestLineChart"
      :labels="forestLabels"
      :datasets="forestDatasets"
      :height="180"
      :current-year="gameStore.currentYear"
      :y-min="20"
      :y-max="80"
      :aria-label="t('dashboard.forest_aria')"
    />
  </EbCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import EbCard from '@/components/layout/EbCard.vue'
import LineChart from '@/components/charts/LineChart.vue'
import GaugeChart from '@/components/charts/GaugeChart.vue'
import { useGameStore } from '@/store/game.store'
import { useSimulationStore, SIM_LABELS } from '@/store/simulation.store'
import { blendedAtYear } from '@/utils/timeSeries'
import type { ForestChartSeries, ChartDataset } from '@/types/index'

const { t } = useI18n()

const props = defineProps<{
  series: ForestChartSeries
  summaryMode: boolean
}>()

const gameStore = useGameStore()
const simStore = useSimulationStore()
const { cumulativeForest, cumulativeForestPessimist } = storeToRefs(simStore)

const PROJECTION_YEARS = SIM_LABELS.filter(y => y > 2024)

const forestCurrent = computed<number>(() =>
  Math.round(blendedAtYear(gameStore.currentYear, SIM_LABELS, cumulativeForest.value, cumulativeForestPessimist.value) * 10) / 10
)

const forestLabels = computed<number[]>(() => [
  ...props.series.timeSeries.years,
  ...PROJECTION_YEARS,
])

const forestDatasets = computed<ChartDataset[]>(() => {
  const round1 = (v: number) => Math.round(v * 10) / 10
  const projValues = PROJECTION_YEARS.map(y =>
    round1(blendedAtYear(y, SIM_LABELS, cumulativeForest.value, cumulativeForestPessimist.value))
  )
  return [{
    label:           t('dashboard.forest_title'),
    data:            [...props.series.timeSeries.values, ...projValues],
    borderColor:     '#00ff88',
    backgroundColor: 'rgba(0,255,136,0.08)',
    fill:            true,
  }]
})
</script>
