<template>
  <EbCard :extra-class="summaryMode ? 'flex flex-col items-center justify-center' : 'col-span-1 md:col-span-2'">
    <div class="flex items-center justify-between mb-3 w-full">
      <div class="text-sm font-bold text-slate-200">
        <i class="fa fa-thermometer-half text-orange-400 mr-2" aria-hidden="true"></i>
        {{ t('dashboard.temp_title') }}
      </div>
      <span v-if="!summaryMode" class="text-xs bg-orange-900/40 text-orange-400 px-2 py-0.5 rounded-full">{{ t('dashboard.temp_tag') }}</span>
    </div>

    <template v-if="summaryMode">
      <GaugeChart
        canvas-id="tempGauge"
        :value="tempCurrent"
        :max="4"
        track-color="#fb923c"
        :size="140"
        :font-size="26"
        unit="°C"
        :aria-label="`${t('dashboard.temp_title')} : ${tempCurrent}°C`"
      >
        <span class="text-2xl font-black text-orange-400">{{ tempCurrent }}</span>
        <span class="text-xs text-slate-500 mt-0.5">°C</span>
      </GaugeChart>
      <div class="mt-3 text-xs text-slate-500 text-center">Seuil Paris : 1,5°C</div>
    </template>

    <LineChart
      v-else
      canvas-id="tempChart"
      :labels="tempLabels"
      :datasets="tempDatasets"
      :height="180"
      :current-year="gameStore.currentYear"
      :events="tempEvents"
      :aria-label="t('dashboard.temp_aria')"
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
import { useSimulationStore, SIM_LABELS, BASELINE_TEMP } from '@/store/simulation.store'
import { useTippingPointsStore } from '@/store/tippingPoints.store'
import { blendedAtYear } from '@/utils/timeSeries'
import type { ChartSeries, ChartDataset } from '@/types/index'

const { t } = useI18n()

const props = defineProps<{
  series: ChartSeries
  summaryMode: boolean
}>()

const gameStore = useGameStore()
const simStore = useSimulationStore()
const { cumulativeTemp, cumulativeTempPessimist } = storeToRefs(simStore)
const tippingStore = useTippingPointsStore()
const { triggeredList } = storeToRefs(tippingStore)

const PROJECTION_YEARS = SIM_LABELS.filter(y => y > 2024)

const triggeredMap = computed(() => new Map(triggeredList.value.map(tp => [tp.id, tp.year])))

const tempCurrent = computed<number>(() =>
  Math.round(blendedAtYear(gameStore.currentYear, SIM_LABELS, cumulativeTemp.value, cumulativeTempPessimist.value) * 100) / 100
)

const tempLabels = computed<number[]>(() => [
  ...props.series.timeSeries.years,
  ...PROJECTION_YEARS,
])

// Années de déclenchement des TPs liés à la température (pour traits verticaux)
const tempEvents = computed(() =>
  (['tp-permafrost', 'tp-coral', 'tp-arctic', 'tp-amoc'] as const)
    .flatMap(id => {
      const year = triggeredMap.value.get(id)
      return year !== undefined ? [{ year, color: '#ff5050' }] : []
    })
)

const tempDatasets = computed<ChartDataset[]>(() => {
  const round2     = (v: number) => Math.round(v * 100) / 100
  const hist       = props.series.timeSeries.values
  const allLabels  = tempLabels.value
  const projValues = PROJECTION_YEARS.map(y =>
    round2(blendedAtYear(y, SIM_LABELS, cumulativeTemp.value, cumulativeTempPessimist.value))
  )
  const amocTriggered = triggeredMap.value.has('tp-amoc')
  return [
    {
      label:           t('dashboard.temp_dataset'),
      data:            [...hist, ...projValues],
      borderColor:     '#fb923c',
      backgroundColor: 'rgba(251,146,60,0.2)',
      fill:            true,
    },
    {
      label:           t('dashboard.baseline_label'),
      data:            [...new Array(hist.length - 1).fill(null), hist.at(-1)!, ...BASELINE_TEMP.slice(1)],
      borderColor:     'rgba(148,163,184,0.55)',
      backgroundColor: 'transparent',
      borderDash:      [6, 4],
      fill:            false,
      pointRadius:     0,
    },
    {
      label:       t('tipping.tp_group_1_5c'),
      data:        allLabels.map(() => 1.5),
      borderColor: triggeredMap.value.has('tp-arctic') ? '#ff5050' : '#a78bfa',
      backgroundColor: 'transparent',
      borderDash:  [3, 4],
      fill:        false,
      tension:     0,
      pointRadius: 0,
    },
    {
      label:       `${t('tipping.tp-amoc.name')} (3°C)`,
      data:        allLabels.map(() => 3),
      borderColor: amocTriggered ? '#ff5050' : '#a78bfa',
      backgroundColor: 'transparent',
      borderDash:  [3, 4],
      fill:        false,
      tension:     0,
      pointRadius: 0,
    },
  ]
})
</script>
