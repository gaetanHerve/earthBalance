// â”€â”€â”€ Simulation Store â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//
// Moteur de calcul dÃ©terministe pour la dÃ©mo de simulation de politiques.
// Charge les dÃ©cisions disponibles, maintient la sÃ©quence choisie par le joueur,
// et calcule les projections COâ‚‚ et tempÃ©rature cumulÃ©es.
//
// Approche : delta additif (sans interactions inter-politiques pour le POC).
// Chaque dÃ©cision contribue : delta_i[j] = decided[j] - baseline[j]
// Cumul : baseline[j] + Î£ delta_i[j]
//
// Seules les dÃ©cisions avec modÃ¨le d'impact complet (emissionsReductionGtCO2yr)
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
import {
  BASELINE_CO2_16PT,
  BASELINE_TEMP_16PT,
  BASELINE_FOREST_16PT,
  BASELINE_ENERGY_MIX_16PT,
  BASELINE_RESOURCES_16PT,
  BASELINE_FOOD_SECURITY_16PT,
  BASELINE_WATER_ACCESS_16PT,
  BASELINE_WATER_TENSIONS_16PT,
  BASELINE_RESOURCE_CONFLICTS_16PT,
  BASELINE_CLIMATE_MIGRATIONS_16PT,
  BASELINE_LIFE_EXPECTANCY_16PT,
  BASELINE_RESPIRATORY_DISEASES_16PT,
  BASELINE_WHO_HEALTH_INDEX_16PT,
  BASELINE_GINI_COEFFICIENT_16PT,
  BASELINE_WEALTH_CONCENTRATION_16PT,
  BASELINE_EDUCATION_ACCESS_16PT,
  BASELINE_CO2_PPM_16PT,
  BASELINE_ENERGY_TOTAL_TWH_16PT,
} from '@/config/baselines.config'

// ─── Baseline SSP3-7.0 (Single Source of Truth) ──────────────────────────────────────────────────
// Imported from src/config/baselines.config.ts — see that file for detailed documentation
// Validée contre [IPCC AR6 WGI, Figure SPM.8 — CEDA Archive, CC-BY-4.0]
// Near-term (2030) : +1.49°C | Mid-term (2050) : +2.10°C | Long-term (2100) : +3.91°C
// SIM_LABELS = [2025, 2030, 2035, 2040, 2045, 2050, 2055, 2060, 2065, 2070, 2075, 2080, 2085, 2090, 2095, 2100]
export { SIM_LABELS } from '@/config/simulation.config'
export const BASELINE_CO2  = BASELINE_CO2_16PT
export const BASELINE_TEMP = BASELINE_TEMP_16PT


// Concentration atmosphérique de CO₂ (ppm) – SSP3-7.0
// Source: voir BASELINE_CO2_PPM_16PT dans baselines.config.ts
export const BASELINE_CO2_PPM = BASELINE_CO2_PPM_16PT

// Forêts primaires mondiales restantes (% de la couverture originelle) – SSP3-7.0
// Source : [AR6 WGII, Ch.2, pp.290-295 & Ch.CCP7, pp.2408-2409]
export const BASELINE_FOREST = BASELINE_FOREST_16PT

// Total énergie primaire mondiale (TWh, hors biomasse traditionnelle) – SSP3-7.0
// Source : voir BASELINE_ENERGY_TOTAL_TWH_16PT dans baselines.config.ts
const BASELINE_ENERGY_TOTAL_TWH = BASELINE_ENERGY_TOTAL_TWH_16PT

// Mix énergétique mondial (% du total énergie primaire) – SSP3-7.0 [AR6 WGIII, Ch.3, pp.289-310]
const ENERGY_MIX_KEYS: EnergyMixKey[] = ['coal', 'oil', 'gas', 'nuclear', 'solar', 'wind', 'hydro', 'autres']
export const BASELINE_ENERGY_MIX: Record<EnergyMixKey, number[]> = BASELINE_ENERGY_MIX_16PT

// Extraction de ressources naturelles (Gt/an) – UNEP Global Resources Outlook
const RESOURCE_KEYS: ResourceKey[] = ['minerals', 'biomass', 'fossilFuels']
export const BASELINE_RESOURCES: Record<ResourceKey, number[]> = BASELINE_RESOURCES_16PT

// Sécurité alimentaire (indice FAO /100) – SSP3-7.0
// Source : [AR6 WGII, Ch.5, pp.557-559] ; FAO SOFI 2023
export const BASELINE_FOOD_SECURITY = BASELINE_FOOD_SECURITY_16PT

// Accès à l'eau potable (% population mondiale) – SSP3-7.0
// Source : [AR6 WGII, Ch.4, p.568] ; WHO/UNICEF JMP
export const BASELINE_WATER_ACCESS = BASELINE_WATER_ACCESS_16PT

// Tensions géopolitiques – scores de tension (0-100, plus haut = pire) – SSP3-7.0
// Source : [AR6 WGII, Ch.7, pp.1038-1042] ; ACLED ; UNHCR
export const BASELINE_WATER_TENSIONS      = BASELINE_WATER_TENSIONS_16PT
export const BASELINE_RESOURCE_CONFLICTS  = BASELINE_RESOURCE_CONFLICTS_16PT
export const BASELINE_CLIMATE_MIGRATIONS  = BASELINE_CLIMATE_MIGRATIONS_16PT

// Santé globale – SSP3-7.0
// Source : [AR6 WGII, Ch.7, pp.1033-1036] ; OMS GHO ; Lancet Countdown 2022
export const BASELINE_LIFE_EXPECTANCY      = BASELINE_LIFE_EXPECTANCY_16PT
export const BASELINE_RESPIRATORY_DISEASES = BASELINE_RESPIRATORY_DISEASES_16PT
export const BASELINE_WHO_HEALTH_INDEX     = BASELINE_WHO_HEALTH_INDEX_16PT

// Inégalités – SSP3-7.0
// Source : [AR6 WGII, Ch.16, pp.2340-2345] ; World Inequality Report 2022 ; WID.world
export const BASELINE_GINI_COEFFICIENT     = BASELINE_GINI_COEFFICIENT_16PT
export const BASELINE_WEALTH_CONCENTRATION = BASELINE_WEALTH_CONCENTRATION_16PT
export const BASELINE_EDUCATION_ACCESS     = BASELINE_EDUCATION_ACCESS_16PT

const SELECTED_KEY  = STORAGE_KEYS.SIMULATION_SELECTED
const BASELINE_KEY  = STORAGE_KEYS.SIMULATION_BASELINE
const SIM_BASE_YEAR = 2024

// â”€â”€â”€ Helpers projection â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function hasImpactModel(d: MitigationPolicy): boolean {
  return typeof d.projectedImpact['emissionsReductionGtCO2yr'] === 'number'
}

function hasProjections(d: MitigationPolicy): d is MitigationPolicy & { projections: MitigationPolicyProjections } {
  const p = d.projections as Partial<MitigationPolicyProjections>
  return Array.isArray(p?.co2?.decided) && Array.isArray(p?.temperature?.decided)
}

// Delta d'une politique avec dÃ©calage temporel (effectiveStart).
// Ã€ l'annÃ©e t :
//   - si t < effectiveStart â†’ delta = 0 (politique pas encore en vigueur)
//   - sinon â†’ delta de l'original Ã  l'annÃ©e 2024 + (t - effectiveStart)
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

// RÃ©duction de tempÃ©rature en 2100 pour une politique adoptÃ©e Ã  adoptionYear (index 9 = annÃ©e 2100)
export function policyTempReductionAt2100(policy: MitigationPolicy, adoptionYear: number): number {
  if (!hasProjections(policy)) return 0
  const proj = policy.projections as MitigationPolicyProjections
  const effectiveStart = adoptionYear + (policy.implementationLag ?? 0)
  const deltas = shiftedDeltas(proj.labels, proj.temperature.decided, proj.temperature.baseline, effectiveStart)
  return -(deltas.at(-1) ?? 0)
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

// Delta direct (valeurs dÃ©jÃ  exprimÃ©es en delta vs. baseline)
function shiftedDeltasDirect(projLabels: number[], projDeltas: number[], effectiveStart: number): number[] {
  return SIM_LABELS.map(year => {
    if (year < effectiveStart) return 0
    const mappedYear = 2024 + (year - effectiveStart)
    return interpolateAtYear(mappedYear, projLabels, projDeltas)
  })
}

function forestDeltas(dec: MitigationPolicy, effectiveStart: number): number[] {
  const proj = dec.projections as Partial<MitigationPolicyProjections>
  if (!Array.isArray(proj?.forest?.decided)) return SIM_LABELS.map(() => 0)
  return shiftedDeltas(proj.labels ?? SIM_LABELS, proj.forest!.decided, proj.forest!.baseline, effectiveStart)
}

function forestDeltasPessimist(dec: MitigationPolicy, effectiveStart: number): number[] {
  const proj = dec.projections as Partial<MitigationPolicyProjections>
  if (!Array.isArray(proj?.forest?.decided)) return SIM_LABELS.map(() => 0)
  return shiftedDeltas(proj.labels ?? SIM_LABELS, proj.forest!.pessimist, proj.forest!.baseline, effectiveStart)
}

function energyMixDeltaArr(dec: MitigationPolicy, effectiveStart: number, cat: EnergyMixKey, scenario: 'decided' | 'pessimist'): number[] {
  const proj = dec.projections as Partial<MitigationPolicyProjections>
  const deltas = proj?.energyMix?.[cat]?.[scenario]
  if (!Array.isArray(deltas)) return SIM_LABELS.map(() => 0)
  return shiftedDeltasDirect(proj.labels ?? SIM_LABELS, deltas, effectiveStart)
}

function resourceDeltaArr(dec: MitigationPolicy, effectiveStart: number, res: ResourceKey, scenario: 'decided' | 'pessimist'): number[] {
  const proj = dec.projections as Partial<MitigationPolicyProjections>
  const deltas = proj?.resources?.[res]?.[scenario]
  if (!Array.isArray(deltas)) return SIM_LABELS.map(() => 0)
  return shiftedDeltasDirect(proj.labels ?? SIM_LABELS, deltas, effectiveStart)
}

function societalDeltaArr(dec: MitigationPolicy, effectiveStart: number, key: SocietalKey, scenario: 'decided' | 'pessimist'): number[] {
  const proj = dec.projections as Partial<MitigationPolicyProjections>
  const deltas = proj?.societal?.[key]?.[scenario]
  if (!Array.isArray(deltas)) return SIM_LABELS.map(() => 0)
  return shiftedDeltasDirect(proj.labels ?? SIM_LABELS, deltas, effectiveStart)
}

// ─── Helpers ppm CO₂ ─────────────────────────────────────────────────────────
// BASELINE_CO2 est en GtCO₂eq (GHG total). Facteur ci-dessous = CO₂ seul (airborne fraction).
// Simplification de jeu : delta GHG total utilisé comme proxy de l’impact atmosphérique (non physique).
const PPM_PER_GTCO2_YR = 0.45 / 7.81

// Compute atmospheric COâ‚‚ ppm from annual emissions array (same indices as SIM_LABELS).
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

// â”€â”€â”€ Helpers simulateur (sÃ©quence grain-based) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

// AnnÃ©e d'adoption simulÃ©e pour la position `index` dans la sÃ©quence
// Toutes les politiques (verrouillÃ©es ou non) suivent la mÃªme rÃ¨gle
export function simulatorAdoptionYearAt(index: number): number {
  return SIM_BASE_YEAR + index * GAME_CONFIG.grain
}

// AnnÃ©e de premier effet simulÃ©e = adoption + lag
function simEffectiveStart(index: number, lag: number): number {
  return simulatorAdoptionYearAt(index) + lag
}

// â”€â”€â”€ Store â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const useSimulationStore = defineStore('simulation', () => {

  const policiesStore = useMitigationPoliciesStore()
  const tpStore       = useTippingPointsStore()

  // Catalogue : politiques avec modÃ¨le d'impact, statuts Ã  jour depuis le store de politiques
  const catalogue = computed<MitigationPolicy[]>(() => {
    const validatedSet = new Set(policiesStore.validatedPolicyIds)
    const withStatus = allMitigationPolicies.map(p =>
      validatedSet.has(p.id) ? { ...p, status: 'validated' as const } : p
    )
    const valid = withStatus.filter(d => hasImpactModel(d) && hasProjections(d))
    return [...valid.filter(d => d.status === 'validated'), ...valid.filter(d => d.status !== 'validated')]
  })

  // IDs des politiques verrouillÃ©es (validÃ©es par scrutin et prÃ©sentes dans le catalogue)
  const lockedIds = computed<string[]>(() =>
    policiesStore.validatedPolicyIds.filter(id => catalogue.value.some(d => d.id === id))
  )

  // â”€â”€â”€ Toggle mode jeu / mode libre â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  //
  // Mode jeu (true)  : politiques verrouillÃ©es ancrÃ©es en tÃªte de sÃ©quence,
  //                    dans l'ordre de validation, non-dÃ©plaÃ§ables.
  //                    Projection "Ã  partir de l'annÃ©e courante du jeu".
  //
  // Mode libre (false) : toutes les politiques librement ajoutables /
  //                      retirables / ordonnables. Projection Ã  partir de 2024.

  const includeGameBaseline = ref<boolean>(
    localStorage.getItem(BASELINE_KEY) !== 'false'
  )

  // â”€â”€â”€ Graphiques de projection visibles dans le simulateur â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const ALL_PROJ_IDS = ['co2', 'temperature', 'forest', 'energy'] as const
  const PROJ_VIS_KEY = STORAGE_KEYS.SIM_PROJ_VISIBLE

  const simProjVisible = ref<string[]>((() => {
    try {
      const raw = localStorage.getItem(PROJ_VIS_KEY)
      if (raw === null) return [...ALL_PROJ_IDS]
      const parsed = JSON.parse(raw) as unknown
      if (!Array.isArray(parsed)) return [...ALL_PROJ_IDS]
      return (parsed as string[]).filter(id => (ALL_PROJ_IDS as readonly string[]).includes(id))
    } catch {
      return [...ALL_PROJ_IDS]
    }
  })())

  function toggleSimProjChart(id: string): void {
    const set = new Set(simProjVisible.value)
    set.has(id) ? set.delete(id) : set.add(id)
    simProjVisible.value = [...set]
    localStorage.setItem(PROJ_VIS_KEY, JSON.stringify(simProjVisible.value))
  }

  watch(includeGameBaseline, (newVal) => {
    localStorage.setItem(BASELINE_KEY, String(newVal))
    // En mode jeu, Ã©pure selectedIds des Ã©ventuels IDs verrouillÃ©s
    // (ils seront injectÃ©s automatiquement via fullSequenceIds)
    if (newVal) {
      selectedIds.value = selectedIds.value.filter(id => !lockedIds.value.includes(id))
    }
  })

  // â”€â”€â”€ SÃ©quence â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

  // SÃ©quence complÃ¨te ordonnÃ©e :
  //   Mode jeu  â†’ [lockedâ‚€, lockedâ‚, â€¦, libreâ‚€, libreâ‚, â€¦]
  //   Mode libre â†’ selectedIds tel quel
  const fullSequenceIds = computed<string[]>(() => {
    if (includeGameBaseline.value) {
      const freeIds = selectedIds.value.filter(id => !lockedIds.value.includes(id))
      return [...lockedIds.value, ...freeIds]
    }
    return selectedIds.value
  })

  // Politiques dans l'ordre de la sÃ©quence complÃ¨te
  const selectedMitigationPolicies = computed<MitigationPolicy[]>(() =>
    fullSequenceIds.value
      .map(id => catalogue.value.find(d => d.id === id))
      .filter((d): d is MitigationPolicy => d !== undefined)
  )

  // IDs effectivement verrouillÃ©s (non-dÃ©plaÃ§ables) : uniquement en mode jeu
  const effectiveLockedIds = computed<string[]>(() =>
    includeGameBaseline.value ? lockedIds.value : []
  )

  // â”€â”€â”€ AnnÃ©es d'adoption et de premier effet simulÃ©es â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const simulatorAdoptionYears = computed<number[]>(() =>
    selectedMitigationPolicies.value.map((_, index) => simulatorAdoptionYearAt(index))
  )

  // AnnÃ©e d'adoption par ID â€” couvre les politiques verrouillÃ©es et sÃ©lectionnÃ©es
  const policyAdoptionYearMap = computed<Map<string, number>>(() =>
    new Map(selectedMitigationPolicies.value.map((p, i) => [p.id, simulatorAdoptionYearAt(i)]))
  )

  const simulatorEffectYears = computed<number[]>(() =>
    selectedMitigationPolicies.value.map((dec, index) =>
      simEffectiveStart(index, dec.implementationLag ?? 0)
    )
  )

  // â”€â”€â”€ Projections dashboard (logique meta.year + lag, inchangÃ©e) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // UtilisÃ©es par EcologicalIndicators.vue

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
      result[cat] = SIM_LABELS.map((_, i) => {
        const base = BASELINE_ENERGY_MIX[cat][i]
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
      result[cat] = SIM_LABELS.map((_, i) => {
        const base = BASELINE_ENERGY_MIX[cat][i]
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
      result[res] = SIM_LABELS.map((_, i) => {
        const base = BASELINE_RESOURCES[res][i]
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
      result[res] = SIM_LABELS.map((_, i) => {
        const base = BASELINE_RESOURCES[res][i]
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

  // â”€â”€â”€ Projections simulateur (sÃ©quence grain-based) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // UtilisÃ©es par SimulateurView.vue.
  // Toutes les politiques : effectiveStart = 2024 + index Ã— grain + implementationLag

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

  // â”€â”€â”€ Indicateurs rÃ©sumÃ©s â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const tempIn2100Decided   = computed<number>(() => cumulativeTemp.value[9])
  const tempIn2100Pessimist = computed<number>(() => cumulativeTempPessimist.value[9])

  const totalAnnualReduction = computed<number>(() =>
    selectedMitigationPolicies.value.reduce((s, dec) =>
      s + (dec.projectedImpact['emissionsReductionGtCO2yr'] as number ?? 0), 0)
  )

  // â”€â”€â”€ Mutations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  function addMitigationPolicy(id: string): void {
    // En mode jeu, les locked sont dÃ©jÃ  dans fullSequenceIds â€” ne pas dupliquer dans selectedIds
    if (includeGameBaseline.value && lockedIds.value.includes(id)) return
    if (!selectedIds.value.includes(id)) {
      selectedIds.value = [...selectedIds.value, id]
    }
  }

  function removeMitigationPolicy(id: string): void {
    // En mode jeu, les locked ne peuvent pas Ãªtre retirÃ©s
    if (includeGameBaseline.value && lockedIds.value.includes(id)) return
    selectedIds.value = selectedIds.value.filter(i => i !== id)
  }

  function moveUp(index: number): void {
    if (includeGameBaseline.value) {
      const nLocked = lockedIds.value.length
      // Les locked (index < nLocked) et la premiÃ¨re politique libre ne montent pas
      if (index <= nLocked) return
      const freeIndex = index - nLocked
      // OpÃ¨re sur la partie libre de selectedIds (filtre les locked rÃ©siduels)
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
    // Vide les sÃ©lections libres. En mode jeu, les locked restent via fullSequenceIds.
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
    policyAdoptionYearMap,
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
    simProjVisible,
    toggleSimProjChart,
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
