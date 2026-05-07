<template>
  <EbCard>
    <!-- En-tête -->
    <div class="flex items-start justify-between gap-2 mb-3">
      <div class="flex items-center gap-2">
        <i :class="['fa', limit.icon, 'text-lg']" :style="{ color: limit.color }" aria-hidden="true"></i>
        <h3 class="text-sm font-bold text-slate-200">{{ displayName }}</h3>
      </div>
      <span
        class="text-xs px-2 py-0.5 rounded-full font-bold shrink-0"
        :class="statusClass"
        :aria-label="t('limits.status_aria', { status: statusLabel })"
      >
        {{ statusLabel }}
      </span>
    </div>

    <!-- Définition -->
    <p class="text-xs text-slate-500 mb-3 leading-relaxed">{{ displayDefinition }}</p>

    <!-- Valeurs clés -->
    <div class="grid grid-cols-2 gap-2 mb-3 text-xs">
      <div class="bg-eb-mid rounded-lg p-2 border border-eb-border">
        <div class="text-slate-500">{{ t('limits.current_value') }}</div>
        <div class="font-bold mt-0.5" :style="{ color: limit.color }">
          {{ limit.currentValue }} <span class="text-slate-500 font-normal">{{ limit.unit }}</span>
        </div>
      </div>
      <div class="bg-eb-mid rounded-lg p-2 border border-eb-border">
        <div class="text-slate-500">{{ t('limits.threshold_label') }}</div>
        <div class="font-bold text-yellow-400 mt-0.5">
          {{ limit.threshold }} <span class="text-slate-500 font-normal">{{ limit.unit }}</span>
        </div>
      </div>
    </div>

    <!-- Barre de dépassement -->
    <div class="mb-3">
      <div class="flex justify-between text-xs mb-1">
        <span class="text-slate-500">{{ t('limits.ratio_label') }}</span>
        <span class="font-bold flex items-center gap-1" :style="{ color: limit.color }">
          <i :class="['fa', statusIcon]" aria-hidden="true"></i>
          ×{{ limit.ratio.toFixed(2) }}
        </span>
      </div>
      <progress
        class="limit-progress block w-full h-2 rounded-full"
        :aria-label="t('limits.ratio_label') + ' : ' + limit.ratio.toFixed(2)"
        :value="Math.min(limit.ratio, 1)"
        max="1"
        :style="{ '--progress-color': limit.color }"
      ></progress>
    </div>

    <!-- Graphique d'évolution temporelle -->
    <LineChart
      :canvas-id="`chart-${limit.id}`"
      :labels="chartLabels"
      :datasets="chartDatasets"
      :height="120"
      :aria-label="t('limits.chart_evolution', { name: displayName })"
    />

    <!-- Seuil critique en référence visuelle -->
    <div class="mt-2 text-xs text-slate-600 flex items-center gap-1">
      <span class="w-4 h-px bg-yellow-400/60 inline-block"></span>
      {{ t('limits.threshold_ref', { threshold: limit.threshold, unit: limit.unit }) }}
    </div>
  </EbCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import EbCard from '@/components/layout/EbCard.vue'
import LineChart from '@/components/charts/LineChart.vue'
import { useGameStore } from '@/store/game.store'
import { SIM_LABELS } from '@/store/simulation.store'

import type { PlanetaryLimit, LimitStatus, ChartDataset } from '@/types/index'

const BLEND = 0.5

const { t, locale } = useI18n()
const gameStore = useGameStore()

const props = defineProps<{
  limit:          PlanetaryLimit
  status?:        LimitStatus
  projDecided?:   number[]
  projPessimist?: number[]
}>()

const displayName       = computed(() => locale.value === 'en' ? props.limit.nameEn : props.limit.name)
const displayDefinition = computed(() => locale.value === 'en' ? props.limit.definitionEn : props.limit.definition)

const STATUS_CLASS: Record<LimitStatus, string> = {
  depasse:          'bg-red-900/40 text-red-400 border border-red-700/30',
  zone_incertitude: 'bg-yellow-900/40 text-yellow-400 border border-yellow-700/30',
  safe:             'bg-green-900/40 text-eb-green border border-green-700/30',
}
const STATUS_ICON: Record<LimitStatus, string> = {
  depasse:          'fa-triangle-exclamation',
  zone_incertitude: 'fa-exclamation',
  safe:             'fa-check',
}
const STATUS_KEY: Record<LimitStatus, string> = {
  depasse:          'limits.exceeded',
  zone_incertitude: 'limits.risk_zone',
  safe:             'limits.safe',
}

const effectiveStatus = computed<LimitStatus>(() => props.status ?? (props.limit.status as LimitStatus))
const statusClass  = computed(() => STATUS_CLASS[effectiveStatus.value])
const statusLabel  = computed(() => t(STATUS_KEY[effectiveStatus.value]))
const statusIcon   = computed(() => STATUS_ICON[effectiveStatus.value])

function hexToRgba(hex: string, alpha: number): string {
  const r = Number.parseInt(hex.slice(1, 3), 16)
  const g = Number.parseInt(hex.slice(3, 5), 16)
  const b = Number.parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

// ─── Projection helpers ───────────────────────────────────────────────────────

function interpolateAtYear(year: number, values: number[]): number {
  if (year <= SIM_LABELS[0]) return values[0]
  if (year >= SIM_LABELS[SIM_LABELS.length - 1]) return values[values.length - 1]
  for (let i = 0; i < SIM_LABELS.length - 1; i++) {
    if (year >= SIM_LABELS[i] && year <= SIM_LABELS[i + 1]) {
      const frac = (year - SIM_LABELS[i]) / (SIM_LABELS[i + 1] - SIM_LABELS[i])
      return values[i] + frac * (values[i + 1] - values[i])
    }
  }
  return values[values.length - 1]
}

function blendedAtYear(year: number): number {
  if (!props.projDecided || !props.projPessimist) return 0
  const d = interpolateAtYear(year, props.projDecided)
  const p = interpolateAtYear(year, props.projPessimist)
  return d * (1 - BLEND) + p * BLEND
}

const projectionYearsAfter2024 = computed<number[]>(() => {
  if (!props.projDecided) return []
  const cur = gameStore.currentYear
  if (cur <= 2024) return []
  const years = SIM_LABELS.filter(y => y > 2024 && y <= cur)
  if (!SIM_LABELS.includes(cur)) years.push(cur)
  return years.sort((a, b) => a - b)
})

const chartLabels = computed<number[]>(() => [
  ...props.limit.timeSeries.years,
  ...projectionYearsAfter2024.value,
])

const chartDatasets = computed<ChartDataset[]>(() => {
  const historical = props.limit.timeSeries.values
  const color      = props.limit.color
  if (!props.projDecided || projectionYearsAfter2024.value.length === 0) {
    return [{
      label:           displayName.value,
      data:            [...historical],
      borderColor:     color,
      backgroundColor: hexToRgba(color, 0.08),
      fill:            true,
      pointRadius:     2,
    }]
  }
  const round2     = (v: number) => Math.round(v * 100) / 100
  const projValues = projectionYearsAfter2024.value.map(y => round2(blendedAtYear(y)))
  return [{
    label:           displayName.value,
    data:            [...historical, ...projValues],
    borderColor:     color,
    backgroundColor: hexToRgba(color, 0.08),
    fill:            true,
    pointRadius:     2,
  }]
})
</script>

<style scoped>
.limit-progress {
  appearance: none;
  background: #1f2d3d; /* eb-border */
}
.limit-progress::-webkit-progress-bar   { background: #1f2d3d; border-radius: 9999px; }
.limit-progress::-webkit-progress-value { background: var(--progress-color); border-radius: 9999px; transition: width 1s; }
.limit-progress::-moz-progress-bar      { background: var(--progress-color); border-radius: 9999px; transition: width 1s; }
</style>
