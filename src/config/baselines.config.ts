// ─── Baseline SSP3-7.0 — Single Source of Truth ──────────────────────────────
//
// Référence climatique partagée : Regional Rivalry high-emissions scenario (SSP3-7.0)
// Température validée contre IPCC AR6 WGI Figure SPM.8 — CEDA Archive, CC-BY-4.0
// Near-term (2030) : +1.49°C | Mid-term (2050) : +2.10°C | Long-term (2100) : +3.95°C
//
// Cette configuration est importée par :
// - src/store/simulation.store.ts — baseline pour le moteur de simulation (16 points)
//
// Grille temporelle :
//   SIM_LABELS (16 points) : [2025, 2030, 2035, 2040, 2045, 2050, 2055, 2060, 2065, 2070, 2075, 2080, 2085, 2090, 2095, 2100]
//   Grille uniforme 5 ans — continue la série historique 1990–2020 du dashboard

// ─── Baselines 9-point legacy (used by mitigationPolicies.ts — à migrer step 3) ─
// Ancienne grille irrégulière [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074]
// Conservées comme source de traçabilité pour les _16PT interpolées ci-dessous

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

// ─── Baselines 16-point — grille uniforme 5 ans (SIM_LABELS) ──────────────────
//
// Méthode : interpolation linéaire depuis les séries _9PT + ancre 2100 AR6.
// BASELINE_TEMP_16PT : valeurs directement extraites du CSV CEDA (spm_fig8/panel_a/).
// Indicateurs sociétaux (_9PT, _16PT) : calibrés sur connaissance générale AR6 — voir ⚠️ inline.

export const BASELINE_CO2_16PT = [66.2, 71.6, 75.7, 79.9, 83.6, 87.2, 90.1, 92.9, 95.5, 98.2, 100.9, 103.9, 106.9, 109.9, 112.9, 115.9]
// GtCO₂eq/an — GHG TOTAL SSP3-7.0
// Source: [IPCC AR6 WGI, Figure SPM.4 — CEDA Archive, CC-BY-4.0] + GWP100 conversions AR6

export const BASELINE_TEMP_16PT = [1.35, 1.49, 1.63, 1.78, 1.94, 2.10, 2.27, 2.44, 2.62, 2.80, 2.99, 3.18, 3.37, 3.57, 3.76, 3.95]
// °C warming above pre-industrial — SSP3-7.0 ensemble mean
// Source: [IPCC AR6 WGI, Figure SPM.8 — CEDA Archive, CC-BY-4.0]
// Valeurs directement extraites du CSV CEDA (tools/rag/data_sources/datasets/WGI/spm_fig8/panel_a/)
// 2100 extrapolé : 3.909 (2099) + Δ0.037/an → 3.95°C

export const BASELINE_FOREST_16PT = [57.7, 55.5, 52.6, 49.5, 46.5, 43.5, 40.8, 38.0, 35.7, 33.4, 31.2, 29.8, 28.3, 26.9, 25.4, 24.0]
// % remaining primary forest cover relative to pre-industrial baseline
// Source: [AR6 WGII, Ch.2, pp.290-295 & Ch.CCP7, pp.2408-2409]

export const BASELINE_ENERGY_MIX_16PT = {
  coal:    [27.0, 27.0, 27.0, 27.0, 26.8, 26.5, 26.4, 26.2, 26.1, 26.1, 26.0, 25.9, 25.8, 25.7, 25.6, 25.5],
  oil:     [30.9, 30.3, 29.6, 28.8, 27.9, 27.0, 26.5, 26.0, 25.6, 25.3, 25.0, 24.8, 24.6, 24.4, 24.2, 24.0],
  gas:     [23.0, 23.5, 23.5, 23.5, 23.3, 23.0, 22.8, 22.5, 22.3, 22.1, 22.0, 21.9, 21.8, 21.7, 21.6, 21.5],
  nuclear: [ 5.0,  5.0,  5.0,  4.8,  4.7,  4.6,  4.6,  4.5,  4.5,  4.5,  4.5,  4.5,  4.5,  4.5,  4.5,  4.5],
  solar:   [ 5.1,  5.7,  6.4,  7.2,  8.1,  9.0,  9.5, 10.0, 10.2, 10.4, 10.5, 10.7, 10.9, 11.1, 11.3, 11.5],
  wind:    [ 4.1,  4.3,  4.8,  5.4,  6.0,  6.5,  6.8,  7.0,  7.2,  7.4,  7.5,  7.7,  7.9,  8.1,  8.3,  8.5],
  hydro:   [ 3.0,  3.0,  3.0,  3.0,  3.0,  3.0,  3.0,  3.0,  3.0,  3.0,  3.0,  3.0,  3.0,  3.0,  3.0,  3.0],
  autres:  [ 2.0,  1.2,  0.7,  0.3,  0.4,  0.4,  0.6,  0.8,  1.1,  1.3,  1.5,  1.5,  1.5,  1.5,  1.5,  1.5],
}
// % primary energy mix — Source: [AR6 WGIII, Ch.3, pp.289-310] — ⚠️ per-fuel breakdown: connaissance générale calibrée

export const BASELINE_RESOURCES_16PT = {
  minerals:    [21.4, 23.8, 26.4, 28.8, 30.9, 33.0, 34.8, 36.5, 37.8, 39.0, 40.1, 40.6, 41.1, 41.5, 42.0, 42.5],
  biomass:     [17.3, 18.4, 19.8, 21.2, 22.4, 23.5, 25.0, 26.5, 27.8, 29.0, 30.1, 30.6, 31.1, 31.5, 32.0, 32.5],
  fossilFuels: [14.3, 16.3, 18.8, 21.5, 23.0, 24.5, 27.0, 29.5, 30.9, 32.4, 33.6, 34.3, 35.0, 35.7, 36.3, 37.0],
}
// Gt/an — Source: [AR6 WGIII, Ch.6, p.660]; UNEP Global Resources Outlook 2024

export const BASELINE_FOOD_SECURITY_16PT = [62.8, 61.0, 57.9, 55.0, 52.5, 50.0, 47.5, 45.0, 42.5, 40.0, 37.7, 36.4, 35.0, 33.7, 32.3, 31.0]
// FAO hunger index /100 — Source: [AR6 WGII, Ch.5, pp.557-559]; FAO SOFI 2023

export const BASELINE_WATER_ACCESS_16PT = [71.1, 71.3, 70.9, 70.5, 70.0, 69.5, 68.8, 68.0, 67.3, 66.6, 65.9, 65.3, 64.7, 64.2, 63.6, 63.0]
// % world population with access to safe drinking water — Source: [AR6 WGII, Ch.4, p.568]; WHO/UNICEF JMP

export const BASELINE_WATER_TENSIONS_16PT = [61.5, 65.5, 69.8, 74.0, 77.0, 80.0, 82.8, 85.5, 86.8, 88.0, 89.1, 89.5, 89.8, 90.2, 90.6, 91.0]
// Geopolitical tension score 0–100 — Source: [AR6 WGII, Ch.7, p.1038]; ACLED; UNHCR

export const BASELINE_RESOURCE_CONFLICTS_16PT = [74.8, 79.0, 83.2, 86.5, 88.5, 90.5, 91.8, 93.0, 93.7, 94.4, 95.0, 95.2, 95.4, 95.6, 95.8, 96.0]
// Resource conflict intensity 0–100 — Source: [AR6 WGII, Ch.7, pp.1040-1042]; ACLED

export const BASELINE_CLIMATE_MIGRATIONS_16PT = [55.8, 62.0, 72.2, 83.0, 95.0, 107.0, 119.5, 132.0, 142.0, 152.0, 161.0, 165.8, 170.6, 175.4, 180.2, 185.0]
// Climate-displaced persons (millions) — Source: [AR6 WGII, Ch.7, p.1059]; IOM World Migration Report 2022

export const BASELINE_LIFE_EXPECTANCY_16PT = [73.3, 72.5, 71.3, 70.0, 68.8, 67.5, 66.0, 64.5, 63.3, 62.0, 60.9, 60.2, 59.5, 58.8, 58.2, 57.5]
// years — global average — Source: [AR6 WGII, Ch.7, pp.1033-1036]; WHO GHO; Lancet Countdown 2022

export const BASELINE_RESPIRATORY_DISEASES_16PT = [18.8, 23.0, 28.5, 33.5, 38.3, 43.0, 48.0, 53.0, 56.6, 60.1, 63.3, 65.1, 66.8, 68.5, 70.3, 72.0]
// % increase vs 2000 — Source: [AR6 WGII, Ch.7, p.1030]; WHO Global Air Quality 2021

export const BASELINE_WHO_HEALTH_INDEX_16PT = [66.7, 64.5, 62.0, 59.5, 57.5, 55.5, 53.5, 51.5, 49.9, 48.3, 46.9, 46.2, 45.5, 44.8, 44.2, 43.5]
// /100 — Source: [AR6 WGII, Ch.7] — ⚠️ index amplitude: connaissance générale

export const BASELINE_GINI_COEFFICIENT_16PT = [0.671, 0.679, 0.689, 0.698, 0.707, 0.715, 0.723, 0.730, 0.736, 0.743, 0.749, 0.751, 0.754, 0.757, 0.759, 0.762]
// Gini index 0–1 — Source: [AR6 WGII, Ch.16, pp.2340-2345]; World Inequality Report 2022

export const BASELINE_WEALTH_CONCENTRATION_16PT = [45.3, 47.2, 50.0, 52.5, 54.8, 57.0, 59.3, 61.5, 62.9, 64.4, 65.6, 66.1, 66.6, 67.0, 67.5, 68.0]
// % of global wealth held by top 1% — Source: WID.world; World Inequality Report 2022; [AR6 WGII, Ch.16]

export const BASELINE_EDUCATION_ACCESS_16PT = [61.1, 61.0, 60.6, 60.0, 59.5, 59.0, 58.5, 58.0, 57.6, 57.3, 56.9, 56.7, 56.4, 56.1, 55.8, 55.5]
// % secondary+ education access — Source: UNESCO Education 2030; World Bank — ⚠️ trajectory: connaissance générale

// ─── Séries déplacées depuis simulation.store.ts ──────────────────────────────

export const BASELINE_CO2_PPM_16PT = [427, 443, 459, 476, 495, 513, 535, 557, 578, 600, 619, 629, 639, 650, 660, 670]
// ppm CO₂ atmosphérique — SSP3-7.0
// Source: ⚠️ connaissance générale (AR6 WGI Annex II Table AII.1.2 non indexée localement)
// Note: ticker CO₂ ppm = CO₂ seul (atmosphérique). Axe GHG simulateur = GtCO₂eq total.

export const BASELINE_ENERGY_TOTAL_TWH_16PT = [177600, 188000, 199700, 213000, 224500, 236000, 246000, 256000, 263900, 271700, 279000, 284200, 289400, 294600, 299800, 305000]
// TWh — énergie primaire mondiale totale (hors biomasse traditionnelle) — SSP3-7.0
// Utilisé pour convertir les parts % du mix en valeurs absolues TWh
// Source: 2025 : données Energy Institute (réel) ; 2030-2100 : projection SSP3-7.0 demande énergétique élevée
