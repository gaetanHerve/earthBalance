<template>
  <EbCard :extra-class="`flex flex-col${summaryMode ? '' : ' col-span-1 md:col-span-2'}`">
    <div class="flex items-center justify-between mb-3">
      <div class="text-sm font-bold text-slate-200">
        <i class="fa fa-bolt text-orange-400 mr-2" aria-hidden="true"></i>{{ t('dashboard.extremes_section') }}
      </div>
      <span v-if="!summaryMode" class="text-xs bg-orange-900/40 text-orange-400 px-2 py-0.5 rounded-full">indice</span>
    </div>

    <template v-if="summaryMode">
      <div class="grid grid-cols-3 gap-2 mb-3">
        <div
          v-for="m in extremesMetrics"
          :key="m.valueKey"
          class="flex flex-col items-center gap-1.5"
        >
          <div
            class="w-full aspect-square flex items-center justify-center rounded-lg border border-eb-border bg-eb-mid/60"
            :title="t(m.labelKey)"
          >
            <span class="text-xl font-black text-orange-400 tabular-nums">{{ t(m.valueKey) }}</span>
          </div>
          <span class="text-[9px] text-slate-400 text-center leading-snug">{{ t(m.shortKey) }}</span>
        </div>
      </div>
      <p class="mt-auto text-[10px] text-slate-500 leading-relaxed">
        <i class="fa fa-earth-europe text-orange-400/70 mr-1" aria-hidden="true"></i>
        {{ t('dashboard.extremes_exposure') }}
      </p>
    </template>

    <template v-else>
      <LineChart
        canvas-id="extremesChart"
        :labels="series.timeSeries.years"
        :datasets="extremesDatasets"
        :height="180"
        :current-year="gameStore.currentYear"
        :y-min="0"
        :aria-label="t('dashboard.extremes_proj_aria')"
      />
      <div class="mt-1 text-[10px] text-slate-600 text-right">
        {{ t('dashboard.extremes_proj_ref') }}
      </div>
    </template>
  </EbCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import EbCard from '@/components/layout/EbCard.vue'
import LineChart from '@/components/charts/LineChart.vue'
import { useGameStore } from '@/store/game.store'
import { useTippingPointsStore } from '@/store/tippingPoints.store'
import { SIM_LABELS } from '@/store/simulation.store'
import type { ChartSeries, ChartDataset } from '@/types/index'

const { t } = useI18n()

const props = defineProps<{
  series: ChartSeries
  summaryMode: boolean
}>()

const gameStore = useGameStore()
const tippingStore = useTippingPointsStore()
const { extremesOffset } = storeToRefs(tippingStore)

const extremesMetrics = [
  { valueKey: 'dashboard.extremes_m1_value', shortKey: 'dashboard.extremes_m1_short', labelKey: 'dashboard.extremes_m1_label' },
  { valueKey: 'dashboard.extremes_m2_value', shortKey: 'dashboard.extremes_m2_short', labelKey: 'dashboard.extremes_m2_label' },
  { valueKey: 'dashboard.extremes_m3_value', shortKey: 'dashboard.extremes_m3_short', labelKey: 'dashboard.extremes_m3_label' },
]

// Applique l'offset AMOC (amplification des extrêmes) aux années de projection 2025→2100
const dynamicValues = computed<number[]>(() =>
  props.series.timeSeries.years.map((year, i) => {
    const simIdx = SIM_LABELS.indexOf(year)
    if (simIdx === -1) return props.series.timeSeries.values[i]
    return props.series.timeSeries.values[i] + extremesOffset.value[simIdx]
  })
)

const extremesDatasets = computed<ChartDataset[]>(() => [{
  label:           t('dashboard.extremes_section'),
  data:            dynamicValues.value,
  borderColor:     '#fb923c',
  backgroundColor: 'rgba(251,146,60,0.08)',
  fill:            true,
}])
</script>
