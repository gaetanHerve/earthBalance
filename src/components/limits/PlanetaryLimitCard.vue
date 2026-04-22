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
      <div
        class="bg-eb-border rounded-full h-2 overflow-hidden"
        role="progressbar"
        :aria-label="t('limits.ratio_label') + ' : ' + limit.ratio.toFixed(2)"
        :aria-valuenow="Math.min(limit.ratio, 2)"
        aria-valuemin="0"
        aria-valuemax="2"
      >
        <div
          class="h-full rounded-full transition-all duration-1000"
          :style="{
            width: Math.min((limit.ratio / 2) * 100, 100) + '%',
            backgroundColor: limit.color,
          }"
        ></div>
      </div>
    </div>

    <!-- Graphique d'évolution temporelle -->
    <LineChart
      :canvas-id="`chart-${limit.id}`"
      :labels="limit.timeSeries.years"
      :datasets="[{
        label: displayName.value,
        data: limit.timeSeries.values,
        borderColor: limit.color,
        backgroundColor: hexToRgba(limit.color, 0.08),
        fill: true,
        pointRadius: 2,
      }]"
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

import type { PlanetaryLimit, LimitStatus } from '@/types/index'

const { t, locale } = useI18n()
const props = defineProps<{ limit: PlanetaryLimit }>()

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

const statusClass  = computed(() => STATUS_CLASS[props.limit.status])
const statusLabel  = computed(() => t(STATUS_KEY[props.limit.status]))
const statusIcon   = computed(() => STATUS_ICON[props.limit.status as LimitStatus])

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}
</script>
