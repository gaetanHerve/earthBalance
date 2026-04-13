import type { Decision, GlobalStats, BlockchainState } from '@/types/index'

// ─── Baseline SSP2-4.5 (référence partagée pour toutes les projections) ────────
// labels : [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074]
// co2    : [37.4, 39.0, 40.5, 42.0, 45.1, 49.2, 54.0, 58.0, 63.0] GtCO2/an
// temp   : [1.40, 1.50, 1.60, 1.72, 1.95, 2.20, 2.60, 3.00, 3.50] °C
//
// Les courbes "decided" et "pessimist" sont calculées en ajoutant les deltas
// issus des modèles d'impact JSON (src/data/models/) à la baseline SSP2-4.5.

export const decisions: Decision[] = [
  // ─── Décision existante 42-07 ─────────────────────────────────────────────
  {
    id: 'dec-42-07',
    sessionId: 42,
    number: '42-07',
    status: 'active',
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
    projectedImpact: {
      co2ReductionPct: 22,
      tempReductionBy2050: 0.3,
      renewableShareIn2034: 51,
      deforestationReductionPct: 35,
    },
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
    projections: {
      labels: [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074],
      co2: {
        baseline:  [37.4, 39, 40.5, 42, 45.1, 49.2, 54, 58, 63],
        decided:   [37.4, 36.8, 35, 32.4, 29.1, 26, 23.5, 22, 21],
        pessimist: [37.4, 38.5, 39.8, 41.2, 43.5, 46.8, 50, 53, 56],
      },
      temperature: {
        baseline:  [1.4, 1.5, 1.6, 1.72, 1.95, 2.2, 2.6, 3, 3.5],
        decided:   [1.4, 1.42, 1.44, 1.45, 1.48, 1.52, 1.6, 1.65, 1.7],
        pessimist: [1.4, 1.48, 1.56, 1.65, 1.82, 2.05, 2.3, 2.55, 2.8],
      },
    },
  },

  // ─── Décision existante 42-06 ─────────────────────────────────────────────
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

  // ─── Décision 42-05 — Modèle : POL_COAL_EXIT_2030_DEV ────────────────────
  {
    id: 'dec-42-05',
    sessionId: 42,
    number: '42-05',
    status: 'validated',
    title: 'Sortie du charbon pour la production électrique dans les pays développés d\'ici 2030',
    description: `Fermeture programmée de toutes les centrales électriques au charbon sans captage de CO₂ dans les pays de l'Annexe I (OCDE + UE) avant fin 2030. La transition serait accompagnée d'un plan de reconversion pour les bassins miniers et d'un mécanisme de compensation pour les pays encore dépendants. D'après AR6 WGIII, le charbon représente ~30% des émissions mondiales de CO₂ liées à l'énergie ; les pays développés en assurent ~45%. Cette mesure s'inscrit dans les trajectoires C1 (1,5°C) qui exigent une baisse de **67%** [46–86%] de la production charbonnière mondiale dès 2030.`,
    options: [
      { id: 'pour',   label: 'Pour',       color: '#00ff88', bgClass: 'bg-eb-green/10',  borderClass: 'border-eb-green/20' },
      { id: 'contre', label: 'Contre',     color: '#ff5050', bgClass: 'bg-red-500/10',   borderClass: 'border-red-500/20'  },
      { id: 'abst',   label: 'Abstention', color: '#475569', bgClass: 'bg-slate-700/30', borderClass: 'border-slate-600/30'},
    ],
    votes: { pour: 812, contre: 298, abst: 143 },
    consensusThreshold: 67,
    deadline: '2024-01-31T18:00:00Z',
    resources: [
      {
        title: 'GIEC AR6 SYR — Section 4.5 : Options d\'atténuation à court terme',
        excerpt: 'Les scénarios C1 (1,5°C) nécessitent une réduction de 67% [46–86%] de la production électrique au charbon sans CCS entre 2019 et 2030 à l\'échelle mondiale.',
        url: 'https://www.ipcc.ch/report/ar6/syr/',
      },
      {
        title: 'IEA — Coal in Net Zero Transitions',
        excerpt: 'Les pays développés doivent mettre fin à la production d\'électricité au charbon non-abattu d\'ici 2030 pour rester sur une trajectoire Net Zéro 2050.',
        url: 'https://www.iea.org/reports/coal-in-net-zero-transitions',
      },
    ],
    // Source : src/data/models/POL_COAL_EXIT_2030_DEV.json
    projectedImpact: {
      emissionsReductionGtCO2yr: 1.8,
      tempReductionC2100: 0.15,
      fullEffectYear: 2032,
      uncertaintyScore: 2, // 1=low 2=medium 3=high
    },
    prospectiveNarratives: {
      optimistic: {
        horizon: '+10 ans',
        label: 'Scénario Optimiste',
        colorClass: 'text-eb-green',
        borderClass: 'border-eb-green/30',
        text: 'En 2034, la dernière centrale à charbon des pays développés a fermé ses portes. Les **1 800 TWh** annuels sont remplacés par du solaire et de l\'éolien. La qualité de l\'air dans les bassins industriels européens et nord-américains s\'est améliorée spectaculairement — réduction de **42%** des hospitalisations cardiovasculaires dans les zones anciennement charbonnières. Les émissions annuelles mondiales ont chuté de **2,4 GtCO₂**.',
      },
      moderate: {
        horizon: '+20 ans',
        label: 'Scénario Modéré',
        colorClass: 'text-yellow-400',
        borderClass: 'border-yellow-500/30',
        text: 'En 2044, la décision a évité **~27 GtCO₂** cumulées depuis 2025 — soit ~0,12°C de réchauffement de moins par rapport à la trajectoire de référence. Les régions minières ont subi une transition douloureuse : si certains bassins (Ruhr, Appalachie) ont reconverti 70% des emplois, d\'autres restent fragilisés. Le gaz naturel a partiellement compensé le charbon dans plusieurs pays, limitant les gains nets.',
      },
      pessimistic: {
        horizon: '+50 ans',
        label: 'Scénario Pessimiste',
        colorClass: 'text-red-400',
        borderClass: 'border-red-500/30',
        text: 'En 2074, sans extension aux pays émergents (qui représentent 55% des émissions charbon), l\'impact de la seule décision reste limité à **-0,10°C**. La Chine et l\'Inde ont continué d\'expandre leurs capacités, compensant les fermetures occidentales. Le "carbon leakage" industriel (délocalisation vers des pays sans contrainte) a réduit les gains nets de ~30%. La décision reste positive mais insuffisante sans coopération internationale.',
      },
    },
    // Deltas issus de POL_COAL_EXIT_2030_DEV (médian / pessimiste), appliqués sur baseline SSP2-4.5
    projections: {
      labels: [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074],
      co2: {
        baseline:  [37.4, 39, 40.5, 42, 45.1, 49.2, 54, 58, 63],
        decided:   [37.4, 38.8, 40.0, 41.1, 43.5, 47.4, 52.2, 56.2, 61.2],
        pessimist: [37.4, 38.9, 40.2, 41.5, 44.0, 48.0, 52.8, 56.8, 61.8],
      },
      temperature: {
        baseline:  [1.4, 1.5, 1.6, 1.72, 1.95, 2.2, 2.6, 3, 3.5],
        decided:   [1.4, 1.5, 1.59, 1.71, 1.92, 2.15, 2.52, 2.9, 3.38],
        pessimist: [1.4, 1.5, 1.59, 1.71, 1.93, 2.17, 2.55, 2.94, 3.42],
      },
    },
  },

  // ─── Décision 42-04 — Modèle : POL_METHANE_REDUCTION_2030 ────────────────
  {
    id: 'dec-42-04',
    sessionId: 42,
    number: '42-04',
    status: 'active',
    title: 'Réduction mondiale des émissions de méthane de 34% d\'ici 2030',
    description: `Le méthane (CH₄) est responsable d'environ **0,5°C** du réchauffement actuel. Sa durée de vie atmosphérique courte (~12 ans) en fait le levier d'action climatique le plus rapide disponible. Cette proposition adopte l'objectif du Global Methane Pledge : réduire les émissions mondiales de CH₄ de **34% sous les niveaux de 2019 d'ici 2030**, couvrant les secteurs de l'énergie fossile (fuites O&G, mines de charbon), de l'agriculture (fermentation entérique, rizicultures) et des déchets. La mesure est largement coût-efficace : plus de 60% du potentiel de réduction est atteignable à coût négatif ou nul (AR6 WGIII Ch.6).`,
    options: [
      { id: 'pour',   label: 'Pour',       color: '#00ff88', bgClass: 'bg-eb-green/10',  borderClass: 'border-eb-green/20' },
      { id: 'contre', label: 'Contre',     color: '#ff5050', bgClass: 'bg-red-500/10',   borderClass: 'border-red-500/20'  },
      { id: 'abst',   label: 'Abstention', color: '#475569', bgClass: 'bg-slate-700/30', borderClass: 'border-slate-600/30'},
    ],
    votes: { pour: 748, contre: 187, abst: 215 },
    consensusThreshold: 67,
    deadline: '2025-06-30T18:00:00Z',
    resources: [
      {
        title: 'GIEC AR6 SYR — Section 4.1 : Réductions de méthane et qualité de l\'air',
        excerpt: 'Des réductions fortes et rapides du CH₄ limiteraient le pic de réchauffement et amélioreraient la qualité de l\'air. Objectif 1,5°C : –34% d\'ici 2030.',
        url: 'https://www.ipcc.ch/report/ar6/syr/',
      },
      {
        title: 'UNEP — Global Methane Assessment 2021',
        excerpt: 'Réduire les émissions de méthane de 45% d\'ici 2030 permettrait d\'éviter 0,3°C de réchauffement supplémentaire d\'ici 2045 et de sauver 255 000 vies/an par amélioration de la qualité de l\'air.',
        url: 'https://www.unep.org/resources/report/global-methane-assessment-benefits-and-costs-mitigating-methane-emissions',
      },
    ],
    // Source : src/data/models/POL_METHANE_REDUCTION_2030.json
    projectedImpact: {
      emissionsReductionGtCO2yr: 3.5,
      tempReductionC2100: 0.18,
      fullEffectYear: 2030,
      uncertaintyScore: 2,
    },
    prospectiveNarratives: {
      optimistic: {
        horizon: '+10 ans',
        label: 'Scénario Optimiste',
        colorClass: 'text-eb-green',
        borderClass: 'border-eb-green/30',
        text: 'En 2034, grâce au déploiement de capteurs satellitaires (Copernicus, MethaneSAT) et à des réglementations strictes sur les fuites des infrastructures O&G, les émissions mondiales de CH₄ ont chuté de **38%**. Le pic de température mondiale est désormais estimé à **0,2°C inférieur** aux prévisions de 2024. Dans les mégapoles asiatiques, la réduction de l\'ozone troposphérique lié au méthane a amélioré la santé respiratoire de **180 millions** de personnes.',
      },
      moderate: {
        horizon: '+20 ans',
        label: 'Scénario Modéré',
        colorClass: 'text-yellow-400',
        borderClass: 'border-yellow-500/30',
        text: 'En 2044, la réduction effective est de **28%** — en deçà de l\'objectif. Les secteurs de l\'énergie fossile ont largement répondu à la réglementation, mais les émissions agricoles (fermentation entérique des ruminants) ont peu diminué faute de technologies accessibles dans les pays du Sud. Le bénéfice climatique est réel : **–0,15°C** par rapport à la trajectoire de référence. La qualité de l\'air s\'est améliorée dans 65% des zones urbaines mondiales.',
      },
      pessimistic: {
        horizon: '+50 ans',
        label: 'Scénario Pessimiste',
        colorClass: 'text-red-400',
        borderClass: 'border-red-500/30',
        text: 'En 2074, le méthane a été réduit de seulement **18%** — résistances des lobbies pétroliers et gaziers, déficit de surveillance dans les pays émergents. La courte durée de vie du CH₄ signifie que les bénéfices de la décennie 2025-2035 se sont en partie estompés. Le bilan net reste positif (**–0,10°C**) mais la fenêtre d\'opportunité d\'action rapide sur le CH₄ a été partiellement manquée.',
      },
    },
    // Deltas issus de POL_METHANE_REDUCTION_2030, appliqués sur baseline SSP2-4.5
    projections: {
      labels: [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074],
      co2: {
        baseline:  [37.4, 39, 40.5, 42, 45.1, 49.2, 54, 58, 63],
        decided:   [37.4, 38.4, 38.7, 39.0, 41.7, 45.7, 50.5, 54.5, 59.5],
        pessimist: [37.4, 38.6, 39.3, 40.0, 42.7, 46.7, 51.5, 55.5, 60.5],
      },
      temperature: {
        baseline:  [1.4, 1.5, 1.6, 1.72, 1.95, 2.2, 2.6, 3, 3.5],
        decided:   [1.4, 1.5, 1.59, 1.7, 1.9, 2.1, 2.45, 2.84, 3.33],
        pessimist: [1.4, 1.5, 1.59, 1.71, 1.92, 2.13, 2.5, 2.89, 3.38],
      },
    },
  },

  // ─── Décision 42-03 — Modèle : POL_DEFORESTATION_HALT_2030 ───────────────
  {
    id: 'dec-42-03',
    sessionId: 42,
    number: '42-03',
    status: 'validated',
    title: 'Arrêt de la déforestation tropicale et restauration des forêts d\'ici 2030',
    description: `Cette décision engage les nations signataires à **stopper toute déforestation nette des forêts tropicales primaires d'ici 2030** et à restaurer 350 millions d'hectares de forêts dégradées d'ici 2030 (engagement Glasgow 2021). La déforestation tropicale représente ~4 GtCO₂eq/an — soit l'équivalent de toutes les émissions de l'Union Européenne. Les forêts tropicales abritent plus de **50% des espèces terrestres mondiales** et régulent le cycle hydrologique de régions entières. La principale cause (>70%) est l'expansion agricole liée à l'élevage et aux cultures d'exportation (soja, huile de palme). Un fonds de **500 Mds$** serait mobilisé via des paiements pour services écosystémiques (REDD+).`,
    options: [
      { id: 'pour',   label: 'Pour',       color: '#00ff88', bgClass: 'bg-eb-green/10',  borderClass: 'border-eb-green/20' },
      { id: 'contre', label: 'Contre',     color: '#ff5050', bgClass: 'bg-red-500/10',   borderClass: 'border-red-500/20'  },
      { id: 'abst',   label: 'Abstention', color: '#475569', bgClass: 'bg-slate-700/30', borderClass: 'border-slate-600/30'},
    ],
    votes: { pour: 924, contre: 134, abst: 195 },
    consensusThreshold: 67,
    deadline: '2024-02-15T18:00:00Z',
    resources: [
      {
        title: 'GIEC AR6 SYR — Section 4.5.4 : AFOLU et options terrestres',
        excerpt: 'La conservation des forêts représente la part la plus importante du potentiel d\'atténuation économique dans le secteur AFOLU, avec le plus haut potentiel total d\'atténuation parmi les mesures terrestres.',
        url: 'https://www.ipcc.ch/report/ar6/syr/',
      },
      {
        title: 'Science — Une décennie de restauration des écosystèmes (2021)',
        excerpt: 'La restauration de 15% des écosystèmes convertis dans les zones prioritaires mondiales pourrait éviter 60% des extinctions prévues et séquestrer 299 GtCO₂.',
        url: 'https://www.science.org/doi/10.1126/science.abf4793',
      },
    ],
    // Source : src/data/models/POL_DEFORESTATION_HALT_2030.json
    projectedImpact: {
      emissionsReductionGtCO2yr: 3.0,
      tempReductionC2100: 0.22,
      fullEffectYear: 2035,
      uncertaintyScore: 3,
    },
    prospectiveNarratives: {
      optimistic: {
        horizon: '+10 ans',
        label: 'Scénario Optimiste',
        colorClass: 'text-eb-green',
        borderClass: 'border-eb-green/30',
        text: 'En 2034, combinée à l\'essor des protéines végétales, la décision a réduit la déforestation tropicale nette de **78%**. 120 millions d\'hectares de forêts dégradées sont en cours de restauration. La biodiversité amazonienne enregistre une reprise mesurable des populations de grands mammifères. Le cycle des pluies au Brésil montre des signes de stabilisation après deux décennies de dérèglement. Les communautés autochtones gardiens des forêts reçoivent des paiements REDD+ réguliers.',
      },
      moderate: {
        horizon: '+20 ans',
        label: 'Scénario Modéré',
        colorClass: 'text-yellow-400',
        borderClass: 'border-yellow-500/30',
        text: 'En 2044, la déforestation brute a diminué de **52%** — freinée par la demande persistante en protéines animales et en biocarburants. Le "leakage" (déplacement vers des zones non-protégées) représente 20% des émissions évitées théoriques. Le bilan reste fortement positif : **–0,14°C** par rapport à la baseline, avec des co-bénéfices biodiversité irremplaçables. La surveillance satellitaire en temps réel a rendu possible la mise en application sans précédent du traité.',
      },
      pessimistic: {
        horizon: '+50 ans',
        label: 'Scénario Pessimiste',
        colorClass: 'text-red-400',
        borderClass: 'border-red-500/30',
        text: 'En 2074, sans réforme du système alimentaire mondial (demande en viande bovine toujours croissante dans les pays émergents), la pression sur les forêts n\'a jamais vraiment cédé. La déforestation a été réduite de **30%** mais les méga-feux liés au changement climatique ont compensé une partie des gains. La décision, faute de s\'attaquer aux causes profondes (régimes alimentaires), n\'a permis qu\'un effet climatique limité à **–0,10°C**.',
      },
    },
    // Deltas issus de POL_DEFORESTATION_HALT_2030, appliqués sur baseline SSP2-4.5
    projections: {
      labels: [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074],
      co2: {
        baseline:  [37.4, 39, 40.5, 42, 45.1, 49.2, 54, 58, 63],
        decided:   [37.4, 38.8, 39.9, 41.0, 42.9, 46.2, 51.0, 55.0, 60.0],
        pessimist: [37.4, 38.9, 40.2, 41.5, 43.8, 47.7, 52.5, 56.5, 61.5],
      },
      temperature: {
        baseline:  [1.4, 1.5, 1.6, 1.72, 1.95, 2.2, 2.6, 3, 3.5],
        decided:   [1.4, 1.5, 1.59, 1.71, 1.92, 2.13, 2.48, 2.86, 3.32],
        pessimist: [1.4, 1.5, 1.6, 1.72, 1.93, 2.16, 2.53, 2.92, 3.4],
      },
    },
  },

  // ─── Décision 42-02 — Modèle : POL_DIET_SHIFT_PLANTBASED ─────────────────
  {
    id: 'dec-42-02',
    sessionId: 42,
    number: '42-02',
    status: 'active',
    title: 'Transition mondiale vers des régimes alimentaires durables à base végétale',
    description: `Le système alimentaire mondial génère **10 à 14 GtCO₂eq/an** — soit 20 à 30% des émissions anthropiques mondiales, dont 60% sont liées aux produits d'origine animale. Le régime EAT-Lancet (une planète saine pour 10 milliards de personnes) préconise de réduire la consommation mondiale de viande rouge de **50%** et les produits laitiers de **30%** d'ici 2050. Cette décision engage à subventionner les protéines végétales, instaurer un étiquetage carbone obligatoire sur les aliments et réformer les subventions agricoles. Le potentiel d'atténuation est de **3 à 7 GtCO₂eq/an** (AR6 WGIII Ch.7), avec des co-bénéfices majeurs sur la biodiversité, l'eau et la santé publique.`,
    options: [
      { id: 'pour',   label: 'Pour',       color: '#00ff88', bgClass: 'bg-eb-green/10',  borderClass: 'border-eb-green/20' },
      { id: 'contre', label: 'Contre',     color: '#ff5050', bgClass: 'bg-red-500/10',   borderClass: 'border-red-500/20'  },
      { id: 'abst',   label: 'Abstention', color: '#475569', bgClass: 'bg-slate-700/30', borderClass: 'border-slate-600/30'},
    ],
    votes: { pour: 541, contre: 463, abst: 248 },
    consensusThreshold: 67,
    deadline: '2025-09-30T18:00:00Z',
    resources: [
      {
        title: 'GIEC AR6 SYR — Section 4.5.4 : Options côté demande dans l\'alimentation',
        excerpt: 'Les options côté demande — notamment les régimes sains et durables — présentent un potentiel de réduction de 73% des émissions du secteur alimentaire d\'ici 2050.',
        url: 'https://www.ipcc.ch/report/ar6/syr/',
      },
      {
        title: 'EAT-Lancet Commission — Food Planet Health (2019)',
        excerpt: 'L\'adoption d\'un régime alimentaire planétaire sain pourrait prévenir 11 millions de décès prématurés par an et réduire les émissions agricoles de 6,6 GtCO₂eq/an.',
        url: 'https://eatforum.org/eat-lancet-commission/',
      },
    ],
    // Source : src/data/models/POL_DIET_SHIFT_PLANTBASED.json
    projectedImpact: {
      emissionsReductionGtCO2yr: 3.5,
      tempReductionC2100: 0.17,
      fullEffectYear: 2050,
      uncertaintyScore: 3,
    },
    prospectiveNarratives: {
      optimistic: {
        horizon: '+10 ans',
        label: 'Scénario Optimiste',
        colorClass: 'text-eb-green',
        borderClass: 'border-eb-green/30',
        text: 'En 2034, l\'explosion des alternatives végétales (viande fermentée, protéines d\'insectes, analogues laitiers) a rendu la transition alimentaire accessible et désirable. La consommation de viande bovine a chuté de **28%** dans les pays à hauts revenus. Les terres libérées par la réduction de l\'élevage extensif (180 Mha) sont en cours de reboisement. Les maladies cardiovasculaires ont reculé de **15%** dans les pays pionniers — bénéfice santé de 400 Mds$/an estimé par l\'OMS.',
      },
      moderate: {
        horizon: '+20 ans',
        label: 'Scénario Modéré',
        colorClass: 'text-yellow-400',
        borderClass: 'border-yellow-500/30',
        text: 'En 2044, la transition alimentaire progresse à deux vitesses : les pays riches ont réduit leur consommation de protéines animales de **35%**, mais la demande explose dans les classes moyennes émergentes d\'Asie et d\'Afrique (+40%). Le bilan net reste positif mais loin des scénarios C1 : réduction de **–1.8 GtCO₂eq/an**. Les subventions à l\'élevage conventionnel persistent dans de nombreux pays, ralentissant la reconversion agricole.',
      },
      pessimistic: {
        horizon: '+50 ans',
        label: 'Scénario Pessimiste',
        colorClass: 'text-red-400',
        borderClass: 'border-red-500/30',
        text: 'En 2074, sans politique d\'accompagnement ambitieuse (réforme des subventions, investissements dans la R&D alimentaire, coopération Sud-Sud), le changement de régime alimentaire n\'a touché qu\'une minorité aisée des pays développés. La décision est perçue comme une ingérence culturelle dans les pays du Sud. Le bilan climatique est limité à **–0,10°C**, les co-bénéfices biodiversité et eau partiellement réalisés.',
      },
    },
    // Deltas issus de POL_DIET_SHIFT_PLANTBASED, appliqués sur baseline SSP2-4.5
    projections: {
      labels: [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074],
      co2: {
        baseline:  [37.4, 39, 40.5, 42, 45.1, 49.2, 54, 58, 63],
        decided:   [37.4, 38.9, 40.2, 41.5, 44.2, 47.4, 50.5, 54.5, 59.5],
        pessimist: [37.4, 39.0, 40.4, 41.8, 44.7, 48.3, 52.0, 56.0, 61.0],
      },
      temperature: {
        baseline:  [1.4, 1.5, 1.6, 1.72, 1.95, 2.2, 2.6, 3, 3.5],
        decided:   [1.4, 1.5, 1.6, 1.72, 1.94, 2.17, 2.53, 2.91, 3.37],
        pessimist: [1.4, 1.5, 1.6, 1.72, 1.94, 2.18, 2.56, 2.95, 3.43],
      },
    },
  },

  // ─── Décision 42-01 — Modèle : POL_TRANSPORT_ELECTRIFICATION ────────────
  {
    id: 'dec-42-01',
    sessionId: 42,
    number: '42-01',
    status: 'active',
    title: 'Électrification des transports terrestres et mobilités durables d\'ici 2050',
    description: `Le secteur des transports représente **~8 GtCO₂/an** (2019), dont 75% pour les transports terrestres (voitures, camions, bus). Cette décision fixe : (1) l'interdiction des nouvelles immatriculations de véhicules thermiques dès **2035** dans tous les pays signataires, (2) le déploiement prioritaire des transports collectifs électrifiés (train, bus rapide, métro) dans les zones urbaines de plus de 500 000 habitants, (3) un plan de développement des infrastructures de recharge accessible. Prérequis : la décision est contingente à la décarbonation du mix électrique — un VE chargé sur un réseau charbonnier peut émettre davantage qu'un hybride thermique.`,
    options: [
      { id: 'pour',   label: 'Pour',       color: '#00ff88', bgClass: 'bg-eb-green/10',  borderClass: 'border-eb-green/20' },
      { id: 'contre', label: 'Contre',     color: '#ff5050', bgClass: 'bg-red-500/10',   borderClass: 'border-red-500/20'  },
      { id: 'abst',   label: 'Abstention', color: '#475569', bgClass: 'bg-slate-700/30', borderClass: 'border-slate-600/30'},
    ],
    votes: { pour: 689, contre: 312, abst: 178 },
    consensusThreshold: 67,
    deadline: '2025-12-31T18:00:00Z',
    resources: [
      {
        title: 'GIEC AR6 SYR — Section 4.5.3 : Décarbonation des transports',
        excerpt: 'Les véhicules électriques offrent le plus grand potentiel de décarbonation parmi les modes de transport terrestre, combinés aux transports en commun et à la mobilité douce.',
        url: 'https://www.ipcc.ch/report/ar6/syr/',
      },
      {
        title: 'IEA — Global EV Outlook 2024',
        excerpt: 'En 2023, 14 millions de VE immatriculés (18% du marché mondial). Le coût de possession total des VE est déjà inférieur aux véhicules thermiques dans la plupart des segments en Europe et en Chine.',
        url: 'https://www.iea.org/reports/global-ev-outlook-2024',
      },
    ],
    // Source : src/data/models/POL_TRANSPORT_ELECTRIFICATION.json
    projectedImpact: {
      emissionsReductionGtCO2yr: 3.5,
      tempReductionC2100: 0.16,
      fullEffectYear: 2050,
      uncertaintyScore: 2,
    },
    prospectiveNarratives: {
      optimistic: {
        horizon: '+10 ans',
        label: 'Scénario Optimiste',
        colorClass: 'text-eb-green',
        borderClass: 'border-eb-green/30',
        text: 'En 2034, les VE représentent **62%** des nouvelles immatriculations mondiales. Dans les métropoles pionnières (Amsterdam, Shenzhen, Oslo, Bogotá), la qualité de l\'air s\'est transformée : réduction de **55%** des particules fines en zone urbaine, soit 1,2 million de décès prématurés évités par an selon l\'OMS. Les coûts des batteries ont chuté à 60 $/kWh, rendant les VE moins chers que les thermiques dans tous les segments.',
      },
      moderate: {
        horizon: '+20 ans',
        label: 'Scénario Modéré',
        colorClass: 'text-yellow-400',
        borderClass: 'border-yellow-500/30',
        text: 'En 2044, 80% du parc automobile mondial est électrique dans les pays de l\'OCDE, mais seulement 45% dans les pays émergents (contrainte coût, infrastructure de recharge). Les poids lourds restent problématiques : le transport routier de marchandises n\'est qu\'à 30% électrifié. Bilan : **–2,0 GtCO₂/an** — inférieur au potentiel maximal faute de décarbonation complète du mix électrique dans les économies en développement.',
      },
      pessimistic: {
        horizon: '+50 ans',
        label: 'Scénario Pessimiste',
        colorClass: 'text-red-400',
        borderClass: 'border-red-500/30',
        text: 'En 2074, les tensions sur les minéraux critiques (lithium, cobalt) ont ralenti la transition. Des pays ont développé des véhicules à hydrogène gris ou des biocarburants à bilan CO₂ incertain. Le "rebond" (plus de kilomètres parcourus en VE car coût marginal inférieur) a partiellement annulé les gains d\'efficacité. L\'effet net reste positif (**–0,12°C**) mais la promesse initiale de décarbonation totale des transports est restée hors de portée sans co-décisions sur l\'urbanisme et le report modal.',
      },
    },
    // Deltas issus de POL_TRANSPORT_ELECTRIFICATION, appliqués sur baseline SSP2-4.5
    projections: {
      labels: [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074],
      co2: {
        baseline:  [37.4, 39, 40.5, 42, 45.1, 49.2, 54, 58, 63],
        decided:   [37.4, 38.9, 40.2, 41.5, 44.0, 47.2, 50.5, 54.5, 59.5],
        pessimist: [37.4, 39.0, 40.4, 41.8, 44.6, 48.2, 51.5, 55.5, 60.5],
      },
      temperature: {
        baseline:  [1.4, 1.5, 1.6, 1.72, 1.95, 2.2, 2.6, 3, 3.5],
        decided:   [1.4, 1.5, 1.6, 1.72, 1.94, 2.17, 2.52, 2.9, 3.37],
        pessimist: [1.4, 1.5, 1.6, 1.72, 1.94, 2.18, 2.55, 2.93, 3.41],
      },
    },
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
