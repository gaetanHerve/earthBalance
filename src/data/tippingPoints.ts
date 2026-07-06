export type TippingPointDef = {
  id: string
  trigger: {
    variable:   'temp' | 'forest'
    threshold:  number
    comparison: '>' | '<'
  }
  // Déclenchement probabiliste : si true, collapseProb(temp) est évaluée à chaque tour
  probabilistic?: boolean
  collapseProb?:  (temp: number) => number
  // Effets sur les séries de simulation (injectés dans simulation.store)
  deltaTemp?:   number   // °C ajoutés de l'année de déclenchement → 2100
  deltaCo2Ppm?: number   // ppm ajoutés
  deltaForest?: number   // % forêt supplémentaire perdu (négatif)
  // Effets directs sur les ratios (consommés dans LimitsView / widgets)
  deltaBiodiversityRatio?:  number
  deltaAcidificationRatio?: number
  deltaWaterRatio?:         number
  // Amplification des extrêmes climatiques (consommé dans le widget Extrêmes)
  deltaExtremes?:           number
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
    // AR6 WGI p.1878 : pas de tipping point irréversible pour la glace arctique estivale (high confidence).
    // Modélisé comme une rétroaction albédo graduelle, non un basculement.
    id:      'tp-arctic',
    trigger: { variable: 'temp', threshold: 1.5, comparison: '>' },
    deltaTemp: 0.1,
  },
  {
    // AR6 WGI p.303-304 : effondrement "very unlikely" avant 2100 sous SSP2-4.5, probabilité croissante
    // avec le réchauffement. Impacts : refroidissement régional Atlantique Nord (-deltaTemp),
    // perturbation ITCZ (deltaWaterRatio négatif), amplification extrêmes Europe (deltaExtremes).
    id:      'tp-amoc',
    trigger:       { variable: 'temp', threshold: 3.0, comparison: '>' },
    probabilistic: true,
    collapseProb:  (T: number) => Math.min(Math.max((T - 1.5) * 0.08, 0), 0.5),
    deltaTemp:      -0.2,
    deltaWaterRatio: -0.08,
    deltaExtremes:   0.4,
  },
]
