<template>
  <div class="bg-eb-deep border-t border-b border-eb-border py-1 flex items-center gap-2">

    <!-- Bouton pause/lecture (RGAA 13.8) -->
    <button
      class="relative z-10 shrink-0 w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-200 transition-colors focus-visible:ring-2 focus-visible:ring-eb-cyan rounded outline-none ml-2"
      :aria-pressed="paused"
      :aria-label="paused ? 'Reprendre le défilement des indicateurs' : 'Mettre en pause le défilement des indicateurs'"
      @click="paused = !paused"
    >
      <i :class="['fa', paused ? 'fa-play' : 'fa-pause', 'text-xs']" aria-hidden="true"></i>
    </button>

    <!-- Conteneur de clip : fixe, overflow-hidden, flex-1 -->
    <div
      class="relative flex-1 overflow-hidden"
      role="marquee"
      aria-label="Indicateurs planétaires en temps réel"
      :aria-live="paused ? 'polite' : 'off'"
    >
      <!-- Contenu animé : c'est lui qui translate, pas le clipper -->
      <div
        class="animate-ticker flex whitespace-nowrap gap-12 px-4 text-xs text-slate-500"
        :class="{ 'ticker-paused': paused }"
      >
        <template v-for="pass in 2" :key="pass">
          <span
            v-for="(item, i) in items"
            :key="`${pass}-${i}`"
            class="shrink-0"
          >
            {{ item.emoji }}
            {{ item.label }} :
            <span class="font-bold" :class="item.colorClass">{{ item.value }}</span>
          </span>
        </template>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useDashboardStore } from '@/store/dashboard.store'
import { useGameStore } from '@/store/game.store'
import { useSimulationStore, SIM_LABELS } from '@/store/simulation.store'
import { populationTimeSeries, ecologicalCharts } from '@/data/societalIndicators'
import { interpolateAtYear, blendedAtYear } from '@/utils/timeSeries'

const dashStore = useDashboardStore()
const { tickerItems: staticItems } = storeToRefs(dashStore)
const gameStore = useGameStore()
const simStore  = useSimulationStore()
const {
  cumulativeTemp, cumulativeTempPessimist,
  cumulativeForest, cumulativeForestPessimist,
  cumulativeEnergyMix, cumulativeEnergyMixPessimist,
  cumulativeWaterAccess, cumulativeWaterAccessPessimist,
  cumulativeFoodSecurity, cumulativeFoodSecurityPessimist,
} = storeToRefs(simStore)

const paused = ref(false)

// Concentration CO₂ atm. SSP2-4.5 (IPCC AR6 WGI Annexe II) — ne reflète pas les politiques votées
const co2PpmSeries = {
  years:  [1990, 2000, 2010, 2020, 2024, 2030, 2040, 2050, 2060, 2074, 2100],
  values: [ 354,  369,  389,  413,  421,  434,  454,  471,  486,  503,  538],
}

// Élévation pré-industrielle → 1990 (~100 mm) pour ramener la série Δ1990 à une référence pré-industrielle
const SEA_LEVEL_PRE1990_MM = 102

const items = computed(() => {
  const y = gameStore.currentYear

  const tempVal  = (Math.round(blendedAtYear(y, SIM_LABELS, cumulativeTemp.value,   cumulativeTempPessimist.value)   * 100) / 100).toFixed(2)
  const co2Val   = Math.round(interpolateAtYear(y, co2PpmSeries.years, co2PpmSeries.values))
  const seaMm    = interpolateAtYear(y, ecologicalCharts.seaLevel.timeSeries.years, ecologicalCharts.seaLevel.timeSeries.values)
  const seaCm    = Math.round((seaMm + SEA_LEVEL_PRE1990_MM) / 10)
  const forest   = Math.round(blendedAtYear(y, SIM_LABELS, cumulativeForest.value,  cumulativeForestPessimist.value)  * 10) / 10
  const solar    = blendedAtYear(y, SIM_LABELS, cumulativeEnergyMix.value.solar, cumulativeEnergyMixPessimist.value.solar)
  const wind     = blendedAtYear(y, SIM_LABELS, cumulativeEnergyMix.value.wind,  cumulativeEnergyMixPessimist.value.wind)
  const hydro    = blendedAtYear(y, SIM_LABELS, cumulativeEnergyMix.value.hydro, cumulativeEnergyMixPessimist.value.hydro)
  const renew    = Math.round(solar + wind + hydro)
  const water    = Math.round(blendedAtYear(y, SIM_LABELS, cumulativeWaterAccess.value,   cumulativeWaterAccessPessimist.value)   * 10) / 10
  const food     = Math.round(blendedAtYear(y, SIM_LABELS, cumulativeFoodSecurity.value,  cumulativeFoodSecurityPessimist.value)  * 10) / 10
  const popRaw   = interpolateAtYear(y, populationTimeSeries.years, populationTimeSeries.values)

  const overrides: Record<string, string> = {
    '🌡️': `+${tempVal}°C`,
    '💨': `${co2Val} ppm`,
    '🌊': `+${seaCm} cm`,
    '🌲': `${forest}%`,
    '⚡':  `${renew}%`,
    '💧': `${water}%`,
    '🍽️': `${food}/100`,
    '👥': `${(Math.round(popRaw * 10) / 10).toFixed(1)} Mds`,
  }

  return staticItems.value.map(item => {
    const v = overrides[item.emoji]
    return v !== undefined ? { ...item, value: v } : item
  })
})

onMounted(() => {
  if (staticItems.value.length === 0) dashStore.fetchAll()
})
</script>

<style scoped>
.ticker-paused {
  animation-play-state: paused;
}
</style>
