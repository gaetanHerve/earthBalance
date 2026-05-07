export type TippingPointDef = {
  id: string
  trigger: {
    variable:   'temp' | 'forest'
    threshold:  number
    comparison: '>' | '<'
  }
  // Effets sur les séries de simulation (injectés dans simulation.store)
  deltaTemp?:   number   // °C ajoutés de l'année de déclenchement → 2100
  deltaCo2Ppm?: number   // ppm ajoutés
  deltaForest?: number   // % forêt supplémentaire perdu (négatif)
  // Effets directs sur les ratios (consommés dans LimitsView)
  deltaBiodiversityRatio?:  number
  deltaAcidificationRatio?: number
  deltaWaterRatio?:         number
}

export const TIPPING_POINTS: TippingPointDef[] = [
  {
    id:      'tp-permafrost',
    trigger: { variable: 'temp', threshold: 1.5, comparison: '>' },
    deltaTemp:              0.25,
    deltaCo2Ppm:            15,
    deltaBiodiversityRatio: 0.2,
  },
  {
    id:      'tp-coral',
    trigger: { variable: 'temp', threshold: 1.5, comparison: '>' },
    deltaBiodiversityRatio: 0.25,
  },
  {
    id:      'tp-amazon',
    trigger: { variable: 'forest', threshold: 45, comparison: '<' },
    deltaTemp:              0.3,
    deltaForest:           -8,
    deltaBiodiversityRatio: 0.2,
  },
  {
    id:      'tp-arctic',
    trigger: { variable: 'temp', threshold: 1.5, comparison: '>' },
    deltaTemp: 0.3,
  },
  {
    id:      'tp-amoc',
    trigger: { variable: 'temp', threshold: 3.0, comparison: '>' },
    deltaTemp:      0.2,
    deltaWaterRatio: 0.15,
  },
]
