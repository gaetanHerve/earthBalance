import type { Decision, GlobalStats, BlockchainState } from '@/types/index'

export const decisions: Decision[] = [
  {
    id: 'dec-42-07',
    sessionId: 42,
    number: '42-07',
    status: 'active', // 'active' | 'validated' | 'rejected' | 'expired'
    title: 'Taxe carbone mondiale à 150 $/tonne d\'ici 2030 ?',
    description: `Cette proposition vise à instaurer une taxe carbone universelle de **150 $/tonne de CO₂** applicable à toutes les nations signataires de l'Accord de Paris d'ici 2030. Les revenus seraient redistribués à 60% vers les pays en développement pour financer la transition énergétique, et à 40% vers un fonds mondial d'adaptation climatique. Enjeux : compétitivité industrielle, justice climatique, efficacité de réduction des émissions.`,
    options: [
      { id: 'pour',   label: 'Pour',       color: '#00ff88', bgClass: 'bg-eb-green/10',  borderClass: 'border-eb-green/20' },
      { id: 'contre', label: 'Contre',     color: '#ff5050', bgClass: 'bg-red-500/10',   borderClass: 'border-red-500/20'  },
      { id: 'abst',   label: 'Abstention', color: '#475569', bgClass: 'bg-slate-700/30', borderClass: 'border-slate-600/30'},
    ],
    votes: { pour: 673, contre: 386, abst: 188 },
    consensusThreshold: 67,
    deadline: '2024-03-15T18:00:00Z',
    resources: [
      {
        title: 'Rapport GIEC AR6 — Atténuation du changement climatique',
        excerpt: 'Les taxes carbone entre 135 et 5500 $/tCO₂ sont nécessaires pour limiter le réchauffement à 1,5°C.',
        url: 'https://www.ipcc.ch/report/ar6/wg3/',
      },
      {
        title: 'FMI — Tarification du carbone : pourquoi, comment et combien ?',
        excerpt: 'Une taxe universelle de 75 $ la tonne permettrait de réduire les émissions de 35% d\'ici 2030.',
        url: 'https://www.imf.org/en/Publications/staff-climate-notes/Issues/2021/06/15/',
      },
      {
        title: 'Carbon Pricing Dashboard — Banque Mondiale',
        excerpt: 'Panorama mondial des mécanismes de tarification du carbone en vigueur en 2024.',
        url: 'https://carbonpricingdashboard.worldbank.org/',
      },
    ],
    // Impact sur les limites planétaires si la décision est validée
    projectedImpact: {
      co2ReductionPct: 22,
      tempReductionBy2050: 0.3,
      renewableShareIn2034: 51,
      deforestationReductionPct: 35,
    },
    // Prospective LLM — TODO: remplacer par appel réel à llm.service.js
    prospectiveNarratives: {
      optimistic: {
        horizon: '+10 ans',
        label: 'Scénario Optimiste',
        colorClass: 'text-eb-green',
        borderClass: 'border-eb-green/30',
        text: 'En 2034, la taxe carbone mondiale a réduit les émissions globales de **22%**. Les énergies renouvelables représentent désormais **51%** du mix énergétique mondial. Les pays en développement ont reçu 2 400 Mds$ pour financer leur transition. La déforestation a ralenti de **35%**. Les conflits liés aux ressources énergétiques ont diminué significativement.',
      },
      moderate: {
        horizon: '+20 ans',
        label: 'Scénario Modéré',
        colorClass: 'text-yellow-400',
        borderClass: 'border-yellow-500/30',
        text: 'En 2044, malgré des résistances industrielles, les émissions ont baissé de **38%** par rapport à 2024. La température globale se stabilise à **+1.7°C**. Des tensions persistent dans les régions à forte dépendance aux hydrocarbures. L\'accès à l\'eau potable progresse à **79%** de la population mondiale.',
      },
      pessimistic: {
        horizon: '+50 ans',
        label: 'Scénario Pessimiste',
        colorClass: 'text-red-400',
        borderClass: 'border-red-500/30',
        text: 'En 2074, si la taxe n\'est pas respectée par les grandes puissances, les émissions ne baissent que de **12%**. La température atteint **+2.8°C**, déclenchant des événements climatiques extrêmes majeurs. 800 millions de personnes supplémentaires sont en situation d\'insécurité alimentaire. Les conflits géopolitiques liés à l\'eau et aux terres arables s\'intensifient.',
      },
    },
    // Projections graphiques post-décision
    projections: {
      labels: [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074],
      co2: {
        baseline:  [37.4, 39.0, 40.5, 42.0, 45.1, 49.2, 54.0, 58.0, 63.0],
        decided:   [37.4, 36.8, 35.0, 32.4, 29.1, 26.0, 23.5, 22.0, 21.0],
        pessimist: [37.4, 38.5, 39.8, 41.2, 43.5, 46.8, 50.0, 53.0, 56.0],
      },
      temperature: {
        baseline:  [1.40, 1.50, 1.60, 1.72, 1.95, 2.20, 2.60, 3.00, 3.50],
        decided:   [1.40, 1.42, 1.44, 1.45, 1.48, 1.52, 1.60, 1.65, 1.70],
        pessimist: [1.40, 1.48, 1.56, 1.65, 1.82, 2.05, 2.30, 2.55, 2.80],
      },
    },
  },

  {
    id: 'dec-42-06',
    sessionId: 42,
    number: '42-06',
    status: 'validated',
    title: 'Moratoire mondial sur la déforestation primaire',
    description: 'Interdire toute coupe de forêts primaires d\'ici 2025 via un traité international contraignant.',
    options: [
      { id: 'pour',   label: 'Pour',       color: '#00ff88', bgClass: 'bg-eb-green/10',  borderClass: 'border-eb-green/20' },
      { id: 'contre', label: 'Contre',     color: '#ff5050', bgClass: 'bg-red-500/10',   borderClass: 'border-red-500/20'  },
      { id: 'abst',   label: 'Abstention', color: '#475569', bgClass: 'bg-slate-700/30', borderClass: 'border-slate-600/30'},
    ],
    votes: { pour: 891, contre: 201, abst: 155 },
    consensusThreshold: 67,
    deadline: '2024-02-28T18:00:00Z',
    resources: [],
    projectedImpact: {},
    prospectiveNarratives: {},
    projections: {},
  },
]

export const globalStats: GlobalStats = {
  totalDecisions: 2847,
  validatedDecisions: 1203,
  totalSessions: 42,
  uniquePlayers: 48291,
}

export const blockchainState: BlockchainState = {
  lastHash: '0x4f3a…c91b',
  blocksValidated: 1847,
  activeNodes: 312,
  latencyMs: 42,
  lastBlockTime: 8,
}
