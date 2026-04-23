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
import { ref, computed } from 'vue'
import { mitigationPolicies as allMitigationPolicies } from '@/data/mitigationPolicies'
import type { MitigationPolicy, MitigationPolicyProjections } from '@/types/index'

// ─── Baseline SSP2-4.5 (référence partagée) ───────────────────────────────────
export const SIM_LABELS    = [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074, 2100]
export const BASELINE_CO2  = [37.4, 39, 40.5, 42, 45.1, 49.2, 54, 58, 63, 70]
export const BASELINE_TEMP = [1.4, 1.5, 1.6, 1.72, 1.95, 2.2, 2.6, 3, 3.5, 4]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function hasImpactModel(d: MitigationPolicy): boolean {
  return typeof d.projectedImpact['emissionsReductionGtCO2yr'] === 'number'
}

function hasProjections(d: MitigationPolicy): d is MitigationPolicy & { projections: MitigationPolicyProjections } {
  const p = d.projections as Partial<MitigationPolicyProjections>
  return Array.isArray(p?.co2?.decided) && Array.isArray(p?.temperature?.decided)
}

function extendedDelta(arr: number[], baseline: number[]): number[] {
  return baseline.map((base, i) => {
    if (i < arr.length) return arr[i] - base
    const lastIdx = arr.length - 1
    return arr[lastIdx] - baseline[lastIdx]
  })
}

function co2Deltas(dec: MitigationPolicy): number[] {
  if (!hasProjections(dec)) return BASELINE_CO2.map(() => 0)
  return extendedDelta((dec.projections as MitigationPolicyProjections).co2.decided, BASELINE_CO2)
}

function co2DeltasPessimist(dec: MitigationPolicy): number[] {
  if (!hasProjections(dec)) return BASELINE_CO2.map(() => 0)
  return extendedDelta((dec.projections as MitigationPolicyProjections).co2.pessimist, BASELINE_CO2)
}

function tempDeltas(dec: MitigationPolicy): number[] {
  if (!hasProjections(dec)) return BASELINE_TEMP.map(() => 0)
  return extendedDelta((dec.projections as MitigationPolicyProjections).temperature.decided, BASELINE_TEMP)
}

function tempDeltasPessimist(dec: MitigationPolicy): number[] {
  if (!hasProjections(dec)) return BASELINE_TEMP.map(() => 0)
  return extendedDelta((dec.projections as MitigationPolicyProjections).temperature.pessimist, BASELINE_TEMP)
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useSimulationStore = defineStore('simulation', () => {

  // Politiques disponibles pour la simulation (avec modèle d'impact complet)
  const catalogue = computed<MitigationPolicy[]>(() => {
    const valid = allMitigationPolicies.filter(d => hasImpactModel(d) && hasProjections(d))
    return [...valid.filter(d => d.status === 'validated'), ...valid.filter(d => d.status !== 'validated')]
  })

  // IDs des politiques retenues (validées par scrutin clos) — ne peuvent être retirées
  const lockedIds = computed<string[]>(() =>
    catalogue.value.filter(d => d.status === 'validated').map(d => d.id)
  )

  // Séquence ordonnée : initialisée avec les politiques déjà retenues
  const selectedIds = ref<string[]>(
    allMitigationPolicies
      .filter(d => d.status === 'validated' && hasImpactModel(d) && hasProjections(d))
      .map(d => d.id)
  )

  // Politiques sélectionnées dans l'ordre choisi
  const selectedMitigationPolicies = computed<MitigationPolicy[]>(() =>
    selectedIds.value
      .map(id => catalogue.value.find(d => d.id === id))
      .filter((d): d is MitigationPolicy => d !== undefined)
  )

  // ─── Projections cumulées ──────────────────────────────────────────────────

  const cumulativeCo2 = computed<number[]>(() =>
    BASELINE_CO2.map((base, i) => {
      const delta = selectedMitigationPolicies.value.reduce((s, dec) => s + co2Deltas(dec)[i], 0)
      return Math.round((base + delta) * 10) / 10
    })
  )

  const cumulativeCo2Pessimist = computed<number[]>(() =>
    BASELINE_CO2.map((base, i) => {
      const delta = selectedMitigationPolicies.value.reduce((s, dec) => s + co2DeltasPessimist(dec)[i], 0)
      return Math.round((base + delta) * 10) / 10
    })
  )

  const cumulativeTemp = computed<number[]>(() =>
    BASELINE_TEMP.map((base, i) => {
      const delta = selectedMitigationPolicies.value.reduce((s, dec) => s + tempDeltas(dec)[i], 0)
      return Math.round((base + delta) * 100) / 100
    })
  )

  const cumulativeTempPessimist = computed<number[]>(() =>
    BASELINE_TEMP.map((base, i) => {
      const delta = selectedMitigationPolicies.value.reduce((s, dec) => s + tempDeltasPessimist(dec)[i], 0)
      return Math.round((base + delta) * 100) / 100
    })
  )

  // ─── Indicateurs résumés ───────────────────────────────────────────────────

  // Température en 2100 (dernier point des séries)
  const tempIn2100Decided    = computed<number>(() => cumulativeTemp.value[9])
  const tempIn2100Pessimist  = computed<number>(() => cumulativeTempPessimist.value[9])

  // Réduction totale d'émissions annuelles cumulées
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
