// ─── Baseline SSP3-7.0 — Single Source of Truth ──────────────────────────────
//
// Référence climatique partagée : Regional Rivalry high-emissions scenario (SSP3-7.0)
// Température validée contre IPCC AR6 WGI Figure SPM.8 — CEDA Archive, CC-BY-4.0
// Near-term (2030) : +1.49°C | Mid-term (2050) : +2.10°C | Long-term (2100) : +3.91°C
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

export const BASELINE_CO2_9PT = [65.2, 67.2, 69.3, 71.6, 74.9, 79.9, 87.2, 92.9, 100.3]
// GtCO₂eq/an — GHG TOTAL : CO₂ (fossile+LULUCF) + CH₄×GWP27.9 + N₂O×GWP273 + Gaz F
// Sources :
//   CO₂ (fossile+LULUCF) : [IPCC AR6 WGI, Figure SPM.4 — CEDA Archive, CC-BY-4.0]
//   CH₄ : CEDA Methane_Mt_CO2_yr.csv × GWP100=27.9 (AR6) [AR6 WGI, SPM.4 — CEDA, CC-BY-4.0]
//   N₂O : CEDA Nitrous_oxide_Mt_N2O_yr.csv × GWP100=273 (AR6) [AR6 WGI, SPM.4 — CEDA, CC-BY-4.0]
//   Gaz F : estimation centrale SSP3-7.0, compliance Kigali partielle [AR6 WGI, p.899 ; AR6 WGIII, Ch.2, p.241]
// 2024 ref: ~65 GtCO₂eq (vs 59 en 2019 [AR6 WGIII, Ch.2, p.241]) ✓

export const BASELINE_TEMP_9PT = [1.32, 1.38, 1.43, 1.49, 1.60, 1.78, 2.10, 2.44, 2.95]
// °C warming above pre-industrial (anomaly vs 1950-1980 baseline)
// Trajectory: reaches ~3.91°C by 2100 under SSP3-7.0
// Source: [IPCC AR6 WGI, Figure SPM.8 — CEDA Archive, CC-BY-4.0] — ensemble mean

export const BASELINE_FOREST_9PT = [58.0, 57.3, 56.5, 55.5, 53.2, 49.5, 43.5, 38.0, 31.5]
// % remaining primary forest cover relative to pre-industrial baseline
// Deforestation rate ~1.9× SSP2-4.5 under SSP3-7.0 (agricultural expansion, weak land policy)
// Source: [AR6 WGII, Ch.2, pp.290-295 (biome transitions) & Ch.CCP7, pp.2408-2409 (Amazon tipping)]
// 2024 value = 58% (current observed state, planetary boundary: 58%)

export const BASELINE_ENERGY_MIX_9PT = {
  coal:    [27.0, 27.0, 27.0, 27.0, 27.0, 27.0, 26.5, 26.2, 26.0],
  oil:     [31.0, 30.8, 30.5, 30.3, 29.8, 28.8, 27.0, 26.0, 25.0],
  gas:     [23.0, 23.0, 23.0, 23.5, 23.5, 23.5, 23.0, 22.5, 22.0],
  nuclear: [ 5.0,  5.0,  5.0,  5.0,  5.0,  4.8,  4.6,  4.5,  4.5],
  solar:   [ 5.0,  5.2,  5.4,  5.7,  6.2,  7.2,  9.0, 10.0, 10.5],
  wind:    [ 4.0,  4.1,  4.2,  4.3,  4.7,  5.4,  6.5,  7.0,  7.5],
  hydro:   [ 3.0,  3.0,  3.0,  3.0,  3.0,  3.0,  3.0,  3.0,  3.0],
  autres:  [ 2.0,  1.9,  1.9,  1.2,  0.8,  0.3,  0.4,  0.8,  1.5],
}
// % primary energy mix — fossils remain dominant (>75% through 2050) under SSP3-7.0
// Renewables (solar+wind+hydro+autres) reach only ~22.5% by 2074 (vs ~37% under SSP2-4.5)
// Source: [AR6 WGIII, Ch.3, pp.289-310 (no-additional-policy pathways)] — ⚠️ per-fuel breakdown: connaissance générale calibrée

export const BASELINE_RESOURCES_9PT = {
  minerals:    [21.0, 21.8, 22.7, 23.8, 25.9, 28.8, 33.0, 36.5, 40.0],
  biomass:     [17.1, 17.5, 17.9, 18.4, 19.5, 21.2, 23.5, 26.5, 30.0],
  fossilFuels: [13.9, 14.6, 15.3, 16.3, 18.2, 21.5, 24.5, 29.5, 33.5],
}
// Gt/an — extraction of natural resources
// fossilFuels at 2074: 33.5 vs 17.0 (SSP2-4.5) — factor ~2.0, calibré sur ratio CO₂ CEDA
// biomass: expansion agricole + biomasse traditionnelle (pauvreté énergétique SSP3)
// Source: [AR6 WGIII, Ch.6, p.660 (80% charbon doit rester = NON respecté sous SSP3-7.0)]
// UNEP Global Resources Outlook 2024 — ⚠️ amplitude fossilFuels: ratio CEDA SSP3-7.0/SSP2-4.5

export const BASELINE_FOOD_SECURITY_9PT = [63.0, 62.5, 62.0, 61.0, 58.5, 55.0, 50.0, 45.0, 38.0]
// FAO hunger index /100 — lower is better
// SSP3-7.0: 10-25% cereal yield losses under 3°C; degradation factor ~1.6× vs SSP2-4.5
// Source: [AR6 WGII, Ch.5, pp.557-559 (food systems under high warming)]; FAO SOFI 2023

export const BASELINE_WATER_ACCESS_9PT = [71.0, 71.2, 71.3, 71.3, 71.0, 70.5, 69.5, 68.0, 66.0]
// % world population with access to safe drinking water
// SSP3-7.0: stagnates then declines — 3-4 billion exposed to water stress at 3.5-4°C
// Source: [AR6 WGII, Ch.4, p.568]; WHO/UNICEF JMP

export const BASELINE_WATER_TENSIONS_9PT = [61.0, 62.0, 63.5, 65.5, 69.0, 74.0, 80.0, 85.5, 89.0]
// Geopolitical tension score 0–100 (higher = worse)
// SSP3-7.0: "Regional Rivalry" — national water security framing, less intl cooperation
// Source: [AR6 WGII, Ch.7, p.1038 (water-related conflicts, high warming)]; ACLED; UNHCR

export const BASELINE_RESOURCE_CONFLICTS_9PT = [74.0, 75.5, 77.0, 79.0, 82.5, 86.5, 90.5, 93.0, 95.0]
// Resource conflict intensity index 0–100 (higher = worse)
// SSP3-7.0 = defining scenario for resource competition, fragmented governance
// Source: [AR6 WGII, Ch.7, pp.1040-1042 (conflict amplification under climate stress)]; ACLED

export const BASELINE_CLIMATE_MIGRATIONS_9PT = [55.0, 56.5, 58.5, 62.0, 70.0, 83.0, 107.0, 132.0, 160.0]
// Climate-displaced persons index (millions equivalent)
// SSP3-7.0: West Africa alone 50M+ [AR6 WGII, Ch.9, p.1405]; ~2.2× SSP2-4.5 at 2074
// Source: [AR6 WGII, Ch.7, p.1059]; IOM World Migration Report 2022 (216M internal migrants by 2050)

export const BASELINE_LIFE_EXPECTANCY_9PT = [73.4, 73.2, 72.9, 72.5, 71.5, 70.0, 67.5, 64.5, 61.0]
// years — global average
// SSP3-7.0: accelerated decline from heat mortality, disease vectors, fossil air pollution
// Source: [AR6 WGII, Ch.7, pp.1033-1036 (health impacts)]; WHO GHO; Lancet Countdown 2022

export const BASELINE_RESPIRATORY_DISEASES_9PT = [18.0, 19.5, 21.0, 23.0, 27.5, 33.5, 43.0, 53.0, 63.0]
// % increase vs 2000 — air pollution (fossil dominance), heat waves, pollen season extension
// SSP3-7.0: unmitigated fossil use maintains high PM2.5; +66% at 2074 vs +38% SSP2-4.5
// Source: [AR6 WGII, Ch.7, p.1030 (air quality + heat synergy)]; WHO Global Air Quality 2021

export const BASELINE_WHO_HEALTH_INDEX_9PT = [67.0, 66.3, 65.5, 64.5, 62.5, 59.5, 55.5, 51.5, 47.0]
// /100 — composite WHO health index (heat mortality, infectious diseases, malnutrition, air quality)
// SSP3-7.0: sharper decline driven by unmitigated warming + fossil pollution
// Source: [AR6 WGII, Ch.7 (composite health impacts under high warming)] — ⚠️ index amplitude: connaissance générale

export const BASELINE_GINI_COEFFICIENT_9PT = [0.670, 0.672, 0.675, 0.679, 0.687, 0.698, 0.715, 0.730, 0.748]
// Gini index 0–1 — higher = more unequal
// SSP3-7.0: fragmented governance, reduced redistribution — developing economies bear disproportionate cost
// Source: [AR6 WGII, Ch.16, pp.2340-2345 (poverty & inequality amplification)]; World Inequality Report 2022

export const BASELINE_WEALTH_CONCENTRATION_9PT = [45.0, 45.6, 46.3, 47.2, 49.5, 52.5, 57.0, 61.5, 65.5]
// % of global wealth held by top 1%
// SSP3-7.0: accelerated concentration — regional rivalry + climate cost asymmetry
// Source: WID.world; World Inequality Report 2022; [AR6 WGII, Ch.16] — ⚠️ trajectory: connaissance générale

export const BASELINE_EDUCATION_ACCESS_9PT = [61.0, 61.1, 61.1, 61.0, 60.7, 60.0, 59.0, 58.0, 57.0]
// % world population with secondary+ education access
// SSP3-7.0: stagnates then declines — forced displacement, economic instability, school closures
// Source: UNESCO Education 2030 Framework; World Bank — ⚠️ SSP3-7.0 trajectory: connaissance générale

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

// Source 2100 values: [IPCC AR6 WGI, Figure SPM.4 & SPM.8 — CEDA Archive, CC-BY-4.0] pour temp & CO₂;
// indicateurs sociétaux: extrapolation calibrée sur trajectoire SSP3-7.0
export const BASELINE_CO2_10PT = [...BASELINE_CO2_9PT, 115.9]
// Source 2100: [IPCC AR6 WGI, Figure SPM.4 — CEDA, CC-BY-4.0] + AR6 GWP100 conversions
export const BASELINE_TEMP_10PT = [...BASELINE_TEMP_9PT, 3.91]
export const BASELINE_FOREST_10PT = [...BASELINE_FOREST_9PT, 24.0]
export const BASELINE_ENERGY_MIX_10PT = {
  coal:    [...BASELINE_ENERGY_MIX_9PT.coal,    25.5],
  oil:     [...BASELINE_ENERGY_MIX_9PT.oil,     24.0],
  gas:     [...BASELINE_ENERGY_MIX_9PT.gas,     21.5],
  nuclear: [...BASELINE_ENERGY_MIX_9PT.nuclear,  4.5],
  solar:   [...BASELINE_ENERGY_MIX_9PT.solar,   11.5],
  wind:    [...BASELINE_ENERGY_MIX_9PT.wind,     8.5],
  hydro:   [...BASELINE_ENERGY_MIX_9PT.hydro,    3.0],
  autres:  [...BASELINE_ENERGY_MIX_9PT.autres,   1.5],
}
export const BASELINE_RESOURCES_10PT = {
  minerals:    [...BASELINE_RESOURCES_9PT.minerals,    42.5],
  biomass:     [...BASELINE_RESOURCES_9PT.biomass,     32.5],
  fossilFuels: [...BASELINE_RESOURCES_9PT.fossilFuels, 37.0],
}
export const BASELINE_FOOD_SECURITY_10PT = [...BASELINE_FOOD_SECURITY_9PT, 31.0]
export const BASELINE_WATER_ACCESS_10PT = [...BASELINE_WATER_ACCESS_9PT, 63.0]
export const BASELINE_WATER_TENSIONS_10PT = [...BASELINE_WATER_TENSIONS_9PT, 91.0]
export const BASELINE_RESOURCE_CONFLICTS_10PT = [...BASELINE_RESOURCE_CONFLICTS_9PT, 96.0]
export const BASELINE_CLIMATE_MIGRATIONS_10PT = [...BASELINE_CLIMATE_MIGRATIONS_9PT, 185.0]
export const BASELINE_LIFE_EXPECTANCY_10PT = [...BASELINE_LIFE_EXPECTANCY_9PT, 57.5]
export const BASELINE_RESPIRATORY_DISEASES_10PT = [...BASELINE_RESPIRATORY_DISEASES_9PT, 72.0]
export const BASELINE_WHO_HEALTH_INDEX_10PT = [...BASELINE_WHO_HEALTH_INDEX_9PT, 43.5]
export const BASELINE_GINI_COEFFICIENT_10PT = [...BASELINE_GINI_COEFFICIENT_9PT, 0.762]
export const BASELINE_WEALTH_CONCENTRATION_10PT = [...BASELINE_WEALTH_CONCENTRATION_9PT, 68.0]
export const BASELINE_EDUCATION_ACCESS_10PT = [...BASELINE_EDUCATION_ACCESS_9PT, 55.5]

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
