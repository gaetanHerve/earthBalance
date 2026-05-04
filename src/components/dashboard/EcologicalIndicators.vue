<template>
  <section aria-labelledby="ecological-title">
    <SectionTitle
      id="ecological-title"
      :title="t('dashboard.eco_title')"
      icon="fa-leaf"
      color-class="text-eb-green"
    />

    <!-- Toggle global vue résumé / historique -->
    <fieldset class="flex items-center gap-2 mb-4 border-0 p-0 m-0">
      <legend class="text-xs text-slate-500 float-left mr-2">{{ t('dashboard.global_toggle_label') }}</legend>
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
    </fieldset>

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
          <span v-if="!co2GaugeMode" class="text-xs bg-red-900/40 text-red-400 px-2 py-0.5 rounded-full">GtCO₂/an</span>
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
          <span v-if="forestLineMode" class="text-xs bg-green-900/40 text-green-400 px-2 py-0.5 rounded-full">% prim.</span>
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
          <span class="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full">TWh</span>
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
          <span v-if="!tempGaugeMode" class="text-xs bg-orange-900/40 text-orange-400 px-2 py-0.5 rounded-full">{{ t('dashboard.temp_tag') }}</span>
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

      <!-- Niveau des mers — jauge ou courbe selon le toggle -->
      <EbCard
        v-if="isVisible('seaLevel')"
        :extra-class="seaGaugeMode ? 'flex flex-col items-center justify-center' : 'col-span-1 md:col-span-2'"
      >
        <div class="flex items-center justify-between mb-3 w-full">
          <div class="text-sm font-bold text-slate-200">
            <i class="fa fa-water text-blue-400 mr-2" aria-hidden="true"></i>{{ t('dashboard.sea_level_title') }}
          </div>
          <span v-if="!seaGaugeMode" class="text-xs bg-blue-900/40 text-blue-400 px-2 py-0.5 rounded-full">mm</span>
        </div>

        <!-- Vue jauge -->
        <template v-if="seaGaugeMode">
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

        <!-- Vue courbe historique + projection -->
        <LineChart
          v-else
          canvas-id="seaLevelChart"
          :labels="seaLevelLabels"
          :datasets="seaLevelDatasets"
          :height="180"
          :current-year="gameStore.currentYear"
          :y-min="0"
          :aria-label="t('dashboard.sea_level_aria')"
        />
        <div v-if="!seaGaugeMode" class="mt-1 text-[10px] text-slate-600 text-right">
          {{ t('dashboard.sea_level_ref') }}
        </div>
      </EbCard>

      <!-- Extrêmes climatiques — KPIs ou courbe selon le toggle -->
      <EbCard
        v-if="isVisible('extremes')"
        :extra-class="`flex flex-col${extremesLineMode ? ' col-span-1 md:col-span-2' : ''}`"
      >
        <div class="flex items-center justify-between mb-3">
          <div class="text-sm font-bold text-slate-200">
            <i class="fa fa-bolt text-orange-400 mr-2" aria-hidden="true"></i>{{ t('dashboard.extremes_section') }}
          </div>
          <span v-if="extremesLineMode" class="text-xs bg-orange-900/40 text-orange-400 px-2 py-0.5 rounded-full">indice</span>
        </div>

        <!-- Vue actuelle : 3 KPIs carrés + libellés sous les encadrés -->
        <template v-if="!extremesLineMode">
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

        <!-- Vue projection : courbe -->
        <template v-else>
          <LineChart
            canvas-id="extremesChart"
            :labels="extremesLabels"
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

      <!-- Ressources naturelles — courbe ou barres selon le toggle -->
      <EbCard v-if="isVisible('resources')" :extra-class="!resourcesBarMode ? 'col-span-1 md:col-span-2' : ''">
        <div class="flex items-center justify-between mb-3">
          <div class="text-sm font-bold text-slate-200">
            <i class="fa fa-mountain text-slate-400 mr-2" aria-hidden="true"></i>
            {{ t('dashboard.resources_title') }}
          </div>
          <span class="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full">Gt</span>
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
import { interpolateAtYear } from '@/utils/timeSeries'
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
const extremesLineMode = ref(false)
const co2GaugeMode     = ref(true)
const tempGaugeMode    = ref(true)
const seaGaugeMode     = ref(true)
const resourcesBarMode = ref(true)

// ─── Citations GIEC — mélangées une fois au setup ─────────────────────────────

const _shuffled = [...ipccQuotes]
for (let i = _shuffled.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1))
  ;[_shuffled[i], _shuffled[j]] = [_shuffled[j], _shuffled[i]]
}
const shuffledQuotes = _shuffled

// ─── Toggle global (Option B : raccourci, non verrouillé) ─────────────────────

const allSummary = computed(() =>
  co2GaugeMode.value && tempGaugeMode.value && seaGaugeMode.value &&
  !forestLineMode.value && !energyLineMode.value && resourcesBarMode.value && !extremesLineMode.value
)
const allHistory = computed(() =>
  !co2GaugeMode.value && !tempGaugeMode.value && !seaGaugeMode.value &&
  forestLineMode.value && energyLineMode.value && !resourcesBarMode.value && extremesLineMode.value
)

function setGlobalMode(summary: boolean) {
  co2GaugeMode.value     = summary
  tempGaugeMode.value    = summary
  seaGaugeMode.value     = summary
  forestLineMode.value   = !summary
  energyLineMode.value   = !summary
  resourcesBarMode.value = summary
  extremesLineMode.value = !summary
}

// ─── Cases vides à xl (4 colonnes) ────────────────────────────────────────────

function widgetCols(id: string, wide: boolean): number {
  if (!props.visibleWidgets.includes(id)) return 0
  return wide ? 2 : 1
}

const emptySlots = computed(() => {
  const total =
    widgetCols('co2',         !co2GaugeMode.value)    +
    widgetCols('forest',       forestLineMode.value)  +
    widgetCols('seaLevel',    !seaGaugeMode.value)    +
    widgetCols('extremes',     extremesLineMode.value) +
    widgetCols('energyMix',    energyLineMode.value)  +
    widgetCols('temperature', !tempGaugeMode.value)   +
    widgetCols('resources',   !resourcesBarMode.value)
  const rem = total % 4
  return rem === 0 ? 0 : 4 - rem
})

const displayedQuotes = computed(() => shuffledQuotes.slice(0, emptySlots.value))

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isVisible(id: string): boolean {
  return props.visibleWidgets.includes(id)
}


function blendedAtYear(year: number, decided: number[], pessimist: number[]): number {
  const d = interpolateAtYear(year, SIM_LABELS, decided)
  const p = interpolateAtYear(year, SIM_LABELS, pessimist)
  return d * (1 - BLEND) + p * BLEND
}

// Toutes les années de projection (2026 → 2100) — toujours visibles sur le graphique.
// Le marqueur currentYear du LineChart indique visuellement où le jeu en est.
const PROJECTION_YEARS = SIM_LABELS.filter(y => y > 2024)

// ─── CO₂ ──────────────────────────────────────────────────────────────────────

const co2Current = computed<number>(() =>
  Math.round(blendedAtYear(gameStore.currentYear, cumulativeCo2.value, cumulativeCo2Pessimist.value) * 10) / 10
)

const co2Labels = computed<number[]>(() => [
  ...props.eco.co2.timeSeries.years,
  ...PROJECTION_YEARS,
])

const co2Datasets = computed<ChartDataset[]>(() => {
  const round1 = (v: number) => Math.round(v * 10) / 10
  const projValues = PROJECTION_YEARS.map(y =>
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
  ...PROJECTION_YEARS,
])

const tempDatasets = computed<ChartDataset[]>(() => {
  const round2 = (v: number) => Math.round(v * 100) / 100
  const projValues = PROJECTION_YEARS.map(y =>
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
  ...PROJECTION_YEARS,
])

const forestDatasets = computed<ChartDataset[]>(() => {
  const round1 = (v: number) => Math.round(v * 10) / 10
  const projValues = PROJECTION_YEARS.map(y =>
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

// ─── Niveau des mers ──────────────────────────────────────────────────────────

const seaLevelCurrent = computed<number>(() =>
  Math.round(interpolateAtYear(
    gameStore.currentYear,
    props.eco.seaLevel.timeSeries.years,
    props.eco.seaLevel.timeSeries.values,
  ))
)

const seaLevelLabels = computed<number[]>(() => props.eco.seaLevel.timeSeries.years)

const seaLevelDatasets = computed<ChartDataset[]>(() => [{
  label:           t('dashboard.sea_level_title'),
  data:            props.eco.seaLevel.timeSeries.values,
  borderColor:     '#60a5fa',
  backgroundColor: 'rgba(96,165,250,0.08)',
  fill:            true,
}])

// ─── Extrêmes climatiques ─────────────────────────────────────────────────────

const extremesMetrics = [
  { valueKey: 'dashboard.extremes_m1_value', shortKey: 'dashboard.extremes_m1_short', labelKey: 'dashboard.extremes_m1_label' },
  { valueKey: 'dashboard.extremes_m2_value', shortKey: 'dashboard.extremes_m2_short', labelKey: 'dashboard.extremes_m2_label' },
  { valueKey: 'dashboard.extremes_m3_value', shortKey: 'dashboard.extremes_m3_short', labelKey: 'dashboard.extremes_m3_label' },
]

const extremesLabels = computed<number[]>(() => props.eco.extremes.timeSeries.years)

const extremesDatasets = computed<ChartDataset[]>(() => [{
  label:           t('dashboard.extremes_section'),
  data:            props.eco.extremes.timeSeries.values,
  borderColor:     '#fb923c',
  backgroundColor: 'rgba(251,146,60,0.08)',
  fill:            true,
}])

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
  ...PROJECTION_YEARS,
])

const energyMixDatasets = computed<ChartDataset[]>(() => {
  return props.eco.energyMix.categories.map(cat => {
    const key = CATEGORY_KEY_MAP[cat.label] as EnergyMixKey | undefined
    const historical = key
      ? props.eco.energyMix.timeSeries.byCategory[key]
      : props.eco.energyMix.timeSeries.years.map(() => cat.value)
    const projValues = key
      ? PROJECTION_YEARS.map(y => {
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
  ...PROJECTION_YEARS,
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
    const projValues = PROJECTION_YEARS.map(y =>
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
