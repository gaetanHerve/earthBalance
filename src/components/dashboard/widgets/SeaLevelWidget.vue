<template>
  <EbCard :extra-class="summaryMode ? 'flex flex-col items-center justify-center' : 'col-span-1 md:col-span-2'">
    <div class="flex items-center justify-between mb-3 w-full">
      <div class="text-sm font-bold text-slate-200">
        <i class="fa fa-water text-blue-400 mr-2" aria-hidden="true"></i>{{ t('dashboard.sea_level_title') }}
      </div>
      <span v-if="!summaryMode" class="text-xs bg-blue-900/40 text-blue-400 px-2 py-0.5 rounded-full">mm</span>
    </div>

    <template v-if="summaryMode">
      <GaugeChart
        canvas-id="seaLevelGauge"
        :value="seaLevelCurrent"
        :max="1000"
        track-color="#60a5fa"
        :size="140"
        :font-size="20"
        unit="mm"
        :aria-label="`${t('dashboard.sea_level_title')} : +${seaLevelCurrent} mm`"
      >
        <span class="text-2xl font-black text-blue-400">+{{ seaLevelCurrent }}</span>
        <span class="text-xs text-slate-500 mt-0.5">mm</span>
      </GaugeChart>
      <div class="mt-3 text-xs text-slate-500 text-center">{{ t('dashboard.sea_level_gauge_note') }}</div>
    </template>

    <template v-else>
      <LineChart
        canvas-id="seaLevelChart"
        :labels="seaLevelLabels"
        :datasets="seaLevelDatasets"
        :height="180"
        :current-year="gameStore.currentYear"
        :y-min="0"
        :aria-label="t('dashboard.sea_level_aria')"
      />
      <div class="mt-1 text-[10px] text-slate-600 text-right">
        {{ t('dashboard.sea_level_ref') }}
      </div>
    </template>
  </EbCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import EbCard from '@/components/layout/EbCard.vue'
import LineChart from '@/components/charts/LineChart.vue'
import GaugeChart from '@/components/charts/GaugeChart.vue'
import { useGameStore } from '@/store/game.store'
import { interpolateAtYear } from '@/utils/timeSeries'
import type { EcologicalCharts, ChartDataset } from '@/types/index'

const { t } = useI18n()

const props = defineProps<{
  series: EcologicalCharts['seaLevel']
  summaryMode: boolean
}>()

const gameStore = useGameStore()

const seaLevelCurrent = computed<number>(() =>
  Math.round(interpolateAtYear(
    gameStore.currentYear,
    props.series.timeSeries.years,
    props.series.timeSeries.values,
  ))
)

const seaLevelLabels = computed<number[]>(() => props.series.timeSeries.years)

const seaLevelDatasets = computed<ChartDataset[]>(() => [{
  label:           t('dashboard.sea_level_title'),
  data:            props.series.timeSeries.values,
  borderColor:     '#60a5fa',
  backgroundColor: 'rgba(96,165,250,0.08)',
  fill:            true,
}])
</script>
