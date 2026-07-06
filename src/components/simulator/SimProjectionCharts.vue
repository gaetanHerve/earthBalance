<template>
  <div>

    <!-- Chips de sélection -->
    <div class="flex flex-wrap gap-2 mb-4" role="group" :aria-label="t('simulator.proj_toggle_aria')">
      <button
        v-for="c in chartDefs"
        :key="c.id"
        class="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full border transition-all focus-visible:ring-2 focus-visible:ring-eb-cyan outline-none"
        :class="visibleSet.has(c.id)
          ? 'border-eb-cyan/50 text-eb-cyan bg-eb-cyan/10'
          : 'border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-300'"
        :aria-pressed="visibleSet.has(c.id)"
        @click="toggleSimProjChart(c.id)"
      >
        <i :class="['fa', c.icon, 'text-[10px]']" aria-hidden="true"></i>
        {{ c.label }}
      </button>
    </div>

    <!-- Grille de graphiques -->
    <div v-if="visibleSet.size > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <template v-for="c in chartDefs" :key="c.id">
        <EbCard v-if="visibleSet.has(c.id)">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-bold text-slate-200">{{ c.label }}</h3>
            <span class="text-xs bg-slate-700/60 text-slate-400 px-2 py-0.5 rounded-full">{{ c.unit }}</span>
          </div>
          <LineChart
            :canvas-id="`sim-proj-${c.id}`"
            :labels="displayLabels"
            :datasets="datasetsFor(c.id)"
            :height="160"
            :y-min="c.yMin"
            :y-max="c.yMax"
            :current-year="simulatorCurrentYear"
            :events="eventsFor(c.id)"
            :aria-label="c.label"
          />
        </EbCard>
      </template>
    </div>

    <p v-else class="text-sm text-slate-500 italic text-center py-6">
      {{ t('simulator.proj_all_hidden') }}
    </p>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import {
  useSimulationStore,
  SIM_LABELS,
  BASELINE_CO2,
  BASELINE_TEMP,
  BASELINE_FOREST,
  BASELINE_ENERGY_MIX,
  simulatorAdoptionYearAt,
} from '@/store/simulation.store'
import { usePlanetsStore } from '@/store/planets.store'
import { useTippingPointsStore } from '@/store/tippingPoints.store'
import EbCard    from '@/components/layout/EbCard.vue'
import LineChart from '@/components/charts/LineChart.vue'
import type { ChartDataset, EnergyMixKey } from '@/types/index'

const { t } = useI18n()
const simStore      = useSimulationStore()
const planetsStore  = usePlanetsStore()
const tippingStore  = useTippingPointsStore()

const {
  simCumulativeCo2,
  simCumulativeCo2Pessimist,
  simCumulativeTemp,
  simCumulativeTempPessimist,
  cumulativeForest,
  cumulativeForestPessimist,
  cumulativeEnergyMix,
  cumulativeEnergyMixPessimist,
  simProjVisible,
  selectedMitigationPolicies,
} = storeToRefs(simStore)

const { toggleSimProjChart } = simStore
const { selectedHorizon }    = storeToRefs(planetsStore)
const { triggeredList }      = storeToRefs(tippingStore)

const simulatorCurrentYear = computed<number>(() =>
  simulatorAdoptionYearAt(selectedMitigationPolicies.value.length)
)

// ─── Tipping points déclenchés ────────────────────────────────────────────────

const triggeredMap = computed(() =>
  new Map(triggeredList.value.map(tp => [tp.id, tp.year]))
)

const tempEvents = computed(() =>
  (['tp-permafrost', 'tp-coral', 'tp-amoc'] as const).flatMap(id => {
    const year = triggeredMap.value.get(id)
    return year !== undefined ? [{ year, color: '#ff5050' }] : []
  })
)

const forestEvents = computed(() => {
  const year = triggeredMap.value.get('tp-amazon')
  return year !== undefined ? [{ year, color: '#ff5050' }] : []
})

function eventsFor(id: string): { year: number; color: string }[] {
  if (id === 'temperature') return tempEvents.value
  if (id === 'forest')      return forestEvents.value
  return []
}

// ─── Horizon ──────────────────────────────────────────────────────────────────

const horizonIndex = computed<number>(() => {
  let last = 0
  for (let i = 0; i < SIM_LABELS.length; i++) {
    if (SIM_LABELS[i] <= selectedHorizon.value) last = i
  }
  return last
})

const sliceN = computed<number>(() =>
  (horizonIndex.value === 0 ? SIM_LABELS.length - 1 : horizonIndex.value) + 1
)

const displayLabels = computed<number[]>(() => SIM_LABELS.slice(0, sliceN.value))

// ─── Énergies renouvelables (solaire + éolien + hydro) % ──────────────────────

const RENEW_KEYS: EnergyMixKey[] = ['solar', 'wind', 'hydro']

const baselineRenewables = SIM_LABELS.map((_, i) =>
  Math.round(RENEW_KEYS.reduce((s, k) => s + BASELINE_ENERGY_MIX[k][i], 0) * 10) / 10
)

const decidedRenewables = computed<number[]>(() =>
  SIM_LABELS.map((_, i) =>
    Math.round(RENEW_KEYS.reduce((s, k) => s + cumulativeEnergyMix.value[k][i], 0) * 10) / 10
  )
)

const pessimistRenewables = computed<number[]>(() =>
  SIM_LABELS.map((_, i) =>
    Math.round(RENEW_KEYS.reduce((s, k) => s + cumulativeEnergyMixPessimist.value[k][i], 0) * 10) / 10
  )
)

// ─── Définitions des graphiques ───────────────────────────────────────────────

interface ChartDef {
  id:    string
  label: string
  unit:  string
  icon:  string
  yMin?: number
  yMax?: number
}

const chartDefs = computed<ChartDef[]>(() => [
  { id: 'co2',         label: t('simulator.co2_chart_title'),  unit: 'GtCO₂/an', icon: 'fa-smog',             yMin: 15,  yMax: 75  },
  { id: 'temperature', label: t('simulator.temp_chart_title'), unit: '°C',        icon: 'fa-temperature-half', yMin: 1.0, yMax: 4.5 },
  { id: 'forest',      label: t('dashboard.forest_title'),     unit: '%',         icon: 'fa-tree',             yMin: 20,  yMax: 80  },
  { id: 'energy',      label: t('simulator.proj_renewables'),  unit: '%',         icon: 'fa-solar-panel',      yMin: 0,   yMax: 100 },
])

// ─── Visibilité ───────────────────────────────────────────────────────────────

const visibleSet = computed(() => new Set(simProjVisible.value))

// ─── Datasets ─────────────────────────────────────────────────────────────────

function makeDatasets(
  baseline:  number[],
  decided:   number[],
  pessimist: number[],
  extra:     ChartDataset[] = [],
): ChartDataset[] {
  const n = sliceN.value
  return [
    {
      label: t('simulator.legend_baseline'),
      data:  baseline.slice(0, n),
      borderColor: '#64748b', backgroundColor: 'transparent',
      fill: false, tension: 0.4, pointRadius: 1, borderDash: [4, 3],
    },
    {
      label: t('simulator.legend_decided'),
      data:  decided.slice(0, n),
      borderColor: '#00ff88', backgroundColor: 'rgba(0,255,136,0.08)',
      fill: false, tension: 0.4, pointRadius: 3,
    },
    {
      label: t('simulator.legend_pessimist'),
      data:  pessimist.slice(0, n),
      borderColor: '#f87171', backgroundColor: 'transparent',
      fill: false, tension: 0.4, pointRadius: 1,
    },
    ...extra,
  ]
}

function tpLine(label: string, val: number, triggered: boolean): ChartDataset {
  return {
    label,
    data:  displayLabels.value.map(() => val),
    borderColor: triggered ? '#ff5050' : '#a78bfa',
    backgroundColor: 'transparent',
    fill: false, tension: 0, borderDash: [3, 4], pointRadius: 0,
  }
}

function datasetsFor(id: string): ChartDataset[] {
  if (id === 'co2')
    return makeDatasets(BASELINE_CO2, simCumulativeCo2.value, simCumulativeCo2Pessimist.value)
  if (id === 'temperature')
    return makeDatasets(BASELINE_TEMP, simCumulativeTemp.value, simCumulativeTempPessimist.value, [
      tpLine(t('tipping.tp_group_1_5c'), 1.5, triggeredMap.value.has('tp-permafrost') || triggeredMap.value.has('tp-coral')),
      tpLine(`${t('tipping.tp-amoc.name')} (3°C)`,   3,   triggeredMap.value.has('tp-amoc')),
    ])
  if (id === 'forest')
    return makeDatasets(BASELINE_FOREST, cumulativeForest.value, cumulativeForestPessimist.value, [
      tpLine(`${t('tipping.tp-amazon.name')} (45 %)`, 45, triggeredMap.value.has('tp-amazon')),
    ])
  if (id === 'energy')
    return makeDatasets(baselineRenewables, decidedRenewables.value, pessimistRenewables.value)
  return []
}
</script>
