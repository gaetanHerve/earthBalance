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
import type { MitigationPolicy, MitigationPolicyProjections } from '@/types/index'
import { useMitigationPoliciesStore } from './mitigationPolicies.store'

// ─── Baseline SSP2-4.5 (référence partagée) ───────────────────────────────────
export const SIM_LABELS    = [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074, 2100]
export const BASELINE_CO2  = [37.4, 39, 40.5, 42, 45.1, 49.2, 54, 58, 63, 70]
export const BASELINE_TEMP = [1.4, 1.5, 1.6, 1.72, 1.95, 2.2, 2.6, 3, 3.5, 4]

const SELECTED_KEY = 'eb_simulation_selected'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function hasImpactModel(d: MitigationPolicy): boolean {
  return typeof d.projectedImpact['emissionsReductionGtCO2yr'] === 'number'
}

function hasProjections(d: MitigationPolicy): d is MitigationPolicy & { projections: MitigationPolicyProjections } {
  const p = d.projections as Partial<MitigationPolicyProjections>
  return Array.isArray(p?.co2?.decided) && Array.isArray(p?.temperature?.decided)
}

// Interpolation linéaire dans une série temporelle (labels, values)
function interpol(year: number, labels: number[], values: number[]): number {
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

// Delta d'une politique avec décalage temporel (startYear + implementationLag).
// À l'année t :
//   - si t < effectiveStart → delta = 0 (politique pas encore en vigueur)
//   - sinon → delta de l'original à l'année 2024 + (t - effectiveStart)
//     (la courbe d'effet est "rejouée" depuis effectiveStart plutôt que depuis 2024)
function shiftedDeltas(
  projLabels: number[],
  projValues: number[],
  projBaseline: number[],
  effectiveStart: number,
): number[] {
  return SIM_LABELS.map(year => {
    if (year < effectiveStart) return 0
    const mappedYear = 2024 + (year - effectiveStart)
    return interpol(mappedYear, projLabels, projValues) - interpol(mappedYear, projLabels, projBaseline)
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

// ─── Store ────────────────────────────────────────────────────────────────────

export const useSimulationStore = defineStore('simulation', () => {

  const policiesStore = useMitigationPoliciesStore()

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

  // Séquence ordonnée : initialisée depuis localStorage ou depuis les politiques déjà retenues
  const storedSelected = localStorage.getItem(SELECTED_KEY)
  const selectedIds = ref<string[]>(
    storedSelected ? (JSON.parse(storedSelected) as string[]) : []
  )

  // Persistance automatique de la séquence sélectionnée
  watch(selectedIds, ids => localStorage.setItem(SELECTED_KEY, JSON.stringify(ids)), { deep: true })

  // Politiques sélectionnées dans l'ordre choisi
  const selectedMitigationPolicies = computed<MitigationPolicy[]>(() =>
    selectedIds.value
      .map(id => catalogue.value.find(d => d.id === id))
      .filter((d): d is MitigationPolicy => d !== undefined)
  )

  // ─── Projections cumulées ──────────────────────────────────────────────────

  // Retourne l'année d'effet réelle d'une politique : année de vote + lag
  // Les politiques initialement validées (year: 2024) accumulent aussi leur lag
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

  const cumulativeTemp = computed<number[]>(() =>
    BASELINE_TEMP.map((base, i) => {
      const delta = selectedMitigationPolicies.value.reduce(
        (s, dec) => s + tempDeltas(dec, effectiveStartOf(dec.id))[i], 0)
      return Math.round((base + delta) * 100) / 100
    })
  )

  const cumulativeTempPessimist = computed<number[]>(() =>
    BASELINE_TEMP.map((base, i) => {
      const delta = selectedMitigationPolicies.value.reduce(
        (s, dec) => s + tempDeltasPessimist(dec, effectiveStartOf(dec.id))[i], 0)
      return Math.round((base + delta) * 100) / 100
    })
  )

  // ─── Indicateurs résumés ───────────────────────────────────────────────────

  const tempIn2100Decided    = computed<number>(() => cumulativeTemp.value[9])
  const tempIn2100Pessimist  = computed<number>(() => cumulativeTempPessimist.value[9])

  const totalAnnualReduction = computed<number>(() =>
    selectedMitigationPolicies.value.reduce((s, dec) =>
      s + (dec.projectedImpact['emissionsReductionGtCO2yr'] as number ?? 0), 0)
  )

  // ─── Mutations ────────────────────────────────────────────────────────────

  function addMitigationPolicy(id: string): void {
    if (!selectedIds.value.includes(id)) {
      selectedIds.value = [...selectedIds.value, id]
    }
  }

  function removeMitigationPolicy(id: string): void {
    if (lockedIds.value.includes(id)) return
    selectedIds.value = selectedIds.value.filter(i => i !== id)
  }

  function moveUp(index: number): void {
    if (index <= 0) return
    const arr = [...selectedIds.value]
    ;[arr[index - 1], arr[index]] = [arr[index], arr[index - 1]]
    selectedIds.value = arr
  }

  function moveDown(index: number): void {
    if (index >= selectedIds.value.length - 1) return
    const arr = [...selectedIds.value]
    ;[arr[index], arr[index + 1]] = [arr[index + 1], arr[index]]
    selectedIds.value = arr
  }

  function reset(): void {
    selectedIds.value = lockedIds.value.slice()
  }

  return {
    selectedIds,
    lockedIds,
    catalogue,
    selectedMitigationPolicies,
    cumulativeCo2,
    cumulativeCo2Pessimist,
    cumulativeTemp,
    cumulativeTempPessimist,
    tempIn2100Decided,
    tempIn2100Pessimist,
    totalAnnualReduction,
    addMitigationPolicy,
    removeMitigationPolicy,
    moveUp,
    moveDown,
    reset,
  }
})
