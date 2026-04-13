// ─── Impact Model — Schéma des modèles d'impact politique ────────────────────
//
// Générés offline par LLM + RAG sur corpus IPCC AR6.
// Consommés en runtime par le moteur de calcul déterministe.
// Stockés dans src/data/models/ (POC) → PostgreSQL/MongoDB (production).

export type CurveType = 'linear' | 'sigmoid' | 'exponential'
export type UncertaintyLevel = 'low' | 'medium' | 'high'
export type InteractionType = 'synergy' | 'antagonism'
export type ImpactDirection = 'improve' | 'worsen' | 'neutral'
export type ImpactMagnitude = 'low' | 'medium' | 'high'
export type GeographicScope = 'global' | 'developed' | 'emerging' | 'regional'

// ─── Source IPCC ──────────────────────────────────────────────────────────────

export interface IpccSource {
  report: string        // "AR6 SYR" | "AR6 WGI" | "AR6 WGIII"
  section: string       // "Section 4.5" | "Chapter 6"
  figure_id?: string    // "Figure SPM.4" → cross-référence index.json
  dataset_id?: string   // "WGI_SPM_Fig4" → fichier CSV dans data_sources/
  excerpt?: string      // citation textuelle courte
}

// ─── Impact émissions ─────────────────────────────────────────────────────────

export interface EmissionsImpact {
  type: 'reduction' | 'increase'
  unit: 'GtCO2eq_yr'
  median: number                      // valeur centrale (ex: 1.8)
  range: { min: number; max: number } // fourchette incertitude
  ramp_start_year: number             // année où l'effet commence
  ramp_end_year: number               // année où l'effet est plein
  curve: CurveType
  sources: IpccSource[]
}

// ─── Impact température 2100 ──────────────────────────────────────────────────

export interface TemperatureImpact {
  delta_C_median: number              // négatif = refroidissement
  range: { min: number; max: number }
  horizon_year: 2100
  dependencies: string[]              // politique_ids requis pour cet effet
  sources: IpccSource[]
}

// ─── Impact limites planétaires ───────────────────────────────────────────────
// limit_id correspond aux ids définis dans src/data/planetaryLimits.ts :
// 'changement-climatique' | 'biodiversite' | 'cycle-azote' | 'cycle-phosphore'
// 'ozone-stratospherique' | 'acidification-oceans' | 'eau-douce'
// 'usage-terres' | 'aerosols-atmospheriques'

export interface PlanetaryLimitImpact {
  limit_id: string
  delta_pct_median: number            // % de variation de currentValue
  range: { min: number; max: number }
  direction: ImpactDirection
  horizon_year: number
  note?: string
}

// ─── Impact indicateurs sociétaux ────────────────────────────────────────────
// indicator_id correspond aux clés de SocietalIndicators dans src/data/societalIndicators.ts :
// 'foodSecurity' | 'waterAccess' | 'geopoliticalConflicts' | 'globalHealth' | 'inequality'

export interface SocietalImpact {
  indicator_id: string
  direction: ImpactDirection
  magnitude: ImpactMagnitude
  note: string
}

// ─── Interactions inter-politiques ───────────────────────────────────────────

export interface PolicyInteraction {
  politique_id: string
  label: string
  type: InteractionType
  factor: number                      // multiplicateur sur l'effet de CE modèle
  note: string
}

// ─── Séries temporelles delta (pour le moteur runtime) ───────────────────────
// Valeurs DELTA par rapport à la baseline SSP2-4.5.
// Le moteur calcule : baseline[year] + delta[year] = courbe projetée.
// Horizons fixes POC : [2025, 2030, 2035, 2040, 2050, 2075, 2100]

export interface ProjectionDelta {
  years: number[]
  median: number[]
  optimistic: number[]
  pessimistic: number[]
}

export interface ImpactProjections {
  co2_delta_GtCO2_yr: ProjectionDelta     // réduction annuelle vs baseline (négatif)
  temp_delta_C: ProjectionDelta           // écart température vs baseline à chaque année
}

// ─── Modèle d'impact complet ─────────────────────────────────────────────────

export interface ImpactModel {
  // Identification
  politique_id: string
  decision_id?: string                // lien vers Decision.id si applicable
  label: string
  version: string                     // "1.0.0"
  generated_at: string                // ISO date (génération offline)

  // Conditions d'application
  conditions: {
    scope: GeographicScope
    sectors: string[]
    implementation_year: number
    full_effect_year: number
    prerequisites?: string[]          // politique_ids requis en amont
  }

  // Impacts quantifiés
  emissions_impact: EmissionsImpact
  temperature_impact: TemperatureImpact
  planetary_limits: PlanetaryLimitImpact[]
  societal_indicators: SocietalImpact[]

  // Interactions avec d'autres politiques
  interactions: PolicyInteraction[]

  // Séries temporelles pour le moteur de calcul
  projections: ImpactProjections

  // Méta
  uncertainty_level: UncertaintyLevel
  methodological_note: string
}
