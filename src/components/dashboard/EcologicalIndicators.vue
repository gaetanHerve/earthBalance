<template>
  <section aria-labelledby="ecological-title">
    <SectionTitle
      id="ecological-title"
      :title="t('dashboard.eco_title')"
      icon="fa-leaf"
      color-class="text-eb-green"
    />

    <!-- Toggle global vue résumé / historique -->
    <div class="flex items-center gap-2 mb-4" role="group" :aria-label="t('dashboard.global_toggle_label')">
      <span class="text-xs text-slate-500">{{ t('dashboard.global_toggle_label') }}</span>
      <button
        :class="['text-xs px-3 py-1 rounded-full border transition-all focus-visible:ring-2 focus-visible:ring-eb-cyan outline-none',
          allSummary ? 'bg-eb-cyan/10 border-eb-cyan/40 text-eb-cyan' : 'bg-transparent border-slate-600 text-slate-400 hover:border-slate-400 hover:text-slate-200']"
        :aria-pressed="allSummary"
        @click="setGlobalMode(true)"
      >{{ t('dashboard.global_toggle_summary') }}</button>
      <button
        :class="['text-xs px-3 py-1 rounded-full border transition-all focus-visible:ring-2 focus-visible:ring-eb-cyan outline-none',
          allHistory ? 'bg-eb-cyan/10 border-eb-cyan/40 text-eb-cyan' : 'bg-transparent border-slate-600 text-slate-400 hover:border-slate-400 hover:text-slate-200']"
        :aria-pressed="allHistory"
        @click="setGlobalMode(false)"
      >{{ t('dashboard.global_toggle_detail') }}</button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 xl:grid-flow-dense gap-4">

      <!-- CO2 — jauge ou courbe selon le toggle -->
      <EbCard
        v-if="isVisible('co2')"
        :extra-class="co2GaugeMode ? 'flex flex-col items-center justify-center' : 'col-span-1 md:col-span-2'"
      >
        <div class="flex items-center justify-between mb-3 w-full">
          <div class="text-sm font-bold text-slate-200">
            <i class="fa fa-smog text-red-400 mr-2" aria-hidden="true"></i>{{ t('dashboard.co2_title') }}
          </div>
          <div class="flex items-center gap-2">
            <span v-if="!co2GaugeMode" class="text-xs bg-red-900/40 text-red-400 px-2 py-0.5 rounded-full">GtCO₂/an</span>
            <button
              class="w-7 h-7 flex items-center justify-center rounded-full border transition-all focus-visible:ring-2 focus-visible:ring-eb-cyan outline-none"
              :class="co2GaugeMode
                ? 'bg-eb-cyan/10 border-eb-cyan/40 text-eb-cyan'
                : 'bg-transparent border-slate-600 text-slate-400 hover:border-eb-cyan/50 hover:text-slate-200'"
              :aria-label="co2GaugeMode ? t('dashboard.co2_toggle_to_line') : t('dashboard.co2_toggle_to_gauge')"
              :aria-pressed="co2GaugeMode"
              @click="co2GaugeMode = !co2GaugeMode"
            >
              <i :class="['fa', co2GaugeMode ? 'fa-chart-line' : 'fa-gauge', 'text-xs']" aria-hidden="true"></i>
            </button>
          </div>
        </div>

        <!-- Vue jauge -->
        <template v-if="co2GaugeMode">
          <GaugeChart
            canvas-id="co2Gauge"
            :value="co2Current"
            :max="70"
            track-color="#ff5050"
            :size="140"
            :font-size="22"
            unit="Gt/an"
            :aria-label="`${t('dashboard.co2_title')} : ${co2Current} GtCO₂/an`"
          >
            <span class="text-2xl font-black text-red-400">{{ co2Current }}</span>
            <span class="text-xs text-slate-500 mt-0.5">GtCO₂/an</span>
          </GaugeChart>
          <div class="mt-3 text-xs text-slate-500 text-center">Paris 2050 : ~20 Gt/an</div>
        </template>

        <!-- Vue courbe -->
        <LineChart
          v-else
          canvas-id="co2Chart"
          :labels="co2Labels"
          :datasets="co2Datasets"
          :height="180"
          :current-year="gameStore.currentYear"
          :aria-label="t('dashboard.co2_aria')"
        />
      </EbCard>

      <!-- Forêt — jauge ou courbe selon le toggle -->
      <EbCard
        v-if="isVisible('forest')"
        :extra-class="forestLineMode ? 'col-span-1 md:col-span-2' : 'flex flex-col items-center justify-center'"
      >
        <div class="flex items-center justify-between mb-3 w-full">
          <div class="text-sm font-bold text-slate-200">
            <i class="fa fa-tree text-eb-green mr-2" aria-hidden="true"></i>{{ t('dashboard.forest_title') }}
          </div>
          <div class="flex items-center gap-2">
            <span v-if="forestLineMode" class="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full">
              % prim.
            </span>
            <button
              class="w-7 h-7 flex items-center justify-center rounded-full border transition-all focus-visible:ring-2 focus-visible:ring-eb-cyan outline-none"
              :class="forestLineMode
                ? 'bg-eb-cyan/10 border-eb-cyan/40 text-eb-cyan'
                : 'bg-transparent border-slate-600 text-slate-400 hover:border-eb-cyan/50 hover:text-slate-200'"
              :aria-label="forestLineMode ? t('dashboard.forest_toggle_to_gauge') : t('dashboard.forest_toggle_to_line')"
              :aria-pressed="forestLineMode"
              @click="forestLineMode = !forestLineMode"
            >
              <i :class="['fa', forestLineMode ? 'fa-gauge' : 'fa-chart-line', 'text-xs']" aria-hidden="true"></i>
            </button>
          </div>
        </div>

        <!-- Vue jauge -->
        <template v-if="!forestLineMode">
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
            {{ t('dashboard.forest_ref', { threshold: eco.forest.criticalThreshold }) }}
          </div>
        </template>

        <!-- Vue courbe historique + projection -->
        <template v-else>
          <LineChart
            canvas-id="forestLineChart"
            :labels="forestLabels"
            :datasets="forestDatasets"
            :height="180"
            :current-year="gameStore.currentYear"
            :y-min="20"
            :y-max="80"
            :aria-label="t('dashboard.forest_aria')"
          />
        </template>
      </EbCard>

      <!-- Mix énergétique — barres ou courbes selon le toggle -->
      <EbCard
        v-if="isVisible('energyMix')"
        :extra-class="energyLineMode ? 'col-span-1 md:col-span-2' : ''"
      >
        <div class="flex items-center justify-between mb-3">
          <div class="text-sm font-bold text-slate-200">
            <i class="fa fa-bolt text-yellow-400 mr-2" aria-hidden="true"></i>{{ t('dashboard.energy_title') }}
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full">TWh</span>
            <button
              class="w-7 h-7 flex items-center justify-center rounded-full border transition-all focus-visible:ring-2 focus-visible:ring-eb-cyan outline-none"
              :class="energyLineMode
                ? 'bg-eb-cyan/10 border-eb-cyan/40 text-eb-cyan'
                : 'bg-transparent border-slate-600 text-slate-400 hover:border-eb-cyan/50 hover:text-slate-200'"
              :aria-label="energyLineMode ? t('dashboard.energy_toggle_to_bar') : t('dashboard.energy_toggle_to_line')"
              :aria-pressed="energyLineMode"
              @click="energyLineMode = !energyLineMode"
            >
              <i :class="['fa', energyLineMode ? 'fa-chart-bar' : 'fa-chart-line', 'text-xs']" aria-hidden="true"></i>
            </button>
          </div>
        </div>

        <!-- Vue barres -->
        <BarChart
          v-if="!energyLineMode"
          canvas-id="energyChart"
          :labels="eco.energyMix.categories.map(c => c.label)"
          :values="energyMixValues"
          :colors="eco.energyMix.categories.map(c => c.color)"
          :height="180"
          :aria-label="t('dashboard.energy_aria')"
        />

        <!-- Vue courbe historique + projection -->
        <LineChart
          v-else
          canvas-id="energyLineChart"
          :labels="energyMixLabels"
          :datasets="energyMixDatasets"
          :show-legend="true"
          :height="180"
          :current-year="gameStore.currentYear"
          :y-min="0"
          :aria-label="t('dashboard.energy_aria')"
        />
      </EbCard>

      <!-- Température — jauge ou courbe selon le toggle -->
      <EbCard
        v-if="isVisible('temperature')"
        :extra-class="tempGaugeMode ? 'flex flex-col items-center justify-center' : 'col-span-1 md:col-span-2'"
      >
        <div class="flex items-center justify-between mb-3 w-full">
          <div class="text-sm font-bold text-slate-200">
            <i class="fa fa-thermometer-half text-orange-400 mr-2" aria-hidden="true"></i>
            {{ t('dashboard.temp_title') }}
          </div>
          <div class="flex items-center gap-2">
            <span v-if="!tempGaugeMode" class="text-xs bg-orange-900/40 text-orange-400 px-2 py-0.5 rounded-full">{{ t('dashboard.temp_tag') }}</span>
            <button
              class="w-7 h-7 flex items-center justify-center rounded-full border transition-all focus-visible:ring-2 focus-visible:ring-eb-cyan outline-none"
              :class="tempGaugeMode
                ? 'bg-eb-cyan/10 border-eb-cyan/40 text-eb-cyan'
                : 'bg-transparent border-slate-600 text-slate-400 hover:border-eb-cyan/50 hover:text-slate-200'"
              :aria-label="tempGaugeMode ? t('dashboard.temp_toggle_to_line') : t('dashboard.temp_toggle_to_gauge')"
              :aria-pressed="tempGaugeMode"
              @click="tempGaugeMode = !tempGaugeMode"
            >
              <i :class="['fa', tempGaugeMode ? 'fa-chart-line' : 'fa-gauge', 'text-xs']" aria-hidden="true"></i>
            </button>
          </div>
        </div>

        <!-- Vue jauge -->
        <template v-if="tempGaugeMode">
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

        <!-- Vue courbe -->
        <LineChart
          v-else
          canvas-id="tempChart"
          :labels="tempLabels"
          :datasets="tempDatasets"
          :height="180"
          :current-year="gameStore.currentYear"
          :aria-label="t('dashboard.temp_aria')"
        />
      </EbCard>

      <!-- Ressources naturelles — courbe ou barres selon le toggle -->
      <EbCard v-if="isVisible('resources')" extra-class="col-span-1 md:col-span-2">
        <div class="flex items-center justify-between mb-3">
          <div class="text-sm font-bold text-slate-200">
            <i class="fa fa-mountain text-slate-400 mr-2" aria-hidden="true"></i>
            {{ t('dashboard.resources_title') }}
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full">Gt/an</span>
            <button
              class="w-7 h-7 flex items-center justify-center rounded-full border transition-all focus-visible:ring-2 focus-visible:ring-eb-cyan outline-none"
              :class="resourcesBarMode
                ? 'bg-eb-cyan/10 border-eb-cyan/40 text-eb-cyan'
                : 'bg-transparent border-slate-600 text-slate-400 hover:border-eb-cyan/50 hover:text-slate-200'"
              :aria-label="resourcesBarMode ? t('dashboard.resources_toggle_to_line') : t('dashboard.resources_toggle_to_bar')"
              :aria-pressed="resourcesBarMode"
              @click="resourcesBarMode = !resourcesBarMode"
            >
              <i :class="['fa', resourcesBarMode ? 'fa-chart-line' : 'fa-chart-bar', 'text-xs']" aria-hidden="true"></i>
            </button>
          </div>
        </div>

        <!-- Vue courbe historique + projection -->
        <LineChart
          v-if="!resourcesBarMode"
          canvas-id="resourceChart"
          :labels="resourceLabels"
          :datasets="resourceDatasets"
          :height="180"
          :show-legend="true"
          :current-year="gameStore.currentYear"
          :aria-label="t('dashboard.resources_aria')"
        />

        <!-- Vue barres -->
        <BarChart
          v-else
          canvas-id="resourceBarChart"
          :labels="eco.resources.datasets.map(d => d.label)"
          :values="resourceBarValues"
          :colors="eco.resources.datasets.map(d => d.color)"
          :height="180"
          :aria-label="t('dashboard.resources_aria')"
        />
      </EbCard>

      <!-- Citations GIEC — remplissent les cases vides à xl -->
      <IpccQuoteCard
        v-for="quote in displayedQuotes"
        :key="quote.id"
        :quote="quote"
      />

    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import SectionTitle from '@/components/layout/SectionTitle.vue'
import EbCard from '@/components/layout/EbCard.vue'
import LineChart from '@/components/charts/LineChart.vue'
import GaugeChart from '@/components/charts/GaugeChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import IpccQuoteCard from '@/components/dashboard/IpccQuoteCard.vue'

import { useGameStore } from '@/store/game.store'
import { useSimulationStore, SIM_LABELS, BASELINE_ENERGY_TOTAL_TWH } from '@/store/simulation.store'
import { ipccQuotes } from '@/data/ipccQuotes'
import type { EcologicalCharts, ChartDataset, EnergyMixKey, ResourceKey } from '@/types/index'

const { t } = useI18n()
const gameStore = useGameStore()
const simulationStore = useSimulationStore()
const {
  cumulativeCo2, cumulativeCo2Pessimist,
  cumulativeTemp, cumulativeTempPessimist,
  cumulativeForest, cumulativeForestPessimist,
  cumulativeEnergyMix, cumulativeEnergyMixPessimist,
  cumulativeResources, cumulativeResourcesPessimist,
} = storeToRefs(simulationStore)

// Coefficient d'interpolation entre scénario décidé (0) et pessimiste (1).
const BLEND = 0.5

const props = withDefaults(defineProps<{
  eco:            EcologicalCharts
  visibleWidgets?: string[]
}>(), { visibleWidgets: () => [] })

// ─── Toggles vue alternative ──────────────────────────────────────────────────

const forestLineMode   = ref(false)
const energyLineMode   = ref(false)
const co2GaugeMode     = ref(false)
const tempGaugeMode    = ref(false)
const resourcesBarMode = ref(false)

// ─── Citations GIEC — mélangées une fois au setup ─────────────────────────────

const _shuffled = [...ipccQuotes]
for (let i = _shuffled.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1))
  ;[_shuffled[i], _shuffled[j]] = [_shuffled[j], _shuffled[i]]
}
const shuffledQuotes = _shuffled

// ─── Toggle global (Option B : raccourci, non verrouillé) ─────────────────────

const allSummary = computed(() =>
  co2GaugeMode.value && tempGaugeMode.value && !forestLineMode.value && !energyLineMode.value && resourcesBarMode.value
)
const allHistory = computed(() =>
  !co2GaugeMode.value && !tempGaugeMode.value && forestLineMode.value && energyLineMode.value && !resourcesBarMode.value
)

function setGlobalMode(summary: boolean) {
  co2GaugeMode.value     = summary
  tempGaugeMode.value    = summary
  forestLineMode.value   = !summary
  energyLineMode.value   = !summary
  resourcesBarMode.value = summary
}

// ─── Cases vides à xl (4 colonnes) ────────────────────────────────────────────

const emptySlots = computed(() => {
  const s = (id: string, wide: boolean) => props.visibleWidgets.includes(id) ? (wide ? 2 : 1) : 0
  const total =
    s('co2',         !co2GaugeMode.value)    +
    s('forest',       forestLineMode.value)  +
    s('energyMix',    energyLineMode.value)  +
    s('temperature', !tempGaugeMode.value)   +
    s('resources',    true)
  const rem = total % 4
  return rem === 0 ? 0 : 4 - rem
})

const displayedQuotes = computed(() => shuffledQuotes.slice(0, emptySlots.value))

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isVisible(id: string): boolean {
  return props.visibleWidgets.includes(id)
}

function interpolateAtYear(year: number, labels: number[], values: number[]): number {
  if (year <= labels[0]) return values[0]
  if (year >= labels[labels.length - 1]) return values[values.length - 1]
  for (let i = 0; i < labels.length - 1; i++) {
    if (year >= labels[i] && year <= labels[i + 1]) {
      const t = (year - labels[i]) / (labels[i + 1] - labels[i])
      return values[i] + t * (values[i + 1] - values[i])
    }
  }
  return values[values.length - 1]
}

function blendedAtYear(year: number, decided: number[], pessimist: number[]): number {
  const d = interpolateAtYear(year, SIM_LABELS, decided)
  const p = interpolateAtYear(year, SIM_LABELS, pessimist)
  return d * (1 - BLEND) + p * BLEND
}

// Années de projection > 2024 et ≤ currentYear
const projectionYearsAfter2024 = computed<number[]>(() => {
  const year = gameStore.currentYear
  if (year <= 2024) return []
  const years = SIM_LABELS.filter(y => y > 2024 && y <= year)
  if (!SIM_LABELS.includes(year)) years.push(year)
  return years.sort((a, b) => a - b)
})

// ─── CO₂ ──────────────────────────────────────────────────────────────────────

const co2Current = computed<number>(() =>
  Math.round(blendedAtYear(gameStore.currentYear, cumulativeCo2.value, cumulativeCo2Pessimist.value) * 10) / 10
)

const co2Labels = computed<number[]>(() => [
  ...props.eco.co2.timeSeries.years,
  ...projectionYearsAfter2024.value,
])

const co2Datasets = computed<ChartDataset[]>(() => {
  const round1 = (v: number) => Math.round(v * 10) / 10
  const projValues = projectionYearsAfter2024.value.map(y =>
    round1(blendedAtYear(y, cumulativeCo2.value, cumulativeCo2Pessimist.value))
  )
  return [{
    label:           t('dashboard.co2_dataset'),
    data:            [...props.eco.co2.timeSeries.values, ...projValues],
    borderColor:     '#ff5050',
    backgroundColor: 'rgba(255,80,80,0.08)',
    fill:            true,
  }]
})

// ─── Température ──────────────────────────────────────────────────────────────

const tempCurrent = computed<number>(() =>
  Math.round(blendedAtYear(gameStore.currentYear, cumulativeTemp.value, cumulativeTempPessimist.value) * 100) / 100
)

const tempLabels = computed<number[]>(() => [
  ...props.eco.temperature.timeSeries.years,
  ...projectionYearsAfter2024.value,
])

const tempDatasets = computed<ChartDataset[]>(() => {
  const round2 = (v: number) => Math.round(v * 100) / 100
  const projValues = projectionYearsAfter2024.value.map(y =>
    round2(blendedAtYear(y, cumulativeTemp.value, cumulativeTempPessimist.value))
  )
  return [{
    label:           t('dashboard.temp_dataset'),
    data:            [...props.eco.temperature.timeSeries.values, ...projValues],
    borderColor:     '#fb923c',
    backgroundColor: 'rgba(251,146,60,0.2)',
    fill:            true,
  }]
})

// ─── Forêt (jauge) ────────────────────────────────────────────────────────────

const forestCurrent = computed<number>(() =>
  Math.round(blendedAtYear(gameStore.currentYear, cumulativeForest.value, cumulativeForestPessimist.value) * 10) / 10
)

// ─── Forêt (courbe historique + projection) ───────────────────────────────────

const forestLabels = computed<number[]>(() => [
  ...props.eco.forest.timeSeries.years,
  ...projectionYearsAfter2024.value,
])

const forestDatasets = computed<ChartDataset[]>(() => {
  const round1 = (v: number) => Math.round(v * 10) / 10
  const projValues = projectionYearsAfter2024.value.map(y =>
    round1(blendedAtYear(y, cumulativeForest.value, cumulativeForestPessimist.value))
  )
  return [{
    label:           t('dashboard.forest_title'),
    data:            [...props.eco.forest.timeSeries.values, ...projValues],
    borderColor:     '#00ff88',
    backgroundColor: 'rgba(0,255,136,0.08)',
    fill:            true,
  }]
})

// ─── Mix énergétique (barres) ─────────────────────────────────────────────────

const CATEGORY_KEY_MAP: Record<string, EnergyMixKey> = {
  'Charbon':    'coal',
  'Pétrole':   'oil',
  'Gaz':       'gas',
  'Nucléaire': 'nuclear',
  'Solaire':   'solar',
  'Éolien':   'wind',
  'Hydro':     'hydro',
  'Autres':    'autres',
}

const energyMixValues = computed<number[]>(() => {
  const totalTWh = interpolateAtYear(gameStore.currentYear, SIM_LABELS, BASELINE_ENERGY_TOTAL_TWH)
  return props.eco.energyMix.categories.map(cat => {
    const key = CATEGORY_KEY_MAP[cat.label]
    if (!key) return cat.value
    const pct = blendedAtYear(gameStore.currentYear, cumulativeEnergyMix.value[key], cumulativeEnergyMixPessimist.value[key])
    return Math.round(pct / 100 * totalTWh)
  })
})

// ─── Mix énergétique (courbe multi-lignes historique + projection) ────────────

const energyMixLabels = computed<number[]>(() => [
  ...props.eco.energyMix.timeSeries.years,
  ...projectionYearsAfter2024.value,
])

const energyMixDatasets = computed<ChartDataset[]>(() => {
  return props.eco.energyMix.categories.map(cat => {
    const key = CATEGORY_KEY_MAP[cat.label] as EnergyMixKey | undefined
    const historical = key
      ? props.eco.energyMix.timeSeries.byCategory[key]
      : props.eco.energyMix.timeSeries.years.map(() => cat.value)
    const projValues = key
      ? projectionYearsAfter2024.value.map(y => {
          const totalTWh = interpolateAtYear(y, SIM_LABELS, BASELINE_ENERGY_TOTAL_TWH)
          const pct = blendedAtYear(y, cumulativeEnergyMix.value[key], cumulativeEnergyMixPessimist.value[key])
          return Math.round(pct / 100 * totalTWh)
        })
      : []
    return {
      label:           cat.label,
      data:            [...historical, ...projValues],
      borderColor:     cat.color,
      backgroundColor: 'transparent',
      fill:            false,
      tension:         0.3,
      pointRadius:     2,
    }
  })
})

// ─── Ressources naturelles ────────────────────────────────────────────────────

const RESOURCE_KEY_MAP: Record<string, ResourceKey> = {
  'Minéraux':              'minerals',
  'Biomasse':              'biomass',
  'Combustibles fossiles': 'fossilFuels',
}

const resourceBarValues = computed<number[]>(() =>
  props.eco.resources.datasets.map(dataset => {
    const key = RESOURCE_KEY_MAP[dataset.label]
    if (!key) return dataset.values[dataset.values.length - 1]
    return Math.round(blendedAtYear(gameStore.currentYear, cumulativeResources.value[key], cumulativeResourcesPessimist.value[key]) * 10) / 10
  })
)

const resourceLabels = computed<number[]>(() => [
  ...props.eco.resources.years,
  ...projectionYearsAfter2024.value,
])

const resourceDatasets = computed<ChartDataset[]>(() =>
  props.eco.resources.datasets.map(dataset => {
    const key = RESOURCE_KEY_MAP[dataset.label]
    if (!key) {
      return {
        label:           dataset.label,
        data:            [...dataset.values],
        borderColor:     dataset.color,
        backgroundColor: dataset.bgColor,
        fill:            true,
      }
    }
    const round1 = (v: number) => Math.round(v * 10) / 10
    const projValues = projectionYearsAfter2024.value.map(y =>
      round1(blendedAtYear(y, cumulativeResources.value[key], cumulativeResourcesPessimist.value[key]))
    )
    return {
      label:           dataset.label,
      data:            [...dataset.values, ...projValues],
      borderColor:     dataset.color,
      backgroundColor: dataset.bgColor,
      fill:            true,
    }
  })
)
</script>
