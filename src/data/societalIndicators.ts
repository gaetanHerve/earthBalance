import type { SocietalIndicators, TickerItem, EcologicalCharts } from '@/types/index'

const years: number[] = [1990, 1995, 2000, 2005, 2010, 2015, 2020, 2024]

export const societalIndicators: SocietalIndicators = {
  foodSecurity: {
    label: 'Sécurité alimentaire',
    icon: 'fa-wheat-awn',
    color: '#facc15',
    unit: '/100 (indice FAO)',
    criticalThreshold: 50,
    current: 63,
    source: '[AR6 WGII, Ch.5, pp.557-559] ; FAO SOFI 2023 (observé) ; calibration SSP3-7.0',
    timeSeries: {
      years,
      values: [55, 57, 59, 60, 61, 62, 62, 63],
    },
  },

  waterAccess: {
    label: 'Accès eau potable',
    icon: 'fa-droplet',
    color: '#38bdf8',
    unit: '% population mondiale',
    criticalThreshold: 60,
    current: 71,
    source: '[AR6 WGII, Ch.4, p.568] ; WHO/UNICEF JMP (observé) ; calibration SSP3-7.0',
    timeSeries: {
      years,
      values: [52, 56, 60, 63, 66, 68, 70, 71],
    },
  },

  geopoliticalConflicts: {
    label: 'Tensions géopolitiques',
    icon: 'fa-shield-halved',
    color: '#ff5050',
    subIndicators: [
      { label: 'Conflits ressources', value: 74, color: '#ef4444' },
      { label: 'Tensions eau',       value: 61, color: '#fb923c' },
      { label: 'Migrations climatiques', value: 55, color: '#facc15' },
    ],
    source: '[AR6 WGII, Ch.7, pp.1038-1042] ; ACLED ; UNHCR ; calibration SSP3-7.0',
  },

  globalHealth: {
    label: 'Santé globale',
    icon: 'fa-heart-pulse',
    color: '#f472b6',
    stats: [
      { label: 'Espérance de vie',       value: '73.4 ans', trend: 'up',   color: '#00ff88' },
      { label: 'Maladies respiratoires', value: '↑ 18%',    trend: 'down', color: '#fb923c' },
      { label: 'Indice santé OMS',       value: '67/100',   trend: 'flat', color: '#00e5ff' },
    ],
    source: '[AR6 WGII, Ch.7, pp.1033-1036] ; OMS GHO ; Lancet Countdown 2022 ; calibration SSP3-7.0',
  },

  inequality: {
    label: 'Inégalités (Gini)',
    icon: 'fa-scale-balanced',
    color: '#c084fc',
    stats: [
      { label: 'Gini mondial',       value: '0.67',       color: '#ff5050' },
      { label: '1% les plus riches', value: '45% richesse', color: '#ff5050' },
      { label: 'Accès éducation',    value: '61%',          color: '#facc15' },
    ],
    source: '[AR6 WGII, Ch.16, pp.2340-2345] ; WID.world ; World Inequality Report 2022 ; calibration SSP3-7.0',
  },
}

// Trajectoire SSP3-7.0 (UN WPP 2022, compatible AR6) — milliards de personnes
export const populationTimeSeries = {
  years:  [1990, 1995, 2000, 2005, 2010, 2015, 2020, 2024, 2030, 2040, 2050, 2060, 2074, 2100],
  values: [ 5.3,  5.7,  6.1,  6.5,  6.9,  7.4,  7.8,  8.1,  8.5,  9.2,  9.7, 10.1, 10.4, 10.4],
}

export const tickerItems: TickerItem[] = [
  { emoji: '🌡️', label: 'Temp. globale',    value: '+1.4°C', colorClass: 'text-orange-400' },
  { emoji: '💨', label: 'CO₂ atm.',          value: '421 ppm', colorClass: 'text-red-400'    },
  { emoji: '🌊', label: 'Niveau mer',         value: '+22 cm',  colorClass: 'text-eb-cyan'     },
  { emoji: '🌲', label: 'Forêt restante',     value: '58%',     colorClass: 'text-eb-green'    },
  { emoji: '⚡', label: 'Renouvelable',        value: '34%',     colorClass: 'text-yellow-400'  },
  { emoji: '💧', label: 'Accès eau',          value: '71%',     colorClass: 'text-blue-400'    },
  { emoji: '🍽️', label: 'Sécurité alim.',     value: '63/100',  colorClass: 'text-eb-green'    },
  { emoji: '👥', label: 'Pop. mondiale',      value: '8.1 Mds', colorClass: 'text-slate-300'   },
]

export const ecologicalCharts: EcologicalCharts = {
  co2: {
    label: 'Émissions CO₂ mondiales',
    unit: 'GtCO₂/an',
    color: '#ff5050',
    source: 'Global Carbon Project 2023 (observé 1990-2024) ; [IPCC AR6 WGI, Figure SPM.4 — CEDA Archive, CC-BY-4.0] (proj. SSP3-7.0)',
    timeSeries: {
      years: [1990, 1995, 2000, 2005, 2010, 2015, 2020, 2024],
      values: [22.7, 23.5, 25, 28.1, 31.6, 35, 34.8, 37.4],
    },
  },

  temperature: {
    label: 'Anomalie de température globale',
    unit: '°C vs. pré-industriel',
    color: '#fb923c',
    source: 'NASA GISS GISTEMP v4 (observé 1990-2024) ; [IPCC AR6 WGI, Figure SPM.8 — CEDA Archive, CC-BY-4.0] (proj. SSP3-7.0)',
    timeSeries: {
      years: [1990, 1995, 2000, 2005, 2010, 2015, 2020, 2024],
      values: [0.45, 0.52, 0.62, 0.72, 0.82, 0.95, 1.1, 1.4],
    },
  },

  forest: {
    label: 'Forêts primaires mondiales restantes',
    unit: '% de la couverture originelle',
    color: '#00ff88',
    criticalThreshold: 75,
    current: 58,
    source: 'Mackey et al. (2015) — Intact Forest Landscapes ; Steffen et al. (2015) — Planetary Boundaries ; Curtis et al. (2018), Science',
    timeSeries: {
      years:  [1990, 1995, 2000, 2005, 2010, 2015, 2020, 2024],
      values: [  71,   68,   66,   64,   62,   60,   59,   58],
    },
  },

  seaLevel: {
    label: 'Élévation du niveau des mers',
    unit: 'mm (Δ 1995-2014)',
    color: '#60a5fa',
    source: 'IPCC AR6 WGI Ch.9 — Church & White (2011) ; altimétrie satellite NASA/CNES ; projection médiane SSP3-7.0 [AR6 WGI, SPM.8 — CEDA Archive, CC-BY-4.0]',
    timeSeries: {
      // Observé 1990-2024, puis projection médiane SSP3-7.0 (CEDA AR6 WGI Figure SPM.8 panel d)
      // Référence : moyenne 1995-2014 ≈ 0 mm (convention AR6 WGI Ch.9)
      // SSP3-7.0 vs SSP2-4.5 à 2100 : +692 mm vs +415 mm (ratio CEDA SSP3-7.0/SSP2-4.5)
      years:  [1990, 1995, 2000, 2005, 2010, 2015, 2020, 2024, 2030, 2040, 2050, 2060, 2074, 2100],
      values: [ -40,  -26,  -12,    2,   20,   38,   58,   78,  102,  152,  222,  292,  418,  692],
    },
  },

  extremes: {
    label: 'Indice de fréquence des extrêmes climatiques',
    unit: 'indice (pré-industriel = 1)',
    color: '#fb923c',
    source: 'IPCC AR6 WGI Ch.11 — données observées et projection médiane SSP3-7.0 [AR6 WGI, Ch.11]',
    timeSeries: {
      // Indice composite observé 1950-2024, calibré à ×2,8 en 2024 (vagues de chaleur)
      // puis projection médiane SSP3-7.0 — extrêmes amplifiés ~1.4× vs SSP2-4.5 à 2100
      years:  [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020, 2024, 2030, 2040, 2050, 2060, 2074, 2100],
      values: [1.2, 1.3, 1.42, 1.58, 1.78, 2.05, 2.35, 2.6, 2.8, 3.2, 4.1, 5.3, 7.1, 10.2, 14.5],
    },
  },

  energyMix: {
    label: 'Mix énergétique mondial',
    unit: 'TWh (énergie primaire, hors biomasse traditionnelle)',
    source: 'Energy Institute — Statistical Review of World Energy (2025) via Our World in Data ; Smil (2017)',
    categories: [
      { label: 'Charbon',    value: 45851, color: '#6b7280' },
      { label: 'Pétrole',   value: 55292, color: '#ef4444' },
      { label: 'Gaz',       value: 41278, color: '#f97316' },
      { label: 'Nucléaire', value:  6872, color: '#a78bfa' },
      { label: 'Solaire',   value:  5151, color: '#facc15' },
      { label: 'Éolien',    value:  6124, color: '#00ff88' },
      { label: 'Hydro',     value: 10861, color: '#00e5ff' },
      { label: 'Autres',    value:  3843, color: '#475569' },
    ],
    timeSeries: {
      years: [1990,  1995,  2000,  2005,  2010,  2015,  2020,  2024],
      byCategory: {
        coal:    [25929, 25999, 27456, 36201, 42016, 43695, 42316, 45851],
        oil:     [37907, 39666, 43017, 47017, 48193, 51294, 49101, 55292],
        gas:     [19481, 21104, 23994, 27439, 31593, 34780, 38704, 41278],
        nuclear: [ 5557,  6451,  7169,  7442,  7209,  6520,  6640,  6872],
        solar:   [    1,     2,     3,    11,    88,   649,  2117,  5151],
        wind:    [   10,    23,    87,   281,   902,  2106,  3940,  6124],
        hydro:   [ 5996,  6898,  7352,  7826,  8933,  9821, 10763, 10861],
        autres:  [  473,   589,   710,  1033,  1861,  2568,  3221,  3843],
      },
    },
  },

  resources: {
    label: 'Extraction de ressources naturelles',
    unit: 'Gt/an',
    source: 'TODO: UNEP Resource Panel — Global Material Flows Database',
    datasets: [
      {
        label: 'Minéraux',
        color: '#c084fc',
        bgColor: 'rgba(192,132,252,0.1)',
        values: [8.2, 9.1, 10.5, 12.3, 14.8, 17.2, 19.1, 21],
      },
      {
        label: 'Biomasse',
        color: '#00ff88',
        bgColor: 'rgba(0,255,136,0.08)',
        values: [12.1, 12.8, 13.5, 14.2, 15, 15.8, 16.4, 17.1],
      },
      {
        label: 'Combustibles fossiles',
        color: '#fb923c',
        bgColor: 'rgba(251,146,60,0.08)',
        values: [7.5, 8.2, 9, 10.1, 11.5, 12.8, 13.2, 13.9],
      },
    ],
    years: [1990, 1995, 2000, 2005, 2010, 2015, 2020, 2024],
  },
}
