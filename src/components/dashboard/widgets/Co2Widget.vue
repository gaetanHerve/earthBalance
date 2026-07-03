<template>
  <EbCard :extra-class="summaryMode ? 'flex flex-col items-center justify-center' : 'col-span-1 md:col-span-2'">
    <div class="flex items-center justify-between mb-3 w-full">
      <div class="text-sm font-bold text-slate-200">
        <i class="fa fa-smog text-red-400 mr-2" aria-hidden="true"></i>{{ t('dashboard.co2_title') }}
      </div>
      <span v-if="!summaryMode" class="text-xs bg-red-900/40 text-red-400 px-2 py-0.5 rounded-full">GtCO₂eq/an</span>
    </div>

    <template v-if="summaryMode">
      <GaugeChart
        canvas-id="co2Gauge"
        :value="co2Current"
        :max="130"
        track-color="#ff5050"
        :size="140"
        :font-size="22"
        unit="GtCO₂eq/an"
        :aria-label="`${t('dashboard.co2_title')} : ${co2Current} GtCO₂eq/an`"
      >
        <span class="text-2xl font-black text-red-400">{{ co2Current }}</span>
        <span class="text-xs text-slate-500 mt-0.5">GtCO₂eq/an</span>
      </GaugeChart>
      <div class="mt-3 text-xs text-slate-500 text-center">{{ t('dashboard.co2_ref') }}</div>
    </template>

    <LineChart
      v-else
      canvas-id="co2Chart"
      :labels="co2Labels"
      :datasets="co2Datasets"
      :height="180"
      :current-year="gameStore.currentYear"
      :aria-label="t('dashboard.co2_aria')"
    />
    <div class="mt-1 text-[10px] text-slate-600 text-right">{{ t('dashboard.co2_source_ref') }}</div>
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
import { useSimulationStore, SIM_LABELS, BASELINE_CO2 } from '@/store/simulation.store'
import { blendedAtYear } from '@/utils/timeSeries'
import type { ChartSeries, ChartDataset } from '@/types/index'

const { t } = useI18n()

const props = defineProps<{
  series: ChartSeries
  summaryMode: boolean
}>()

const gameStore = useGameStore()
const simStore = useSimulationStore()
const { cumulativeCo2, cumulativeCo2Pessimist } = storeToRefs(simStore)

const PROJECTION_YEARS = SIM_LABELS.filter(y => y > 2024)

const co2Current = computed<number>(() =>
  Math.round(blendedAtYear(gameStore.currentYear, SIM_LABELS, cumulativeCo2.value, cumulativeCo2Pessimist.value) * 10) / 10
)

const co2Labels = computed<number[]>(() => [
  ...props.series.timeSeries.years,
  ...PROJECTION_YEARS,
])

const co2Datasets = computed<ChartDataset[]>(() => {
  const round1     = (v: number) => Math.round(v * 10) / 10
  const hist       = props.series.timeSeries.values
  const projValues = PROJECTION_YEARS.map(y =>
    round1(blendedAtYear(y, SIM_LABELS, cumulativeCo2.value, cumulativeCo2Pessimist.value))
  )
  return [
    {
      label:           t('dashboard.co2_dataset'),
      data:            [...hist, ...projValues],
      borderColor:     '#ff5050',
      backgroundColor: 'rgba(255,80,80,0.08)',
      fill:            true,
    },
    {
      label:           t('dashboard.baseline_label'),
      data:            [...new Array(hist.length - 1).fill(null), hist.at(-1)!, ...BASELINE_CO2.slice(1)],
      borderColor:     'rgba(148,163,184,0.55)',
      backgroundColor: 'transparent',
      borderDash:      [6, 4],
      fill:            false,
      pointRadius:     0,
    },
  ]
})
</script>
