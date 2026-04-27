<template>
  <section aria-labelledby="societal-title">
    <SectionTitle
      id="societal-title"
      :title="t('dashboard.soc_title')"
      icon="fa-globe"
      color-class="text-eb-cyan"
    />

    <div class="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">

      <!-- Sécurité alimentaire -->
      <EbCard extra-class="flex flex-col items-center">
        <div class="text-xs font-bold text-slate-400 mb-2 text-center">
          <i class="fa fa-wheat-awn text-yellow-500 mr-1" aria-hidden="true"></i>
          {{ t('dashboard.food_title') }}
        </div>
        <GaugeChart
          canvas-id="foodGauge"
          :value="foodSecurityCurrent"
          track-color="#facc15"
          :size="110"
          :font-size="22"
          :aria-label="t('dashboard.food_aria', { value: foodSecurityCurrent })"
        >
          <span class="text-xl font-black text-yellow-400">{{ foodSecurityCurrent }}</span>
          <span class="text-xs text-slate-500">/100</span>
        </GaugeChart>
        <div class="mt-2 text-xs text-slate-500">{{ t('dashboard.food_note') }}</div>
      </EbCard>

      <!-- Accès eau potable -->
      <EbCard extra-class="flex flex-col items-center">
        <div class="text-xs font-bold text-slate-400 mb-2 text-center">
          <i class="fa fa-droplet text-blue-400 mr-1" aria-hidden="true"></i>
          {{ t('dashboard.water_title') }}
        </div>
        <GaugeChart
          canvas-id="waterGauge"
          :value="waterAccessCurrent"
          track-color="#38bdf8"
          :size="110"
          :font-size="22"
          :aria-label="t('dashboard.water_aria', { value: waterAccessCurrent })"
        >
          <span class="text-xl font-black text-blue-400">{{ waterAccessCurrent }}</span>
          <span class="text-xs text-slate-500">%</span>
        </GaugeChart>
        <div class="mt-2 text-xs text-slate-500">{{ t('dashboard.water_note') }}</div>
      </EbCard>

      <!-- Tensions géopolitiques -->
      <EbCard>
        <div class="text-xs font-bold text-slate-400 mb-3">
          <i class="fa fa-shield-halved text-red-400 mr-1" aria-hidden="true"></i>
          {{ t('dashboard.conflicts_title') }}
        </div>
        <div class="space-y-2">
          <div
            v-for="indicator in geopoliticalIndicators"
            :key="indicator.label"
          >
            <div class="flex justify-between text-xs mb-1">
              <span class="text-slate-400">{{ indicator.label }}</span>
              <span class="font-bold" :style="{ color: indicator.color }">{{ indicator.value }}/100</span>
            </div>
            <div
              class="bg-eb-border rounded-full h-3 overflow-hidden"
              role="progressbar"
              :aria-label="indicator.label"
              :aria-valuenow="indicator.value"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div
                class="h-full rounded-full"
                :style="{ width: indicator.value + '%', backgroundColor: indicator.color }"
              ></div>
            </div>
          </div>
        </div>
      </EbCard>

      <!-- Santé globale -->
      <EbCard>
        <div class="text-xs font-bold text-slate-400 mb-3">
          <i class="fa fa-heart-pulse text-pink-400 mr-1" aria-hidden="true"></i>
          {{ t('dashboard.health_title') }}
        </div>
        <div class="space-y-2">
          <div
            v-for="stat in globalHealthStats"
            :key="stat.label"
            class="flex items-center justify-between bg-eb-mid rounded-lg px-3 py-2 border border-eb-border"
          >
            <span class="text-xs text-slate-400">{{ stat.label }}</span>
            <span class="font-bold text-sm" :style="{ color: stat.color }">{{ stat.value }}</span>
          </div>
        </div>
      </EbCard>

      <!-- Inégalités (Gini) -->
      <EbCard>
        <div class="text-xs font-bold text-slate-400 mb-3">
          <i class="fa fa-scale-balanced text-purple-400 mr-1" aria-hidden="true"></i>
          {{ t('dashboard.inequality_title') }}
        </div>
        <div class="space-y-2">
          <div
            v-for="stat in inequalityStats"
            :key="stat.label"
            class="flex items-center justify-between bg-eb-mid rounded-lg px-3 py-2 border border-eb-border"
          >
            <span class="text-xs text-slate-400">{{ stat.label }}</span>
            <span class="font-bold text-sm" :style="{ color: stat.color }">{{ stat.value }}</span>
          </div>
        </div>
      </EbCard>

    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import SectionTitle from '@/components/layout/SectionTitle.vue'
import EbCard from '@/components/layout/EbCard.vue'
import GaugeChart from '@/components/charts/GaugeChart.vue'
import { useGameStore } from '@/store/game.store'
import { useSimulationStore, SIM_LABELS } from '@/store/simulation.store'

import type { SocietalIndicators } from '@/types/index'

const { t } = useI18n()

const props = defineProps<{ soc: SocietalIndicators }>()

const gameStore = useGameStore()
const simStore  = useSimulationStore()
const {
  cumulativeFoodSecurity, cumulativeFoodSecurityPessimist,
  cumulativeWaterAccess, cumulativeWaterAccessPessimist,
  cumulativeResourceConflicts, cumulativeResourceConflictsPessimist,
  cumulativeWaterTensions, cumulativeWaterTensionsPessimist,
  cumulativeClimateMigrations, cumulativeClimateMigrationsPessimist,
  cumulativeLifeExpectancy, cumulativeLifeExpectancyPessimist,
  cumulativeRespiratoryDiseases, cumulativeRespiratoryDiseasesPessimist,
  cumulativeWhoHealthIndex, cumulativeWhoHealthIndexPessimist,
  cumulativeGiniCoefficient, cumulativeGiniCoefficientPessimist,
  cumulativeWealthConcentration, cumulativeWealthConcentrationPessimist,
  cumulativeEducationAccess, cumulativeEducationAccessPessimist,
} = storeToRefs(simStore)

const BLEND = 0.5

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

const foodSecurityCurrent = computed(() =>
  Math.round(blendedAtYear(gameStore.currentYear, cumulativeFoodSecurity.value, cumulativeFoodSecurityPessimist.value) * 10) / 10
)

const waterAccessCurrent = computed(() =>
  Math.round(blendedAtYear(gameStore.currentYear, cumulativeWaterAccess.value, cumulativeWaterAccessPessimist.value) * 10) / 10
)

const resourceConflictsCurrent = computed(() =>
  Math.round(blendedAtYear(gameStore.currentYear, cumulativeResourceConflicts.value, cumulativeResourceConflictsPessimist.value) * 10) / 10
)

const waterTensionsCurrent = computed(() =>
  Math.round(blendedAtYear(gameStore.currentYear, cumulativeWaterTensions.value, cumulativeWaterTensionsPessimist.value) * 10) / 10
)

const climateMigrationsCurrent = computed(() =>
  Math.round(blendedAtYear(gameStore.currentYear, cumulativeClimateMigrations.value, cumulativeClimateMigrationsPessimist.value) * 10) / 10
)

const geopoliticalIndicators = computed(() => [
  { label: props.soc.geopoliticalConflicts.subIndicators[0].label, value: resourceConflictsCurrent.value, color: props.soc.geopoliticalConflicts.subIndicators[0].color },
  { label: props.soc.geopoliticalConflicts.subIndicators[1].label, value: waterTensionsCurrent.value,     color: props.soc.geopoliticalConflicts.subIndicators[1].color },
  { label: props.soc.geopoliticalConflicts.subIndicators[2].label, value: climateMigrationsCurrent.value, color: props.soc.geopoliticalConflicts.subIndicators[2].color },
])

const lifeExpectancyCurrent = computed(() =>
  Math.round(blendedAtYear(gameStore.currentYear, cumulativeLifeExpectancy.value, cumulativeLifeExpectancyPessimist.value) * 10) / 10
)

const respiratoryDiseasesCurrent = computed(() =>
  Math.round(blendedAtYear(gameStore.currentYear, cumulativeRespiratoryDiseases.value, cumulativeRespiratoryDiseasesPessimist.value) * 10) / 10
)

const whoHealthIndexCurrent = computed(() =>
  Math.round(blendedAtYear(gameStore.currentYear, cumulativeWhoHealthIndex.value, cumulativeWhoHealthIndexPessimist.value) * 10) / 10
)

function formatRespiratoryDiseases(v: number): string {
  if (v > 0.05)  return `↑ ${Math.round(v)}%`
  if (v < -0.05) return `↓ ${Math.round(-v)}%`
  return `→ 0%`
}

const globalHealthStats = computed(() => [
  { label: props.soc.globalHealth.stats[0].label, value: `${lifeExpectancyCurrent.value.toFixed(1)} ans`,      color: props.soc.globalHealth.stats[0].color },
  { label: props.soc.globalHealth.stats[1].label, value: formatRespiratoryDiseases(respiratoryDiseasesCurrent.value), color: props.soc.globalHealth.stats[1].color },
  { label: props.soc.globalHealth.stats[2].label, value: `${Math.round(whoHealthIndexCurrent.value)}/100`,     color: props.soc.globalHealth.stats[2].color },
])

const giniCurrent = computed(() =>
  Math.round(blendedAtYear(gameStore.currentYear, cumulativeGiniCoefficient.value, cumulativeGiniCoefficientPessimist.value) * 1000) / 1000
)

const wealthConcentrationCurrent = computed(() =>
  Math.round(blendedAtYear(gameStore.currentYear, cumulativeWealthConcentration.value, cumulativeWealthConcentrationPessimist.value) * 10) / 10
)

const educationAccessCurrent = computed(() =>
  Math.round(blendedAtYear(gameStore.currentYear, cumulativeEducationAccess.value, cumulativeEducationAccessPessimist.value) * 10) / 10
)

const inequalityStats = computed(() => [
  { label: props.soc.inequality.stats[0].label, value: giniCurrent.value.toFixed(2),                         color: props.soc.inequality.stats[0].color },
  { label: props.soc.inequality.stats[1].label, value: `${wealthConcentrationCurrent.value.toFixed(1)}% richesse`, color: props.soc.inequality.stats[1].color },
  { label: props.soc.inequality.stats[2].label, value: `${Math.round(educationAccessCurrent.value)}%`,       color: props.soc.inequality.stats[2].color },
])
</script>
