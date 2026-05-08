import type { EnergyMixKey } from '@/types/index'

export type ScoreCategory = 'good' | 'warning' | 'critical'

export interface IndicatorResult {
  id: string
  value: number
  baseline: number
  unit: string
  category: ScoreCategory
  higherIsBetter: boolean
}

export interface PillarResult {
  id: 'climate' | 'societal' | 'energy'
  indicators: IndicatorResult[]
  category: ScoreCategory
}

export interface GameFinalScore {
  pillars: PillarResult[]
  overall: ScoreCategory
  tempAt2100: number
  tippingCount: number
}

// Index 9 = year 2100 in SIM_LABELS
const IDX = 9

function blended(decided: number[], pessimist: number[]): number {
  return 0.5 * decided[IDX] + 0.5 * pessimist[IDX]
}

function cat(value: number, goodBound: number, warnBound: number, higherIsBetter: boolean): ScoreCategory {
  if (higherIsBetter) {
    if (value >= goodBound) return 'good'
    if (value >= warnBound) return 'warning'
    return 'critical'
  } else {
    if (value <= goodBound) return 'good'
    if (value <= warnBound) return 'warning'
    return 'critical'
  }
}

function worstOf(cats: ScoreCategory[]): ScoreCategory {
  if (cats.includes('critical')) return 'critical'
  if (cats.includes('warning'))  return 'warning'
  return 'good'
}

export interface GameScoreInput {
  cumulativeTemp:                    number[]
  cumulativeTempPessimist:           number[]
  cumulativeForest:                  number[]
  cumulativeForestPessimist:         number[]
  cumulativeEnergyMix:               Record<EnergyMixKey, number[]>
  cumulativeEnergyMixPessimist:      Record<EnergyMixKey, number[]>
  cumulativeFoodSecurity:            number[]
  cumulativeFoodSecurityPessimist:   number[]
  cumulativeWaterAccess:             number[]
  cumulativeWaterAccessPessimist:    number[]
  cumulativeWhoHealthIndex:          number[]
  cumulativeWhoHealthIndexPessimist: number[]
  cumulativeClimateMigrations:       number[]
  cumulativeClimateMigrationsPessimist: number[]
  cumulativeGiniCoefficient:             number[]
  cumulativeGiniCoefficientPessimist:    number[]
}

// Baseline SSP2-4.5 at 2100 — hardcoded from simulation.store constants
export const BASELINE_2100 = {
  temp:             4.0,   // °C
  forest:          42.0,   // %
  foodSecurity:    46.0,   // /100
  waterAccess:     82.0,   // %
  whoHealthIndex:  55.0,   // /100
  climateMigrations: 77.0, // index /100
  giniCoefficient: 0.715,  // 0–1
  renewables:      34.5,   // % (solar 17 + wind 14.5 + hydro 3, clamped to 2074)
} as const

export function narrativeKey(tempAt2100: number): '1' | '2' | '3' | '4' {
  if (tempAt2100 < 1.5) return '1'
  if (tempAt2100 < 2.0) return '2'
  if (tempAt2100 < 3.0) return '3'
  return '4'
}

export function computeGameScore(input: GameScoreInput, tippingCount: number): GameFinalScore {
  const temp   = blended(input.cumulativeTemp,          input.cumulativeTempPessimist)
  const forest = blended(input.cumulativeForest,        input.cumulativeForestPessimist)
  const food   = blended(input.cumulativeFoodSecurity,  input.cumulativeFoodSecurityPessimist)
  const water  = blended(input.cumulativeWaterAccess,   input.cumulativeWaterAccessPessimist)
  const health = blended(input.cumulativeWhoHealthIndex, input.cumulativeWhoHealthIndexPessimist)
  const migr   = blended(input.cumulativeClimateMigrations, input.cumulativeClimateMigrationsPessimist)
  const gini   = blended(input.cumulativeGiniCoefficient, input.cumulativeGiniCoefficientPessimist)
  const renew  =
    0.5 * (input.cumulativeEnergyMix.solar[IDX] + input.cumulativeEnergyMix.wind[IDX] + input.cumulativeEnergyMix.hydro[IDX]) +
    0.5 * (input.cumulativeEnergyMixPessimist.solar[IDX] + input.cumulativeEnergyMixPessimist.wind[IDX] + input.cumulativeEnergyMixPessimist.hydro[IDX])

  // ── Pilier Climat & Écosystèmes ────────────────────────────────────────────
  const climateIndicators: IndicatorResult[] = [
    {
      id: 'temp', value: Math.round(temp * 100) / 100, baseline: BASELINE_2100.temp,
      unit: '°C', higherIsBetter: false,
      category: cat(temp, 1.5, 2.5, false),
    },
    {
      id: 'forest', value: Math.round(forest * 10) / 10, baseline: BASELINE_2100.forest,
      unit: '%', higherIsBetter: true,
      category: cat(forest, 55, 47, true),
    },
    {
      id: 'tipping', value: tippingCount, baseline: 0,
      unit: '/5', higherIsBetter: false,
      category: cat(tippingCount, 0, 2, false),
    },
  ]

  // ── Pilier Sociétal ────────────────────────────────────────────────────────
  const societalIndicators: IndicatorResult[] = [
    {
      id: 'food', value: Math.round(food * 10) / 10, baseline: BASELINE_2100.foodSecurity,
      unit: '/100', higherIsBetter: true,
      category: cat(food, 65, 52, true),
    },
    {
      id: 'water', value: Math.round(water * 10) / 10, baseline: BASELINE_2100.waterAccess,
      unit: '%', higherIsBetter: true,
      category: cat(water, 88, 80, true),
    },
    {
      id: 'health', value: Math.round(health * 10) / 10, baseline: BASELINE_2100.whoHealthIndex,
      unit: '/100', higherIsBetter: true,
      category: cat(health, 70, 58, true),
    },
    {
      id: 'migrations', value: Math.round(migr), baseline: BASELINE_2100.climateMigrations,
      unit: '/100', higherIsBetter: false,
      category: cat(migr, 50, 68, false),
    },
    {
      id: 'gini', value: Math.round(gini * 1000) / 1000, baseline: BASELINE_2100.giniCoefficient,
      unit: '', higherIsBetter: false,
      category: cat(gini, 0.63, 0.70, false),
    },
  ]

  // ── Pilier Énergie & Ressources ────────────────────────────────────────────
  const energyIndicators: IndicatorResult[] = [
    {
      id: 'renewables', value: Math.round(renew * 10) / 10, baseline: BASELINE_2100.renewables,
      unit: '%', higherIsBetter: true,
      category: cat(renew, 70, 40, true),
    },
  ]

  const climateCat  = worstOf(climateIndicators.map(i => i.category))
  const societalCat = worstOf(societalIndicators.map(i => i.category))
  const energyCat   = worstOf(energyIndicators.map(i => i.category))

  // Pondération : climat domine (condition nécessaire mais non suffisante)
  const overall: ScoreCategory =
    climateCat === 'critical' || societalCat === 'critical' ? 'critical'
    : climateCat === 'warning'  || societalCat === 'warning'  ? 'warning'
    : 'good'

  return {
    pillars: [
      { id: 'climate',  indicators: climateIndicators,  category: climateCat  },
      { id: 'societal', indicators: societalIndicators, category: societalCat },
      { id: 'energy',   indicators: energyIndicators,   category: energyCat   },
    ],
    overall,
    tempAt2100: Math.round(temp * 100) / 100,
    tippingCount,
  }
}
