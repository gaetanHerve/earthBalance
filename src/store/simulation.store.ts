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
import { decisions as allDecisions } from '@/data/decisions'
import type { Decision, DecisionProjections } from '@/types/index'

// ─── Baseline SSP2-4.5 (référence partagée) ───────────────────────────────────
export const SIM_LABELS    = [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074]
export const BASELINE_CO2  = [37.4, 39, 40.5, 42, 45.1, 49.2, 54, 58, 63]
export const BASELINE_TEMP = [1.4, 1.5, 1.6, 1.72, 1.95, 2.2, 2.6, 3, 3.5]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function hasImpactModel(d: Decision): boolean {
  return typeof d.projectedImpact['emissionsReductionGtCO2yr'] === 'number'
}

function hasProjections(d: Decision): d is Decision & { projections: DecisionProjections } {
  const p = d.projections as Partial<DecisionProjections>
  return Array.isArray(p?.co2?.decided) && Array.isArray(p?.temperature?.decided)
}

function co2Deltas(dec: Decision): number[] {
  if (!hasProjections(dec)) return BASELINE_CO2.map(() => 0)
  return (dec.projections as DecisionProjections).co2.decided.map((v, i) => v - BASELINE_CO2[i])
}

function co2DeltasPessimist(dec: Decision): number[] {
  if (!hasProjections(dec)) return BASELINE_CO2.map(() => 0)
  return (dec.projections as DecisionProjections).co2.pessimist.map((v, i) => v - BASELINE_CO2[i])
}

function tempDeltas(dec: Decision): number[] {
  if (!hasProjections(dec)) return BASELINE_TEMP.map(() => 0)
  return (dec.projections as DecisionProjections).temperature.decided.map((v, i) => v - BASELINE_TEMP[i])
}

function tempDeltasPessimist(dec: Decision): number[] {
  if (!hasProjections(dec)) return BASELINE_TEMP.map(() => 0)
  return (dec.projections as DecisionProjections).temperature.pessimist.map((v, i) => v - BASELINE_TEMP[i])
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useSimulationStore = defineStore('simulation', () => {

  // Décisions disponibles pour la simulation (avec modèle d'impact complet)
  const catalogue = computed<Decision[]>(() => {
    const valid = allDecisions.filter(d => hasImpactModel(d) && hasProjections(d))
    return [...valid.filter(d => d.status === 'validated'), ...valid.filter(d => d.status !== 'validated')]
  })

  // IDs des décisions retenues (validées par scrutin clos) — ne peuvent être retirées
  const lockedIds = computed<string[]>(() =>
    catalogue.value.filter(d => d.status === 'validated').map(d => d.id)
  )

  // Séquence ordonnée : initialisée avec les décisions déjà retenues
  const selectedIds = ref<string[]>(
    allDecisions
      .filter(d => d.status === 'validated' && hasImpactModel(d) && hasProjections(d))
      .map(d => d.id)
  )

  // Décisions sélectionnées dans l'ordre choisi
  const selectedDecisions = computed<Decision[]>(() =>
    selectedIds.value
      .map(id => catalogue.value.find(d => d.id === id))
      .filter((d): d is Decision => d !== undefined)
  )

  // ─── Projections cumulées ──────────────────────────────────────────────────

  const cumulativeCo2 = computed<number[]>(() =>
    BASELINE_CO2.map((base, i) => {
      const delta = selectedDecisions.value.reduce((s, dec) => s + co2Deltas(dec)[i], 0)
      return Math.round((base + delta) * 10) / 10
    })
  )

  const cumulativeCo2Pessimist = computed<number[]>(() =>
    BASELINE_CO2.map((base, i) => {
      const delta = selectedDecisions.value.reduce((s, dec) => s + co2DeltasPessimist(dec)[i], 0)
      return Math.round((base + delta) * 10) / 10
    })
  )

  const cumulativeTemp = computed<number[]>(() =>
    BASELINE_TEMP.map((base, i) => {
      const delta = selectedDecisions.value.reduce((s, dec) => s + tempDeltas(dec)[i], 0)
      return Math.round((base + delta) * 100) / 100
    })
  )

  const cumulativeTempPessimist = computed<number[]>(() =>
    BASELINE_TEMP.map((base, i) => {
      const delta = selectedDecisions.value.reduce((s, dec) => s + tempDeltasPessimist(dec)[i], 0)
      return Math.round((base + delta) * 100) / 100
    })
  )

  // ─── Indicateurs résumés ───────────────────────────────────────────────────

  // Température en 2074 (dernier point des séries)
  const tempIn2074Decided    = computed<number>(() => cumulativeTemp.value[8])
  const tempIn2074Pessimist  = computed<number>(() => cumulativeTempPessimist.value[8])

  // CO₂ évité par rapport à la baseline en 2050
  const co2SavedIn2050 = computed<number>(() =>
    Math.round((BASELINE_CO2[6] - cumulativeCo2.value[6]) * 10) / 10
  )

  // CO₂ annuel en 2050 dans le scénario décidé
  const co2In2050Decided = computed<number>(() => cumulativeCo2.value[6])

  // Réduction totale d'émissions annuelles cumulées
  const totalAnnualReduction = computed<number>(() =>
    selectedDecisions.value.reduce((s, dec) =>
      s + (dec.projectedImpact['emissionsReductionGtCO2yr'] as number ?? 0), 0)
  )

  // ─── Mutations ────────────────────────────────────────────────────────────

  function addDecision(id: string): void {
    if (!selectedIds.value.includes(id)) {
      selectedIds.value = [...selectedIds.value, id]
    }
  }

  function removeDecision(id: string): void {
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
    selectedDecisions,
    cumulativeCo2,
    cumulativeCo2Pessimist,
    cumulativeTemp,
    cumulativeTempPessimist,
    tempIn2074Decided,
    tempIn2074Pessimist,
    co2SavedIn2050,
    co2In2050Decided,
    totalAnnualReduction,
    addDecision,
    removeDecision,
    moveUp,
    moveDown,
    reset,
  }
})
