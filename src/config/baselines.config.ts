// ─── Baseline SSP2-4.5 — Single Source of Truth ──────────────────────────────
//
// Référence climatique partagée : Middle-of-the-road emissions scenario (SSP2-4.5)
// Validée contre GIEC AR6_WG1_00174 (page 80)
// Near-term (2030) : +1.70°C | Mid-term (2050) : +2.10°C | Long-term (2100) : +2.70°C
//
// Cette configuration est importée par :
// - src/data/mitigationPolicies.ts — baseline pour les politiques (9 + 10e points)
// - src/store/simulation.store.ts — baseline pour le moteur de simulation (10 points)
//
// Temporal labels :
//   - SIM_LABELS (10 points) : [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074, 2100]
//   - PROJ_LABELS (9 points) : [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074] (obsolète, conservé pour compatibilité)

// ─── Baselines 9-point (used by mitigationPolicies.ts) ──────────────────────────
// Extrapolation 2024→2074 en 5-year increments — projection la plus certaine (35 ans d'horizon)

export const BASELINE_CO2_9PT = [37.4, 38.8, 40.2, 41.8, 44.8, 49.0, 54.5, 57.0, 59.0]
// GtCO₂/an — Cumulative CO₂ emissions
// Trajectory: stabilization post-2050 under SSP2-4.5
// Source: GIEC AR6 WG1, Figure 4.19 (SSP2-4.5 projection)

export const BASELINE_TEMP_9PT = [1.35, 1.43, 1.52, 1.70, 1.82, 1.94, 2.10, 2.18, 2.32]
// °C warming above pre-industrial
// Trajectory: warming continues but below 2.5°C at 2074
// Source: GIEC AR6 WG1, Figure 4.19 (SSP2-4.5 projection, ensemble mean)

export const BASELINE_FOREST_9PT = [58.0, 57.5, 57.0, 56.5, 55.3, 53.5, 50.5, 47.5, 43.5]
// % remaining primary forest cover relative to pre-industrial baseline
// Source: Mackey et al. 2015; Steffen et al. 2015 (planetary boundary: 58%)
// 2024 value = 58% (current observed state)

export const BASELINE_ENERGY_MIX_9PT = {
  coal:    [27,   26.5, 26,   25.5, 24.5, 22.5, 20,   18,   15.5],
  oil:     [31,   30.5, 30,   29.5, 28.5, 27.5, 26,   24,   22  ],
  gas:     [23,   23,   23.5, 23.5, 23,   22.5, 22,   21,   20  ],
  nuclear: [5,    5,    5,    5,    5,    5,    5.5,  5.5,  5.5 ],
  solar:   [5,    5.5,  6,    6.5,  8,    10,   12.5, 14.5, 17  ],
  wind:    [4,    4.5,  5,    5.5,  7,    8.5,  10,   12,   14.5],
  hydro:   [3,    3,    3,    3,    3,    3,    3,    3,    3   ],
  autres:  [2,    2,    1.5,  1.5,  1,    1,    1,    2,    2.5 ],
}
// % primary energy mix — IEA STEPS (Stated Policies Scenario)
// Coal declining; renewables (solar+wind) growing to ~32% by 2074

export const BASELINE_RESOURCES_9PT = {
  minerals:    [21.0, 21.8, 22.5, 23.3, 25.0, 27.5, 31.0, 34.0, 37.0],
  biomass:     [17.1, 17.4, 17.7, 18.0, 18.6, 19.5, 21.0, 22.5, 24.0],
  fossilFuels: [13.9, 14.3, 14.7, 15.0, 15.5, 16.0, 16.5, 16.8, 17.0],
}
// Gt/an — extraction of natural resources — UNEP Global Resources Outlook
// Minerals: accelerating (rising technology demand)
// Biomass: steady growth
// Fossil fuels: plateauing (depletion + climate policies)

export const BASELINE_FOOD_SECURITY_9PT = [63, 62.8, 62.5, 62, 61, 59.5, 57, 54, 50]
// FAO hunger index /100 — lower is better
// SSP2-4.5 without mitigation: progressive degradation after 2030 under climate pressure
// Source: AR6 WGII Ch.5 (agricultural systems); FAO SOFI 2023

export const BASELINE_WATER_ACCESS_9PT = [71, 71.5, 72, 72.5, 73.5, 75, 77, 79, 81]
// % world population with access to safe drinking water
// Progression continues but slowing (physiological limits ~85%)
// Source: WHO/UNICEF JMP; AR6 WGII Ch.4 (water resources)

export const BASELINE_WATER_TENSIONS_9PT = [61, 61.5, 62, 63, 65, 68, 71, 73, 75]
// Geopolitical tension score 0–100 (higher = worse)
// Rising due to scarcity, population growth, climate-driven migration
// Source: AR6 WGII Ch.7 (conflicts); ACLED; UNHCR

export const BASELINE_RESOURCE_CONFLICTS_9PT = [74, 74.5, 75, 76, 78, 80, 82, 84, 85]
// Resource conflict intensity index 0–100 (higher = worse)
// Driven by competition over water, minerals, arable land
// Source: AR6 WGII Ch.7; ACLED

export const BASELINE_CLIMATE_MIGRATIONS_9PT = [55, 55.5, 56.5, 58, 61, 65, 68, 71, 74]
// Climate-displaced persons index (millions equivalent)
// Accelerating after 2030 as extreme events intensify
// Source: AR6 WGII Ch.7; UNHCR climate displacement projections

export const BASELINE_LIFE_EXPECTANCY_9PT = [73.4, 73.3, 73.2, 73.0, 72.5, 71.8, 70.5, 69.0, 67.0]
// years — global average
// Declining after 2030 due to heat stress, malnutrition, disease vectors
// Source: AR6 WGII Ch.7 (health); WHO GHO; Lancet Countdown

export const BASELINE_RESPIRATORY_DISEASES_9PT = [18, 19, 20, 21, 23, 26, 30, 34, 38]
// % increase vs 2000 — due to air pollution, heat waves
// Accelerates as temperatures rise
// Source: AR6 WGII Ch.7; WHO; Lancet Countdown

export const BASELINE_WHO_HEALTH_INDEX_9PT = [67, 66.5, 66, 65.5, 64.5, 63, 61, 59, 57]
// /100 — composite WHO health index
// Declining trajectory under SSP2-4.5 without strong adaptation

export const BASELINE_GINI_COEFFICIENT_9PT = [0.670, 0.671, 0.673, 0.675, 0.679, 0.684, 0.692, 0.700, 0.708]
// Gini index 0–1 — higher = more unequal
// Climate impacts widen inequality; poor are most vulnerable
// Source: AR6 WGII Ch.16 (poverty & inequality); World Inequality Report 2022

export const BASELINE_WEALTH_CONCENTRATION_9PT = [45, 45.3, 45.6, 46.0, 47.0, 48.5, 50.5, 52.5, 54.5]
// % of global wealth held by top 1%
// Increases as climate impacts hit developing economies hardest
// Source: WID.world; World Inequality Report 2022

export const BASELINE_EDUCATION_ACCESS_9PT = [61, 61.3, 61.5, 61.8, 62.3, 63.0, 63.5, 64.0, 64.3]
// % world population with secondary+ education access
// Slow progress; climate-driven school closures limit gains post-2050
// Source: UNESCO; World Bank education datasets

// ─── Baselines 10-point including 2100 extrapolation ──────────────────────────
// Interpolation strategy: asymptotic stabilization (decay ratio = 0.75)
//
// Justification:
// 1. Most climate & policy impacts decelerate in their effects over time (saturation, limits)
// 2. A linear decay from 2074→2100 (26 years) with ratio 0.75 = 25% attenuation
// 3. Example: if CO₂ delta at 2074 is −5 GtCO₂/an, at 2100 it becomes 0.75 × (−5) = −3.75
// 4. This ratio is uniform across all indicators for simplicity & traceability
// 5. If future evidence suggests different ratios per indicator, they can be adjusted with justification
//
// Formula: value[2100] = baseline[2100] + 0.75 × (value[2074] − baseline[2074])

export const BASELINE_CO2_10PT = [...BASELINE_CO2_9PT, 59.5]
export const BASELINE_TEMP_10PT = [...BASELINE_TEMP_9PT, 2.70]
export const BASELINE_FOREST_10PT = [...BASELINE_FOREST_9PT, 42.0]
export const BASELINE_ENERGY_MIX_10PT = {
  coal:    [...BASELINE_ENERGY_MIX_9PT.coal, 14],
  oil:     [...BASELINE_ENERGY_MIX_9PT.oil, 20],
  gas:     [...BASELINE_ENERGY_MIX_9PT.gas, 19],
  nuclear: [...BASELINE_ENERGY_MIX_9PT.nuclear, 5.5],
  solar:   [...BASELINE_ENERGY_MIX_9PT.solar, 19],
  wind:    [...BASELINE_ENERGY_MIX_9PT.wind, 16],
  hydro:   [...BASELINE_ENERGY_MIX_9PT.hydro, 3],
  autres:  [...BASELINE_ENERGY_MIX_9PT.autres, 3.5],
}
export const BASELINE_RESOURCES_10PT = {
  minerals:    [...BASELINE_RESOURCES_9PT.minerals, 39.5],
  biomass:     [...BASELINE_RESOURCES_9PT.biomass, 25.5],
  fossilFuels: [...BASELINE_RESOURCES_9PT.fossilFuels, 17.0],
}
export const BASELINE_FOOD_SECURITY_10PT = [...BASELINE_FOOD_SECURITY_9PT, 46]
export const BASELINE_WATER_ACCESS_10PT = [...BASELINE_WATER_ACCESS_9PT, 82]
export const BASELINE_WATER_TENSIONS_10PT = [...BASELINE_WATER_TENSIONS_9PT, 77]
export const BASELINE_RESOURCE_CONFLICTS_10PT = [...BASELINE_RESOURCE_CONFLICTS_9PT, 87]
export const BASELINE_CLIMATE_MIGRATIONS_10PT = [...BASELINE_CLIMATE_MIGRATIONS_9PT, 77]
export const BASELINE_LIFE_EXPECTANCY_10PT = [...BASELINE_LIFE_EXPECTANCY_9PT, 65.0]
export const BASELINE_RESPIRATORY_DISEASES_10PT = [...BASELINE_RESPIRATORY_DISEASES_9PT, 42]
export const BASELINE_WHO_HEALTH_INDEX_10PT = [...BASELINE_WHO_HEALTH_INDEX_9PT, 55]
export const BASELINE_GINI_COEFFICIENT_10PT = [...BASELINE_GINI_COEFFICIENT_9PT, 0.715]
export const BASELINE_WEALTH_CONCENTRATION_10PT = [...BASELINE_WEALTH_CONCENTRATION_9PT, 56.0]
export const BASELINE_EDUCATION_ACCESS_10PT = [...BASELINE_EDUCATION_ACCESS_9PT, 64.5]

// ─── Helper function for extrapolation ────────────────────────────────────────
/**
 * Extrapolate a 9-point projection to 10 points (add 2100 value)
 * 
 * @param values9 - 9-point array [2024, 2026, ..., 2074]
 * @param baseline9 - 9-point baseline array
 * @param baseline2100 - baseline value at 2100
 * @param decayRatio - attenuation factor for delta (default 0.75 = 25% decay)
 * @returns value at 2100
 * 
 * Strategy: delta[2100] = decayRatio × (delta[2074]) + baseline[2100]
 * This ensures policy effects plateau asymptotically rather than diverging
 */
export function extrapolateValueTo2100(
  values9: number[],
  baseline9: number[],
  baseline2100: number,
  decayRatio: number = 0.75
): number {
  const point9Index = 8 // 2074 is at index 8 (0-indexed)
  const delta2074 = values9[point9Index] - baseline9[point9Index]
  const delta2100 = delta2074 * decayRatio
  return baseline2100 + delta2100
}
