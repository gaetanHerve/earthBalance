<template>
  <main class="max-w-screen-2xl mx-auto px-4 py-6 space-y-8" id="main-content" tabindex="-1">
    <!-- Intro + légende statuts -->
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black text-white mb-1">{{ t('limits.title') }}</h1>
        <p class="text-sm text-slate-400 max-w-2xl leading-relaxed">{{ t('limits.intro') }}</p>
      </div>
      <div class="flex gap-3 text-xs shrink-0">
        <span class="flex items-center gap-1.5 bg-red-900/30 text-red-400 border border-red-700/30 px-2 py-1 rounded-full">
          <svg width="10" height="10" aria-hidden="true" class="shrink-0">
            <polygon points="5,0 10,10 0,10" fill="#ff5050"/>
          </svg>
          {{ t('limits.exceeded') }} ({{ limitsByStatus.depasse.length }})
        </span>
        <span class="flex items-center gap-1.5 bg-yellow-900/30 text-yellow-400 border border-yellow-700/30 px-2 py-1 rounded-full">
          <svg width="9" height="9" aria-hidden="true" class="shrink-0">
            <rect x="0" y="0" width="9" height="9" fill="#facc15"/>
          </svg>
          {{ t('limits.risk_zone') }} ({{ limitsByStatus.zone_incertitude.length }})
        </span>
        <span class="flex items-center gap-1.5 bg-green-900/30 text-eb-green border border-green-700/30 px-2 py-1 rounded-full">
          <svg width="9" height="9" aria-hidden="true" class="shrink-0">
            <circle cx="4.5" cy="4.5" r="4.5" fill="#00ff88"/>
          </svg>
          {{ t('limits.safe') }} ({{ limitsByStatus.safe.length }})
        </span>
      </div>
    </div>

    <!-- Graphique radar global -->
    <section aria-labelledby="radar-title">
      <SectionTitle id="radar-title" :title="t('limits.radar_title')" icon="fa-circle-nodes" color-class="text-eb-cyan" />
      <EbCard>
        <RadarChart
          v-if="radarData"
          canvas-id="globalRadar"
          :labels="localizedRadarLabels"
          :values="dynamicRadarValues"
          :statuses="limitStatuses"
          :height="420"
          :show-earth="true"
          :aria-label="t('limits.radar_aria')"
        />
        <ChartSkeleton v-else :height="420" :label="t('limits.loading_radar')" />
        <p class="text-xs text-slate-500 text-center mt-2">{{ t('limits.radar_note') }}</p>
      </EbCard>
    </section>

    <!-- 9 fiches individuelles -->
    <section aria-labelledby="limits-grid-title">
      <SectionTitle id="limits-grid-title" :title="t('limits.cards_title')" icon="fa-table-cells" color-class="text-eb-green" />

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <template v-if="loading">
          <output
            v-for="i in 9"
            :key="i"
            class="rounded-xl bg-eb-border/30 animate-pulse"
            style="height: 220px"
            aria-live="polite"
            :aria-label="t('limits.loading_card')"
          ></output>
        </template>
        <template v-else>
          <PlanetaryLimitCard
            v-for="(limit, i) in limits"
            :key="limit.id"
            :limit="limit"
            :status="limitStatuses[i]"
            :proj-decided="projDecided(limit.id)"
            :proj-pessimist="projPessimist(limit.id)"
          />
        </template>
      </div>
    </section>

  </main>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { usePlanetsStore } from '@/store/planets.store'
import { useSimulationStore, SIM_LABELS } from '@/store/simulation.store'
import { useGameStore } from '@/store/game.store'
import { useTippingPointsStore } from '@/store/tippingPoints.store'
import { interpolateAtYear } from '@/utils/timeSeries'

import SectionTitle       from '@/components/layout/SectionTitle.vue'
import EbCard             from '@/components/layout/EbCard.vue'
import RadarChart         from '@/components/charts/RadarChart.vue'
import ChartSkeleton      from '@/components/charts/ChartSkeleton.vue'
import PlanetaryLimitCard from '@/components/limits/PlanetaryLimitCard.vue'

const { t, locale } = useI18n()
const store = usePlanetsStore()
const { limits, radarData, loading } = storeToRefs(store)

const gameStore = useGameStore()
const { currentYear } = storeToRefs(gameStore)

const tpStore  = useTippingPointsStore()
const simStore = useSimulationStore()
const {
  cumulativeCo2Ppm,     cumulativeCo2PpmPessimist,
  cumulativeForest,     cumulativeForestPessimist,
  cumulativeTemp,       cumulativeTempPessimist,
  cumulativeEnergyMix,  cumulativeEnergyMixPessimist,
} = storeToRefs(simStore)

// ─── Biodiversité : projection E/MSY ─────────────────────────────────────────
// Deux principaux moteurs de perte de biodiversité (IPBES 2019 / AR6 WGII Ch.2) :
//   1. Perte d'habitat   — approchée par la couverture en forêts primaires
//   2. Stress thermique  — approché par l'anomalie de température mondiale
//
// Pour chaque point i de SIM_LABELS :
//   forestLoss_i    = BASELINE_FOREST_2024 − forest_i   (pp de forêt perdus depuis 2024)
//   tempDelta_i     = temp_i − BASELINE_TEMP_2024        (°C supplémentaires depuis 2024)
//   amplification_i = 1 + K_FOREST × forestLoss_i + K_TEMP × tempDelta_i
//   E/MSY_i         = EMSY_2024 × amplification_i
//
// Coefficients de sensibilité (estimations éducatives, calés sur IPBES/AR6) :
//   K_FOREST = 0.025 — chaque pp de forêt perdue ajoute 2,5 % au taux E/MSY
//   K_TEMP   = 0.06  — chaque °C supplémentaire ajoute 6 % au taux E/MSY
//
// Vérification baseline 2100 : forêt −16 pp, température +2,6 °C
//   → amplification × 1,556 → ≈ 156 E/MSY  (contre 100 en 2024)
// Vérification scénario décidé 2100 (estimation) : forêt −8 pp, température +1,1 °C
//   → amplification × 1,266 → ≈ 127 E/MSY  (écart visible, pédagogiquement utile)

const BASELINE_FOREST_2024 = 58     // % forêts primaires — BASELINE_FOREST[0]
const BASELINE_TEMP_2024   = 1.4    // °C anomalie        — BASELINE_TEMP[0]
const EMSY_2024            = 100    // E/MSY en 2024 (valeur actuelle de la limite)
const K_FOREST             = 0.025  // amplification E/MSY par pp de forêt perdue
const K_TEMP               = 0.06   // amplification E/MSY par °C supplémentaire

const biodiversiteDecided = computed<number[]>(() =>
  cumulativeForest.value.map((forest, i) => {
    const forestLoss = BASELINE_FOREST_2024 - forest
    const tempDelta  = cumulativeTemp.value[i] - BASELINE_TEMP_2024
    return Math.round(EMSY_2024 * (1 + K_FOREST * forestLoss + K_TEMP * tempDelta) * 10) / 10
  })
)

const biodiversitePessimist = computed<number[]>(() =>
  cumulativeForestPessimist.value.map((forest, i) => {
    const forestLoss = BASELINE_FOREST_2024 - forest
    const tempDelta  = cumulativeTempPessimist.value[i] - BASELINE_TEMP_2024
    return Math.round(EMSY_2024 * (1 + K_FOREST * forestLoss + K_TEMP * tempDelta) * 10) / 10
  })
)

// ─── Acidification des océans : projection Ω aragonite ───────────────────────
// L'aragonite dissous d'autant plus vite que le CO₂ atmosphérique est élevé.
// Relation linéaire calibrée sur les données historiques 1950–2024 :
//   - 1950 : CO₂ ≈ 311 ppm → Ω = 3.44
//   - 2024 : CO₂ = 421 ppm → Ω = 2.82
//   - Pente : (2.82 − 3.44) / (421 − 311) ≈ −0.0056 Ω par ppm
//
// Formule :
//   Ω_i = OMEGA_2024 − (ppm_i − PPM_2024) × K_PPM
//
// Vérification baseline 2100 (549 ppm) :
//   Ω = 2.82 − (549 − 421) × 0.0056 = 2.82 − 0.717 ≈ 2.10
//   (seuil limite planétaire : 2.75 — largement dépassé sous BAU)

const OMEGA_2024 = 2.82   // Ω aragonite en 2024
const PPM_2024   = 421    // CO₂ atmosphérique en 2024 (ppm) — BASELINE_CO2_PPM[0]
const K_PPM      = 0.0056 // baisse de Ω par ppm de CO₂ supplémentaire (calibré 1950–2024)

const acidificationDecided = computed<number[]>(() =>
  cumulativeCo2Ppm.value.map(ppm =>
    Math.round((OMEGA_2024 - (ppm - PPM_2024) * K_PPM) * 1000) / 1000
  )
)

const acidificationPessimist = computed<number[]>(() =>
  cumulativeCo2PpmPessimist.value.map(ppm =>
    Math.round((OMEGA_2024 - (ppm - PPM_2024) * K_PPM) * 1000) / 1000
  )
)

// ─── Aérosols atmosphériques : projection AOD ────────────────────────────────
// L'AOD anthropique est dominé par les sulfates et le carbone suie issus de la
// combustion du charbon (~60 % des aérosols anthropiques — Boucher et al. 2013 / AR6 WGI Ch.6).
// Le reste (agriculture, transport, industrie légère) est modélisé comme une fraction fixe.
//
// Quantité de charbon brûlé au point i :
//   coalTWh_i = coal_share_i (%) × totalEnergyTWhAt(year_i) / 100
//
// L'AOD est proportionnel à la quantité absolue de charbon brûlé :
//   AOD_i = AOD_FIXED + (AOD_2024 − AOD_FIXED) × (coalTWh_i / COAL_TWH_2024)
//
// AOD_FIXED = AOD_2024 × (1 − COAL_FRACTION) : composante incompressible (aérosols
//   naturels + sources non-charbon invariantes sur l'horizon de simulation).
//
// Calibration baseline 2100 :
//   coal ≈ 15.5 %, total ≈ 305 000 TWh → coalTWh ≈ 47 275 → ratio ≈ 1.0 → AOD ≈ 0.30
//   (la baisse de part % est compensée par l'augmentation du total d'énergie — BAU stable)
// Calibration scénario décidé 2050 (estimation) :
//   coal ≈ 17 %, total ≈ 236 000 TWh → coalTWh ≈ 40 120 → ratio ≈ 0.85 → AOD ≈ 0.27

const AOD_2024      = 0.3
const COAL_FRACTION = 0.6
const AOD_FIXED     = AOD_2024 * (1 - COAL_FRACTION)  // 0.12 — fraction incompressible
const COAL_TWH_2024 = (27 / 100) * 175272             // ≈ 47 323 TWh (charbon 2024)

const aerosolsDecided = computed<number[]>(() =>
  SIM_LABELS.map((year, i) => {
    const coalTWh = (cumulativeEnergyMix.value.coal[i] / 100) * simStore.totalEnergyTWhAt(year)
    return Math.round((AOD_FIXED + (AOD_2024 - AOD_FIXED) * (coalTWh / COAL_TWH_2024)) * 1000) / 1000
  })
)

const aerosolsPessimist = computed<number[]>(() =>
  SIM_LABELS.map((year, i) => {
    const coalTWh = (cumulativeEnergyMixPessimist.value.coal[i] / 100) * simStore.totalEnergyTWhAt(year)
    return Math.round((AOD_FIXED + (AOD_2024 - AOD_FIXED) * (coalTWh / COAL_TWH_2024)) * 1000) / 1000
  })
)

// ─── Eau douce : projection des prélèvements (km³/an) ────────────────────────
// La demande en eau est pilotée par deux composantes distinctes :
//
//   1. Tendance structurelle (démographie + agriculture) — indépendante de la simulation
//      Extrapolée depuis FAO AQUASTAT / AR6 WGII Ch.4 pour SSP2-4.5 :
//      croissance soutenue jusqu'en ~2050 (transition démographique en cours),
//      puis ralentissement progressif grâce aux gains d'efficacité d'irrigation.
//      Cette composante est identique pour les scénarios décidé et pessimiste —
//      elle ne répond pas aux politiques climatiques du jeu.
//
//   2. Amplification climatique (évapotranspiration + pression sur l'irrigation)
//      Chaque °C supplémentaire augmente les besoins en eau de ~4 %
//      (milieu de fourchette AR6 WGII Ch.4 : 2–6 % par °C, source : Greve et al. 2018).
//      Cette composante est la seule qui diffère entre les scénarios :
//      une décarbonation rapide maintient la pression thermique plus basse.
//
// Formule :
//   withdrawals_i = STRUCTURAL_TREND[i] + W_2024 × K_TEMP × (temp_i − BASELINE_TEMP_2024)
//
// Limitation documentée : le modèle ne capture pas les politiques de gestion de l'eau
//   (tarification, irrigation au goutte-à-goutte, transfert de cultures…). Ces leviers
//   pourraient réduire la tendance structurelle de 10–30 % (FAO, 2018).
//
// Vérifications :
//   2024 (ΔTemp = 0) → 2600 + 0 = 2600 km³/an ✓ (cohérent avec currentValue)
//   2100 baseline (ΔTemp = +2,6 °C) → 3300 + 2600 × 0,04 × 2,6 ≈ 3570 km³/an
//   2100 décidé   (ΔTemp ≈ +1,1 °C) → 3300 + 2600 × 0,04 × 1,1 ≈ 3414 km³/an
//   Écart décidé/baseline à 2100 : ~156 km³/an (< seuil de 4 000 km³/an dans les deux cas)

// Tendance structurelle sur SIM_LABELS = [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074, 2100]
// Source : FAO AQUASTAT ; AR6 WGII Ch.4 table 4.2 ; hypothèses SSP2 avec gains d'efficacité modérés
const STRUCTURAL_WATER_TREND = [2600, 2660, 2720, 2775, 2875, 3000, 3100, 3175, 3250, 3300]

const W_2024  = 2600   // prélèvements 2024 en km³/an — base de l'amplification climatique
const K_WATER = 0.04   // +4 % de demande par °C supplémentaire (AR6 WGII Ch.4)

const eauDouceDecided = computed<number[]>(() =>
  SIM_LABELS.map((_, i) => {
    const tempDelta = cumulativeTemp.value[i] - BASELINE_TEMP_2024
    return Math.round((STRUCTURAL_WATER_TREND[i] + W_2024 * K_WATER * tempDelta) * 10) / 10
  })
)

const eauDoucePessimist = computed<number[]>(() =>
  SIM_LABELS.map((_, i) => {
    const tempDelta = cumulativeTempPessimist.value[i] - BASELINE_TEMP_2024
    return Math.round((STRUCTURAL_WATER_TREND[i] + W_2024 * K_WATER * tempDelta) * 10) / 10
  })
)

function projDecided(id: string): number[] | undefined {
  switch (id) {
    case 'changement-climatique':   return cumulativeCo2Ppm.value
    case 'usage-terres':            return cumulativeForest.value
    case 'biodiversite':            return biodiversiteDecided.value
    case 'acidification-oceans':    return acidificationDecided.value
    case 'aerosols-atmospheriques': return aerosolsDecided.value
    case 'eau-douce':               return eauDouceDecided.value
    default:                        return undefined
  }
}
function projPessimist(id: string): number[] | undefined {
  switch (id) {
    case 'changement-climatique':   return cumulativeCo2PpmPessimist.value
    case 'usage-terres':            return cumulativeForestPessimist.value
    case 'biodiversite':            return biodiversitePessimist.value
    case 'acidification-oceans':    return acidificationPessimist.value
    case 'aerosols-atmospheriques': return aerosolsPessimist.value
    case 'eau-douce':               return eauDoucePessimist.value
    default:                        return undefined
  }
}

// ─── Radar dynamique ──────────────────────────────────────────────────────────
// Pour chaque limite ayant un driver simulation, on interpole la valeur projetée
// au currentYear (blend 50 % décidé / pessimiste) puis on recalcule le ratio
// avec la même convention que la donnée statique, afin de ne pas créer de rupture
// visuelle entre les fiches individuelles et le radar.
//
// Convention par limite :
//   ratio = valeur / seuil  → CO₂, biodiversité, acidification*, aérosols, eau douce
//   ratio = seuil / valeur  → usage des terres (forêt ↓ = pire)
//   ratio statique conservé → cycle azote, cycle phosphore, ozone (pas de driver sim)
//
// * acidification : Ω ↓ = pire, mais le ratio statique est Ω/seuil (ratio ↓ quand ça empire).
//   On maintient cette convention pour rester cohérent avec PlanetaryLimitCard.
//   Sur le radar, le point se rapproche du centre quand la situation empire — limite documentée.

const BLEND = 0.5

function computeDynamicRatio(id: string, value: number, threshold: number, staticRatio: number): number {
  switch (id) {
    case 'changement-climatique':   // CO₂ ppm ↑ = pire
    case 'biodiversite':            // E/MSY ↑ = pire
    case 'acidification-oceans':    // Ω aragonite ↓ = pire (convention: Ω/seuil, voir note)
    case 'aerosols-atmospheriques': // AOD ↑ = pire
    case 'eau-douce':               // km³/an ↑ = pire
      return value / threshold
    case 'usage-terres':            // % forêts ↓ = pire
      return threshold / value
    default:
      return staticRatio
  }
}

function tpRatioOffset(limitId: string): number {
  switch (limitId) {
    case 'biodiversite':
      return interpolateAtYear(currentYear.value, SIM_LABELS, tpStore.biodiversityRatioOffset)
    case 'acidification-oceans':
      return interpolateAtYear(currentYear.value, SIM_LABELS, tpStore.acidificationRatioOffset)
    case 'eau-douce':
      return interpolateAtYear(currentYear.value, SIM_LABELS, tpStore.waterRatioOffset)
    default:
      return 0
  }
}

const dynamicRadarValues = computed<number[]>(() =>
  limits.value.map(limit => {
    const decided   = projDecided(limit.id)
    const pessimist = projPessimist(limit.id)
    if (!decided || !pessimist) return Math.min(limit.ratio, 2)
    const d       = interpolateAtYear(currentYear.value, SIM_LABELS, decided)
    const p       = interpolateAtYear(currentYear.value, SIM_LABELS, pessimist)
    const blended = d * (1 - BLEND) + p * BLEND
    const base    = computeDynamicRatio(limit.id, blended, limit.threshold, limit.ratio)
    return Math.min(base + tpRatioOffset(limit.id), 2)
  })
)

type LimitStatus = 'safe' | 'zone_incertitude' | 'depasse'

// Limites pour lesquelles la simulation produit un driver — les autres restent statiques.
const LIMITS_WITH_DRIVERS = new Set([
  'changement-climatique', 'usage-terres', 'biodiversite',
  'acidification-oceans', 'aerosols-atmospheriques', 'eau-douce',
])

function ratioToStatus(id: string, ratio: number, staticStatus: LimitStatus): LimitStatus {
  if (!LIMITS_WITH_DRIVERS.has(id)) return staticStatus
  // Acidification : ratio = Ω/seuil — convention inversée (ratio ↓ = pire)
  if (id === 'acidification-oceans') {
    if (ratio < 1)    return 'depasse'
    if (ratio < 1.15) return 'zone_incertitude'
    return 'safe'
  }
  // Tous les autres : ratio ↑ = pire
  if (ratio > 1)    return 'depasse'
  if (ratio > 0.85) return 'zone_incertitude'
  return 'safe'
}

const localizedRadarLabels = computed<string[]>(() =>
  limits.value.map((l: { name: string; nameEn: string }) => locale.value === 'en' ? l.nameEn : l.name)
)

const limitStatuses = computed<LimitStatus[]>(() =>
  limits.value.map((l, i) =>
    ratioToStatus(l.id, dynamicRadarValues.value[i], l.status as LimitStatus)
  )
)

const limitsByStatus = computed(() => ({
  depasse:          limits.value.filter((_, i) => limitStatuses.value[i] === 'depasse'),
  zone_incertitude: limits.value.filter((_, i) => limitStatuses.value[i] === 'zone_incertitude'),
  safe:             limits.value.filter((_, i) => limitStatuses.value[i] === 'safe'),
}))

onMounted(() => store.fetchAll())
</script>
