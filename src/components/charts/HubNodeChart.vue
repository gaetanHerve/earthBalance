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
  useSimulationStore, SIM_LABELS,
  BASELINE_CO2, BASELINE_TEMP, BASELINE_FOREST, BASELINE_ENERGY_MIX,
  BASELINE_FOOD_SECURITY, BASELINE_WATER_ACCESS,
  BASELINE_LIFE_EXPECTANCY, BASELINE_RESPIRATORY_DISEASES, BASELINE_WHO_HEALTH_INDEX,
  BASELINE_RESOURCE_CONFLICTS, BASELINE_WATER_TENSIONS, BASELINE_CLIMATE_MIGRATIONS,
  BASELINE_GINI_COEFFICIENT, BASELINE_WEALTH_CONCENTRATION, BASELINE_EDUCATION_ACCESS,
} from '@/store/simulation.store'
import { useTippingPointsStore } from '@/store/tippingPoints.store'
import { useDashboardStore } from '@/store/dashboard.store'
import { interpolateAtYear } from '@/utils/timeSeries'
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
const dashStore = useDashboardStore()

const {
  simCumulativeCo2,
  simCumulativeTemp,
  cumulativeForest,
  cumulativeEnergyMix,
  cumulativeFoodSecurity,
  cumulativeWaterAccess,
  cumulativeLifeExpectancy,
  cumulativeRespiratoryDiseases,
  cumulativeWhoHealthIndex,
  cumulativeResourceConflicts,
  cumulativeWaterTensions,
  cumulativeClimateMigrations,
  cumulativeGiniCoefficient,
  cumulativeWealthConcentration,
  cumulativeEducationAccess,
} = storeToRefs(simStore)

const { triggeredList, extremesOffset } = storeToRefs(tpStore)

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

// ─── Datasets baseline / décidé ───────────────────────────────────────────────

function makeDatasets(
  baseline:     (number | null)[],
  decided:      (number | null)[],
  decidedLabel: string,
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
      label:           decidedLabel,
      data:            decided,
      borderColor:     '#00ff88',
      backgroundColor: 'rgba(0,255,136,0.08)',
      fill:            false,
      tension:         0.4,
      pointRadius:     2,
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
      return makeDatasets(BASELINE_CO2, simCumulativeCo2.value, t('hub.nodes.co2.label'))
    case 'temp':
      return makeDatasets(BASELINE_TEMP, simCumulativeTemp.value, t('hub.nodes.temp.label'))
    case 'forest':
      return makeDatasets(BASELINE_FOREST, cumulativeForest.value, t('hub.nodes.forest.label'))
    case 'renewables':
      return makeDatasets(
        baselineRenewables,
        sumRenewables(cumulativeEnergyMix.value),
        t('hub.nodes.energy-mix.unit'),
      )
    case 'energyMixBreakdown':
      return energyMixDatasets()
    case 'food':
      return makeDatasets(BASELINE_FOOD_SECURITY, cumulativeFoodSecurity.value, t('hub.nodes.food.label'))
    case 'water':
      return makeDatasets(BASELINE_WATER_ACCESS, cumulativeWaterAccess.value, t('hub.nodes.water.label'))
    case 'extremes': {
      const ts = dashStore.ecologicalCharts?.extremes.timeSeries
      if (!ts) return []
      const data = SIM_LABELS.map((y, i) => {
        const base = interpolateAtYear(y, ts.years, ts.values)
        return Math.round((base + (extremesOffset.value[i] ?? 0)) * 10) / 10
      })
      return [{
        label:           t('dashboard.extremes_section'),
        data,
        borderColor:     '#fb923c',
        backgroundColor: 'rgba(251,146,60,0.08)',
        fill:            true,
        tension:         0.4,
        pointRadius:     1,
      }]
    }
    case 'sea-level': {
      const ts = dashStore.ecologicalCharts?.seaLevel.timeSeries
      if (!ts) return []
      const data = SIM_LABELS.map(y => Math.round(interpolateAtYear(y, ts.years, ts.values)))
      return [{
        label:           t('hub.charts.sea-level.label'),
        data,
        borderColor:     '#00e5ff',
        backgroundColor: 'rgba(0,229,255,0.08)',
        fill:            true,
        tension:         0.4,
        pointRadius:     1,
      }]
    }
    case 'life-expectancy':
      return makeDatasets(BASELINE_LIFE_EXPECTANCY, cumulativeLifeExpectancy.value, t('hub.charts.life-expectancy.label'))
    case 'respiratory-diseases':
      return makeDatasets(BASELINE_RESPIRATORY_DISEASES, cumulativeRespiratoryDiseases.value, t('hub.charts.respiratory-diseases.label'))
    case 'who-health-index':
      return makeDatasets(BASELINE_WHO_HEALTH_INDEX, cumulativeWhoHealthIndex.value, t('hub.charts.who-health-index.label'))
    case 'resource-conflicts':
      return makeDatasets(BASELINE_RESOURCE_CONFLICTS, cumulativeResourceConflicts.value, t('hub.charts.resource-conflicts.label'))
    case 'water-tensions':
      return makeDatasets(BASELINE_WATER_TENSIONS, cumulativeWaterTensions.value, t('hub.charts.water-tensions.label'))
    case 'climate-migrations':
      return makeDatasets(BASELINE_CLIMATE_MIGRATIONS, cumulativeClimateMigrations.value, t('hub.charts.climate-migrations.label'))
    case 'gini-coefficient':
      return makeDatasets(BASELINE_GINI_COEFFICIENT, cumulativeGiniCoefficient.value, t('hub.charts.gini-coefficient.label'))
    case 'wealth-concentration':
      return makeDatasets(BASELINE_WEALTH_CONCENTRATION, cumulativeWealthConcentration.value, t('hub.charts.wealth-concentration.label'))
    case 'education-access':
      return makeDatasets(BASELINE_EDUCATION_ACCESS, cumulativeEducationAccess.value, t('hub.charts.education-access.label'))
    default:
      return []
  }
})

// ─── Événements tipping ───────────────────────────────────────────────────────

const tpEvents = computed<{ year: number; color: string }[]>(() => {
  if (props.chartType === 'temp') {
    return (['tp-permafrost', 'tp-coral', 'tp-amoc'] as const).flatMap(id => {
      const year = triggeredMap.value.get(id)
      return year === undefined ? [] : [{ year, color: '#ff5050' }]
    })
  }
  if (props.chartType === 'extremes') {
    const year = triggeredMap.value.get('tp-amoc')
    return year === undefined ? [] : [{ year, color: '#ff5050' }]
  }
  if (props.chartType === 'forest') {
    const year = triggeredMap.value.get('tp-amazon')
    return year === undefined ? [] : [{ year, color: '#ff5050' }]
  }
  return []
})

// ─── Bornes Y ─────────────────────────────────────────────────────────────────

const chartMeta = computed<{ yMin?: number; yMax?: number }>(() => {
  switch (props.chartType) {
    case 'co2':               return { yMin: 15,  yMax: 125 }
    case 'temp':              return { yMin: 1,   yMax: 4.5 }
    case 'forest':            return { yMin: 20,  yMax: 80  }
    case 'renewables':        return { yMin: 0,   yMax: 100 }
    case 'energyMixBreakdown':return { yMin: 0,   yMax: 45  }
    case 'food':              return { yMin: 25,  yMax: 75  }
    case 'water':             return { yMin: 60,  yMax: 90  }
    case 'extremes':           return { yMin: 0,    yMax: 18   }
    case 'sea-level':          return { yMin: 0,    yMax: 750  }
    case 'life-expectancy':    return { yMin: 55,   yMax: 80   }
    case 'respiratory-diseases':return { yMin: 0,   yMax: 80   }
    case 'who-health-index':   return { yMin: 35,   yMax: 75   }
    case 'resource-conflicts': return { yMin: 60,   yMax: 100  }
    case 'water-tensions':     return { yMin: 50,   yMax: 100  }
    case 'climate-migrations': return { yMin: 0,    yMax: 200  }
    case 'gini-coefficient':   return { yMin: 0.55, yMax: 0.8  }
    case 'wealth-concentration':return { yMin: 35,  yMax: 75   }
    case 'education-access':   return { yMin: 50,   yMax: 70   }
    default:                   return {}
  }
})
</script>
