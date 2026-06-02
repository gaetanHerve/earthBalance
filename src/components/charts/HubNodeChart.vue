<template>
  <LineChart
    :canvas-id="`hub-panel-${chartType}`"
    :labels="SIM_LABELS"
    :datasets="datasets"
    :height="150"
    :y-min="chartMeta.yMin"
    :y-max="chartMeta.yMax"
    :current-year="gameStore.currentYear"
    :events="tpEvents"
    :show-legend="true"
    :aria-label="ariaLabel ?? chartType"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import LineChart from './LineChart.vue'
import { useGameStore } from '@/store/game.store'
import {
  useSimulationStore,
  SIM_LABELS,
  BASELINE_CO2,
  BASELINE_TEMP,
  BASELINE_FOREST,
  BASELINE_ENERGY_MIX,
  BASELINE_FOOD_SECURITY,
  BASELINE_WATER_ACCESS,
} from '@/store/simulation.store'
import { useTippingPointsStore } from '@/store/tippingPoints.store'
import type { HubChartType } from '@/data/hubGraph'
import type { ChartDataset, EnergyMixKey } from '@/types/index'

const props = defineProps<{
  chartType:  HubChartType
  ariaLabel?: string
}>()

const { t }     = useI18n()
const gameStore = useGameStore()
const simStore  = useSimulationStore()
const tpStore   = useTippingPointsStore()

const {
  simCumulativeCo2,       simCumulativeCo2Pessimist,
  simCumulativeTemp,      simCumulativeTempPessimist,
  cumulativeForest,       cumulativeForestPessimist,
  cumulativeEnergyMix,    cumulativeEnergyMixPessimist,
  cumulativeFoodSecurity, cumulativeFoodSecurityPessimist,
  cumulativeWaterAccess,  cumulativeWaterAccessPessimist,
} = storeToRefs(simStore)

const { triggeredList } = storeToRefs(tpStore)

const triggeredMap = computed(() =>
  new Map(triggeredList.value.map(tp => [tp.id, tp.year]))
)

// ─── Renouvelables (solaire + éolien + hydraulique) ───────────────────────────

const RENEW_KEYS: EnergyMixKey[] = ['solar', 'wind', 'hydro']

function sumRenewables(mix: Record<EnergyMixKey, number[]>): (number | null)[] {
  return SIM_LABELS.map((_, i) => {
    if (i >= mix.solar.length) return null
    return Math.round(RENEW_KEYS.reduce((s, k) => s + mix[k][i], 0) * 10) / 10
  })
}

const baselineRenewables = sumRenewables(BASELINE_ENERGY_MIX)

// ─── Datasets baseline / décidé / pessimiste ──────────────────────────────────

function makeDatasets(
  baseline:  (number | null)[],
  decided:   (number | null)[],
  pessimist: (number | null)[],
): ChartDataset[] {
  return [
    {
      label:           t('simulator.legend_baseline'),
      data:            baseline,
      borderColor:     '#64748b',
      backgroundColor: 'transparent',
      fill:            false,
      tension:         0.4,
      pointRadius:     1,
      borderDash:      [4, 3],
    },
    {
      label:           t('simulator.legend_decided'),
      data:            decided,
      borderColor:     '#00ff88',
      backgroundColor: 'rgba(0,255,136,0.08)',
      fill:            false,
      tension:         0.4,
      pointRadius:     2,
    },
    {
      label:           t('simulator.legend_pessimist'),
      data:            pessimist,
      borderColor:     '#f87171',
      backgroundColor: 'transparent',
      fill:            false,
      tension:         0.4,
      pointRadius:     1,
    },
  ]
}

// ─── Datasets mix énergétique détaillé ───────────────────────────────────────

const ENERGY_MIX_COLORS: Record<EnergyMixKey, string> = {
  coal:    '#78716c',
  oil:     '#f97316',
  gas:     '#fbbf24',
  nuclear: '#a78bfa',
  solar:   '#fde047',
  wind:    '#60a5fa',
  hydro:   '#34d399',
  autres:  '#94a3b8',
}

const ALL_MIX_KEYS: EnergyMixKey[] = ['coal', 'oil', 'gas', 'nuclear', 'solar', 'wind', 'hydro', 'autres']

function energyMixDatasets(): ChartDataset[] {
  return ALL_MIX_KEYS.map(key => ({
    label:           t(`dashboard.energy_sources.${key}`),
    data:            SIM_LABELS.map((_, i) => cumulativeEnergyMix.value[key][i] ?? null),
    borderColor:     ENERGY_MIX_COLORS[key],
    backgroundColor: 'transparent',
    fill:            false,
    tension:         0.4,
    pointRadius:     1,
  }))
}

// ─── Computed final ───────────────────────────────────────────────────────────

const datasets = computed<ChartDataset[]>(() => {
  switch (props.chartType) {
    case 'co2':
      return makeDatasets(BASELINE_CO2, simCumulativeCo2.value, simCumulativeCo2Pessimist.value)
    case 'temp':
      return makeDatasets(BASELINE_TEMP, simCumulativeTemp.value, simCumulativeTempPessimist.value)
    case 'forest':
      return makeDatasets(BASELINE_FOREST, cumulativeForest.value, cumulativeForestPessimist.value)
    case 'renewables':
      return makeDatasets(
        baselineRenewables,
        sumRenewables(cumulativeEnergyMix.value),
        sumRenewables(cumulativeEnergyMixPessimist.value),
      )
    case 'energyMixBreakdown':
      return energyMixDatasets()
    case 'food':
      return makeDatasets(BASELINE_FOOD_SECURITY, cumulativeFoodSecurity.value, cumulativeFoodSecurityPessimist.value)
    case 'water':
      return makeDatasets(BASELINE_WATER_ACCESS, cumulativeWaterAccess.value, cumulativeWaterAccessPessimist.value)
    default:
      return []
  }
})

// ─── Événements tipping ───────────────────────────────────────────────────────

const tpEvents = computed<{ year: number; color: string }[]>(() => {
  if (props.chartType === 'temp') {
    return (['tp-permafrost', 'tp-coral', 'tp-arctic', 'tp-amoc'] as const).flatMap(id => {
      const year = triggeredMap.value.get(id)
      return year !== undefined ? [{ year, color: '#ff5050' }] : []
    })
  }
  if (props.chartType === 'forest') {
    const year = triggeredMap.value.get('tp-amazon')
    return year !== undefined ? [{ year, color: '#ff5050' }] : []
  }
  return []
})

// ─── Bornes Y ─────────────────────────────────────────────────────────────────

const chartMeta = computed<{ yMin?: number; yMax?: number }>(() => {
  switch (props.chartType) {
    case 'co2':               return { yMin: 15,  yMax: 75  }
    case 'temp':              return { yMin: 1.0, yMax: 4.5 }
    case 'forest':            return { yMin: 20,  yMax: 80  }
    case 'renewables':        return { yMin: 0,   yMax: 100 }
    case 'energyMixBreakdown':return { yMin: 0,   yMax: 45  }
    case 'food':              return { yMin: 40,  yMax: 70  }
    case 'water':             return { yMin: 60,  yMax: 90  }
    default:                  return {}
  }
})
</script>
