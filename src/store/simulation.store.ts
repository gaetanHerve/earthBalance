// ─── Simulation Store ─────────────────────────────────────────────────────────
//
// Moteur de calcul déterministe pour la démo de simulation de politiques.
// Charge les décisions disponibles, maintient la séquence choisie par le joueur,
// et calcule les projections CO₂ et température cumulées.
//
// Approche : delta additif (sans interactions inter-politiques pour le POC).
// Chaque décision contribue : delta_i[j] = decided[j] - baseline[j]
// Cumul : baseline[j] + Σ delta_i[j]
//
// Seules les décisions avec modèle d'impact complet (emissionsReductionGtCO2yr)
// sont incluses dans le catalogue de simulation.

import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { mitigationPolicies as allMitigationPolicies } from '@/data/mitigationPolicies'
import type { MitigationPolicy, MitigationPolicyProjections, EnergyMixKey, ResourceKey, SocietalKey } from '@/types/index'
import { useMitigationPoliciesStore } from './mitigationPolicies.store'
import { useTippingPointsStore } from './tippingPoints.store'
import { GAME_CONFIG } from '@/config/game.config'
import { STORAGE_KEYS } from '@/config/storageKeys'
import { SIM_LABELS } from '@/config/simulation.config'
import { interpolateAtYear } from '@/utils/timeSeries'

// ─── Baseline SSP2-4.5 (référence partagée) ───────────────────────────────────
export { SIM_LABELS } from '@/config/simulation.config'
export const BASELINE_CO2  = [37.4, 39, 40.5, 42, 45.1, 49.2, 54, 58, 63, 70]
export const BASELINE_TEMP = [1.4, 1.5, 1.6, 1.72, 1.95, 2.2, 2.6, 3, 3.5, 4]

// Labels des projections dans les données de politique (9 points, hors 2100)
const PROJ_LABELS = [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074]

// Concentration atmosphérique de CO₂ (ppm) — SSP2-4.5 (source : CMIP6 / Meinshausen et al.)
export const BASELINE_CO2_PPM = [421, 425, 429, 433, 443, 460, 487, 510, 527, 549]

// Forêts primaires mondiales restantes (% de la couverture originelle) — SSP2-4.5
// Source : Mackey et al. 2015 / Steffen et al. 2015 (limite planétaire usage des terres) : 58 % en 2024
export const BASELINE_FOREST = [58.0, 57.5, 57.0, 56.5, 55.3, 53.5, 50.5, 47.5, 43.5, 42.0]

// Total énergie primaire mondiale (TWh, hors biomasse traditionnelle) — IEA STEPS / SSP2-4.5
// Utilisé pour convertir les parts % du mix en valeurs absolues TWh
// 2024 : données réelles Energy Institute ; 2026-2100 : projection tendancielle
const BASELINE_ENERGY_TOTAL_TWH = [175272, 180000, 184000, 188000, 197000, 213000, 236000, 256000, 278000, 305000]

// Mix énergétique mondial (% du total énergie primaire) — IEA STEPS
const ENERGY_MIX_KEYS: EnergyMixKey[] = ['coal', 'oil', 'gas', 'nuclear', 'solar', 'wind', 'hydro', 'autres']
export const BASELINE_ENERGY_MIX: Record<EnergyMixKey, number[]> = {
  coal:    [27,   26.5, 26,   25.5, 24.5, 22.5, 20,   18,   15.5],
  oil:     [31,   30.5, 30,   29.5, 28.5, 27.5, 26,   24,   22  ],
  gas:     [23,   23,   23.5, 23.5, 23,   22.5, 22,   21,   20  ],
  nuclear: [5,    5,    5,    5,    5,    5,    5.5,  5.5,  5.5 ],
  solar:   [5,    5.5,  6,    6.5,  8,    10,   12.5, 14.5, 17  ],
  wind:    [4,    4.5,  5,    5.5,  7,    8.5,  10,   12,   14.5],
  hydro:   [3,    3,    3,    3,    3,    3,    3,    3,    3   ],
  autres:  [2,    2,    1.5,  1.5,  1,    1,    1,    2,    2.5 ],
}

// Extraction de ressources naturelles (Gt/an) — UNEP Global Resources Outlook
const RESOURCE_KEYS: ResourceKey[] = ['minerals', 'biomass', 'fossilFuels']
export const BASELINE_RESOURCES: Record<ResourceKey, number[]> = {
  minerals:    [21.0, 21.8, 22.5, 23.3, 25.0, 27.5, 31.0, 34.0, 37.0],
  biomass:     [17.1, 17.4, 17.7, 18.0, 18.6, 19.5, 21.0, 22.5, 24.0],
  fossilFuels: [13.9, 14.3, 14.7, 15.0, 15.5, 16.0, 16.5, 16.8, 17.0],
}

// Sécurité alimentaire (indice FAO /100) — SSP2-4.5 : dégradation après 2030 sous pression climatique
// Source : AR6 WGII Ch.5 (agricultural systems) ; FAO SOFI 2023
export const BASELINE_FOOD_SECURITY = [63, 62.8, 62.5, 62, 61, 59.5, 57, 54, 50, 46]

// Accès à l'eau potable (% population mondiale) — SSP2-4.5 : progression continue mais ralentissante
// Source : WHO/UNICEF JMP ; AR6 WGII Ch.4 (water resources)
export const BASELINE_WATER_ACCESS = [71, 71.5, 72, 72.5, 73.5, 75, 77, 79, 81, 82]

// Tensions géopolitiques — scores de tension (0-100, plus haut = pire) — SSP2-4.5 sans action
// Source : AR6 WGII Ch.7 (conflits, migrations) ; ACLED ; UNHCR
export const BASELINE_RESOURCE_CONFLICTS  = [74, 74.5, 75, 76, 78, 80, 82, 84, 85, 87]
export const BASELINE_WATER_TENSIONS      = [61, 61.5, 62, 63, 65, 68, 71, 73, 75, 77]
export const BASELINE_CLIMATE_MIGRATIONS  = [55, 55.5, 56.5, 58, 61, 65, 68, 71, 74, 77]

// Santé globale — SSP2-4.5 sans action
// Source : AR6 WGII Ch.7 (santé) ; OMS GHO ; Lancet Countdown on Health & Climate Change
export const BASELINE_LIFE_EXPECTANCY      = [73.4, 73.3, 73.2, 73.0, 72.5, 71.8, 70.5, 69.0, 67.0, 65.0]  // années
export const BASELINE_RESPIRATORY_DISEASES = [18, 19, 20, 21, 23, 26, 30, 34, 38, 42]                        // % d'augmentation vs 2000
export const BASELINE_WHO_HEALTH_INDEX     = [67, 66.5, 66, 65.5, 64.5, 63, 61, 59, 57, 55]                 // /100

// Inégalités — SSP2-4.5 sans action : les impacts climatiques creusent les inégalités
// Source : AR6 WGII Ch.16 (pauvreté & inégalité) ; World Inequality Report 2022 ; WID.world
export const BASELINE_GINI_COEFFICIENT     = [0.670, 0.671, 0.673, 0.675, 0.679, 0.684, 0.692, 0.700, 0.708, 0.715]
export const BASELINE_WEALTH_CONCENTRATION = [45, 45.3, 45.6, 46.0, 47.0, 48.5, 50.5, 52.5, 54.5, 56.0]    // % richesse du top 1%
export const BASELINE_EDUCATION_ACCESS     = [61, 61.3, 61.5, 61.8, 62.3, 63.0, 63.5, 64.0, 64.3, 64.5]    // % population avec accès éducation secondaire+

const SELECTED_KEY  = STORAGE_KEYS.SIMULATION_SELECTED
const BASELINE_KEY  = STORAGE_KEYS.SIMULATION_BASELINE
const SIM_BASE_YEAR = 2024

// ─── Helpers projection ───────────────────────────────────────────────────────

function hasImpactModel(d: MitigationPolicy): boolean {
  return typeof d.projectedImpact['emissionsReductionGtCO2yr'] === 'number'
}

function hasProjections(d: MitigationPolicy): d is MitigationPolicy & { projections: MitigationPolicyProjections } {
  const p = d.projections as Partial<MitigationPolicyProjections>
  return Array.isArray(p?.co2?.decided) && Array.isArray(p?.temperature?.decided)
}

// Delta d'une politique avec décalage temporel (effectiveStart).
// À l'année t :
//   - si t < effectiveStart → delta = 0 (politique pas encore en vigueur)
//   - sinon → delta de l'original à l'année 2024 + (t - effectiveStart)
function shiftedDeltas(
  projLabels: number[],
  projValues: number[],
  projBaseline: number[],
  effectiveStart: number,
): number[] {
  return SIM_LABELS.map(year => {
    if (year < effectiveStart) return 0
    const mappedYear = 2024 + (year - effectiveStart)
    return interpolateAtYear(mappedYear, projLabels, projValues) - interpolateAtYear(mappedYear, projLabels, projBaseline)
  })
}

function co2Deltas(dec: MitigationPolicy, effectiveStart: number): number[] {
  if (!hasProjections(dec)) return SIM_LABELS.map(() => 0)
  const proj = dec.projections as MitigationPolicyProjections
  return shiftedDeltas(proj.labels, proj.co2.decided, proj.co2.baseline, effectiveStart)
}

function co2DeltasPessimist(dec: MitigationPolicy, effectiveStart: number): number[] {
  if (!hasProjections(dec)) return SIM_LABELS.map(() => 0)
  const proj = dec.projections as MitigationPolicyProjections
  return shiftedDeltas(proj.labels, proj.co2.pessimist, proj.co2.baseline, effectiveStart)
}

function tempDeltas(dec: MitigationPolicy, effectiveStart: number): number[] {
  if (!hasProjections(dec)) return SIM_LABELS.map(() => 0)
  const proj = dec.projections as MitigationPolicyProjections
  return shiftedDeltas(proj.labels, proj.temperature.decided, proj.temperature.baseline, effectiveStart)
}

function tempDeltasPessimist(dec: MitigationPolicy, effectiveStart: number): number[] {
  if (!hasProjections(dec)) return SIM_LABELS.map(() => 0)
  const proj = dec.projections as MitigationPolicyProjections
  return shiftedDeltas(proj.labels, proj.temperature.pessimist, proj.temperature.baseline, effectiveStart)
}

// Delta direct (valeurs déjà exprimées en delta vs. baseline)
function shiftedDeltasDirect(projDeltas: number[], effectiveStart: number): number[] {
  return SIM_LABELS.map(year => {
    if (year < effectiveStart) return 0
    const mappedYear = 2024 + (year - effectiveStart)
    return interpolateAtYear(mappedYear, PROJ_LABELS, projDeltas)
  })
}

function forestDeltas(dec: MitigationPolicy, effectiveStart: number): number[] {
  const proj = dec.projections as Partial<MitigationPolicyProjections>
  if (!Array.isArray(proj?.forest?.decided)) return SIM_LABELS.map(() => 0)
  return shiftedDeltas(PROJ_LABELS, proj.forest!.decided, proj.forest!.baseline, effectiveStart)
}

function forestDeltasPessimist(dec: MitigationPolicy, effectiveStart: number): number[] {
  const proj = dec.projections as Partial<MitigationPolicyProjections>
  if (!Array.isArray(proj?.forest?.decided)) return SIM_LABELS.map(() => 0)
  return shiftedDeltas(PROJ_LABELS, proj.forest!.pessimist, proj.forest!.baseline, effectiveStart)
}

function energyMixDeltaArr(dec: MitigationPolicy, effectiveStart: number, cat: EnergyMixKey, scenario: 'decided' | 'pessimist'): number[] {
  const proj = dec.projections as Partial<MitigationPolicyProjections>
  const deltas = proj?.energyMix?.[cat]?.[scenario]
  if (!Array.isArray(deltas)) return SIM_LABELS.map(() => 0)
  return shiftedDeltasDirect(deltas, effectiveStart)
}

function resourceDeltaArr(dec: MitigationPolicy, effectiveStart: number, res: ResourceKey, scenario: 'decided' | 'pessimist'): number[] {
  const proj = dec.projections as Partial<MitigationPolicyProjections>
  const deltas = proj?.resources?.[res]?.[scenario]
  if (!Array.isArray(deltas)) return SIM_LABELS.map(() => 0)
  return shiftedDeltasDirect(deltas, effectiveStart)
}

function societalDeltaArr(dec: MitigationPolicy, effectiveStart: number, key: SocietalKey, scenario: 'decided' | 'pessimist'): number[] {
  const proj = dec.projections as Partial<MitigationPolicyProjections>
  const deltas = proj?.societal?.[key]?.[scenario]
  if (!Array.isArray(deltas)) return SIM_LABELS.map(() => 0)
  return shiftedDeltasDirect(deltas, effectiveStart)
}

// ─── Helpers ppm CO₂ ─────────────────────────────────────────────────────────
// Airborne fraction × (1 ppm = 7.81 GtCO₂): 0.45 / 7.81 ≈ 0.0576 ppm per GtCO₂/yr per year
const PPM_PER_GTCO2_YR = 0.45 / 7.81

// Compute atmospheric CO₂ ppm from annual emissions array (same indices as SIM_LABELS).
// Policy-induced emission savings reduce atmospheric accumulation relative to baseline.
function ppmFromEmissionSavings(annualEmissions: number[]): number[] {
  const result: number[] = [BASELINE_CO2_PPM[0]]
  let cumSaved = 0
  for (let i = 0; i < SIM_LABELS.length - 1; i++) {
    const years      = SIM_LABELS[i + 1] - SIM_LABELS[i]
    const savingI    = BASELINE_CO2[i]     - annualEmissions[i]
    const savingNext = BASELINE_CO2[i + 1] - annualEmissions[i + 1]
    cumSaved += (savingI + savingNext) / 2 * years * PPM_PER_GTCO2_YR
    result.push(Math.round((BASELINE_CO2_PPM[i + 1] - cumSaved) * 10) / 10)
  }
  return result
}

// ─── Helpers simulateur (séquence grain-based) ────────────────────────────────

// Année d'adoption simulée pour la position `index` dans la séquence
// Toutes les politiques (verrouillées ou non) suivent la même règle
export function simulatorAdoptionYearAt(index: number): number {
  return SIM_BASE_YEAR + index * GAME_CONFIG.grain
}

// Année de premier effet simulée = adoption + lag
function simEffectiveStart(index: number, lag: number): number {
  return simulatorAdoptionYearAt(index) + lag
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useSimulationStore = defineStore('simulation', () => {

  const policiesStore = useMitigationPoliciesStore()
  const tpStore       = useTippingPointsStore()

  // Catalogue : politiques avec modèle d'impact, statuts à jour depuis le store de politiques
  const catalogue = computed<MitigationPolicy[]>(() => {
    const validatedSet = new Set(policiesStore.validatedPolicyIds)
    const withStatus = allMitigationPolicies.map(p =>
      validatedSet.has(p.id) ? { ...p, status: 'validated' as const } : p
    )
    const valid = withStatus.filter(d => hasImpactModel(d) && hasProjections(d))
    return [...valid.filter(d => d.status === 'validated'), ...valid.filter(d => d.status !== 'validated')]
  })

  // IDs des politiques verrouillées (validées par scrutin et présentes dans le catalogue)
  const lockedIds = computed<string[]>(() =>
    policiesStore.validatedPolicyIds.filter(id => catalogue.value.some(d => d.id === id))
  )

  // ─── Toggle mode jeu / mode libre ─────────────────────────────────────────
  //
  // Mode jeu (true)  : politiques verrouillées ancrées en tête de séquence,
  //                    dans l'ordre de validation, non-déplaçables.
  //                    Projection "à partir de l'année courante du jeu".
  //
  // Mode libre (false) : toutes les politiques librement ajoutables /
  //                      retirables / ordonnables. Projection à partir de 2024.

  const includeGameBaseline = ref<boolean>(
    localStorage.getItem(BASELINE_KEY) !== 'false'
  )

  watch(includeGameBaseline, (newVal) => {
    localStorage.setItem(BASELINE_KEY, String(newVal))
    // En mode jeu, épure selectedIds des éventuels IDs verrouillés
    // (ils seront injectés automatiquement via fullSequenceIds)
    if (newVal) {
      selectedIds.value = selectedIds.value.filter(id => !lockedIds.value.includes(id))
    }
  })

  // ─── Séquence ─────────────────────────────────────────────────────────────

  function loadSelectedIds(): string[] {
    try {
      const raw = localStorage.getItem(SELECTED_KEY)
      if (!raw) return []
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  const selectedIds = ref<string[]>(loadSelectedIds())

  watch(selectedIds, ids => localStorage.setItem(SELECTED_KEY, JSON.stringify(ids)), { deep: true })

  // Séquence complète ordonnée :
  //   Mode jeu  → [locked₀, locked₁, …, libre₀, libre₁, …]
  //   Mode libre → selectedIds tel quel
  const fullSequenceIds = computed<string[]>(() => {
    if (includeGameBaseline.value) {
      const freeIds = selectedIds.value.filter(id => !lockedIds.value.includes(id))
      return [...lockedIds.value, ...freeIds]
    }
    return selectedIds.value
  })

  // Politiques dans l'ordre de la séquence complète
  const selectedMitigationPolicies = computed<MitigationPolicy[]>(() =>
    fullSequenceIds.value
      .map(id => catalogue.value.find(d => d.id === id))
      .filter((d): d is MitigationPolicy => d !== undefined)
  )

  // IDs effectivement verrouillés (non-déplaçables) : uniquement en mode jeu
  const effectiveLockedIds = computed<string[]>(() =>
    includeGameBaseline.value ? lockedIds.value : []
  )

  // ─── Années d'adoption et de premier effet simulées ───────────────────────

  const simulatorAdoptionYears = computed<number[]>(() =>
    selectedMitigationPolicies.value.map((_, index) => simulatorAdoptionYearAt(index))
  )

  const simulatorEffectYears = computed<number[]>(() =>
    selectedMitigationPolicies.value.map((dec, index) =>
      simEffectiveStart(index, dec.implementationLag ?? 0)
    )
  )

  // ─── Projections dashboard (logique meta.year + lag, inchangée) ───────────
  // Utilisées par EcologicalIndicators.vue

  function effectiveStartOf(decId: string): number {
    const meta = policiesStore.validatedPolicyMeta.find(m => m.id === decId)
    const startYear = meta?.year ?? 2024
    const lag = policiesStore.getMitigationPolicy(decId)?.implementationLag ?? 0
    return startYear + lag
  }

  const cumulativeCo2 = computed<number[]>(() =>
    BASELINE_CO2.map((base, i) => {
      const delta = selectedMitigationPolicies.value.reduce(
        (s, dec) => s + co2Deltas(dec, effectiveStartOf(dec.id))[i], 0)
      return Math.round((base + delta) * 10) / 10
    })
  )

  const cumulativeCo2Pessimist = computed<number[]>(() =>
    BASELINE_CO2.map((base, i) => {
      const delta = selectedMitigationPolicies.value.reduce(
        (s, dec) => s + co2DeltasPessimist(dec, effectiveStartOf(dec.id))[i], 0)
      return Math.round((base + delta) * 10) / 10
    })
  )

  const cumulativeCo2Ppm = computed<number[]>(() =>
    ppmFromEmissionSavings(cumulativeCo2.value)
      .map((v, i) => Math.round((v + tpStore.co2PpmOffset[i]) * 10) / 10)
  )
  const cumulativeCo2PpmPessimist = computed<number[]>(() =>
    ppmFromEmissionSavings(cumulativeCo2Pessimist.value)
      .map((v, i) => Math.round((v + tpStore.co2PpmOffset[i]) * 10) / 10)
  )

  const cumulativeTemp = computed<number[]>(() =>
    BASELINE_TEMP.map((base, i) => {
      const delta = selectedMitigationPolicies.value.reduce(
        (s, dec) => s + tempDeltas(dec, effectiveStartOf(dec.id))[i], 0)
      return Math.round((base + delta + tpStore.tempOffset[i]) * 100) / 100
    })
  )

  const cumulativeTempPessimist = computed<number[]>(() =>
    BASELINE_TEMP.map((base, i) => {
      const delta = selectedMitigationPolicies.value.reduce(
        (s, dec) => s + tempDeltasPessimist(dec, effectiveStartOf(dec.id))[i], 0)
      return Math.round((base + delta + tpStore.tempOffset[i]) * 100) / 100
    })
  )

  const cumulativeForest = computed<number[]>(() =>
    BASELINE_FOREST.map((base, i) => {
      const delta = selectedMitigationPolicies.value.reduce(
        (s, dec) => s + forestDeltas(dec, effectiveStartOf(dec.id))[i], 0)
      return Math.round((base + delta + tpStore.forestOffset[i]) * 10) / 10
    })
  )

  const cumulativeForestPessimist = computed<number[]>(() =>
    BASELINE_FOREST.map((base, i) => {
      const delta = selectedMitigationPolicies.value.reduce(
        (s, dec) => s + forestDeltasPessimist(dec, effectiveStartOf(dec.id))[i], 0)
      return Math.round((base + delta + tpStore.forestOffset[i]) * 10) / 10
    })
  )

  const cumulativeEnergyMix = computed<Record<EnergyMixKey, number[]>>(() => {
    const result = {} as Record<EnergyMixKey, number[]>
    for (const cat of ENERGY_MIX_KEYS) {
      result[cat] = SIM_LABELS.map((year, i) => {
        const base = interpolateAtYear(year, PROJ_LABELS, BASELINE_ENERGY_MIX[cat])
        const delta = selectedMitigationPolicies.value.reduce(
          (s, dec) => s + energyMixDeltaArr(dec, effectiveStartOf(dec.id), cat, 'decided')[i], 0)
        return base + delta
      })
    }
    return result
  })

  const cumulativeEnergyMixPessimist = computed<Record<EnergyMixKey, number[]>>(() => {
    const result = {} as Record<EnergyMixKey, number[]>
    for (const cat of ENERGY_MIX_KEYS) {
      result[cat] = SIM_LABELS.map((year, i) => {
        const base = interpolateAtYear(year, PROJ_LABELS, BASELINE_ENERGY_MIX[cat])
        const delta = selectedMitigationPolicies.value.reduce(
          (s, dec) => s + energyMixDeltaArr(dec, effectiveStartOf(dec.id), cat, 'pessimist')[i], 0)
        return base + delta
      })
    }
    return result
  })

  const cumulativeResources = computed<Record<ResourceKey, number[]>>(() => {
    const result = {} as Record<ResourceKey, number[]>
    for (const res of RESOURCE_KEYS) {
      result[res] = SIM_LABELS.map((year, i) => {
        const base = interpolateAtYear(year, PROJ_LABELS, BASELINE_RESOURCES[res])
        const delta = selectedMitigationPolicies.value.reduce(
          (s, dec) => s + resourceDeltaArr(dec, effectiveStartOf(dec.id), res, 'decided')[i], 0)
        return Math.round((base + delta) * 10) / 10
      })
    }
    return result
  })

  const cumulativeResourcesPessimist = computed<Record<ResourceKey, number[]>>(() => {
    const result = {} as Record<ResourceKey, number[]>
    for (const res of RESOURCE_KEYS) {
      result[res] = SIM_LABELS.map((year, i) => {
        const base = interpolateAtYear(year, PROJ_LABELS, BASELINE_RESOURCES[res])
        const delta = selectedMitigationPolicies.value.reduce(
          (s, dec) => s + resourceDeltaArr(dec, effectiveStartOf(dec.id), res, 'pessimist')[i], 0)
        return Math.round((base + delta) * 10) / 10
      })
    }
    return result
  })

  const cumulativeFoodSecurity = computed<number[]>(() =>
    BASELINE_FOOD_SECURITY.map((base, i) => {
      const delta = selectedMitigationPolicies.value.reduce(
        (s, dec) => s + societalDeltaArr(dec, effectiveStartOf(dec.id), 'foodSecurity', 'decided')[i], 0)
      return Math.round((base + delta) * 10) / 10
    })
  )

  const cumulativeFoodSecurityPessimist = computed<number[]>(() =>
    BASELINE_FOOD_SECURITY.map((base, i) => {
      const delta = selectedMitigationPolicies.value.reduce(
        (s, dec) => s + societalDeltaArr(dec, effectiveStartOf(dec.id), 'foodSecurity', 'pessimist')[i], 0)
      return Math.round((base + delta) * 10) / 10
    })
  )

  const cumulativeWaterAccess = computed<number[]>(() =>
    BASELINE_WATER_ACCESS.map((base, i) => {
      const delta = selectedMitigationPolicies.value.reduce(
        (s, dec) => s + societalDeltaArr(dec, effectiveStartOf(dec.id), 'waterAccess', 'decided')[i], 0)
      return Math.round((base + delta) * 10) / 10
    })
  )

  const cumulativeWaterAccessPessimist = computed<number[]>(() =>
    BASELINE_WATER_ACCESS.map((base, i) => {
      const delta = selectedMitigationPolicies.value.reduce(
        (s, dec) => s + societalDeltaArr(dec, effectiveStartOf(dec.id), 'waterAccess', 'pessimist')[i], 0)
      return Math.round((base + delta) * 10) / 10
    })
  )

  const cumulativeResourceConflicts = computed<number[]>(() =>
    BASELINE_RESOURCE_CONFLICTS.map((base, i) => {
      const delta = selectedMitigationPolicies.value.reduce(
        (s, dec) => s + societalDeltaArr(dec, effectiveStartOf(dec.id), 'resourceConflicts', 'decided')[i], 0)
      return Math.round((base + delta) * 10) / 10
    })
  )

  const cumulativeResourceConflictsPessimist = computed<number[]>(() =>
    BASELINE_RESOURCE_CONFLICTS.map((base, i) => {
      const delta = selectedMitigationPolicies.value.reduce(
        (s, dec) => s + societalDeltaArr(dec, effectiveStartOf(dec.id), 'resourceConflicts', 'pessimist')[i], 0)
      return Math.round((base + delta) * 10) / 10
    })
  )

  const cumulativeWaterTensions = computed<number[]>(() =>
    BASELINE_WATER_TENSIONS.map((base, i) => {
      const delta = selectedMitigationPolicies.value.reduce(
        (s, dec) => s + societalDeltaArr(dec, effectiveStartOf(dec.id), 'waterTensions', 'decided')[i], 0)
      return Math.round((base + delta) * 10) / 10
    })
  )

  const cumulativeWaterTensionsPessimist = computed<number[]>(() =>
    BASELINE_WATER_TENSIONS.map((base, i) => {
      const delta = selectedMitigationPolicies.value.reduce(
        (s, dec) => s + societalDeltaArr(dec, effectiveStartOf(dec.id), 'waterTensions', 'pessimist')[i], 0)
      return Math.round((base + delta) * 10) / 10
    })
  )

  const cumulativeClimateMigrations = computed<number[]>(() =>
    BASELINE_CLIMATE_MIGRATIONS.map((base, i) => {
      const delta = selectedMitigationPolicies.value.reduce(
        (s, dec) => s + societalDeltaArr(dec, effectiveStartOf(dec.id), 'climateMigrations', 'decided')[i], 0)
      return Math.round((base + delta) * 10) / 10
    })
  )

  const cumulativeClimateMigrationsPessimist = computed<number[]>(() =>
    BASELINE_CLIMATE_MIGRATIONS.map((base, i) => {
      const delta = selectedMitigationPolicies.value.reduce(
        (s, dec) => s + societalDeltaArr(dec, effectiveStartOf(dec.id), 'climateMigrations', 'pessimist')[i], 0)
      return Math.round((base + delta) * 10) / 10
    })
  )

  const cumulativeLifeExpectancy = computed<number[]>(() =>
    BASELINE_LIFE_EXPECTANCY.map((base, i) => {
      const delta = selectedMitigationPolicies.value.reduce(
        (s, dec) => s + societalDeltaArr(dec, effectiveStartOf(dec.id), 'lifeExpectancy', 'decided')[i], 0)
      return Math.round((base + delta) * 10) / 10
    })
  )

  const cumulativeLifeExpectancyPessimist = computed<number[]>(() =>
    BASELINE_LIFE_EXPECTANCY.map((base, i) => {
      const delta = selectedMitigationPolicies.value.reduce(
        (s, dec) => s + societalDeltaArr(dec, effectiveStartOf(dec.id), 'lifeExpectancy', 'pessimist')[i], 0)
      return Math.round((base + delta) * 10) / 10
    })
  )

  const cumulativeRespiratoryDiseases = computed<number[]>(() =>
    BASELINE_RESPIRATORY_DISEASES.map((base, i) => {
      const delta = selectedMitigationPolicies.value.reduce(
        (s, dec) => s + societalDeltaArr(dec, effectiveStartOf(dec.id), 'respiratoryDiseases', 'decided')[i], 0)
      return Math.round((base + delta) * 10) / 10
    })
  )

  const cumulativeRespiratoryDiseasesPessimist = computed<number[]>(() =>
    BASELINE_RESPIRATORY_DISEASES.map((base, i) => {
      const delta = selectedMitigationPolicies.value.reduce(
        (s, dec) => s + societalDeltaArr(dec, effectiveStartOf(dec.id), 'respiratoryDiseases', 'pessimist')[i], 0)
      return Math.round((base + delta) * 10) / 10
    })
  )

  const cumulativeWhoHealthIndex = computed<number[]>(() =>
    BASELINE_WHO_HEALTH_INDEX.map((base, i) => {
      const delta = selectedMitigationPolicies.value.reduce(
        (s, dec) => s + societalDeltaArr(dec, effectiveStartOf(dec.id), 'whoHealthIndex', 'decided')[i], 0)
      return Math.round((base + delta) * 10) / 10
    })
  )

  const cumulativeWhoHealthIndexPessimist = computed<number[]>(() =>
    BASELINE_WHO_HEALTH_INDEX.map((base, i) => {
      const delta = selectedMitigationPolicies.value.reduce(
        (s, dec) => s + societalDeltaArr(dec, effectiveStartOf(dec.id), 'whoHealthIndex', 'pessimist')[i], 0)
      return Math.round((base + delta) * 10) / 10
    })
  )

  const cumulativeGiniCoefficient = computed<number[]>(() =>
    BASELINE_GINI_COEFFICIENT.map((base, i) => {
      const delta = selectedMitigationPolicies.value.reduce(
        (s, dec) => s + societalDeltaArr(dec, effectiveStartOf(dec.id), 'giniCoefficient', 'decided')[i], 0)
      return Math.round((base + delta) * 1000) / 1000
    })
  )

  const cumulativeGiniCoefficientPessimist = computed<number[]>(() =>
    BASELINE_GINI_COEFFICIENT.map((base, i) => {
      const delta = selectedMitigationPolicies.value.reduce(
        (s, dec) => s + societalDeltaArr(dec, effectiveStartOf(dec.id), 'giniCoefficient', 'pessimist')[i], 0)
      return Math.round((base + delta) * 1000) / 1000
    })
  )

  const cumulativeWealthConcentration = computed<number[]>(() =>
    BASELINE_WEALTH_CONCENTRATION.map((base, i) => {
      const delta = selectedMitigationPolicies.value.reduce(
        (s, dec) => s + societalDeltaArr(dec, effectiveStartOf(dec.id), 'wealthConcentration', 'decided')[i], 0)
      return Math.round((base + delta) * 10) / 10
    })
  )

  const cumulativeWealthConcentrationPessimist = computed<number[]>(() =>
    BASELINE_WEALTH_CONCENTRATION.map((base, i) => {
      const delta = selectedMitigationPolicies.value.reduce(
        (s, dec) => s + societalDeltaArr(dec, effectiveStartOf(dec.id), 'wealthConcentration', 'pessimist')[i], 0)
      return Math.round((base + delta) * 10) / 10
    })
  )

  const cumulativeEducationAccess = computed<number[]>(() =>
    BASELINE_EDUCATION_ACCESS.map((base, i) => {
      const delta = selectedMitigationPolicies.value.reduce(
        (s, dec) => s + societalDeltaArr(dec, effectiveStartOf(dec.id), 'educationAccess', 'decided')[i], 0)
      return Math.round((base + delta) * 10) / 10
    })
  )

  const cumulativeEducationAccessPessimist = computed<number[]>(() =>
    BASELINE_EDUCATION_ACCESS.map((base, i) => {
      const delta = selectedMitigationPolicies.value.reduce(
        (s, dec) => s + societalDeltaArr(dec, effectiveStartOf(dec.id), 'educationAccess', 'pessimist')[i], 0)
      return Math.round((base + delta) * 10) / 10
    })
  )

  // ─── Projections simulateur (séquence grain-based) ────────────────────────
  // Utilisées par SimulateurView.vue.
  // Toutes les politiques : effectiveStart = 2024 + index × grain + implementationLag

  const simCumulativeCo2 = computed<number[]>(() =>
    BASELINE_CO2.map((base, i) => {
      const delta = selectedMitigationPolicies.value.reduce(
        (s, dec, idx) => s + co2Deltas(dec, simEffectiveStart(idx, dec.implementationLag ?? 0))[i], 0)
      return Math.round((base + delta) * 10) / 10
    })
  )

  const simCumulativeCo2Pessimist = computed<number[]>(() =>
    BASELINE_CO2.map((base, i) => {
      const delta = selectedMitigationPolicies.value.reduce(
        (s, dec, idx) => s + co2DeltasPessimist(dec, simEffectiveStart(idx, dec.implementationLag ?? 0))[i], 0)
      return Math.round((base + delta) * 10) / 10
    })
  )

  const simCumulativeTemp = computed<number[]>(() =>
    BASELINE_TEMP.map((base, i) => {
      const delta = selectedMitigationPolicies.value.reduce(
        (s, dec, idx) => s + tempDeltas(dec, simEffectiveStart(idx, dec.implementationLag ?? 0))[i], 0)
      return Math.round((base + delta) * 100) / 100
    })
  )

  const simCumulativeTempPessimist = computed<number[]>(() =>
    BASELINE_TEMP.map((base, i) => {
      const delta = selectedMitigationPolicies.value.reduce(
        (s, dec, idx) => s + tempDeltasPessimist(dec, simEffectiveStart(idx, dec.implementationLag ?? 0))[i], 0)
      return Math.round((base + delta) * 100) / 100
    })
  )

  // ─── Indicateurs résumés ───────────────────────────────────────────────────

  const tempIn2100Decided   = computed<number>(() => cumulativeTemp.value[9])
  const tempIn2100Pessimist = computed<number>(() => cumulativeTempPessimist.value[9])

  const totalAnnualReduction = computed<number>(() =>
    selectedMitigationPolicies.value.reduce((s, dec) =>
      s + (dec.projectedImpact['emissionsReductionGtCO2yr'] as number ?? 0), 0)
  )

  // ─── Mutations ────────────────────────────────────────────────────────────

  function addMitigationPolicy(id: string): void {
    // En mode jeu, les locked sont déjà dans fullSequenceIds — ne pas dupliquer dans selectedIds
    if (includeGameBaseline.value && lockedIds.value.includes(id)) return
    if (!selectedIds.value.includes(id)) {
      selectedIds.value = [...selectedIds.value, id]
    }
  }

  function removeMitigationPolicy(id: string): void {
    // En mode jeu, les locked ne peuvent pas être retirés
    if (includeGameBaseline.value && lockedIds.value.includes(id)) return
    selectedIds.value = selectedIds.value.filter(i => i !== id)
  }

  function moveUp(index: number): void {
    if (includeGameBaseline.value) {
      const nLocked = lockedIds.value.length
      // Les locked (index < nLocked) et la première politique libre ne montent pas
      if (index <= nLocked) return
      const freeIndex = index - nLocked
      // Opère sur la partie libre de selectedIds (filtre les locked résiduels)
      const free = selectedIds.value.filter(id => !lockedIds.value.includes(id))
      if (freeIndex <= 0 || freeIndex >= free.length) return
      ;[free[freeIndex - 1], free[freeIndex]] = [free[freeIndex], free[freeIndex - 1]]
      const lockedInSelected = selectedIds.value.filter(id => lockedIds.value.includes(id))
      selectedIds.value = [...free, ...lockedInSelected]
    } else {
      if (index <= 0) return
      const arr = [...selectedIds.value]
      ;[arr[index - 1], arr[index]] = [arr[index], arr[index - 1]]
      selectedIds.value = arr
    }
  }

  function moveDown(index: number): void {
    if (includeGameBaseline.value) {
      const nLocked = lockedIds.value.length
      // Les locked (index < nLocked) ne descendent pas
      if (index < nLocked) return
      const freeIndex = index - nLocked
      const free = selectedIds.value.filter(id => !lockedIds.value.includes(id))
      if (freeIndex >= free.length - 1) return
      ;[free[freeIndex], free[freeIndex + 1]] = [free[freeIndex + 1], free[freeIndex]]
      const lockedInSelected = selectedIds.value.filter(id => lockedIds.value.includes(id))
      selectedIds.value = [...free, ...lockedInSelected]
    } else {
      if (index >= selectedIds.value.length - 1) return
      const arr = [...selectedIds.value]
      ;[arr[index], arr[index + 1]] = [arr[index + 1], arr[index]]
      selectedIds.value = arr
    }
  }

  function reset(): void {
    // Vide les sélections libres. En mode jeu, les locked restent via fullSequenceIds.
    selectedIds.value = []
  }

  function toggleGameBaseline(): void {
    includeGameBaseline.value = !includeGameBaseline.value
  }

  function resetAll(): void {
    selectedIds.value = []
    includeGameBaseline.value = true
  }

  function totalEnergyTWhAt(year: number): number {
    return interpolateAtYear(year, SIM_LABELS, BASELINE_ENERGY_TOTAL_TWH)
  }

  return {
    selectedIds,
    lockedIds,
    effectiveLockedIds,
    includeGameBaseline,
    catalogue,
    selectedMitigationPolicies,
    simulatorAdoptionYears,
    simulatorEffectYears,
    cumulativeCo2,
    cumulativeCo2Pessimist,
    cumulativeCo2Ppm,
    cumulativeCo2PpmPessimist,
    cumulativeTemp,
    cumulativeTempPessimist,
    cumulativeForest,
    cumulativeForestPessimist,
    cumulativeEnergyMix,
    cumulativeEnergyMixPessimist,
    cumulativeResources,
    cumulativeResourcesPessimist,
    cumulativeFoodSecurity,
    cumulativeFoodSecurityPessimist,
    cumulativeWaterAccess,
    cumulativeWaterAccessPessimist,
    cumulativeResourceConflicts,
    cumulativeResourceConflictsPessimist,
    cumulativeWaterTensions,
    cumulativeWaterTensionsPessimist,
    cumulativeClimateMigrations,
    cumulativeClimateMigrationsPessimist,
    cumulativeLifeExpectancy,
    cumulativeLifeExpectancyPessimist,
    cumulativeRespiratoryDiseases,
    cumulativeRespiratoryDiseasesPessimist,
    cumulativeWhoHealthIndex,
    cumulativeWhoHealthIndexPessimist,
    cumulativeGiniCoefficient,
    cumulativeGiniCoefficientPessimist,
    cumulativeWealthConcentration,
    cumulativeWealthConcentrationPessimist,
    cumulativeEducationAccess,
    cumulativeEducationAccessPessimist,
    simCumulativeCo2,
    simCumulativeCo2Pessimist,
    simCumulativeTemp,
    simCumulativeTempPessimist,
    tempIn2100Decided,
    tempIn2100Pessimist,
    totalAnnualReduction,
    addMitigationPolicy,
    removeMitigationPolicy,
    moveUp,
    moveDown,
    reset,
    toggleGameBaseline,
    resetAll,
    totalEnergyTWhAt,
  }
})
