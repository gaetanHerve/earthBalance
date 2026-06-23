import type { MitigationPolicy, GlobalStats, BlockchainState } from '@/types/index'

// ─── Baseline SSP2-4.5 (référence partagée pour toutes les projections) ────────
// Validée contre AR6_WG1_00174 (page 80) — Near-term 1.5°C, Mid-term 2.0°C, Long-term 2.7°C
// labels : [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074]
// co2    : [37.4, 38.8, 40.2, 41.8, 44.8, 49.0, 54.5, 57.0, 59.0] GtCO2/an (stabilisation post-2050)
// temp   : [1.35, 1.43, 1.52, 1.70, 1.82, 1.94, 2.10, 2.18, 2.32] °C (GIEC-aligned progression)
//
// Les courbes "decided" et "pessimist" sont calculées en ajoutant les deltas
// issus des modèles d'impact JSON (src/data/models/) à la baseline SSP2-4.5.

export const mitigationPolicies: MitigationPolicy[] = [
  // ─── Décision existante 42-07 ─────────────────────────────────────────────
  {
    id: 'dec-07',
    sessionId: 1,
    number: '07',
    status: 'active',
    implementationLag: 2,
    title: 'Taxe carbone mondiale à 150 $/tonne d\'ici 6 ans ?',
    description: `Cette proposition vise à instaurer une taxe carbone universelle de **150 $/tonne de CO₂** applicable à toutes les nations signataires de l'Accord de Paris d'ici 6 ans. Les revenus seraient redistribués à 60% vers les pays en développement pour financer la transition énergétique, et à 40% vers un fonds mondial d'adaptation climatique. Enjeux : compétitivité industrielle, justice climatique, efficacité de réduction des émissions.`,
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
    // Source : src/data/models/POL_CARBON_TAX_150.json
    projectedImpact: {
      emissionsReductionGtCO2yr: 6,
      tempReductionC2100: 0.22,
      fullEffectYear: 2050,
      uncertaintyScore: 2,
    },
    prospectiveNarratives: {
      optimistic: {
        horizon: '+10 ans',
        label: 'Scénario Optimiste',
        colorClass: 'text-eb-green',
        borderClass: 'border-eb-green/30',
        text: 'Dans 10 ans, la taxe carbone mondiale aura réduit les émissions globales de **22%**. Les énergies renouvelables représentent désormais **51%** du mix énergétique mondial. Les pays en développement ont reçu 2 400 Mds$ pour financer leur transition. La déforestation a ralenti de **35%**. Les conflits liés aux ressources énergétiques ont diminué significativement.',
      },
      moderate: {
        horizon: '+20 ans',
        label: 'Scénario Modéré',
        colorClass: 'text-yellow-400',
        borderClass: 'border-yellow-500/30',
        text: 'Dans 20 ans, malgré des résistances industrielles, les émissions auront baissé de **38%** par rapport à 2024. La température globale se stabilise à **+1.7°C**. Des tensions persistent dans les régions à forte dépendance aux hydrocarbures. L\'accès à l\'eau potable progresse à **79%** de la population mondiale.',
      },
      pessimistic: {
        horizon: '+50 ans',
        label: 'Scénario Pessimiste',
        colorClass: 'text-red-400',
        borderClass: 'border-red-500/30',
        text: 'Dans 50 ans, si la taxe n\'est pas respectée par les grandes puissances, les émissions ne baissent que de **12%**. La température atteint **+2.8°C**, déclenchant des événements climatiques extrêmes majeurs. 800 millions de personnes supplémentaires sont en situation d\'insécurité alimentaire. Les conflits géopolitiques liés à l\'eau et aux terres arables s\'intensifient.',
      },
    },
    projections: {
      labels: [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074],
      co2: {
        baseline:  [37.4, 38.8, 40.2, 41.8, 44.8, 49.0, 54.5, 57.0, 59.0],
        decided:   [37.4, 38.3, 38.8, 38.8, 40.3, 43.5, 48.0, 52.0, 57.0],
        pessimist: [37.4, 38.6, 39.8, 40.6, 42.9, 46.5, 51.0, 55.0, 60.0],
      },
      temperature: {
        baseline:  [1.35, 1.43, 1.52, 1.70, 1.82, 1.94, 2.10, 2.18, 2.32],
        decided:   [1.35, 1.44, 1.52, 1.65, 1.84, 2.05, 2.40, 2.77, 3.25],
        pessimist: [1.35, 1.45, 1.54, 1.68, 1.89, 2.12, 2.50, 2.88, 3.37],
      },
      forest: {
        // % forêts primaires mondiales — baseline Mackey et al. 2015 ; deltas TMF rescalés ×0.6
        baseline:  [58.0, 57.5, 57.0, 56.5, 55.3, 53.5, 50.5, 47.5, 43.5],
        decided:   [58.0, 57.6, 57.3, 56.9, 55.7, 54.0, 51.7, 48.8, 44.8],
        pessimist: [58.0, 57.5, 57.1, 56.7, 55.4, 53.7, 51.2, 48.2, 44.1],
      },
    },
  },

  // ─── Décision 05 — Modèle : POL_COAL_EXIT_2030_DEV ────────────────────
  {
    id: 'dec-05',
    sessionId: 1,
    number: '05',
    status: 'active',
    implementationLag: 3,
    title: 'Sortie du charbon pour la production électrique dans les pays développés d\'ici 6 ans',
    description: `Fermeture programmée de toutes les centrales électriques au charbon sans captage de CO₂ dans les pays de l'Annexe I (OCDE + UE) dans les 6 premières années. La transition serait accompagnée d'un plan de reconversion pour les bassins miniers et d'un mécanisme de compensation pour les pays encore dépendants. D'après AR6 WGIII, le charbon représente ~30% des émissions mondiales de CO₂ liées à l'énergie ; les pays développés en assurent ~45%. Cette mesure s'inscrit dans les trajectoires C1 (1,5°C) qui exigent une baisse de **67%** [46–86%] de la production charbonnière mondiale dès la 6e année.`,
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
        text: 'Dans 10 ans, la dernière centrale à charbon des pays développés ferme ses portes. Les **1 800 TWh** annuels sont remplacés par du solaire et de l\'éolien. La qualité de l\'air dans les bassins industriels européens et nord-américains s\'est améliorée spectaculairement — réduction de **42%** des hospitalisations cardiovasculaires dans les zones anciennement charbonnières. Les émissions annuelles mondiales ont chuté de **2,4 GtCO₂**.',
      },
      moderate: {
        horizon: '+20 ans',
        label: 'Scénario Modéré',
        colorClass: 'text-yellow-400',
        borderClass: 'border-yellow-500/30',
        text: 'Dans 20ans, la décision a évité **~27 GtCO₂** cumulées depuis aujouird\'hui — soit ~0,12°C de réchauffement de moins par rapport à la trajectoire de référence. Les régions minières ont subi une transition douloureuse : si certains bassins (Ruhr, Appalachie) ont reconverti 70% des emplois, d\'autres restent fragilisés. Le gaz naturel a partiellement compensé le charbon dans plusieurs pays, limitant les gains nets.',
      },
      pessimistic: {
        horizon: '+50 ans',
        label: 'Scénario Pessimiste',
        colorClass: 'text-red-400',
        borderClass: 'border-red-500/30',
        text: 'Dans 50 ans, sans extension aux pays émergents (qui représentent 55% des émissions charbon), l\'impact de la seule décision reste limité à **-0,10°C**. La Chine et l\'Inde ont continué d\'expandre leurs capacités, compensant les fermetures occidentales. Le "carbon leakage" industriel (délocalisation vers des pays sans contrainte) a réduit les gains nets de ~30%. La décision reste positive mais insuffisante sans coopération internationale.',
      },
    },
    // Deltas issus de POL_COAL_EXIT_2030_DEV (médian / pessimiste), appliqués sur baseline SSP2-4.5
    projections: {
      labels: [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074],
      co2: {
        baseline:  [37.4, 38.8, 40.2, 41.8, 44.8, 49.0, 54.5, 57.0, 59.0],
        decided:   [37.4, 38.6, 39.8, 40.9, 43.3, 47.2, 52.0, 56.0, 61.0],
        pessimist: [37.4, 38.7, 40.0, 41.3, 43.8, 47.8, 52.6, 56.6, 61.6],
      },
      temperature: {
        baseline:  [1.35, 1.43, 1.52, 1.70, 1.82, 1.94, 2.10, 2.18, 2.32],
        decided:   [1.35, 1.43, 1.51, 1.69, 1.89, 2.12, 2.49, 2.87, 3.35],
        pessimist: [1.35, 1.43, 1.51, 1.69, 1.90, 2.14, 2.52, 2.91, 3.39],
      },
      energyMix: {
        coal:  { decided: [0, -0.5, -1.5, -3.5, -5.0, -5.5, -5.5, -5.5, -5.5], pessimist: [0, -0.3, -1.0, -2.5, -3.5, -4.0, -4.0, -4.0, -4.0] },
        gas:   { decided: [0, +0.2, +0.5, +1.0, +1.5, +1.5, +1.2, +1.0, +0.8], pessimist: [0, +0.1, +0.3, +0.8, +1.2, +1.3, +1.2, +1.0, +0.8] },
        solar: { decided: [0, +0.2, +0.5, +1.3, +2.0, +2.2, +2.3, +2.5, +2.7], pessimist: [0, +0.1, +0.4, +1.0, +1.5, +1.7, +1.8, +2.0, +2.0] },
        wind:  { decided: [0, +0.1, +0.5, +1.2, +1.5, +1.8, +2.0, +2.0, +2.0], pessimist: [0, +0.1, +0.3, +0.7, +0.8, +1.0, +1.0, +1.0, +1.2] },
      },
      resources: {
        minerals:    { decided: [0, +0.1, +0.2, +0.3, +0.5, +0.6, +0.7, +0.8, +0.8], pessimist: [0, +0.1, +0.1, +0.2, +0.3, +0.4, +0.5, +0.6, +0.6] },
        fossilFuels: { decided: [0, -0.2, -0.5, -0.9, -1.2, -1.3, -1.4, -1.4, -1.4], pessimist: [0, -0.1, -0.3, -0.6, -0.8, -0.9, -1.0, -1.0, -1.0] },
      },
      // Impact sociétal — Source : POL_COAL_EXIT_2030_DEV.json societal_indicators
      societal: {
        foodSecurity:          { decided: [0, 0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.5, 0.5],          pessimist: [0, 0.0, 0.0, 0.1, 0.1, 0.2, 0.2, 0.2, 0.2] },
        resourceConflicts:     { decided: [0, -0.1, -0.3, -0.6, -1.0, -1.5, -2.0, -2.0, -2.0],  pessimist: [0, 0.0, -0.1, -0.2, -0.4, -0.6, -1.0, -1.0, -1.0] },
        waterTensions:         { decided: [0, -0.1, -0.2, -0.5, -0.8, -1.2, -1.5, -1.5, -1.5],  pessimist: [0, 0.0, -0.1, -0.2, -0.3, -0.5, -0.8, -0.8, -0.8] },
        climateMigrations:     { decided: [0, -0.1, -0.4, -0.8, -1.4, -2.0, -3.0, -3.0, -3.0],  pessimist: [0, 0.0, -0.1, -0.3, -0.6, -0.9, -1.5, -1.5, -1.5] },
        lifeExpectancy:        { decided: [0, 0.1, 0.3, 0.6, 0.9, 1.2, 1.5, 1.5, 1.5],          pessimist: [0, 0.0, 0.1, 0.2, 0.4, 0.5, 0.7, 0.7, 0.7] },
        respiratoryDiseases:   { decided: [0, -0.5, -1.5, -3.0, -5.5, -8.0, -10.0, -10.0, -10.0], pessimist: [0, -0.2, -0.7, -1.5, -2.5, -3.5, -5.0, -5.0, -5.0] },
        whoHealthIndex:        { decided: [0, 0.1, 0.4, 0.8, 1.5, 2.0, 3.0, 3.0, 3.0],          pessimist: [0, 0.0, 0.2, 0.4, 0.7, 1.0, 1.5, 1.5, 1.5] },
        giniCoefficient:       { decided: [0, 0.0, -0.002, -0.004, -0.007, -0.009, -0.012, -0.012, -0.012], pessimist: [0, 0.001, 0.0, -0.001, -0.002, -0.003, -0.005, -0.005, -0.005] },
        wealthConcentration:   { decided: [0, 0.0, -0.2, -0.4, -0.7, -1.0, -1.5, -1.5, -1.5],  pessimist: [0, 0.0, -0.1, -0.2, -0.3, -0.4, -0.7, -0.7, -0.7] },
        educationAccess:       { decided: [0, 0.0, 0.1, 0.2, 0.5, 0.7, 1.0, 1.0, 1.0],          pessimist: [0, 0.0, 0.0, 0.1, 0.2, 0.3, 0.5, 0.5, 0.5] },
      },
    },
    prerequisites: {
      policiesRequired: ['dec-07'],
    },
  },

  // ─── Décision 04 — Modèle : POL_METHANE_REDUCTION_2030 ────────────────
  {
    id: 'dec-04',
    sessionId: 1,
    number: '04',
    status: 'active',
    implementationLag: 2,
    title: 'Réduction mondiale des émissions de méthane de 34% d\'ici 6 ans',
    description: `Le méthane (CH₄) est responsable d'environ **0,5°C** du réchauffement actuel. Sa durée de vie atmosphérique courte (~12 ans) en fait le levier d'action climatique le plus rapide disponible. Cette proposition adopte l'objectif du Global Methane Pledge : réduire les émissions mondiales de CH₄ de **34% sous les niveaux de 2019 d'ici 6 ans**, couvrant les secteurs de l'énergie fossile (fuites O&G, mines de charbon), de l'agriculture (fermentation entérique, rizicultures) et des déchets. La mesure est largement coût-efficace : plus de 60% du potentiel de réduction est atteignable à coût négatif ou nul (AR6 WGIII Ch.6).`,
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
        text: 'Dans 10 ans, grâce au déploiement de capteurs satellitaires (Copernicus, MethaneSAT) et à des réglementations strictes sur les fuites des infrastructures O&G, les émissions mondiales de CH₄ ont chuté de **38%**. Le pic de température mondiale est désormais estimé à **0,2°C inférieur** aux prévisions de 2024. Dans les mégapoles asiatiques, la réduction de l\'ozone troposphérique lié au méthane a amélioré la santé respiratoire de **180 millions** de personnes.',
      },
      moderate: {
        horizon: '+20 ans',
        label: 'Scénario Modéré',
        colorClass: 'text-yellow-400',
        borderClass: 'border-yellow-500/30',
        text: 'Dans 20 ans, la réduction effective sera de **28%** — en deçà de l\'objectif. Les secteurs de l\'énergie fossile ont largement répondu à la réglementation, mais les émissions agricoles (fermentation entérique des ruminants) ont peu diminué faute de technologies accessibles dans les pays du Sud. Le bénéfice climatique est réel : **–0,15°C** par rapport à la trajectoire de référence. La qualité de l\'air s\'est améliorée dans 65% des zones urbaines mondiales.',
      },
      pessimistic: {
        horizon: '+50 ans',
        label: 'Scénario Pessimiste',
        colorClass: 'text-red-400',
        borderClass: 'border-red-500/30',
        text: 'Dans 50 ans, les émissions de méthane auront été réduites de seulement **18%** — résistances des lobbies pétroliers et gaziers, déficit de surveillance dans les pays émergents. La courte durée de vie du CH₄ signifie que les bénéfices de la décennie 2025-2035 se sont en partie estompés. Le bilan net reste positif (**–0,10°C**) mais la fenêtre d\'opportunité d\'action rapide sur le CH₄ a été partiellement manquée.',
      },
    },
    // Deltas issus de POL_METHANE_REDUCTION_2030, appliqués sur baseline SSP2-4.5
    projections: {
      labels: [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074],
      co2: {
        baseline:  [37.4, 38.8, 40.2, 41.8, 44.8, 49.0, 54.5, 57.0, 59.0],
        decided:   [37.4, 38.2, 38.5, 38.8, 41.5, 45.5, 50.3, 54.3, 59.3],
        pessimist: [37.4, 38.4, 39.1, 39.8, 42.5, 46.5, 51.3, 55.3, 60.3],
      },
      temperature: {
        baseline:  [1.35, 1.43, 1.52, 1.70, 1.82, 1.94, 2.10, 2.18, 2.32],
        decided:   [1.35, 1.43, 1.51, 1.68, 1.87, 2.07, 2.42, 2.81, 3.30],
        pessimist: [1.35, 1.43, 1.51, 1.69, 1.89, 2.10, 2.47, 2.86, 3.35],
      },
      // Impact sociétal — Source : POL_METHANE_REDUCTION_2030.json societal_indicators
      societal: {
        foodSecurity:          { decided: [0, 0.1, 0.3, 0.7, 1.1, 1.3, 1.5, 1.5, 1.5],        pessimist: [0, 0.0, 0.1, 0.3, 0.4, 0.5, 0.5, 0.5, 0.5] },
        resourceConflicts:     { decided: [0, -0.1, -0.3, -0.6, -1.0, -1.3, -1.5, -1.5, -1.5], pessimist: [0, 0.0, -0.1, -0.2, -0.4, -0.6, -0.8, -0.8, -0.8] },
        waterTensions:         { decided: [0, -0.1, -0.3, -0.6, -1.0, -1.3, -1.5, -1.5, -1.5], pessimist: [0, 0.0, -0.1, -0.2, -0.4, -0.6, -0.8, -0.8, -0.8] },
        climateMigrations:     { decided: [0, -0.1, -0.4, -0.8, -1.3, -1.7, -2.0, -2.0, -2.0], pessimist: [0, 0.0, -0.1, -0.3, -0.5, -0.7, -1.0, -1.0, -1.0] },
        lifeExpectancy:        { decided: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.5, 0.5, 0.5],         pessimist: [0, 0.0, 0.1, 0.1, 0.2, 0.2, 0.3, 0.3, 0.3] },
        respiratoryDiseases:   { decided: [0, -0.2, -0.7, -1.5, -2.5, -3.5, -4.0, -4.0, -4.0], pessimist: [0, -0.1, -0.3, -0.7, -1.0, -1.5, -2.0, -2.0, -2.0] },
        whoHealthIndex:        { decided: [0, 0.1, 0.2, 0.4, 0.7, 0.9, 1.0, 1.0, 1.0],         pessimist: [0, 0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.5, 0.5] },
        giniCoefficient:       { decided: [0, 0.0, -0.001, -0.002, -0.003, -0.003, -0.004, -0.004, -0.004], pessimist: [0, 0.0, 0.0, -0.001, -0.001, -0.002, -0.002, -0.002, -0.002] },
        wealthConcentration:   { decided: [0, 0.0, -0.1, -0.2, -0.3, -0.4, -0.5, -0.5, -0.5],  pessimist: [0, 0.0, 0.0, -0.1, -0.1, -0.2, -0.2, -0.2, -0.2] },
        educationAccess:       { decided: [0, 0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.5, 0.5],         pessimist: [0, 0.0, 0.0, 0.1, 0.1, 0.2, 0.2, 0.2, 0.2] },
      },
    },
  },

  // ─── Décision 03 — Modèle : POL_DEFORESTATION_HALT_2030 ───────────────
  {
    id: 'dec-03',
    sessionId: 1,
    number: '03',
    status: 'active',
    implementationLag: 4,
    title: 'Arrêt de la déforestation tropicale et restauration des forêts d\'ici 6 ans',
    description: `Cette décision engage les nations signataires à **stopper toute déforestation nette des forêts tropicales primaires d'ici 6 ans** et à restaurer 350 millions d'hectares de forêts dégradées d'ici 6 ans (engagement Glasgow 2021). La déforestation tropicale représente ~4 GtCO₂eq/an — soit l'équivalent de toutes les émissions de l'Union Européenne. Les forêts tropicales abritent plus de **50% des espèces terrestres mondiales** et régulent le cycle hydrologique de régions entières. La principale cause (>70%) est l'expansion agricole liée à l'élevage et aux cultures d'exportation (soja, huile de palme). Un fonds de **500 Mds$** serait mobilisé via des paiements pour services écosystémiques (REDD+).`,
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
        text: 'Dans 10 ans, combinée à l\'essor des protéines végétales, la décision aura réduit la déforestation tropicale nette de **78%**. 120 millions d\'hectares de forêts dégradées sont en cours de restauration. La biodiversité amazonienne enregistre une reprise mesurable des populations de grands mammifères. Le cycle des pluies au Brésil montre des signes de stabilisation après deux décennies de dérèglement. Les communautés autochtones gardiens des forêts reçoivent des paiements REDD+ réguliers.',
      },
      moderate: {
        horizon: '+20 ans',
        label: 'Scénario Modéré',
        colorClass: 'text-yellow-400',
        borderClass: 'border-yellow-500/30',
        text: 'Dans 20 ans, la déforestation brute aura diminué de **52%** — freinée par la demande persistante en protéines animales et en biocarburants. Le "leakage" (déplacement vers des zones non-protégées) représente 20% des émissions évitées théoriques. Le bilan reste fortement positif : **–0,14°C** par rapport à la baseline, avec des co-bénéfices biodiversité irremplaçables. La surveillance satellitaire en temps réel a rendu possible la mise en application sans précédent du traité.',
      },
      pessimistic: {
        horizon: '+50 ans',
        label: 'Scénario Pessimiste',
        colorClass: 'text-red-400',
        borderClass: 'border-red-500/30',
        text: 'Dans 50 ans, sans réforme du système alimentaire mondial (demande en viande bovine toujours croissante dans les pays émergents), la pression sur les forêts n\'aura jamais vraiment cédé. La déforestation a été réduite de **30%** mais les méga-feux liés au changement climatique ont compensé une partie des gains. La décision, faute de s\'attaquer aux causes profondes (régimes alimentaires), n\'a permis qu\'un effet climatique limité à **–0,10°C**.',
      },
    },
    // Deltas issus de POL_DEFORESTATION_HALT_2030, appliqués sur baseline SSP2-4.5
    projections: {
      labels: [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074],
      co2: {
        baseline:  [37.4, 38.8, 40.2, 41.8, 44.8, 49.0, 54.5, 57.0, 59.0],
        decided:   [37.4, 38.8, 39.9, 41.0, 42.9, 46.2, 51.0, 55.0, 60.0],
        pessimist: [37.4, 38.9, 40.2, 41.5, 43.8, 47.7, 52.5, 56.5, 61.5],
      },
      temperature: {
        baseline:  [1.35, 1.43, 1.52, 1.70, 1.82, 1.94, 2.10, 2.18, 2.32],
        decided:   [1.4, 1.5, 1.59, 1.71, 1.92, 2.13, 2.48, 2.86, 3.32],
        pessimist: [1.4, 1.5, 1.6, 1.72, 1.93, 2.16, 2.53, 2.92, 3.4],
      },
      forest: {
        baseline:  [58.0, 57.5, 57.0, 56.5, 55.3, 53.5, 50.5, 47.5, 43.5],
        decided:   [58.0, 57.9, 57.7, 57.4, 56.9, 56.4, 55.6, 54.6, 53.0],
        pessimist: [58.0, 57.6, 57.3, 56.9, 56.0, 54.6, 52.5, 50.4, 47.2],
      },
      // Impact sociétal — Source : POL_DEFORESTATION_HALT_2030.json societal_indicators
      societal: {
        foodSecurity:          { decided: [0, 0.0, 0.2, 0.5, 0.9, 1.2, 1.5, 1.5, 1.5],        pessimist: [0, 0.0, 0.1, 0.2, 0.4, 0.6, 0.7, 0.7, 0.7] },
        waterAccess:           { decided: [0, 0.0, 0.2, 0.6, 1.1, 1.6, 2.0, 2.0, 2.0],        pessimist: [0, 0.0, 0.1, 0.2, 0.5, 0.7, 1.0, 1.0, 1.0] },
        resourceConflicts:     { decided: [0, -0.1, -0.4, -0.8, -1.5, -2.0, -3.0, -3.0, -3.0], pessimist: [0, 0.0, -0.1, -0.3, -0.6, -0.9, -1.5, -1.5, -1.5] },
        waterTensions:         { decided: [0, -0.1, -0.4, -0.8, -1.5, -2.0, -3.0, -3.0, -3.0], pessimist: [0, 0.0, -0.1, -0.3, -0.6, -0.9, -1.5, -1.5, -1.5] },
        climateMigrations:     { decided: [0, -0.1, -0.3, -0.6, -1.0, -1.5, -2.0, -2.0, -2.0], pessimist: [0, 0.0, -0.1, -0.2, -0.4, -0.6, -1.0, -1.0, -1.0] },
        lifeExpectancy:        { decided: [0, 0.0, 0.1, 0.2, 0.2, 0.3, 0.3, 0.3, 0.3],         pessimist: [0, 0.0, 0.0, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1] },
        respiratoryDiseases:   { decided: [0, -0.1, -0.4, -0.8, -1.5, -2.2, -3.0, -3.0, -3.0], pessimist: [0, 0.0, -0.2, -0.4, -0.7, -1.0, -1.5, -1.5, -1.5] },
        whoHealthIndex:        { decided: [0, 0.0, 0.2, 0.3, 0.5, 0.7, 0.8, 0.8, 0.8],         pessimist: [0, 0.0, 0.1, 0.1, 0.2, 0.3, 0.4, 0.4, 0.4] },
        giniCoefficient:       { decided: [0, 0.0, -0.001, -0.003, -0.005, -0.006, -0.008, -0.008, -0.008], pessimist: [0, 0.0, 0.0, -0.001, -0.002, -0.003, -0.004, -0.004, -0.004] },
        wealthConcentration:   { decided: [0, 0.0, -0.1, -0.3, -0.5, -0.7, -1.0, -1.0, -1.0],  pessimist: [0, 0.0, -0.1, -0.1, -0.2, -0.3, -0.5, -0.5, -0.5] },
        educationAccess:       { decided: [0, 0.0, 0.1, 0.3, 0.5, 0.7, 1.0, 1.0, 1.0],         pessimist: [0, 0.0, 0.1, 0.1, 0.3, 0.4, 0.5, 0.5, 0.5] },
      },
    },
  },

  // ─── Décision 02 — Modèle : POL_DIET_SHIFT_PLANTBASED ─────────────────
  {
    id: 'dec-02',
    sessionId: 1,
    number: '02',
    status: 'active',
    implementationLag: 7,
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
        text: 'Dans 10 ans, l\'explosion des alternatives végétales (viande fermentée, protéines d\'insectes, analogues laitiers) a rendu la transition alimentaire accessible et désirable. La consommation de viande bovine a chuté de **28%** dans les pays à hauts revenus. Les terres libérées par la réduction de l\'élevage extensif (180 Mha) sont en cours de reboisement. Les maladies cardiovasculaires ont reculé de **15%** dans les pays pionniers — bénéfice santé de 400 Mds$/an estimé par l\'OMS.',
      },
      moderate: {
        horizon: '+20 ans',
        label: 'Scénario Modéré',
        colorClass: 'text-yellow-400',
        borderClass: 'border-yellow-500/30',
        text: 'Dans 20 ans, la transition alimentaire progresse à deux vitesses : les pays riches ont réduit leur consommation de protéines animales de **35%**, mais la demande explose dans les classes moyennes émergentes d\'Asie et d\'Afrique (+40%). Le bilan net reste positif mais loin des scénarios C1 : réduction de **–1.8 GtCO₂eq/an**. Les subventions à l\'élevage conventionnel persistent dans de nombreux pays, ralentissant la reconversion agricole.',
      },
      pessimistic: {
        horizon: '+50 ans',
        label: 'Scénario Pessimiste',
        colorClass: 'text-red-400',
        borderClass: 'border-red-500/30',
        text: 'Dans 50 ans, sans politique d\'accompagnement ambitieuse (réforme des subventions, investissements dans la R&D alimentaire, coopération Sud-Sud), le changement de régime alimentaire n\'a touché qu\'une minorité aisée des pays développés. La décision est perçue comme une ingérence culturelle dans les pays du Sud. Le bilan climatique est limité à **–0,10°C**, les co-bénéfices biodiversité et eau partiellement réalisés.',
      },
    },
    // Deltas issus de POL_DIET_SHIFT_PLANTBASED, appliqués sur baseline SSP2-4.5
    projections: {
      labels: [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074],
      co2: {
        baseline:  [37.4, 38.8, 40.2, 41.8, 44.8, 49.0, 54.5, 57.0, 59.0],
        decided:   [37.4, 38.9, 40.2, 41.5, 44.2, 47.4, 50.5, 54.5, 59.5],
        pessimist: [37.4, 39.0, 40.4, 41.8, 44.7, 48.3, 52.0, 56.0, 61.0],
      },
      temperature: {
        baseline:  [1.35, 1.43, 1.52, 1.70, 1.82, 1.94, 2.10, 2.18, 2.32],
        decided:   [1.4, 1.5, 1.6, 1.72, 1.94, 2.17, 2.53, 2.91, 3.37],
        pessimist: [1.4, 1.5, 1.6, 1.72, 1.94, 2.18, 2.56, 2.95, 3.43],
      },
      forest: {
        baseline:  [58.0, 57.5, 57.0, 56.5, 55.3, 53.5, 50.5, 47.5, 43.5],
        decided:   [58.0, 57.5, 57.0, 56.7, 55.7, 54.0, 51.7, 49.2, 45.2],
        pessimist: [58.0, 57.5, 57.0, 56.6, 55.4, 53.7, 51.2, 48.3, 44.3],
      },
      resources: {
        biomass: { decided: [0, 0, -0.2, -0.5, -1.0, -1.8, -2.5, -3.0, -3.5], pessimist: [0, 0, -0.1, -0.3, -0.7, -1.2, -1.8, -2.2, -2.8] },
      },
      // Impact sociétal — Source : POL_DIET_SHIFT_PLANTBASED.json societal_indicators
      societal: {
        foodSecurity:          { decided: [0, 0.1, 0.3, 0.6, 1.0, 1.3, 1.5, 1.5, 1.5],        pessimist: [0, 0.0, 0.1, 0.2, 0.4, 0.5, 0.5, 0.5, 0.5] },
        waterAccess:           { decided: [0, 0.1, 0.3, 0.6, 1.0, 1.5, 2.0, 2.0, 2.0],        pessimist: [0, 0.0, 0.1, 0.2, 0.4, 0.6, 0.8, 0.8, 0.8] },
        resourceConflicts:     { decided: [0, -0.1, -0.3, -0.6, -1.0, -1.3, -2.0, -2.0, -2.0], pessimist: [0, 0.0, -0.1, -0.2, -0.4, -0.6, -1.0, -1.0, -1.0] },
        waterTensions:         { decided: [0, -0.1, -0.4, -0.8, -1.3, -1.8, -2.5, -2.5, -2.5], pessimist: [0, 0.0, -0.1, -0.3, -0.5, -0.7, -1.0, -1.0, -1.0] },
        climateMigrations:     { decided: [0, -0.1, -0.3, -0.6, -0.9, -1.2, -1.5, -1.5, -1.5], pessimist: [0, 0.0, -0.1, -0.2, -0.4, -0.5, -0.8, -0.8, -0.8] },
        lifeExpectancy:        { decided: [0, 0.1, 0.2, 0.4, 0.6, 0.7, 0.8, 0.8, 0.8],         pessimist: [0, 0.0, 0.1, 0.2, 0.3, 0.3, 0.4, 0.4, 0.4] },
        respiratoryDiseases:   { decided: [0, -0.1, -0.3, -0.6, -1.0, -1.5, -2.0, -2.0, -2.0], pessimist: [0, 0.0, -0.1, -0.3, -0.5, -0.7, -1.0, -1.0, -1.0] },
        whoHealthIndex:        { decided: [0, 0.1, 0.2, 0.4, 0.7, 1.0, 1.5, 1.5, 1.5],         pessimist: [0, 0.0, 0.1, 0.2, 0.3, 0.5, 0.7, 0.7, 0.7] },
        giniCoefficient:       { decided: [0, -0.001, -0.002, -0.003, -0.004, -0.004, -0.005, -0.005, -0.005], pessimist: [0, 0.0, -0.001, -0.001, -0.002, -0.002, -0.002, -0.002, -0.002] },
        wealthConcentration:   { decided: [0, -0.1, -0.2, -0.4, -0.6, -0.7, -0.8, -0.8, -0.8],  pessimist: [0, 0.0, -0.1, -0.2, -0.3, -0.3, -0.4, -0.4, -0.4] },
        educationAccess:       { decided: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.5, 0.5, 0.5],          pessimist: [0, 0.0, 0.1, 0.1, 0.2, 0.2, 0.3, 0.3, 0.3] },
      },
    },
    prerequisites: {
      policiesRequired: ['dec-14'],
    },
  },

  // ─── Décision 01 — Modèle : POL_TRANSPORT_ELECTRIFICATION ────────────
  {
    id: 'dec-01',
    sessionId: 1,
    number: '01',
    status: 'active',
    implementationLag: 4,
    title: 'Électrification des transports terrestres et mobilités durables d\'ici 26 ans',
    description: `Le secteur des transports représente **~8 GtCO₂/an** (2019), dont 75% pour les transports terrestres (voitures, camions, bus). Cette décision fixe : (1) l'interdiction des nouvelles immatriculations de véhicules thermiques dès **la 11e année** dans tous les pays signataires, (2) le déploiement prioritaire des transports collectifs électrifiés (train, bus rapide, métro) dans les zones urbaines de plus de 500 000 habitants, (3) un plan de développement des infrastructures de recharge accessible. Prérequis : la décision est contingente à la décarbonation du mix électrique — un VE chargé sur un réseau charbonnier peut émettre davantage qu'un hybride thermique.`,
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
        text: 'Dans 10 ans, les VE représentent **62%** des nouvelles immatriculations mondiales. Dans les métropoles pionnières (Amsterdam, Shenzhen, Oslo, Bogotá), la qualité de l\'air s\'est transformée : réduction de **55%** des particules fines en zone urbaine, soit 1,2 million de décès prématurés évités par an selon l\'OMS. Les coûts des batteries ont chuté à 60 $/kWh, rendant les VE moins chers que les thermiques dans tous les segments.',
      },
      moderate: {
        horizon: '+20 ans',
        label: 'Scénario Modéré',
        colorClass: 'text-yellow-400',
        borderClass: 'border-yellow-500/30',
        text: 'Dans 20 ans, 80% du parc automobile mondial est électrique dans les pays de l\'OCDE, mais seulement 45% dans les pays émergents (contrainte coût, infrastructure de recharge). Les poids lourds restent problématiques : le transport routier de marchandises n\'est qu\'à 30% électrifié. Bilan : **–2,0 GtCO₂/an** — inférieur au potentiel maximal faute de décarbonation complète du mix électrique dans les économies en développement.',
      },
      pessimistic: {
        horizon: '+50 ans',
        label: 'Scénario Pessimiste',
        colorClass: 'text-red-400',
        borderClass: 'border-red-500/30',
        text: 'Dans 50 ans, les tensions sur les minéraux critiques (lithium, cobalt) ont ralenti la transition. Des pays ont développé des véhicules à hydrogène gris ou des biocarburants à bilan CO₂ incertain. Le "rebond" (plus de kilomètres parcourus en VE car coût marginal inférieur) a partiellement annulé les gains d\'efficacité. L\'effet net reste positif (**–0,12°C**) mais la promesse initiale de décarbonation totale des transports est restée hors de portée sans co-décisions sur l\'urbanisme et le report modal.',
      },
    },
    // Deltas issus de POL_TRANSPORT_ELECTRIFICATION, appliqués sur baseline SSP2-4.5
    projections: {
      labels: [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074],
      co2: {
        baseline:  [37.4, 38.8, 40.2, 41.8, 44.8, 49.0, 54.5, 57.0, 59.0],
        decided:   [37.4, 38.9, 40.2, 41.5, 44.0, 47.2, 50.5, 54.5, 59.5],
        pessimist: [37.4, 39.0, 40.4, 41.8, 44.6, 48.2, 51.5, 55.5, 60.5],
      },
      temperature: {
        baseline:  [1.35, 1.43, 1.52, 1.70, 1.82, 1.94, 2.10, 2.18, 2.32],
        decided:   [1.4, 1.5, 1.6, 1.72, 1.94, 2.17, 2.52, 2.9, 3.37],
        pessimist: [1.4, 1.5, 1.6, 1.72, 1.94, 2.18, 2.55, 2.93, 3.41],
      },
      energyMix: {
        oil:   { decided: [0, -0.5, -1.5, -2.5, -4.0, -5.5, -7.0, -8.0, -8.5], pessimist: [0, -0.3, -1.0, -1.5, -2.5, -3.5, -4.5, -5.5, -6.0] },
        coal:  { decided: [0,  0,   -0.2, -0.5, -0.8, -1.0, -1.2, -1.5, -1.5], pessimist: [0,  0,   -0.1, -0.3, -0.5, -0.7, -0.8, -1.0, -1.0] },
        solar: { decided: [0, +0.3, +0.8, +1.5, +2.5, +3.5, +4.5, +5.0, +5.5], pessimist: [0, +0.2, +0.6, +1.0, +1.7, +2.5, +3.0, +3.5, +4.0] },
        wind:  { decided: [0, +0.2, +0.9, +1.5, +2.3, +3.0, +3.7, +4.5, +4.5], pessimist: [0, +0.1, +0.5, +0.8, +1.3, +1.7, +2.3, +3.0, +3.0] },
      },
      resources: {
        minerals:    { decided: [0, +0.2, +0.5, +1.0, +1.8, +2.5, +3.0, +3.5, +3.5], pessimist: [0, +0.1, +0.3, +0.7, +1.2, +1.8, +2.2, +2.5, +2.5] },
        fossilFuels: { decided: [0, -0.1, -0.3, -0.7, -1.2, -1.8, -2.5, -3.0, -3.2], pessimist: [0, -0.1, -0.2, -0.5, -0.8, -1.2, -1.8, -2.2, -2.5] },
      },
      // Impact sociétal — Source : POL_TRANSPORT_ELECTRIFICATION.json societal_indicators
      societal: {
        foodSecurity:          { decided: [0, 0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.5, 0.5],         pessimist: [0, 0.0, 0.0, 0.1, 0.1, 0.2, 0.2, 0.2, 0.2] },
        resourceConflicts:     { decided: [0, -0.1, -0.3, -0.6, -1.0, -1.5, -2.0, -2.0, -2.0],  pessimist: [0, 0.0, -0.1, -0.2, -0.4, -0.6, -1.0, -1.0, -1.0] },
        waterTensions:         { decided: [0, -0.1, -0.2, -0.3, -0.5, -0.8, -1.0, -1.0, -1.0],  pessimist: [0, 0.0, -0.1, -0.1, -0.2, -0.3, -0.5, -0.5, -0.5] },
        climateMigrations:     { decided: [0, -0.1, -0.3, -0.5, -0.8, -1.2, -1.5, -1.5, -1.5],  pessimist: [0, 0.0, -0.1, -0.2, -0.3, -0.5, -0.7, -0.7, -0.7] },
        lifeExpectancy:        { decided: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.5, 0.5, 0.5],          pessimist: [0, 0.0, 0.1, 0.1, 0.2, 0.2, 0.3, 0.3, 0.3] },
        respiratoryDiseases:   { decided: [0, -0.3, -1.0, -2.0, -3.5, -5.0, -6.0, -6.0, -6.0],  pessimist: [0, -0.1, -0.5, -1.0, -1.5, -2.2, -3.0, -3.0, -3.0] },
        whoHealthIndex:        { decided: [0, 0.1, 0.3, 0.5, 0.9, 1.2, 1.5, 1.5, 1.5],          pessimist: [0, 0.0, 0.1, 0.2, 0.4, 0.6, 0.8, 0.8, 0.8] },
        giniCoefficient:       { decided: [0, 0.0, -0.001, -0.001, -0.002, -0.002, -0.003, -0.003, -0.003], pessimist: [0, 0.0, 0.0, -0.001, -0.001, -0.001, -0.001, -0.001, -0.001] },
        wealthConcentration:   { decided: [0, 0.0, -0.1, -0.2, -0.3, -0.4, -0.5, -0.5, -0.5],   pessimist: [0, 0.0, 0.0, -0.1, -0.1, -0.2, -0.2, -0.2, -0.2] },
        educationAccess:       { decided: [0, 0.0, 0.1, 0.1, 0.2, 0.3, 0.3, 0.3, 0.3],          pessimist: [0, 0.0, 0.0, 0.1, 0.1, 0.1, 0.2, 0.2, 0.2] },
      },
    },
    prerequisites: {
      policiesRequired: ['dec-08', 'dec-19'],
    },
  },

  // ─── Décision 08 — Solaire & éolien à grande échelle ──────────────────
  {
    id: 'dec-08',
    sessionId: 1,
    number: '08',
    status: 'active',
    implementationLag: 3,
    title: 'Déploiement massif du solaire et de l\'éolien : 100% électricité décarbonée d\'ici 26 ans',
    description: `Le solaire photovoltaïque et l'éolien représentent le **plus grand potentiel d'atténuation** parmi toutes les options d'énergie selon AR6 WGIII Figure SPM.6 — plus de **5 GtCO₂eq/an** évitables d'ici 6 ans à un coût inférieur à 20 $/tCO₂. Entre 2010 et 2022, le coût du solaire PV a chuté de **85%**, celui de l'éolien de **55%**. Cette décision mandate : (1) un triplement des capacités renouvelables d'ici 6 ans, (2) la fin des nouvelles centrales fossiles non-abattues, (3) un fonds international de 500 Mds$/an pour les pays en développement. La décarbonation du secteur électrique est le prérequis à toutes les décisions d'électrification (transports, bâtiments, industrie).`,
    options: [
      { id: 'pour',   label: 'Pour',       color: '#00ff88', bgClass: 'bg-eb-green/10',  borderClass: 'border-eb-green/20' },
      { id: 'contre', label: 'Contre',     color: '#ff5050', bgClass: 'bg-red-500/10',   borderClass: 'border-red-500/20'  },
      { id: 'abst',   label: 'Abstention', color: '#475569', bgClass: 'bg-slate-700/30', borderClass: 'border-slate-600/30'},
    ],
    votes: { pour: 1043, contre: 198, abst: 264 },
    consensusThreshold: 67,
    deadline: '2025-09-30T18:00:00Z',
    resources: [
      {
        title: 'GIEC AR6 SYR — Figure 4.4 : Potentiels d\'atténuation par secteur',
        excerpt: 'Le solaire et l\'éolien figurent parmi les options au plus grand potentiel d\'atténuation (>5 GtCO₂/an) et aux coûts les plus bas (<20 $/tCO₂).',
        url: 'https://www.ipcc.ch/report/ar6/syr/',
      },
      {
        title: 'IEA — World Energy Outlook 2024',
        excerpt: 'Le solaire est désormais la technologie de production d\'électricité la moins chère de l\'histoire dans la plupart des régions du monde.',
        url: 'https://www.iea.org/reports/world-energy-outlook-2024',
      },
      {
        title: 'IRENA — Renewable Power Generation Costs 2023',
        excerpt: 'En 2023, 86% des nouvelles capacités renouvelables ajoutées sont moins chères que n\'importe quelle source fossile.',
        url: 'https://www.irena.org/Publications/2024/Sep/Renewable-Power-Generation-Costs-in-2023',
      },
    ],
    // Source : src/data/models/POL_SOLAR_WIND_SCALE_2030.json
    projectedImpact: {
      emissionsReductionGtCO2yr: 5,
      tempReductionC2100: 0.22,
      fullEffectYear: 2050,
      uncertaintyScore: 2,
    },
    prospectiveNarratives: {
      optimistic: {
        horizon: '+10 ans',
        label: 'Scénario Optimiste',
        colorClass: 'text-eb-green',
        borderClass: 'border-eb-green/30',
        text: 'Dans 10 ans, les énergies renouvelables couvrent **72%** de la production électrique mondiale. La chute des coûts de stockage (batteries à 60 $/kWh) a résolu l\'intermittence. Dans les pays du Sahel et d\'Asie du Sud-Est, des micro-réseaux solaires ont apporté l\'électricité à **800 millions** de personnes pour la première fois. Les émissions du secteur électrique mondial ont chuté de **48%** par rapport à 2024. Les emplois dans les renouvelables dépassent pour la première fois ceux des fossiles.',
      },
      moderate: {
        horizon: '+20 ans',
        label: 'Scénario Modéré',
        colorClass: 'text-yellow-400',
        borderClass: 'border-yellow-500/30',
        text: 'Dans 20 ans, le mix électrique mondial est à **58%** renouvelable, mais l\'intégration réseau reste un défi : les pics de production solaire et éolienne sont parfois perdus faute de flexibilité suffisante. Les pays à forte dépendance au charbon (Indonésie, Inde rurale, Afrique du Sud) progressent mais restent à 35% de renouvelables. La réduction nette atteint **–3,8 GtCO₂/an** — sous le potentiel maximal, mais l\'impact est historique.',
      },
      pessimistic: {
        horizon: '+50 ans',
        label: 'Scénario Pessimiste',
        colorClass: 'text-red-400',
        borderClass: 'border-red-500/30',
        text: 'Dans 50 ans, le "paradoxe du rebond énergétique" a partiellement annulé les gains : une électricité moins chère a stimulé une consommation globale accrue (+40%). Certaines régions ont également sous-estimé les besoins en minéraux critiques (lithium, cobalt), freinant le déploiement. Le bilan reste positif (**–0,18°C**), mais la promesse d\'une décarbonation complète du secteur électrique avant 2050 n\'a été atteinte que dans 34 pays sur 195.',
      },
    },
    projections: {
      labels: [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074],
      co2: {
        baseline:  [37.4, 38.8, 40.2, 41.8, 44.8, 49.0, 54.5, 57.0, 59.0],
        decided:   [37.4, 38.5, 39.3, 39.5, 41.9, 45.4, 49, 52.5, 57],
        pessimist: [37.4, 38.7, 39.7, 40.5, 43.1, 46.7, 51, 54.5, 59],
      },
      temperature: {
        baseline:  [1.35, 1.43, 1.52, 1.70, 1.82, 1.94, 2.10, 2.18, 2.32],
        decided:   [1.4, 1.5, 1.6, 1.68, 1.87, 2.07, 2.38, 2.7, 3.05],
        pessimist: [1.4, 1.5, 1.6, 1.71, 1.91, 2.12, 2.49, 2.87, 3.35],
      },
      energyMix: {
        coal:  { decided: [0, -1.0, -2.5, -5.0, -8.0, -11.0, -13.0, -14.5, -15.5], pessimist: [0, -0.6, -1.8, -3.5, -5.5, -7.5, -9.0, -10.5, -11.5] },
        oil:   { decided: [0, -0.5, -1.0, -2.0, -3.0, -5.0,  -6.5,  -7.0,  -7.5 ], pessimist: [0, -0.3, -0.7, -1.5, -2.5, -3.5, -4.5, -5.5, -6.0 ] },
        gas:   { decided: [0, -0.5, -0.8, -1.0, -2.0, -3.0,  -4.0,  -5.0,  -5.5 ], pessimist: [0, -0.3, -0.6, -0.8, -1.5, -2.5, -3.0, -3.5, -4.0 ] },
        solar: { decided: [0, +1.2, +2.5, +4.5, +7.5, +11.0, +13.0, +14.5, +15.5], pessimist: [0, +0.7, +1.8, +3.2, +5.5, +8.0, +9.5, +11.0, +12.0] },
        wind:  { decided: [0, +0.8, +1.8, +3.5, +5.5, +8.0,  +10.5, +12.0, +13.0], pessimist: [0, +0.5, +1.3, +2.6, +4.0, +5.5, +7.0, +8.5,  +9.5 ] },
      },
      resources: {
        minerals:    { decided: [0, +0.5, +1.0, +1.8, +3.0, +4.5, +5.5, +6.0, +6.5], pessimist: [0, +0.3, +0.7, +1.2, +2.0, +3.0, +4.0, +4.5, +5.0] },
        fossilFuels: { decided: [0, -0.3, -0.8, -1.5, -2.5, -3.5, -4.5, -5.5, -6.0], pessimist: [0, -0.2, -0.5, -1.0, -1.8, -2.5, -3.5, -4.0, -4.5] },
      },
    },
  },

  // ─── Décision 09 — Rénovation thermique des bâtiments ─────────────────
  {
    id: 'dec-09',
    sessionId: 1,
    number: '09',
    status: 'active',
    implementationLag: 4,
    title: 'Rénovation thermique universelle des bâtiments d\'ici 26 ans : zéro énergie fossile',
    description: `Le secteur du bâtiment représente **~21% des émissions mondiales** de GES. AR6 WGIII identifie un potentiel de réduction de **67%** de la demande finale d'énergie dans les bâtiments avant même l'électrification supplémentaire. Cette décision impose : (1) des normes de rénovation obligatoires pour tous les bâtiments existants d'ici 26 ans, (2) l'interdiction des nouvelles chaudières fossiles dès la 6e année dans les pays de l'OCDE, (3) des pompes à chaleur comme technologie de référence. Les co-bénéfices sont immenses : réduction de la précarité énergétique, amélioration du confort thermique, création d'emplois non-délocalisables dans le secteur de la construction.`,
    options: [
      { id: 'pour',   label: 'Pour',       color: '#00ff88', bgClass: 'bg-eb-green/10',  borderClass: 'border-eb-green/20' },
      { id: 'contre', label: 'Contre',     color: '#ff5050', bgClass: 'bg-red-500/10',   borderClass: 'border-red-500/20'  },
      { id: 'abst',   label: 'Abstention', color: '#475569', bgClass: 'bg-slate-700/30', borderClass: 'border-slate-600/30'},
    ],
    votes: { pour: 876, contre: 243, abst: 201 },
    consensusThreshold: 67,
    deadline: '2025-11-30T18:00:00Z',
    resources: [
      {
        title: 'GIEC AR6 SYR — Section 4.5.3 : Systèmes urbains et bâtiments',
        excerpt: 'Des conceptions de bâtiments intégrées offrent des exemples croissants de bâtiments à zéro énergie ou zéro carbone dans plusieurs régions.',
        url: 'https://www.ipcc.ch/report/ar6/syr/',
      },
      {
        title: 'AIE — Global Heat Pump Report 2023',
        excerpt: 'Les pompes à chaleur peuvent réduire les émissions de chauffage de 40 à 80% par rapport aux chaudières gaz, selon le mix électrique.',
        url: 'https://www.iea.org/reports/the-future-of-heat-pumps',
      },
      {
        title: 'Commission Européenne — Renovation Wave Strategy',
        excerpt: 'Doubler le taux de rénovation annuel de l\'UE permettrait d\'économiser 14 Mtep/an et de créer 160 000 emplois supplémentaires d\'ici 2030.',
        url: 'https://energy.ec.europa.eu/topics/energy-efficiency/energy-efficient-buildings/renovation-wave_en',
      },
    ],
    // Source : src/data/models/POL_BUILDINGS_RENOVATION.json
    projectedImpact: {
      emissionsReductionGtCO2yr: 2.5,
      tempReductionC2100: 0.1,
      fullEffectYear: 2045,
      uncertaintyScore: 2,
    },
    prospectiveNarratives: {
      optimistic: {
        horizon: '+10 ans',
        label: 'Scénario Optimiste',
        colorClass: 'text-eb-green',
        borderClass: 'border-eb-green/30',
        text: 'Dans 10 ans, **12 millions** de logements par an sont rénovés dans l\'UE, au Royaume-Uni et en Amérique du Nord. Les pompes à chaleur représentent 65% des installations de chauffage neuves. La facture énergétique des ménages rénovés a baissé de **42%** en moyenne. La précarité énergétique a reculé de **35%** dans les pays pionniers. Les émissions mondiales du secteur bâtiment ont chuté de **1,8 GtCO₂** par rapport à 2024.',
      },
      moderate: {
        horizon: '+20 ans',
        label: 'Scénario Modéré',
        colorClass: 'text-yellow-400',
        borderClass: 'border-yellow-500/30',
        text: 'Dans 20 ans, le taux de rénovation global reste insuffisant : seuls **28%** du parc immobilier mondial ont atteint les standards BBC (Bâtiment Basse Consommation). Les obstacles financiers pour les propriétaires modestes persistent malgré les aides. En revanche, les nouvelles constructions sont quasi-toutes à énergie positive dans les pays de l\'OCDE. Le gain net atteint **–2 GtCO₂/an** — significatif, mais la transition complète prendra encore 20 ans.',
      },
      pessimistic: {
        horizon: '+50 ans',
        label: 'Scénario Pessimiste',
        colorClass: 'text-red-400',
        borderClass: 'border-red-500/30',
        text: 'Dans 50 ans, l\'inertie du parc immobilier mondial (durée de vie 50–80 ans par bâtiment) a ralenti la transition. Dans les pays à croissance rapide (Afrique, Asie du Sud), de nouveaux bâtiments mal isolés ont été construits massivement, annulant partiellement les gains des rénovations en Occident. La réduction nette reste positive (**–0,08°C**) mais la déconnexion entre normes votées et réalité du terrain a limité les ambitions.',
      },
    },
    projections: {
      labels: [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074],
      co2: {
        baseline:  [37.4, 38.8, 40.2, 41.8, 44.8, 49.0, 54.5, 57.0, 59.0],
        decided:   [37.4, 38.7, 39.7, 40.5, 43.1, 46.7, 51.3, 55.1, 60],
        pessimist: [37.4, 38.9, 40.1, 41.2, 43.9, 47.7, 52.2, 56, 60.8],
      },
      temperature: {
        baseline:  [1.35, 1.43, 1.52, 1.70, 1.82, 1.94, 2.10, 2.18, 2.32],
        decided:   [1.4, 1.5, 1.6, 1.71, 1.93, 2.15, 2.5, 2.88, 3.38],
        pessimist: [1.4, 1.5, 1.6, 1.72, 1.94, 2.18, 2.55, 2.95, 3.44],
      },
    },
    prerequisites: {
      policiesRequired: ['dec-08'],
    },
  },

  // ─── Décision 10 — Économie circulaire dans l'industrie ───────────────
  {
    id: 'dec-10',
    sessionId: 1,
    number: '10',
    status: 'active',
    implementationLag: 5,
    title: 'Économie circulaire et efficacité matière dans l\'industrie mondiale',
    description: `L'industrie représente **~24% des émissions mondiales** de GES. AR6 WGIII identifie l'efficacité matière, la circularité et la substitution des matériaux de construction comme des options d'atténuation cumulant **~2 GtCO₂eq/an** d'ici 6 ans. Cette décision cible : (1) des standards d'écoconception obligatoires pour tous les produits manufacturés (durabilité, réparabilité, recyclabilité), (2) un objectif de **50% de taux de recyclage** des matériaux critiques (acier, aluminium, ciment, plastiques) d'ici 11 ans, (3) des incitations fiscales à l'utilisation de matériaux biosourcés en substitution du béton et de l'acier primaire. L'acier recyclé émet **75% moins** de CO₂ que l'acier primaire au haut fourneau.`,
    options: [
      { id: 'pour',   label: 'Pour',       color: '#00ff88', bgClass: 'bg-eb-green/10',  borderClass: 'border-eb-green/20' },
      { id: 'contre', label: 'Contre',     color: '#ff5050', bgClass: 'bg-red-500/10',   borderClass: 'border-red-500/20'  },
      { id: 'abst',   label: 'Abstention', color: '#475569', bgClass: 'bg-slate-700/30', borderClass: 'border-slate-600/30'},
    ],
    votes: { pour: 712, contre: 334, abst: 198 },
    consensusThreshold: 67,
    deadline: '2026-03-31T18:00:00Z',
    resources: [
      {
        title: 'GIEC AR6 SYR — Section 4.5.2 : Industrie et efficacité matière',
        excerpt: 'L\'efficacité matière, la circularité et la substitution de matériaux de construction peuvent réduire significativement les émissions industrielles à court terme.',
        url: 'https://www.ipcc.ch/report/ar6/syr/',
      },
      {
        title: 'Ellen MacArthur Foundation — The Circular Economy',
        excerpt: 'Une économie circulaire mondiale pourrait réduire les émissions industrielles de 9,3 GtCO₂eq/an d\'ici 2050 et générer 4,5 trillions de dollars de valeur économique.',
        url: 'https://www.ellenmacarthurfoundation.org/the-circular-economy-in-detail',
      },
      {
        title: 'UNEP — Global Resources Outlook 2024',
        excerpt: 'L\'extraction mondiale de matériaux a triplé depuis 1970. L\'efficacité des ressources est indispensable pour respecter les limites planétaires.',
        url: 'https://www.unep.org/resources/report/global-resources-outlook-2024',
      },
    ],
    // Source : src/data/models/POL_CIRCULAR_ECONOMY_INDUSTRY.json
    projectedImpact: {
      emissionsReductionGtCO2yr: 2,
      tempReductionC2100: 0.08,
      fullEffectYear: 2040,
      uncertaintyScore: 3,
    },
    prospectiveNarratives: {
      optimistic: {
        horizon: '+10 ans',
        label: 'Scénario Optimiste',
        colorClass: 'text-eb-green',
        borderClass: 'border-eb-green/30',
        text: 'Dans 10 ans, l\'écoconception est devenue la norme dans les secteurs de l\'électronique, de l\'automobile et de la construction en Europe et en Asie du Nord-Est. Les taux de recyclage de l\'aluminium atteignent **85%** (contre 35% en 2024). Les matériaux biosourcés (bois massif, bambou, chanvre) représentent **18%** des nouvelles constructions mondiales. L\'empreinte matière par habitant a reculé de **22%** dans les pays de l\'OCDE.',
      },
      moderate: {
        horizon: '+20 ans',
        label: 'Scénario Modéré',
        colorClass: 'text-yellow-400',
        borderClass: 'border-yellow-500/30',
        text: 'Dans 20 ans, la transition vers l\'économie circulaire est bien amorcée dans les pays développés, mais les pays émergents peinent à accéder aux technologies de tri et de recyclage. Le commerce international de déchets a créé de nouvelles inégalités environnementales. La réduction nette atteint **–1,5 GtCO₂/an** — inférieure au potentiel, mais la transformation des chaînes de valeur industrielles est irréversible.',
      },
      pessimistic: {
        horizon: '+50 ans',
        label: 'Scénario Pessimiste',
        colorClass: 'text-red-400',
        borderClass: 'border-red-500/30',
        text: 'Dans 50 ans, l\'essor de la demande mondiale de matériaux lié à la construction d\'infrastructures dans les pays émergents (+4 milliards d\'habitants en 2100) a compensé les gains d\'efficacité. Le béton reste le matériau de construction dominant faute d\'alternatives à coût comparable à grande échelle. Le bénéfice climatique reste limité (**–0,05°C**) sans mesures complémentaires sur la production primaire.',
      },
    },
    projections: {
      labels: [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074],
      co2: {
        baseline:  [37.4, 38.8, 40.2, 41.8, 44.8, 49.0, 54.5, 57.0, 59.0],
        decided:   [37.4, 38.8, 39.9, 41, 43.6, 47.2, 51.8, 55.5, 60.2],
        pessimist: [37.4, 38.9, 40.2, 41.5, 44.3, 48, 52.5, 56.2, 61],
      },
      temperature: {
        baseline:  [1.35, 1.43, 1.52, 1.70, 1.82, 1.94, 2.10, 2.18, 2.32],
        decided:   [1.4, 1.5, 1.6, 1.72, 1.94, 2.17, 2.56, 2.95, 3.43],
        pessimist: [1.4, 1.5, 1.6, 1.72, 1.95, 2.19, 2.58, 2.97, 3.45],
      },
      resources: {
        minerals: { decided: [0, -0.5, -1.2, -2.0, -3.5, -5.5, -7.0, -8.0, -9.0], pessimist: [0, -0.3, -0.7, -1.3, -2.5, -4.0, -5.0, -6.0, -7.0] },
        biomass:  { decided: [0, -0.2, -0.5, -0.9, -1.5, -2.0, -2.5, -3.0, -3.5], pessimist: [0, -0.1, -0.3, -0.6, -1.0, -1.5, -1.8, -2.2, -2.5] },
      },
    },
  },

  // ─── Décision 11 — CCS pour l'industrie lourde ────────────────────────
  {
    id: 'dec-11',
    sessionId: 1,
    number: '11',
    implementationLag: 7,
    status: 'active',
    title: 'Déploiement du captage et stockage du carbone (CCS) pour l\'industrie lourde d\'ici 26 ans',
    description: `Certains secteurs industriels — ciment, acier, chimie, raffinage — produisent des émissions de CO₂ **incompressibles** par les seuls leviers d'efficacité et d'électrification. Le CCS (Carbon Capture and Storage) est la seule technologie permettant leur décarbonation profonde. AR6 WGIII estime le potentiel du CCS industriel à **3–4 GtCO₂/an** d'ici 26 ans. Cette décision mandate : (1) l'obligation de CCS sur toutes les nouvelles installations cimentières et sidérurgiques dès la 6e année, (2) un réseau mondial de pipelines CO₂ et de sites de stockage géologique certifiés, (3) un mécanisme de prix carbone minimal de **80 $/tCO₂** pour rendre le CCS compétitif. Actuellement, seuls 50 MtCO₂/an sont captés — il faudra multiplier par 100.`,
    options: [
      { id: 'pour',   label: 'Pour',       color: '#00ff88', bgClass: 'bg-eb-green/10',  borderClass: 'border-eb-green/20' },
      { id: 'contre', label: 'Contre',     color: '#ff5050', bgClass: 'bg-red-500/10',   borderClass: 'border-red-500/20'  },
      { id: 'abst',   label: 'Abstention', color: '#475569', bgClass: 'bg-slate-700/30', borderClass: 'border-slate-600/30'},
    ],
    votes: { pour: 598, contre: 487, abst: 264 },
    consensusThreshold: 67,
    deadline: '2026-06-30T18:00:00Z',
    resources: [
      {
        title: 'GIEC AR6 SYR — Section 5 : Captage et stockage du CO₂',
        excerpt: 'Le CCS est une option pour réduire les émissions des grandes sources d\'énergie fossile et d\'industrie lorsqu\'un stockage géologique est disponible.',
        url: 'https://www.ipcc.ch/report/ar6/syr/',
      },
      {
        title: 'IEA — CCUS in Clean Energy Transitions 2024',
        excerpt: 'Pour atteindre le Net Zéro en 2050, les capacités mondiales de CCS doivent passer de 50 MtCO₂/an à plus de 7,6 GtCO₂/an.',
        url: 'https://www.iea.org/reports/ccus-in-clean-energy-transitions',
      },
      {
        title: 'Global CCS Institute — Status of CCS Report 2024',
        excerpt: '41 projets commerciaux de CCS sont opérationnels dans le monde en 2024, représentant 49 Mt de capacité de captage par an.',
        url: 'https://www.globalccsinstitute.com/resources/global-status-of-ccs-2024/',
      },
    ],
    // Source : src/data/models/POL_INDUSTRIAL_CCS.json
    projectedImpact: {
      emissionsReductionGtCO2yr: 3.5,
      tempReductionC2100: 0.14,
      fullEffectYear: 2050,
      uncertaintyScore: 3,
    },
    prospectiveNarratives: {
      optimistic: {
        horizon: '+10 ans',
        label: 'Scénario Optimiste',
        colorClass: 'text-eb-green',
        borderClass: 'border-eb-green/30',
        text: 'Dans 10 ans, **850 MtCO₂/an** sont captés et stockés dans les formations géologiques profondes, notamment dans les anciens gisements de pétrole et de gaz de la Mer du Nord, du Golfe Persique et du Bassin du Permien. Les premiers hubs industriels CCS (Dunkerque, Rotterdam, Houston) opèrent à pleine capacité. Le coût de captage est tombé à **45 $/tCO₂** grâce aux effets d\'apprentissage. Les émissions du ciment et de l\'acier ont baissé de **22%**.',
      },
      moderate: {
        horizon: '+20 ans',
        label: 'Scénario Modéré',
        colorClass: 'text-yellow-400',
        borderClass: 'border-yellow-500/30',
        text: 'Dans 20 ans, 2,5 GtCO₂/an sont captés — la montée en puissance est réelle mais en dessous des trajectoires Net Zéro. Les problèmes de permanence du stockage (fuites potentielles, surveillance) alimentent la méfiance du public. Certains pays utilisent le CCS comme prétexte pour retarder la transition vers les renouvelables. Le bénéfice net reste substantiel (**–0,10°C**) mais la controverse politique freine le déploiement à grande échelle.',
      },
      pessimistic: {
        horizon: '+50 ans',
        label: 'Scénario Pessimiste',
        colorClass: 'text-red-400',
        borderClass: 'border-red-500/30',
        text: 'Dans 50 ans, le CCS s\'est développé mais reste prisonnier d\'une contradiction structurelle : les plus grands bénéficiaires de la technologie sont les industries fossiles, qui l\'ont utilisée pour prolonger leur activité plutôt que pour décarboner l\'économie. Les fuites de CO₂ dans certains sites mal sélectionnés ont alimenté la controverse. Le bilan net (**–0,08°C**) est inférieur aux projections — le CCS seul ne peut pas résoudre le problème climatique.',
      },
    },
    projections: {
      labels: [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074],
      co2: {
        baseline:  [37.4, 38.8, 40.2, 41.8, 44.8, 49.0, 54.5, 57.0, 59.0],
        decided:   [37.4, 38.7, 40.0, 41.0, 43.4, 46.5, 50.3, 54.0, 58.3],
        pessimist: [37.4, 38.8, 40.2, 41.5, 44.1, 47.5, 51.8, 55.3, 60.0],
      },
      temperature: {
        baseline:  [1.35, 1.43, 1.52, 1.70, 1.82, 1.94, 2.10, 2.18, 2.32],
        decided:   [1.35, 1.43, 1.52, 1.70, 1.81, 2.13, 2.47, 2.84, 3.31],
        pessimist: [1.35, 1.43, 1.52, 1.70, 1.82, 2.16, 2.53, 2.91, 3.40],
      },
    },
    prerequisites: {
      policiesRequired: ['dec-07'],
    },
  },

  // ─── Décision 12 — Expansion du nucléaire ─────────────────────────────
  {
    id: 'dec-12',
    sessionId: 1,
    number: '12',
    implementationLag: 10,
    status: 'active',
    title: 'Expansion du nucléaire comme énergie de base décarbonée : doublement des capacités d\'ici 2050',
    description: `Le nucléaire produit **~10%** de l'électricité mondiale avec des émissions de cycle de vie parmi les plus basses de toutes les sources d'énergie (~12 gCO₂eq/kWh, comparable à l'éolien). AR6 WGIII identifie l'expansion nucléaire comme une option d'atténuation de **~1,5 GtCO₂eq/an** d'ici 2050. Cette décision propose : (1) un programme mondial de construction de nouveaux réacteurs (dont SMR — petits réacteurs modulaires) dans les pays disposant d'un cadre réglementaire robuste, (2) la prolongation de la durée de vie des réacteurs existants sûrs de 20 ans supplémentaires, (3) un traité de non-prolifération renforcé pour les nouvelles nations nucléaires civiles. Option controversée : coûts élevés, risques de sûreté, gestion des déchets, opposition publique dans certains pays.`,
    options: [
      { id: 'pour',   label: 'Pour',       color: '#00ff88', bgClass: 'bg-eb-green/10',  borderClass: 'border-eb-green/20' },
      { id: 'contre', label: 'Contre',     color: '#ff5050', bgClass: 'bg-red-500/10',   borderClass: 'border-red-500/20'  },
      { id: 'abst',   label: 'Abstention', color: '#475569', bgClass: 'bg-slate-700/30', borderClass: 'border-slate-600/30'},
    ],
    votes: { pour: 541, contre: 612, abst: 298 },
    consensusThreshold: 67,
    deadline: '2026-09-30T18:00:00Z',
    resources: [
      {
        title: 'GIEC AR6 SYR — Figure 4.4 : Options d\'atténuation dans le secteur électrique',
        excerpt: 'Le nucléaire figure parmi les options d\'atténuation du secteur électrique avec un potentiel d\'environ 1–1,5 GtCO₂/an en 2030.',
        url: 'https://www.ipcc.ch/report/ar6/syr/',
      },
      {
        title: 'AIE — Nuclear Power and Secure Energy Transitions 2022',
        excerpt: 'Le nucléaire existant fournit la plus grande source d\'électricité bas-carbone au monde. Sa prolongation est la mesure la moins coûteuse pour maintenir l\'énergie propre.',
        url: 'https://www.iea.org/reports/nuclear-power-and-secure-energy-transitions',
      },
      {
        title: 'AIEA — Nuclear Energy for a Net Zero World',
        excerpt: 'Atteindre la neutralité carbone en 2050 nécessiterait de doubler ou tripler la capacité nucléaire mondiale installée.',
        url: 'https://www.iaea.org/topics/nuclear-power',
      },
    ],
    // Source : src/data/models/POL_NUCLEAR_EXPANSION.json
    projectedImpact: {
      emissionsReductionGtCO2yr: 1.5,
      tempReductionC2100: 0.07,
      fullEffectYear: 2050,
      uncertaintyScore: 3,
    },
    prospectiveNarratives: {
      optimistic: {
        horizon: '+10 ans',
        label: 'Scénario Optimiste',
        colorClass: 'text-eb-green',
        borderClass: 'border-eb-green/30',
        text: 'Dans 10 ans, les premiers SMR (Small Modular Reactors) de nouvelle génération sont opérationnels en Pologne, en Corée du Sud et au Canada. La prolongation de **45 réacteurs** existants en Europe et aux États-Unis a évité l\'émission de **400 MtCO₂** supplémentaires. La Chine a ajouté 40 GW de capacité nucléaire supplémentaire, dépassant tous les autres pays. Le coût de construction des SMR chute grâce à la standardisation modulaire.',
      },
      moderate: {
        horizon: '+20 ans',
        label: 'Scénario Modéré',
        colorClass: 'text-yellow-400',
        borderClass: 'border-yellow-500/30',
        text: 'Dans 20 ans, le nucléaire contribue à **13%** du mix électrique mondial (contre 10% en 2024), une progression réelle mais modeste. Les délais de construction (10–15 ans pour les grands réacteurs) et les dépassements de budget (Flamanville, Hinkley Point C) ont ralenti le déploiement. La contribution nette reste **–1 GtCO₂/an** — utile mais insuffisant pour porter seul la décarbonation du système électrique.',
      },
      pessimistic: {
        horizon: '+50 ans',
        label: 'Scénario Pessimiste',
        colorClass: 'text-red-400',
        borderClass: 'border-red-500/30',
        text: 'Dans 50 ans, la question des déchets nucléaires de haute activité n\'est toujours pas résolue dans la plupart des pays : seule la Finlande dispose d\'un site de stockage géologique profond opérationnel. Un accident nucléaire majeur dans un pays à cadre réglementaire insuffisant a déclenché un retrait mondial. La contribution du nucléaire reste positive mais marginale (**–0,04°C**) face à la montée en puissance bien plus rapide du solaire et de l\'éolien.',
      },
    },
    projections: {
      labels: [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074],
      co2: {
        baseline:  [37.4, 38.8, 40.2, 41.8, 44.8, 49.0, 54.5, 57.0, 59.0],
        decided:   [37.4, 38.7, 39.9, 41.5, 44.1, 47.7, 52.3, 55.8, 60.8],
        pessimist: [37.4, 38.8, 40.1, 41.6, 44.5, 48.2, 52.8, 56.3, 61.3],
      },
      temperature: {
        baseline:  [1.35, 1.43, 1.52, 1.70, 1.82, 1.94, 2.10, 2.18, 2.32],
        decided:   [1.35, 1.43, 1.52, 1.70, 1.82, 2.19, 2.56, 2.94, 3.43],
        pessimist: [1.35, 1.43, 1.52, 1.70, 1.82, 2.2, 2.59, 2.98, 3.48],
      },
      energyMix: {
        nuclear: { decided: [0, 0, +0.2, +0.5, +1.5, +2.5, +3.5, +4.0, +4.5], pessimist: [0, 0, +0.1, +0.2, +0.8, +1.5, +2.0, +2.5, +3.0] },
        coal:    { decided: [0, 0, -0.1, -0.3, -0.9, -1.5, -2.0, -2.5, -3.0], pessimist: [0, 0, -0.1, -0.1, -0.5, -0.9, -1.2, -1.5, -2.0] },
        gas:     { decided: [0, 0, -0.1, -0.2, -0.6, -1.0, -1.5, -1.5, -1.5], pessimist: [0, 0,  0,   -0.1, -0.3, -0.6, -0.8, -1.0, -1.0] },
      },
      resources: {
        minerals:    { decided: [0, 0, +0.1, +0.3, +0.6, +1.0, +1.5, +1.8, +2.0], pessimist: [0, 0, +0.1, +0.2, +0.4, +0.7, +1.0, +1.2, +1.5] },
        fossilFuels: { decided: [0, 0, -0.1, -0.2, -0.4, -0.7, -1.0, -1.2, -1.5], pessimist: [0, 0, -0.1, -0.1, -0.2, -0.4, -0.6, -0.8, -1.0] },
      },
    },
    prerequisites: {
      policiesRequired: ['dec-05'],
    },
  },

  // ─── Décision 13 — Phase-out des gaz fluorés ───────────────────────────
  {
    id: 'dec-13',
    sessionId: 1,
    number: '13',
    implementationLag: 3,
    status: 'active',
    title: 'Phase-out mondial des gaz fluorés à effet de serre (Amendement de Kigali étendu)',
    description: `Les gaz fluorés — HFC, PFC, SF₆ — sont des GES au **potentiel de réchauffement 1 000 à 23 000 fois** supérieur au CO₂. Principalement utilisés dans la réfrigération, la climatisation, les mousses isolantes et les semi-conducteurs, ils représentent ~1,5 GtCO₂eq/an (2024). L'Amendement de Kigali (2016) prévoit une réduction de 80% des HFC d'ici 2050, mais cette décision va plus loin : (1) accélération du calendrier — réduction de **85% d'ici 12 ans**, (2) extension aux PFC et SF₆ non couverts, (3) transfert de technologies de substitution (HFO, CO₂ naturel, ammoniac) vers les pays en développement. C'est l'une des mesures les plus **coût-efficaces** de l'ensemble du catalogue.`,
    options: [
      { id: 'pour',   label: 'Pour',       color: '#00ff88', bgClass: 'bg-eb-green/10',  borderClass: 'border-eb-green/20' },
      { id: 'contre', label: 'Contre',     color: '#ff5050', bgClass: 'bg-red-500/10',   borderClass: 'border-red-500/20'  },
      { id: 'abst',   label: 'Abstention', color: '#475569', bgClass: 'bg-slate-700/30', borderClass: 'border-slate-600/30'},
    ],
    votes: { pour: 1089, contre: 134, abst: 127 },
    consensusThreshold: 67,
    deadline: '2025-04-22T18:00:00Z',
    resources: [
      {
        title: 'GIEC AR6 SYR — Figure 4.4 : Réduction des gaz fluorés',
        excerpt: 'La réduction des émissions de gaz fluorés représente ~1,5 GtCO₂eq/an de potentiel d\'atténuation d\'ici 2030 à faible coût.',
        url: 'https://www.ipcc.ch/report/ar6/syr/',
      },
      {
        title: 'PNUE — Évaluation de Kigali 2023',
        excerpt: 'L\'Amendement de Kigali pourrait éviter jusqu\'à 0,5°C de réchauffement d\'ici 2100 si pleinement mis en œuvre.',
        url: 'https://www.unep.org/resources/report/2023-assessment-report-kigali-amendment',
      },
      {
        title: 'Climate & Clean Air Coalition — HFC Factsheet',
        excerpt: 'Le remplacement des HFC par des alternatives à faible PRG (HFO, CO₂, ammoniac) est techniquement mature dans tous les principaux secteurs d\'application.',
        url: 'https://www.ccacoalition.org/short-lived-climate-pollutants/hfcs',
      },
    ],
    // Source : src/data/models/POL_FGAS_PHASEOUT_KIGALI.json
    projectedImpact: {
      emissionsReductionGtCO2yr: 1.5,
      tempReductionC2100: 0.08,
      fullEffectYear: 2036,
      uncertaintyScore: 1,
    },
    prospectiveNarratives: {
      optimistic: {
        horizon: '+10 ans',
        label: 'Scénario Optimiste',
        colorClass: 'text-eb-green',
        borderClass: 'border-eb-green/30',
        text: 'Dans 10 ans, grâce à l\'accélération du calendrier de Kigali, les émissions mondiales de HFC ont chuté de **72%** par rapport à 2019. Les alternatives naturelles (CO₂ en supercritique, ammoniac) dominent les nouvelles installations de réfrigération commerciale et industrielle. Le secteur de la climatisation automobile est passé à **98%** de fluides à faible PRG. Le transfert de technologies vers l\'Inde, l\'Afrique et l\'Asie du Sud-Est a été un succès diplomatique majeur.',
      },
      moderate: {
        horizon: '+20 ans',
        label: 'Scénario Modéré',
        colorClass: 'text-yellow-400',
        borderClass: 'border-yellow-500/30',
        text: 'Dans 20 ans, la réduction des HFC est bien avancée (**–68%** vs 2019) mais les PFC et SF₆ — utilisés dans les équipements électriques haute tension et les semi-conducteurs — restent difficiles à substituer. L\'essor de la climatisation dans les pays chauds à revenus croissants (Inde, Nigéria, Indonésie) a partiellement compensé les réductions. Le bilan reste très positif avec **–1,2 GtCO₂eq/an** de réduction effective.',
      },
      pessimistic: {
        horizon: '+50 ans',
        label: 'Scénario Pessimiste',
        colorClass: 'text-red-400',
        borderClass: 'border-red-500/30',
        text: 'Dans 50 ans, les émissions de gaz fluorés ont été largement maîtrisées pour les HFC, mais l\'explosion mondiale de la climatisation (projections : 4 milliards d\'appareils en 2050 contre 1,9 milliard en 2020) a créé un nouveau problème : les fuites d\'HFO de nouvelle génération, dont certains se dégradent en PFAS (polluants éternels) dans l\'atmosphère. La substitution des gaz fluorés a résolu un problème climatique pour en créer partiellement un autre.',
      },
    },
    projections: {
      labels: [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074],
      co2: {
        baseline:  [37.4, 38.8, 40.2, 41.8, 44.8, 49.0, 54.5, 57.0, 59.0],
        decided:   [37.4, 38.5, 39.6, 40.8, 43.6, 47.7, 52.4, 56.4, 61.4],
        pessimist: [37.4, 38.8, 40, 41.3, 44.1, 48.1, 52.8, 56.7, 61.6],
      },
      temperature: {
        baseline:  [1.35, 1.43, 1.52, 1.70, 1.82, 1.94, 2.10, 2.18, 2.32],
        decided:   [1.4, 1.49, 1.58, 1.7, 1.92, 2.17, 2.56, 2.94, 3.42],
        pessimist: [1.4, 1.5, 1.59, 1.71, 1.94, 2.19, 2.58, 2.97, 3.46],
      },
    },
  },

  // ─── Décision 14 — Réduction du gaspillage alimentaire ────────────────
  {
    id: 'dec-14',
    sessionId: 1,
    number: '14',
    implementationLag: 5,
    status: 'active',
    title: 'Réduction de 50% du gaspillage alimentaire mondial d\'ici 6 ans (ODD 12.3)',
    description: `**1/3 de toute la nourriture produite** dans le monde est gaspillée ou perdue, représentant ~2 GtCO₂eq/an (AR6 WGIII Fig 4.4). Si le gaspillage alimentaire était un pays, ce serait le **3ème émetteur mondial** de GES. Cette décision adopte l'objectif ODD 12.3 — réduire de **50% les pertes et gaspillages d'ici 6 ans** — via : (1) des normes d'étiquetage et de conservation améliorées, (2) des infrastructures de froid et logistiques dans les pays en développement (50–70% des pertes sont post-récolte), (3) des campagnes de sensibilisation dans les pays riches (40–50% du gaspillage est au niveau du consommateur). Co-bénéfices : sécurité alimentaire mondiale, réduction de la pression foncière, eau et biodiversité.`,
    options: [
      { id: 'pour',   label: 'Pour',       color: '#00ff88', bgClass: 'bg-eb-green/10',  borderClass: 'border-eb-green/20' },
      { id: 'contre', label: 'Contre',     color: '#ff5050', bgClass: 'bg-red-500/10',   borderClass: 'border-red-500/20'  },
      { id: 'abst',   label: 'Abstention', color: '#475569', bgClass: 'bg-slate-700/30', borderClass: 'border-slate-600/30'},
    ],
    votes: { pour: 934, contre: 189, abst: 227 },
    consensusThreshold: 67,
    deadline: '2025-10-16T18:00:00Z',
    resources: [
      {
        title: 'GIEC AR6 SYR — Figure 4.4 : Réduction des pertes et gaspillages alimentaires',
        excerpt: 'La réduction du gaspillage alimentaire est identifiée comme une option d\'atténuation avec ~2 GtCO₂eq/an de potentiel d\'ici 2030.',
        url: 'https://www.ipcc.ch/report/ar6/syr/',
      },
      {
        title: 'FAO — The State of Food and Agriculture 2019',
        excerpt: '14% des aliments produits dans le monde sont perdus entre la récolte et la vente au détail ; 17% supplémentaires sont gaspillés au niveau des ménages et de la restauration.',
        url: 'https://www.fao.org/publications/sofa/2019/en/',
      },
      {
        title: 'UNEP — Food Waste Index Report 2024',
        excerpt: 'Le gaspillage alimentaire au niveau des ménages représente 631 millions de tonnes/an — la lutte contre ce gaspillage pourrait réduire les émissions de 1 GtCO₂/an.',
        url: 'https://www.unep.org/resources/report/unep-food-waste-index-report-2024',
      },
    ],
    // Source : src/data/models/POL_FOOD_WASTE_REDUCTION.json
    projectedImpact: {
      emissionsReductionGtCO2yr: 2,
      tempReductionC2100: 0.08,
      fullEffectYear: 2040,
      uncertaintyScore: 3,
    },
    prospectiveNarratives: {
      optimistic: {
        horizon: '+10 ans',
        label: 'Scénario Optimiste',
        colorClass: 'text-eb-green',
        borderClass: 'border-eb-green/30',
        text: 'Dans 10 ans, l\'objectif ODD 12.3 est atteint dans **42 pays** représentant 65% du PIB mondial. Les chaînes du froid ont été déployées dans 38 pays d\'Afrique subsaharienne et d\'Asie du Sud, réduisant les pertes post-récolte de **58%**. En Europe et en Amérique du Nord, la combinaison d\'applications anti-gaspillage (Too Good To Go, Phenix) et de nouvelles réglementations sur les DLC (dates limites de consommation) a réduit le gaspillage ménager de **40%**.',
      },
      moderate: {
        horizon: '+20 ans',
        label: 'Scénario Modéré',
        colorClass: 'text-yellow-400',
        borderClass: 'border-yellow-500/30',
        text: 'Dans 20 ans, le gaspillage alimentaire a reculé de **32%** globalement — en deçà de l\'objectif mais significatif. Le principal obstacle reste l\'adéquation entre offre et demande dans la grande distribution : les promotions commerciales et les achats impulsifs restent des drivers de gaspillage difficiles à traiter par régulation. Dans les pays à forte croissance économique, la transition alimentaire (accès à davantage de produits frais) a temporairement augmenté le gaspillage.',
      },
      pessimistic: {
        horizon: '+50 ans',
        label: 'Scénario Pessimiste',
        colorClass: 'text-red-400',
        borderClass: 'border-red-500/30',
        text: 'Dans 50 ans, malgré des progrès réels, l\'essor des systèmes alimentaires mondialisés ultra-transformés a créé de nouveaux types de gaspillage invisibles (pertes en amont de la chaîne industrielle, invendus hors-statistiques). Le gain climatique net reste modeste (**–0,05°C**) : les émissions liées à l\'agriculture ont continué à croître avec la demande mondiale de protéines animales, dominant le bilan AFOLU.',
      },
    },
    projections: {
      labels: [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074],
      co2: {
        baseline:  [37.4, 38.8, 40.2, 41.8, 44.8, 49.0, 54.5, 57.0, 59.0],
        decided:   [37.4, 38.7, 39.8, 40.9, 43.5, 47.2, 51.8, 55.7, 60.6],
        pessimist: [37.4, 38.9, 40.2, 41.5, 44.2, 48, 52.5, 56.3, 61.1],
      },
      temperature: {
        baseline:  [1.35, 1.43, 1.52, 1.70, 1.82, 1.94, 2.10, 2.18, 2.32],
        decided:   [1.4, 1.5, 1.6, 1.71, 1.94, 2.17, 2.56, 2.95, 3.43],
        pessimist: [1.4, 1.5, 1.6, 1.72, 1.95, 2.19, 2.57, 2.97, 3.46],
      },
      // Impact sociétal — Source : POL_FOOD_WASTE_REDUCTION.json societal_indicators
      societal: {
        foodSecurity:          { decided: [0, 0.3, 0.7, 1.0, 1.3, 1.4, 1.5, 1.5, 1.5],        pessimist: [0, 0.1, 0.2, 0.4, 0.5, 0.5, 0.5, 0.5, 0.5] },
        resourceConflicts:     { decided: [0, -0.2, -0.4, -0.7, -1.0, -1.3, -2.0, -2.0, -2.0], pessimist: [0, -0.1, -0.2, -0.3, -0.4, -0.5, -1.0, -1.0, -1.0] },
        waterTensions:         { decided: [0, -0.1, -0.3, -0.5, -0.7, -0.9, -1.0, -1.0, -1.0], pessimist: [0, 0.0, -0.1, -0.2, -0.3, -0.4, -0.5, -0.5, -0.5] },
        climateMigrations:     { decided: [0, -0.1, -0.3, -0.5, -0.7, -0.9, -1.0, -1.0, -1.0], pessimist: [0, 0.0, -0.1, -0.2, -0.3, -0.4, -0.5, -0.5, -0.5] },
        lifeExpectancy:        { decided: [0, 0.0, 0.1, 0.1, 0.2, 0.2, 0.2, 0.2, 0.2],         pessimist: [0, 0.0, 0.0, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1] },
        respiratoryDiseases:   { decided: [0, -0.1, -0.3, -0.6, -1.0, -1.3, -1.5, -1.5, -1.5], pessimist: [0, 0.0, -0.1, -0.3, -0.5, -0.6, -0.7, -0.7, -0.7] },
        whoHealthIndex:        { decided: [0, 0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.5, 0.5],         pessimist: [0, 0.0, 0.0, 0.1, 0.2, 0.2, 0.3, 0.3, 0.3] },
        giniCoefficient:       { decided: [0, -0.001, -0.002, -0.002, -0.003, -0.003, -0.004, -0.004, -0.004], pessimist: [0, 0.0, -0.001, -0.001, -0.001, -0.002, -0.002, -0.002, -0.002] },
        wealthConcentration:   { decided: [0, -0.1, -0.2, -0.3, -0.4, -0.4, -0.5, -0.5, -0.5],  pessimist: [0, 0.0, -0.1, -0.1, -0.2, -0.2, -0.2, -0.2, -0.2] },
        educationAccess:       { decided: [0, 0.0, 0.1, 0.1, 0.2, 0.3, 0.3, 0.3, 0.3],          pessimist: [0, 0.0, 0.0, 0.1, 0.1, 0.1, 0.2, 0.2, 0.2] },
      },
    },
  },

  // ─── Décision 15 — Agroforesterie et carbone des sols ─────────────────
  {
    id: 'dec-15',
    sessionId: 1,
    number: '15',
    implementationLag: 5,
    status: 'active',
    title: 'Agroforesterie mondiale et séquestration du carbone dans les sols agricoles',
    description: `Les sols agricoles mondiaux ont perdu **50 à 70%** de leur stock de carbone organique depuis le début de l'agriculture intensive. AR6 WGIII identifie la séquestration carbone dans l'agriculture — via l'agroforesterie, le carbone des sols, les cultures de couverture, l'agriculture de conservation — comme une option cumulant **~2,5 GtCO₂eq/an** d'ici 6 ans. Cette décision : (1) mandate un programme mondial d'agroforesterie sur **500 millions d'hectares** d'ici 11 ans (arbres intégrés aux cultures et prairies), (2) instaure des paiements pour la séquestration carbone des sols vérifiable par satellite, (3) finance la transition vers l'agriculture régénératrice dans les pays en développement. Avantage décisif : la séquestration carbone des sols améliore simultanément la fertilité, la rétention d'eau et la résilience aux sécheresses.`,
    options: [
      { id: 'pour',   label: 'Pour',       color: '#00ff88', bgClass: 'bg-eb-green/10',  borderClass: 'border-eb-green/20' },
      { id: 'contre', label: 'Contre',     color: '#ff5050', bgClass: 'bg-red-500/10',   borderClass: 'border-red-500/20'  },
      { id: 'abst',   label: 'Abstention', color: '#475569', bgClass: 'bg-slate-700/30', borderClass: 'border-slate-600/30'},
    ],
    votes: { pour: 867, contre: 212, abst: 241 },
    consensusThreshold: 67,
    deadline: '2026-01-31T18:00:00Z',
    resources: [
      {
        title: 'GIEC AR6 SYR — Figure 4.4 : Séquestration carbone dans l\'agriculture',
        excerpt: 'La séquestration carbone dans les sols agricoles et l\'agroforesterie sont les seules pratiques CDR largement déployables à court terme.',
        url: 'https://www.ipcc.ch/report/ar6/syr/',
      },
      {
        title: 'GIEC SRCCL — Rapport spécial sur les terres',
        excerpt: 'L\'agroforesterie et la gestion durable des terres peuvent contribuer à l\'atténuation tout en améliorant la sécurité alimentaire et la biodiversité.',
        url: 'https://www.ipcc.ch/srccl/',
      },
      {
        title: 'Rodale Institute — White Paper : Regenerative Organic Agriculture',
        excerpt: 'En convertissant l\'ensemble des terres agricoles mondiales à des pratiques régénératrices, il serait possible de séquestrer plus de 100% des émissions mondiales actuelles de CO₂.',
        url: 'https://rodaleinstitute.org/why-organic/organic-basics/regenerative-organic-agriculture/',
      },
    ],
    // Source : src/data/models/POL_AGROFORESTRY_SOILCARBON.json
    projectedImpact: {
      emissionsReductionGtCO2yr: 2.5,
      tempReductionC2100: 0.1,
      fullEffectYear: 2040,
      uncertaintyScore: 3,
    },
    prospectiveNarratives: {
      optimistic: {
        horizon: '+10 ans',
        label: 'Scénario Optimiste',
        colorClass: 'text-eb-green',
        borderClass: 'border-eb-green/30',
        text: 'Dans 10 ans, **200 millions d\'hectares** sont passés à l\'agroforesterie ou à l\'agriculture de conservation. Des satellites Copernicus mesurent en temps réel le carbone séquestré dans les sols de 60 pays, permettant des paiements carbone directs aux agriculteurs. En Inde, au Brésil et en Éthiopie, la combinaison arbres-cultures a augmenté les rendements agricoles de **18%** dans les zones semi-arides tout en séquestrant **1,2 tCO₂/ha/an**.',
      },
      moderate: {
        horizon: '+20 ans',
        label: 'Scénario Modéré',
        colorClass: 'text-yellow-400',
        borderClass: 'border-yellow-500/30',
        text: 'Dans 20 ans, la permanence de la séquestration reste le principal défi : des vagues de sécheresse dans certaines régions ont libéré une partie du carbone accumulé dans les sols. La mesure, le reporting et la vérification (MRV) du carbone des sols reste complexe et coûteuse. Le gain net atteint **–1,8 GtCO₂/an** — le potentiel est réel mais dépend de la stabilité climatique elle-même, créant une dépendance circulaire.',
      },
      pessimistic: {
        horizon: '+50 ans',
        label: 'Scénario Pessimiste',
        colorClass: 'text-red-400',
        borderClass: 'border-red-500/30',
        text: 'Dans 50 ans, la saturation des puits de carbone agricoles limite les gains à long terme : les sols atteignent leur capacité de stockage maximale après 20 à 40 ans. Des changements d\'utilisation des terres (conversion de pâturages carbonés en cultures pour nourrir 10 milliards d\'humains) ont annulé une partie des bénéfices. Le bilan net (**–0,07°C**) reste positif mais souligne que la séquestration agricole seule ne peut pas compenser les émissions fossiles.',
      },
    },
    projections: {
      labels: [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074],
      co2: {
        baseline:  [37.4, 38.8, 40.2, 41.8, 44.8, 49.0, 54.5, 57.0, 59.0],
        decided:   [37.4, 38.5, 39.5, 40.5, 43.1, 46.7, 51.3, 55.2, 60.1],
        pessimist: [37.4, 38.8, 40, 41.2, 43.9, 47.7, 52.2, 56, 60.8],
      },
      temperature: {
        baseline:  [1.35, 1.43, 1.52, 1.70, 1.82, 1.94, 2.10, 2.18, 2.32],
        decided:   [1.4, 1.5, 1.6, 1.71, 1.93, 2.16, 2.53, 2.92, 3.4],
        pessimist: [1.4, 1.5, 1.6, 1.72, 1.94, 2.18, 2.56, 2.95, 3.44],
      },
      forest: {
        baseline:  [58.0, 57.5, 57.0, 56.5, 55.3, 53.5, 50.5, 47.5, 43.5],
        decided:   [58.0, 57.5, 57.2, 56.9, 56.0, 54.6, 52.5, 50.4, 46.8],
        pessimist: [58.0, 57.5, 57.0, 56.7, 55.5, 53.9, 51.7, 48.8, 44.8],
      },
      // Impact sociétal — Source : POL_AGROFORESTRY_SOILCARBON.json societal_indicators
      societal: {
        foodSecurity:          { decided: [0, 0.0, 0.2, 0.5, 0.9, 1.2, 1.5, 1.5, 1.5],        pessimist: [0, 0.0, 0.1, 0.2, 0.4, 0.5, 0.5, 0.5, 0.5] },
        resourceConflicts:     { decided: [0, 0.0, -0.2, -0.5, -0.9, -1.3, -2.0, -2.0, -2.0],  pessimist: [0, 0.0, -0.1, -0.2, -0.4, -0.6, -1.0, -1.0, -1.0] },
        waterTensions:         { decided: [0, 0.0, -0.2, -0.5, -0.9, -1.3, -2.0, -2.0, -2.0],  pessimist: [0, 0.0, -0.1, -0.2, -0.4, -0.6, -1.0, -1.0, -1.0] },
        climateMigrations:     { decided: [0, 0.0, -0.2, -0.4, -0.7, -1.0, -1.5, -1.5, -1.5],  pessimist: [0, 0.0, -0.1, -0.2, -0.3, -0.5, -0.8, -0.8, -0.8] },
        lifeExpectancy:        { decided: [0, 0.0, 0.1, 0.2, 0.2, 0.3, 0.3, 0.3, 0.3],          pessimist: [0, 0.0, 0.0, 0.1, 0.1, 0.1, 0.2, 0.2, 0.2] },
        respiratoryDiseases:   { decided: [0, 0.0, -0.3, -0.7, -1.2, -1.7, -2.0, -2.0, -2.0],  pessimist: [0, 0.0, -0.1, -0.3, -0.6, -0.8, -1.0, -1.0, -1.0] },
        whoHealthIndex:        { decided: [0, 0.0, 0.1, 0.3, 0.5, 0.7, 0.8, 0.8, 0.8],          pessimist: [0, 0.0, 0.1, 0.1, 0.3, 0.3, 0.4, 0.4, 0.4] },
        giniCoefficient:       { decided: [0, 0.0, -0.001, -0.002, -0.004, -0.005, -0.006, -0.006, -0.006], pessimist: [0, 0.0, 0.0, -0.001, -0.002, -0.002, -0.003, -0.003, -0.003] },
        wealthConcentration:   { decided: [0, 0.0, -0.1, -0.2, -0.5, -0.6, -0.8, -0.8, -0.8],   pessimist: [0, 0.0, 0.0, -0.1, -0.2, -0.3, -0.4, -0.4, -0.4] },
        educationAccess:       { decided: [0, 0.0, 0.1, 0.3, 0.5, 0.6, 0.8, 0.8, 0.8],           pessimist: [0, 0.0, 0.1, 0.1, 0.2, 0.3, 0.4, 0.4, 0.4] },
      },
    },
    prerequisites: {
      policiesRequired: ['dec-03'],
    },
  },

  // ─── Décision 16 — Restauration des écosystèmes ───────────────────────
  {
    id: 'dec-16',
    sessionId: 1,
    number: '16',
    implementationLag: 7,
    status: 'active',
    title: 'Restauration mondiale des écosystèmes naturels : reboisement, tourbières et zones humides',
    description: `La destruction des écosystèmes naturels a transformé la biosphère terrestre d'un puits net de carbone en une source. AR6 WGIII identifie la restauration — reboisement, reforestation, conservation des tourbières, restauration des zones humides et mangroves — comme cumulant **~3,5 GtCO₂eq/an** d'ici 6 ans, le plus grand potentiel d'atténuation terrestre. La Décennie ONU pour la Restauration des Écosystèmes (2021–2030) vise la restauration de **1 milliard d'hectares**. Cette décision mandate : (1) un fonds de **200 Mds$/an** pour la restauration dans les pays à forêts tropicales, (2) la protection immédiate de toutes les tourbières intactes (elles stockent **2 fois plus** de carbone que toutes les forêts), (3) un programme mondial de restauration des mangroves et prairies marines (Blue Carbon).`,
    options: [
      { id: 'pour',   label: 'Pour',       color: '#00ff88', bgClass: 'bg-eb-green/10',  borderClass: 'border-eb-green/20' },
      { id: 'contre', label: 'Contre',     color: '#ff5050', bgClass: 'bg-red-500/10',   borderClass: 'border-red-500/20'  },
      { id: 'abst',   label: 'Abstention', color: '#475569', bgClass: 'bg-slate-700/30', borderClass: 'border-slate-600/30'},
    ],
    votes: { pour: 978, contre: 167, abst: 205 },
    consensusThreshold: 67,
    deadline: '2025-06-05T18:00:00Z',
    resources: [
      {
        title: 'GIEC AR6 SYR — Figure 4.4 : Restauration des écosystèmes et reboisement',
        excerpt: 'La restauration des écosystèmes, le reboisement et la reforestation représentent ~3–4 GtCO₂eq/an de potentiel d\'atténuation en 2030.',
        url: 'https://www.ipcc.ch/report/ar6/syr/',
      },
      {
        title: 'UNEP — Decade on Ecosystem Restoration 2021–2030',
        excerpt: 'Restaurer 1 milliard d\'hectares d\'ici 2030 pourrait séquestrer jusqu\'à 13 GtCO₂ par an et protéger la biodiversité de milliers d\'espèces.',
        url: 'https://www.decadeonrestoration.org/',
      },
      {
        title: 'Science — Bastin et al. 2019 : The Global Tree Restoration Potential',
        excerpt: 'La Terre peut accueillir 0,9 milliard d\'hectares de canopée forestière supplémentaire sans empiéter sur les terres agricoles ou les zones urbaines existantes.',
        url: 'https://www.science.org/doi/10.1126/science.aax0848',
      },
    ],
    // Source : src/data/models/POL_ECOSYSTEM_RESTORATION.json
    projectedImpact: {
      emissionsReductionGtCO2yr: 3.5,
      tempReductionC2100: 0.15,
      fullEffectYear: 2050,
      uncertaintyScore: 3,
    },
    prospectiveNarratives: {
      optimistic: {
        horizon: '+10 ans',
        label: 'Scénario Optimiste',
        colorClass: 'text-eb-green',
        borderClass: 'border-eb-green/30',
        text: 'Dans 10 ans, **350 millions d\'hectares** d\'écosystèmes dégradés sont en cours de restauration active dans 78 pays. Les tourbières de Bornéo et de Sibérie — menacées par les incendies et le drainage — sont sous protection légale forte. Les mangroves d\'Afrique de l\'Ouest ont augmenté de **42%** en superficie. Des paiements directs aux communautés autochtones gardiennes de forêts (via REDD+) atteignent 25 Mds$/an, transformant la conservation en moteur de développement local.',
      },
      moderate: {
        horizon: '+20 ans',
        label: 'Scénario Modéré',
        colorClass: 'text-yellow-400',
        borderClass: 'border-yellow-500/30',
        text: 'Dans 20 ans, la restauration avance mais fait face à un paradoxe climatique : le réchauffement lui-même détruit les écosystèmes qu\'on essaie de restaurer. Les méga-incendies (Amazonie, Sibérie, Méditerranée) libèrent du carbone plus vite qu\'on ne peut le re-séquestrer. Le gain net atteint **–2,5 GtCO₂/an** en scénario favorable, mais la fenêtre pour la restauration des tourbières du permafrost se referme rapidement au-delà de +2°C.',
      },
      pessimistic: {
        horizon: '+50 ans',
        label: 'Scénario Pessimiste',
        colorClass: 'text-red-400',
        borderClass: 'border-red-500/30',
        text: 'Dans 50 ans, le dégel du permafrost sibérien et canadien a libéré d\'importants stocks de méthane et de CO₂ — dépassant largement les capacités de séquestration des nouveaux écosystèmes restaurés. Des afforestations mal conçues (monocultures d\'eucalyptus en zone sèche) ont aggravé le stress hydrique local et réduit la biodiversité. Le potentiel de puits de carbone terrestre est **40% inférieur** aux projections de 2024 en raison des feedback climatiques.',
      },
    },
    projections: {
      labels: [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074],
      co2: {
        baseline:  [37.4, 38.8, 40.2, 41.8, 44.8, 49.0, 54.5, 57.0, 59.0],
        decided:   [37.4, 38.5, 39.5, 40.2, 42.6, 46.2, 50.5, 54.2, 59],
        pessimist: [37.4, 38.8, 40, 41.2, 43.7, 47.4, 51.8, 55.5, 60.2],
      },
      temperature: {
        baseline:  [1.35, 1.43, 1.52, 1.70, 1.82, 1.94, 2.10, 2.18, 2.32],
        decided:   [1.4, 1.5, 1.59, 1.71, 1.93, 2.16, 2.52, 2.9, 3.37],
        pessimist: [1.4, 1.5, 1.6, 1.72, 1.94, 2.17, 2.55, 2.94, 3.43],
      },
      forest: {
        baseline:  [58.0, 57.5, 57.0, 56.5, 55.3, 53.5, 50.5, 47.5, 43.5],
        decided:   [58.0, 57.5, 57.2, 57.0, 56.7, 56.2, 55.4, 54.2, 51.4],
        pessimist: [58.0, 57.5, 57.0, 56.7, 56.0, 54.6, 52.1, 49.6, 45.2],
      },
    },
    prerequisites: {
      policiesRequired: ['dec-03'],
    },
  },

  // ─── Décision 17 — BECCS ───────────────────────────────────────────────
  {
    id: 'dec-17',
    sessionId: 1,
    number: '17',
    implementationLag: 12,
    status: 'active',
    title: 'Déploiement de la bioénergie avec captage et stockage du carbone (BECCS) à grande échelle',
    description: `La BECCS (Bioenergy with Carbon Capture and Storage) est la principale technologie de **CO₂ removal (CDR)** dans la plupart des modèles limitant le réchauffement à 1,5°C. Son principe : brûler de la biomasse (cultures énergétiques, résidus agricoles, forestiers) pour produire de l'énergie ou des carburants, puis capter et stocker le CO₂ émis — résultat net : des émissions **négatives**. AR6 WGIII estime le potentiel à ~2 GtCO₂/an net d'ici 26 ans. Cette décision mandate : (1) 10 projets pilotes BECCS commerciaux d'ici 6 ans dans les secteurs de la bioélectricité et des biocarburants, (2) une gouvernance stricte sur les cultures énergétiques (biodiversité, eau, droits fonciers), (3) un mécanisme de crédit carbone "négatif" rémunérateur. Controverses majeures : concurrence avec les terres agricoles et la biodiversité.`,
    options: [
      { id: 'pour',   label: 'Pour',       color: '#00ff88', bgClass: 'bg-eb-green/10',  borderClass: 'border-eb-green/20' },
      { id: 'contre', label: 'Contre',     color: '#ff5050', bgClass: 'bg-red-500/10',   borderClass: 'border-red-500/20'  },
      { id: 'abst',   label: 'Abstention', color: '#475569', bgClass: 'bg-slate-700/30', borderClass: 'border-slate-600/30'},
    ],
    votes: { pour: 487, contre: 598, abst: 365 },
    consensusThreshold: 67,
    deadline: '2026-12-31T18:00:00Z',
    resources: [
      {
        title: 'GIEC AR6 SYR — Section 5 : CDR et BECCS dans les trajectoires 1,5°C',
        excerpt: 'La bioélectricité avec CCS (BECCS) figure dans les modèles de trajectoires limitant le réchauffement à 1,5°C comme source d\'émissions négatives.',
        url: 'https://www.ipcc.ch/report/ar6/syr/',
      },
      {
        title: 'IEA — Bioenergy with Carbon Capture and Storage 2023',
        excerpt: 'Le potentiel de BECCS est de 3 à 10 GtCO₂/an d\'ici 2050, selon les hypothèses sur la disponibilité de la biomasse durable et les capacités de stockage géologique.',
        url: 'https://www.iea.org/energy-system/carbon-capture-utilisation-and-storage/bioenergy-with-ccs-beccs',
      },
      {
        title: 'Royal Society — Greenhouse Gas Removal Report 2018',
        excerpt: 'Les technologies de CDR, dont BECCS, sont nécessaires mais insuffisantes : elles ne peuvent pas compenser une inaction sur les émissions à la source.',
        url: 'https://royalsociety.org/greenhouse-gas-removal/',
      },
    ],
    // Source : src/data/models/POL_BECCS_SCALE.json
    projectedImpact: {
      emissionsReductionGtCO2yr: 2,
      tempReductionC2100: 0.1,
      fullEffectYear: 2060,
      uncertaintyScore: 3,
    },
    prospectiveNarratives: {
      optimistic: {
        horizon: '+10 ans',
        label: 'Scénario Optimiste',
        colorClass: 'text-eb-green',
        borderClass: 'border-eb-green/30',
        text: 'Dans 10 ans, **12 projets BECCS commerciaux** sont opérationnels dans le monde (Illinois, Royaume-Uni, Pays-Bas, Brésil). Le premier projet à grande échelle en Angleterre — combinant bioénergie issue de miscanthus et CCS sous la Mer du Nord — capture **4 MtCO₂/an**. Les carburants d\'aviation durables (SAF) produits avec capture de carbone deviennent commercialement viables. Un protocole de gouvernance internationale définit les critères de durabilité de la biomasse.',
      },
      moderate: {
        horizon: '+20 ans',
        label: 'Scénario Modéré',
        colorClass: 'text-yellow-400',
        borderClass: 'border-yellow-500/30',
        text: 'Dans 20 ans, la BECCS capture **600 MtCO₂/an** — loin en deçà du potentiel théorique. Les controverses sur la compétition foncière ont conduit à limiter les cultures énergétiques aux terres marginales et aux résidus agricoles et forestiers. La chaîne logistique biomasse internationale s\'avère complexe et énergivore. Les modèles projetant une forte contribution de BECCS sont révisés à la baisse, augmentant la pression sur les décisions de réduction des émissions à la source.',
      },
      pessimistic: {
        horizon: '+50 ans',
        label: 'Scénario Pessimiste',
        colorClass: 'text-red-400',
        borderClass: 'border-red-500/30',
        text: 'Dans 50 ans, la BECCS a été utilisée par certains acteurs comme alibi pour retarder les décisions de réduction à la source : "on compensera plus tard". Les plantations énergétiques extensives de miscanthus et de switchgrass ont concurrencé les terres agricoles dans plusieurs régions, aggravant l\'insécurité alimentaire locale. Le bilan réel de la BECCS (**–0,06°C**) est très inférieur aux projections optimistes — une leçon sur les risques du "moral hazard" dans les solutions technologiques de CDR.',
      },
    },
    projections: {
      labels: [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074],
      co2: {
        baseline:  [37.4, 38.8, 40.2, 41.8, 44.8, 49.0, 54.5, 57.0, 59.0],
        decided:   [37.4, 39, 40.4, 41.7, 44.3, 47.7, 52, 55.5, 60],
        pessimist: [37.4, 39, 40.5, 41.9, 44.8, 48.4, 52.8, 56.5, 61],
      },
      temperature: {
        baseline:  [1.35, 1.43, 1.52, 1.70, 1.82, 1.94, 2.10, 2.18, 2.32],
        decided:   [1.4, 1.5, 1.6, 1.72, 1.95, 2.18, 2.55, 2.93, 3.4],
        pessimist: [1.4, 1.5, 1.6, 1.72, 1.95, 2.2, 2.59, 2.97, 3.46],
      },
      forest: {
        // BECCS exerce une pression négative sur les forêts primaires (biomasse)
        baseline:  [58.0, 57.5, 57.0, 56.5, 55.3, 53.5, 50.5, 47.5, 43.5],
        decided:   [58.0, 57.5, 56.9, 56.3, 55.0, 53.1, 49.8, 46.7, 42.4],
        pessimist: [58.0, 57.5, 56.9, 56.3, 55.0, 53.1, 49.7, 46.5, 42.3],
      },
      resources: {
        biomass: { decided: [0, 0, +0.1, +0.3, +0.8, +1.5, +2.0, +2.5, +3.0], pessimist: [0, 0, 0, +0.1, +0.3, +0.7, +1.0, +1.2, +1.5] },
      },
      societal: {
        foodSecurity:          { decided: [0, -0.0, -0.1, -0.3, -0.7, -1.0, -1.3, -1.5, -1.5],  pessimist: [0, -0.1, -0.3, -0.6, -1.0, -1.5, -2.0, -2.0, -2.0] },
        resourceConflicts:     { decided: [0, 0.0, 0.2, 0.5, 1.2, 2.0, 3.0, 3.0, 3.0],          pessimist: [0, 0.0, 0.3, 0.8, 1.8, 3.0, 5.0, 5.0, 5.0] },
        waterTensions:         { decided: [0, 0.0, 0.2, 0.4, 0.8, 1.3, 2.0, 2.0, 2.0],          pessimist: [0, 0.0, 0.3, 0.6, 1.2, 2.0, 3.0, 3.0, 3.0] },
        climateMigrations:     { decided: [0, 0.0, 0.2, 0.4, 0.8, 1.3, 2.0, 2.0, 2.0],          pessimist: [0, 0.0, 0.3, 0.6, 1.2, 2.0, 3.0, 3.0, 3.0] },
        lifeExpectancy:        { decided: [0, 0.0, -0.1, -0.1, -0.2, -0.2, -0.2, -0.2, -0.2],   pessimist: [0, 0.0, -0.1, -0.2, -0.3, -0.4, -0.5, -0.5, -0.5] },
        respiratoryDiseases:   { decided: [0, 0.0, 0.3, 0.6, 1.2, 1.7, 2.0, 2.0, 2.0],          pessimist: [0, 0.0, 0.5, 1.0, 2.0, 3.0, 4.0, 4.0, 4.0] },
        whoHealthIndex:        { decided: [0, 0.0, -0.1, -0.2, -0.3, -0.4, -0.5, -0.5, -0.5],   pessimist: [0, 0.0, -0.2, -0.3, -0.5, -0.8, -1.0, -1.0, -1.0] },
        giniCoefficient:       { decided: [0, 0.0, 0.001, 0.002, 0.004, 0.004, 0.005, 0.005, 0.005], pessimist: [0, 0.0, 0.002, 0.004, 0.007, 0.009, 0.011, 0.011, 0.011] },
        wealthConcentration:   { decided: [0, 0.0, 0.1, 0.3, 0.6, 0.8, 1.0, 1.0, 1.0],          pessimist: [0, 0.0, 0.2, 0.5, 1.0, 1.5, 2.0, 2.0, 2.0] },
        educationAccess:       { decided: [0, 0.0, -0.1, -0.2, -0.3, -0.4, -0.5, -0.5, -0.5],   pessimist: [0, 0.0, -0.2, -0.3, -0.5, -0.7, -1.0, -1.0, -1.0] },
      },
    },
    prerequisites: {
      policiesRequired: ['dec-11', 'dec-15'],
    },
  },

  // ─── dec-18 — Hydrogène vert ──────────────────────────────────────────────
  {
    id: 'dec-18',
    sessionId: 4,
    number: '18',
    status: 'active',
    implementationLag: 4,
    title: 'Hydrogène vert pour industrie lourde et transport',
    description: `L'hydrogène produit par électrolyse à partir d'électricité renouvelable (**hydrogène vert**) offre une solution de décarbonation pour les secteurs difficilement électrifiables : sidérurgie, chimie, ciment, fret lourd longue distance. Le GIEC AR6 WGIII identifie l'hydrogène bas carbone comme une option à fort potentiel pour les secteurs "hard-to-abate", avec un potentiel de **1,5 à 2,5 GtCO₂/an** d'ici 2050. Cette décision propose de financer un programme mondial de déploiement de l'électrolyse renouvelable à hauteur de **150 Mds$/an** d'ici 2030.`,
    options: [
      { id: 'pour',   label: 'Pour',       color: '#00ff88', bgClass: 'bg-eb-green/10',  borderClass: 'border-eb-green/20' },
      { id: 'contre', label: 'Contre',     color: '#ff5050', bgClass: 'bg-red-500/10',   borderClass: 'border-red-500/20'  },
      { id: 'abst',   label: 'Abstention', color: '#475569', bgClass: 'bg-slate-700/30', borderClass: 'border-slate-600/30'},
    ],
    votes: { pour: 412, contre: 198, abst: 95 },
    consensusThreshold: 67,
    deadline: '2026-03-15T18:00:00Z',
    resources: [
      {
        title: 'GIEC AR6 WGIII — Chapitre 6 : Systèmes énergétiques',
        excerpt: 'L\'hydrogène bas carbone représente un potentiel de réduction de 1,5 à 2,5 GtCO₂/an d\'ici 2050 dans les secteurs difficiles à électrifier.',
        url: 'https://www.ipcc.ch/report/ar6/wg3/',
      },
      {
        title: 'AIE — Global Hydrogen Review 2023',
        excerpt: 'Les coûts de l\'électrolyse ont chuté de 60 % depuis 2015. L\'objectif de 90 Mt d\'hydrogène propre d\'ici 2030 est techniquement réalisable.',
        url: 'https://www.iea.org/reports/global-hydrogen-review-2023',
      },
      {
        title: 'Hydrogen Council — Hydrogen Insights 2023',
        excerpt: 'Les projets d\'hydrogène renouvelable en développement dépassent 1 000 GW d\'électrolyse. La compétitivité dépend de l\'accès à des énergies renouvelables bon marché.',
        url: 'https://hydrogencouncil.com/',
      },
    ],
    projectedImpact: {
      emissionsReductionGtCO2yr: 1.5,
      tempReductionC2100: 0.06,
      fullEffectYear: 2060,
      uncertaintyScore: 3,
    },
    prospectiveNarratives: {
      optimistic: {
        horizon: '+10 ans',
        label: 'Scénario Optimiste',
        colorClass: 'text-eb-green',
        borderClass: 'border-eb-green/30',
        text: 'Dans 10 ans, **45 GW** d\'électrolyseurs sont opérationnels dans le monde. Le coût de l\'hydrogène vert est tombé sous **2 $/kg**, atteignant la parité avec l\'hydrogène gris en Europe. Les premiers hauts-fourneaux à hydrogène sont opérationnels en Suède (HYBRIT) et en Allemagne. Le fret lourd représente 8 % de la consommation mondiale d\'hydrogène propre.',
      },
      moderate: {
        horizon: '+20 ans',
        label: 'Scénario Modéré',
        colorClass: 'text-yellow-400',
        borderClass: 'border-yellow-500/30',
        text: 'Dans 20 ans, l\'hydrogène vert couvre **12 %** des besoins en énergie de l\'industrie lourde mondiale. Les tensions géopolitiques autour des corridors d\'exportation ralentissent le déploiement. Les émissions industrielles baissent de **18 %** par rapport à 2024. Le transport maritime intègre progressivement l\'ammoniac vert.',
      },
      pessimistic: {
        horizon: '+50 ans',
        label: 'Scénario Pessimiste',
        colorClass: 'text-red-400',
        borderClass: 'border-red-500/30',
        text: 'Dans 50 ans, si les investissements ont été insuffisants, l\'hydrogène vert ne couvre que **5 %** des besoins industriels mondiaux. Le recours massif à l\'hydrogène bleu (CCS incomplète) a dilué les bénéfices climatiques. La contribution nette reste marginale : **–0,03°C**.',
      },
    },
    projections: {
      labels: [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074],
      co2: {
        baseline:  [37.4, 39,   40.5, 42,   45.1, 49.2, 54,   58,   63],
        decided:   [37.4, 39,   40.5, 41.8, 44.5, 48.2, 52.5, 56.3, 61.2],
        pessimist: [37.4, 39,   40.5, 41.9, 44.8, 48.6, 53.1, 57.0, 62.0],
      },
      temperature: {
        baseline:  [1.4, 1.5,  1.6,  1.72, 1.95, 2.2,  2.6,  3.0,  3.5],
        decided:   [1.4, 1.5,  1.6,  1.71, 1.93, 2.16, 2.54, 2.93, 3.42],
        pessimist: [1.4, 1.5,  1.6,  1.72, 1.94, 2.18, 2.57, 2.96, 3.45],
      },
      energyMix: {
        solar: { decided: [0, 0, 0, 0.3, 0.9, 1.8, 3.0, 3.5, 4.0], pessimist: [0, 0, 0, 0.1, 0.5, 1.0, 1.5, 1.8, 2.0] },
        wind:  { decided: [0, 0, 0, 0.2, 0.6, 1.2, 2.0, 2.5, 3.0], pessimist: [0, 0, 0, 0.1, 0.3, 0.5, 1.0, 1.2, 1.5] },
      },
    },
    prerequisites: {
      policiesRequired: ['dec-08'],
    },
  },

  // ─── dec-19 — Réseaux intelligents et stockage ────────────────────────────
  {
    id: 'dec-19',
    sessionId: 4,
    number: '19',
    status: 'active',
    implementationLag: 2,
    title: 'Réseaux électriques intelligents et stockage d\'énergie',
    description: `Le déploiement massif des énergies renouvelables est freiné par l'intermittence solaire et éolienne et la rigidité des réseaux existants. Les **réseaux intelligents** (smart grids) couplés à des systèmes de stockage (batteries, STEP, hydrogène, gravité) permettent d'atteindre des taux de pénétration des renouvelables supérieurs à **80 %** dans le mix électrique. Le GIEC AR6 évalue le potentiel de réduction de ce pilier à **1 à 2 GtCO₂/an** d'ici 2050 en débridant l'intégration des renouvelables. Cette décision mandate un investissement mondial de **80 Mds$/an** dans la modernisation des réseaux et le stockage à l'échelle réseau.`,
    options: [
      { id: 'pour',   label: 'Pour',       color: '#00ff88', bgClass: 'bg-eb-green/10',  borderClass: 'border-eb-green/20' },
      { id: 'contre', label: 'Contre',     color: '#ff5050', bgClass: 'bg-red-500/10',   borderClass: 'border-red-500/20'  },
      { id: 'abst',   label: 'Abstention', color: '#475569', bgClass: 'bg-slate-700/30', borderClass: 'border-slate-600/30'},
    ],
    votes: { pour: 531, contre: 142, abst: 87 },
    consensusThreshold: 67,
    deadline: '2026-03-15T18:00:00Z',
    resources: [
      {
        title: 'GIEC AR6 WGIII — Chapitre 6 : Intégration des renouvelables',
        excerpt: 'Les réseaux intelligents et le stockage sont des conditions nécessaires pour atteindre des taux de pénétration élevés des renouvelables sans déséquilibre réseau.',
        url: 'https://www.ipcc.ch/report/ar6/wg3/',
      },
      {
        title: 'AIE — Electricity Grids and Secure Energy Transitions 2023',
        excerpt: 'Il faut ajouter ou rénover 80 millions de km de réseaux électriques d\'ici 2040. Les investissements actuels couvrent moins de la moitié des besoins.',
        url: 'https://www.iea.org/reports/electricity-grids-and-secure-energy-transitions',
      },
      {
        title: 'IRENA — Innovation Landscape for Smart Electrification 2023',
        excerpt: 'Le coût des batteries lithium-ion a chuté de 97 % depuis 1991. Le stockage stationnaire représente un marché de 1 000 GWh/an d\'ici 2030.',
        url: 'https://www.irena.org/',
      },
    ],
    projectedImpact: {
      emissionsReductionGtCO2yr: 1.0,
      tempReductionC2100: 0.05,
      fullEffectYear: 2050,
      uncertaintyScore: 2,
    },
    prospectiveNarratives: {
      optimistic: {
        horizon: '+10 ans',
        label: 'Scénario Optimiste',
        colorClass: 'text-eb-green',
        borderClass: 'border-eb-green/30',
        text: 'Dans 10 ans, **25 millions de km** de lignes de transport et distribution sont modernisées. Le taux de pénétration des renouvelables dépasse **65 %** du mix électrique mondial. Les systèmes de stockage stationnaire atteignent **3 000 GWh** de capacité installée. La flexibilité de la demande (véhicules électriques V2G, chauffe-eau intelligents) évite la construction de **200 GW** de centrales de pointe à gaz.',
      },
      moderate: {
        horizon: '+20 ans',
        label: 'Scénario Modéré',
        colorClass: 'text-yellow-400',
        borderClass: 'border-yellow-500/30',
        text: 'Dans 20 ans, les réseaux intelligents ont permis d\'atteindre **55 %** de renouvelables dans le mix électrique mondial. Des goulets d\'étranglement subsistent en Asie du Sud et en Afrique subsaharienne. Le stockage longue durée (saisonnier) reste coûteux et insuffisamment déployé. La réduction nette atteint **–0,8 GtCO₂/an**.',
      },
      pessimistic: {
        horizon: '+50 ans',
        label: 'Scénario Pessimiste',
        colorClass: 'text-red-400',
        borderClass: 'border-red-500/30',
        text: 'Dans 50 ans, le vieillissement des réseaux et la cybersécurité ont ralenti la modernisation dans les économies fragiles. Les pannes de réseau liées à une intégration mal gérée des renouvelables ont créé des résistances politiques. La réduction nette reste positive (**–0,04°C**) mais bien en deçà du potentiel théorique.',
      },
    },
    projections: {
      labels: [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074],
      co2: {
        baseline:  [37.4, 39,    40.5, 42,   45.1, 49.2, 54,   58,   63],
        decided:   [37.4, 38.9,  40.2, 41.5, 44.4, 48.3, 53.0, 57.0, 62.0],
        pessimist: [37.4, 38.95, 40.35,41.75,44.7, 48.6, 53.3, 57.3, 62.3],
      },
      temperature: {
        baseline:  [1.4, 1.5,  1.6,  1.72, 1.95, 2.2,  2.6,  3.0,  3.5],
        decided:   [1.4, 1.49, 1.58, 1.70, 1.92, 2.16, 2.55, 2.95, 3.44],
        pessimist: [1.4, 1.50, 1.59, 1.71, 1.94, 2.18, 2.57, 2.97, 3.46],
      },
      energyMix: {
        solar: { decided: [0, 0.5, 1.5, 2.5, 4.0, 5.5, 7.0, 7.5, 8.0], pessimist: [0, 0.3, 0.8, 1.5, 2.5, 3.5, 4.5, 5.0, 5.5] },
        wind:  { decided: [0, 0.3, 0.8, 1.5, 2.5, 3.5, 4.5, 5.0, 5.5], pessimist: [0, 0.2, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.0] },
        gas:   { decided: [0, -0.2,-0.5,-0.8,-1.5,-2.0,-2.5,-2.5,-2.5], pessimist: [0, -0.1,-0.3,-0.5,-1.0,-1.3,-1.5,-1.5,-1.5] },
      },
    },
    prerequisites: {
      policiesRequired: ['dec-08'],
    },
  },

  // ─── dec-20 — Géothermie et hydroélectricité ──────────────────────────────
  {
    id: 'dec-20',
    sessionId: 4,
    number: '20',
    status: 'active',
    implementationLag: 4,
    title: 'Géothermie et hydroélectricité de nouvelle génération',
    description: `La géothermie profonde (Enhanced Geothermal Systems, EGS) et les mini-centrales hydroélectriques au fil de l'eau représentent des sources d'électricité **pilotables et décarbonées** complémentaires au solaire et à l'éolien. L'EGS peut théoriquement alimenter la planète entière sans émissions, mais reste à démontrer à grande échelle. Le GIEC AR6 estime que l'hydroélectricité existante et nouvelle peut contribuer **0,5 à 1 GtCO₂/an** de réduction. Cette décision finance l'exploration géothermique dans 40 pays et la construction de **500 GW** de petite et moyenne hydraulique d'ici 2050, avec des normes environnementales strictes.`,
    options: [
      { id: 'pour',   label: 'Pour',       color: '#00ff88', bgClass: 'bg-eb-green/10',  borderClass: 'border-eb-green/20' },
      { id: 'contre', label: 'Contre',     color: '#ff5050', bgClass: 'bg-red-500/10',   borderClass: 'border-red-500/20'  },
      { id: 'abst',   label: 'Abstention', color: '#475569', bgClass: 'bg-slate-700/30', borderClass: 'border-slate-600/30'},
    ],
    votes: { pour: 378, contre: 221, abst: 110 },
    consensusThreshold: 67,
    deadline: '2026-03-15T18:00:00Z',
    resources: [
      {
        title: 'GIEC AR6 WGIII — Chapitre 6 : Hydroélectricité et géothermie',
        excerpt: 'L\'hydroélectricité est la plus grande source d\'électricité renouvelable au monde. Son potentiel technique non exploité reste de 10 000 TWh/an.',
        url: 'https://www.ipcc.ch/report/ar6/wg3/',
      },
      {
        title: 'MIT — The Future of Geothermal Energy 2023',
        excerpt: 'Les systèmes géothermiques améliorés (EGS) pourraient fournir plus de 100 GWe aux États-Unis seuls, avec des coûts compétitifs d\'ici 2035.',
        url: 'https://energy.mit.edu/',
      },
      {
        title: 'IHA — World Hydropower Outlook 2023',
        excerpt: 'La modernisation des 1 300 GW de capacité hydroélectrique existante pourrait augmenter la production de 10 à 15 % sans nouveaux barrages.',
        url: 'https://www.hydropower.org/',
      },
    ],
    projectedImpact: {
      emissionsReductionGtCO2yr: 0.8,
      tempReductionC2100: 0.04,
      fullEffectYear: 2060,
      uncertaintyScore: 3,
    },
    prospectiveNarratives: {
      optimistic: {
        horizon: '+10 ans',
        label: 'Scénario Optimiste',
        colorClass: 'text-eb-green',
        borderClass: 'border-eb-green/30',
        text: 'Dans 10 ans, **15 projets EGS** sont commercialement opérationnels dans le monde (Kenya, Islande, Indonésie, États-Unis). La géothermie fournit **500 TWh/an** d\'électricité pilotable 24h/24. 200 GW de petite hydraulique sont construits en Asie du Sud-Est et en Afrique avec des normes environnementales garantissant la continuité des débits écologiques.',
      },
      moderate: {
        horizon: '+20 ans',
        label: 'Scénario Modéré',
        colorClass: 'text-yellow-400',
        borderClass: 'border-yellow-500/30',
        text: 'Dans 20 ans, la géothermie EGS a tenu ses promesses techniques mais les coûts de forage profond restent élevés. L\'hydroélectricité est confrontée au **stress hydrique** dans plusieurs bassins versants, réduisant sa production effective. La contribution nette atteint **–0,6 GtCO₂/an**.',
      },
      pessimistic: {
        horizon: '+50 ans',
        label: 'Scénario Pessimiste',
        colorClass: 'text-red-400',
        borderClass: 'border-red-500/30',
        text: 'Dans 50 ans, la sécheresse persistante liée au changement climatique réduit la production hydroélectrique mondiale de **15 %**. Les grands barrages construits dans des zones à fort stress hydrique ont généré des conflits transfrontaliers. La géothermie a compensé partiellement, mais le bénéfice net sur les émissions reste limité à **–0,03°C**.',
      },
    },
    projections: {
      labels: [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074],
      co2: {
        baseline:  [37.4, 39,   40.5, 42,    45.1, 49.2, 54,   58,   63],
        decided:   [37.4, 39,   40.5, 41.9,  44.8, 48.7, 53.2, 57.2, 62.2],
        pessimist: [37.4, 39,   40.5, 41.95, 44.95,48.9, 53.5, 57.4, 62.4],
      },
      temperature: {
        baseline:  [1.4, 1.5,  1.6,  1.72, 1.95, 2.2,  2.6,  3.0,  3.5],
        decided:   [1.4, 1.5,  1.6,  1.72, 1.94, 2.18, 2.56, 2.96, 3.45],
        pessimist: [1.4, 1.5,  1.6,  1.72, 1.95, 2.19, 2.58, 2.98, 3.47],
      },
      energyMix: {
        hydro:   { decided: [0, 0, 0, 0.3, 1.0, 2.0, 3.0, 3.5, 4.0], pessimist: [0, 0, 0, 0.1, 0.5, 1.0, 1.8, 2.0, 2.2] },
        autres:  { decided: [0, 0, 0, 0.2, 0.5, 1.0, 1.5, 2.0, 2.5], pessimist: [0, 0, 0, 0.1, 0.2, 0.5, 0.8, 1.0, 1.2] },
      },
    },
    prerequisites: {
      policiesRequired: ['dec-05'],
    },
  },

  // ─── dec-21 — Normes zéro-carbone construction neuve ─────────────────────
  {
    id: 'dec-21',
    sessionId: 4,
    number: '21',
    status: 'active',
    implementationLag: 2,
    title: 'Normes zéro-carbone obligatoires pour la construction neuve',
    description: `Les bâtiments représentent **~21 % des émissions mondiales** de GES (chauffage, climatisation, eau chaude). Le GIEC AR6 WGIII évalue le potentiel de réduction du secteur du bâtiment à **3 à 5 GtCO₂/an** d'ici 2050. Cette décision impose que **toute construction neuve** respecte des normes zéro-émission nette (énergie et carbone intrinsèque) dès l'entrée en vigueur. Elle inclut des standards de performance énergétique, l'interdiction des chaudières fossiles dans le neuf, et un cadre de certification internationale "Climate-Ready Building" avec audit tiers.`,
    options: [
      { id: 'pour',   label: 'Pour',       color: '#00ff88', bgClass: 'bg-eb-green/10',  borderClass: 'border-eb-green/20' },
      { id: 'contre', label: 'Contre',     color: '#ff5050', bgClass: 'bg-red-500/10',   borderClass: 'border-red-500/20'  },
      { id: 'abst',   label: 'Abstention', color: '#475569', bgClass: 'bg-slate-700/30', borderClass: 'border-slate-600/30'},
    ],
    votes: { pour: 489, contre: 176, abst: 93 },
    consensusThreshold: 67,
    deadline: '2026-03-15T18:00:00Z',
    resources: [
      {
        title: 'GIEC AR6 WGIII — Chapitre 9 : Bâtiments',
        excerpt: 'Des normes de construction ambitieuses pour les bâtiments neufs, combinées à l\'électrification du chauffage, permettent de réduire les émissions du secteur de 50 à 75 % d\'ici 2050.',
        url: 'https://www.ipcc.ch/report/ar6/wg3/',
      },
      {
        title: 'UNEP — 2023 Global Status Report for Buildings and Construction',
        excerpt: 'Le secteur de la construction est responsable de 37 % des émissions mondiales de CO₂ liées à l\'énergie. Les bâtiments neufs doivent être zéro-carbone dès maintenant.',
        url: 'https://globalabc.org/',
      },
      {
        title: 'IEA — Buildings: A source of enormous untapped efficiency potential',
        excerpt: 'L\'investissement dans l\'efficacité énergétique des bâtiments génère un retour sur investissement de 3 à 5 fois sur 20 ans via la réduction des factures énergétiques.',
        url: 'https://www.iea.org/topics/buildings',
      },
    ],
    projectedImpact: {
      emissionsReductionGtCO2yr: 1.0,
      tempReductionC2100: 0.05,
      fullEffectYear: 2060,
      uncertaintyScore: 2,
    },
    prospectiveNarratives: {
      optimistic: {
        horizon: '+10 ans',
        label: 'Scénario Optimiste',
        colorClass: 'text-eb-green',
        borderClass: 'border-eb-green/30',
        text: 'Dans 10 ans, **100 % des permis de construire** dans les pays de l\'OCDE exigent la conformité aux normes zéro-carbone. Les pompes à chaleur représentent 80 % des systèmes de chauffage dans le neuf. Les matériaux bas carbone (CLT, béton géopolymère, isolants biosourcés) se généralisent. La consommation énergétique des nouveaux bâtiments est **70 % inférieure** à la moyenne du parc existant.',
      },
      moderate: {
        horizon: '+20 ans',
        label: 'Scénario Modéré',
        colorClass: 'text-yellow-400',
        borderClass: 'border-yellow-500/30',
        text: 'Dans 20 ans, les normes zéro-carbone s\'appliquent dans **65 pays** représentant 70 % des nouvelles constructions mondiales. La réduction effective dépend du rythme de remplacement du parc existant (durée de vie 50–80 ans). La réduction nette atteint **–0,7 GtCO₂/an** mais le plein effet sur le parc global n\'interviendra qu\'en 2060–2070.',
      },
      pessimistic: {
        horizon: '+50 ans',
        label: 'Scénario Pessimiste',
        colorClass: 'text-red-400',
        borderClass: 'border-red-500/30',
        text: 'Dans 50 ans, l\'urbanisation rapide en Asie du Sud et en Afrique a conduit à la construction de centaines de millions de logements mal isolés, malgré les normes adoptées sur le papier. L\'inertie du bâtiment existant et le déficit de contrôle dans les pays émergents ont limité la réduction à **–0,04°C**.',
      },
    },
    projections: {
      labels: [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074],
      co2: {
        baseline:  [37.4, 39,    40.5, 42,   45.1, 49.2, 54,   58,   63],
        decided:   [37.4, 38.95, 40.35,41.7, 44.6, 48.5, 53.0, 56.9, 61.8],
        pessimist: [37.4, 38.98, 40.42,41.85,44.8, 48.7, 53.3, 57.2, 62.1],
      },
      temperature: {
        baseline:  [1.4, 1.5,  1.6,  1.72, 1.95, 2.2,  2.6,  3.0,  3.5],
        decided:   [1.4, 1.50, 1.59, 1.71, 1.93, 2.17, 2.55, 2.95, 3.44],
        pessimist: [1.4, 1.50, 1.60, 1.72, 1.94, 2.19, 2.57, 2.97, 3.46],
      },
    },
  },

  // ─── dec-22 — Efficacité appareils et éclairage ───────────────────────────
  {
    id: 'dec-22',
    sessionId: 4,
    number: '22',
    status: 'active',
    implementationLag: 2,
    title: 'Normes d\'efficacité minimale pour appareils électriques et éclairage',
    description: `Les appareils électriques inefficaces (réfrigérateurs, climatiseurs, moteurs industriels, éclairage) sont responsables d'environ **10 % des émissions mondiales** liées à l'énergie. Les normes de performance énergétique minimale (MEPS) figurent parmi les options les plus **coût-efficaces** du portefeuille de mitigation : l'AIE estime que l'élimination des appareils les moins efficaces permettrait d'éviter **1 400 TWh/an** de consommation électrique d'ici 2030. Cette décision établit des MEPS mondiales pour les 10 catégories d'appareils les plus énergivores, avec un mécanisme de convergence vers le meilleur niveau disponible.`,
    options: [
      { id: 'pour',   label: 'Pour',       color: '#00ff88', bgClass: 'bg-eb-green/10',  borderClass: 'border-eb-green/20' },
      { id: 'contre', label: 'Contre',     color: '#ff5050', bgClass: 'bg-red-500/10',   borderClass: 'border-red-500/20'  },
      { id: 'abst',   label: 'Abstention', color: '#475569', bgClass: 'bg-slate-700/30', borderClass: 'border-slate-600/30'},
    ],
    votes: { pour: 601, contre: 114, abst: 75 },
    consensusThreshold: 67,
    deadline: '2026-03-15T18:00:00Z',
    resources: [
      {
        title: 'GIEC AR6 WGIII — Chapitre 9 : Efficacité énergétique dans les bâtiments',
        excerpt: 'Les normes d\'efficacité des appareils sont l\'une des options les plus rentables pour réduire la demande énergétique, avec des coûts négatifs (économies nettes) dans de nombreux cas.',
        url: 'https://www.ipcc.ch/report/ar6/wg3/',
      },
      {
        title: 'AIE — Appliances & Equipment Efficiency 2023',
        excerpt: 'Si tous les appareils vendus aujourd\'hui respectaient les meilleures normes disponibles, la consommation électrique mondiale diminuerait de 10 %.',
        url: 'https://www.iea.org/topics/appliances-and-equipment',
      },
      {
        title: 'CLASP — Global Efficiency Standards and Labels',
        excerpt: 'Les étiquettes énergie et les normes minimales de performance ont généré 1 100 Mds$ d\'économies pour les consommateurs dans 50 pays depuis 2000.',
        url: 'https://www.clasponline.org/',
      },
    ],
    projectedImpact: {
      emissionsReductionGtCO2yr: 0.7,
      tempReductionC2100: 0.03,
      fullEffectYear: 2050,
      uncertaintyScore: 1,
    },
    prospectiveNarratives: {
      optimistic: {
        horizon: '+10 ans',
        label: 'Scénario Optimiste',
        colorClass: 'text-eb-green',
        borderClass: 'border-eb-green/30',
        text: 'Dans 10 ans, les MEPS mondiales ont éliminé les **20 % d\'appareils les plus inefficaces** du marché mondial. L\'éclairage LED représente 95 % du marché. Les climatiseurs nouvelle génération consomment **45 %** de moins qu\'en 2024. Les économies sur les factures d\'électricité atteignent **450 Mds$/an** pour les ménages mondiaux.',
      },
      moderate: {
        horizon: '+20 ans',
        label: 'Scénario Modéré',
        colorClass: 'text-yellow-400',
        borderClass: 'border-yellow-500/30',
        text: 'Dans 20 ans, les MEPS ont réduit la consommation électrique des appareils de **18 %** par rapport à 2024, mais la croissance de la demande (climatisation dans les pays chauds, multiplication des appareils connectés) a partiellement compensé les gains. La réduction nette atteint **–0,5 GtCO₂/an**.',
      },
      pessimistic: {
        horizon: '+50 ans',
        label: 'Scénario Pessimiste',
        colorClass: 'text-red-400',
        borderClass: 'border-red-500/30',
        text: 'Dans 50 ans, la croissance du parc d\'appareils dans les économies émergentes (+3 milliards de ménages accédant à la classe moyenne) a compensé presque intégralement les gains d\'efficacité. Le "rebond" énergétique (les économies réalisées sont réinvesties en consommation supplémentaire) a réduit le bénéfice climatique net à **–0,02°C**.',
      },
    },
    projections: {
      labels: [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074],
      co2: {
        baseline:  [37.4, 39,    40.5, 42,   45.1, 49.2, 54,   58,   63],
        decided:   [37.4, 38.9,  40.3, 41.7, 44.6, 48.6, 53.3, 57.3, 62.3],
        pessimist: [37.4, 38.95, 40.4, 41.8, 44.8, 48.8, 53.5, 57.5, 62.5],
      },
      temperature: {
        baseline:  [1.4, 1.5,  1.6,  1.72, 1.95, 2.2,  2.6,  3.0,  3.5],
        decided:   [1.4, 1.50, 1.59, 1.71, 1.93, 2.17, 2.57, 2.96, 3.46],
        pessimist: [1.4, 1.50, 1.60, 1.72, 1.94, 2.19, 2.58, 2.97, 3.47],
      },
    },
  },

  // ─── dec-23 — Transports en commun et mobilités actives ──────────────────
  {
    id: 'dec-23',
    sessionId: 4,
    number: '23',
    status: 'active',
    implementationLag: 2,
    title: 'Transports en commun, mobilités actives et aménagement urbain',
    description: `Le transport routier représente **12 % des émissions mondiales** de GES. L'expansion des transports en commun (métro, BRT, trains de banlieue) et des infrastructures cyclables/piétonnes réduit la dépendance à la voiture individuelle tout en améliorant la santé publique et la qualité de l'air urbain. Le GIEC AR6 WGIII souligne que la **densification urbaine** couplée aux mobilités actives peut réduire les émissions de transport de **0,8 à 1,8 GtCO₂/an** d'ici 2050. Cette décision engage **120 Mds$/an** dans les infrastructures de transport bas carbone mondial.`,
    options: [
      { id: 'pour',   label: 'Pour',       color: '#00ff88', bgClass: 'bg-eb-green/10',  borderClass: 'border-eb-green/20' },
      { id: 'contre', label: 'Contre',     color: '#ff5050', bgClass: 'bg-red-500/10',   borderClass: 'border-red-500/20'  },
      { id: 'abst',   label: 'Abstention', color: '#475569', bgClass: 'bg-slate-700/30', borderClass: 'border-slate-600/30'},
    ],
    votes: { pour: 548, contre: 163, abst: 89 },
    consensusThreshold: 67,
    deadline: '2026-03-15T18:00:00Z',
    resources: [
      {
        title: 'GIEC AR6 WGIII — Chapitre 10 : Transport',
        excerpt: 'La réduction de la demande de mobilité individuelle via l\'aménagement urbain mixte est l\'une des options à fort co-bénéfice santé/équité/climat du secteur transport.',
        url: 'https://www.ipcc.ch/report/ar6/wg3/',
      },
      {
        title: 'UITP — Public Transport and Climate Change 2023',
        excerpt: 'Un passager-km en transport en commun émet en moyenne 10 fois moins de CO₂ qu\'en voiture individuelle. Le BRT coûte 4 à 20 fois moins qu\'un métro à impact équivalent.',
        url: 'https://www.uitp.org/',
      },
      {
        title: 'OMS — Health, Environment and Climate Action Framework 2023',
        excerpt: 'La pollution atmosphérique causée par les transports tue 4 millions de personnes par an. Les mobilités actives réduisent simultanément les émissions et les maladies cardiovasculaires.',
        url: 'https://www.who.int/',
      },
    ],
    projectedImpact: {
      emissionsReductionGtCO2yr: 1.0,
      tempReductionC2100: 0.05,
      fullEffectYear: 2050,
      uncertaintyScore: 2,
    },
    prospectiveNarratives: {
      optimistic: {
        horizon: '+10 ans',
        label: 'Scénario Optimiste',
        colorClass: 'text-eb-green',
        borderClass: 'border-eb-green/30',
        text: 'Dans 10 ans, **500 villes** ont adopté des plans de mobilité durable intégrant BRT, vélo en libre-service et zones à faibles émissions. La part modale des transports en commun dépasse **40 %** dans les agglomérations couvertes. La mortalité liée à la pollution atmosphérique urbaine a baissé de **22 %**. Les émissions du transport urbain reculent de **18 %** par rapport à 2024.',
      },
      moderate: {
        horizon: '+20 ans',
        label: 'Scénario Modéré',
        colorClass: 'text-yellow-400',
        borderClass: 'border-yellow-500/30',
        text: 'Dans 20 ans, la transition vers les mobilités durables est bien engagée dans les pays de l\'OCDE, mais l\'étalement urbain persistant dans les villes émergentes freine les résultats. Les émissions du secteur baissent de **0,7 GtCO₂/an**. La résistance politique à la réduction du stationnement et à la tarification de la congestion a ralenti les ambitions.',
      },
      pessimistic: {
        horizon: '+50 ans',
        label: 'Scénario Pessimiste',
        colorClass: 'text-red-400',
        borderClass: 'border-red-500/30',
        text: 'Dans 50 ans, l\'urbanisation dans les pays du Sud a produit des mégapoles à forte dépendance automobile. Les transports en commun construits ont été sous-utilisés faute d\'une densification urbaine suffisante. Le bénéfice climatique net est limité à **–0,03°C**, mais les co-bénéfices santé dans les zones couvertes demeurent significatifs.',
      },
    },
    projections: {
      labels: [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074],
      co2: {
        baseline:  [37.4, 39,   40.5, 42,   45.1, 49.2, 54,   58,   63],
        decided:   [37.4, 38.9, 40.3, 41.6, 44.5, 48.4, 53.0, 57.0, 62.0],
        pessimist: [37.4, 38.95,40.4, 41.8, 44.7, 48.6, 53.3, 57.3, 62.3],
      },
      temperature: {
        baseline:  [1.4, 1.5,  1.6,  1.72, 1.95, 2.2,  2.6,  3.0,  3.5],
        decided:   [1.4, 1.49, 1.58, 1.70, 1.92, 2.16, 2.55, 2.95, 3.44],
        pessimist: [1.4, 1.50, 1.59, 1.71, 1.94, 2.18, 2.57, 2.97, 3.46],
      },
      societal: {
        respiratoryDiseases: { decided: [0, -0.2, -0.4, -0.8, -1.3, -2.0, -2.5, -2.5, -2.5], pessimist: [0, -0.1, -0.2, -0.5, -0.8, -1.2, -1.5, -1.5, -1.5] },
        whoHealthIndex:      { decided: [0, 0.1,  0.2,  0.4,  0.7,  1.0,  1.3,  1.5,  1.5],  pessimist: [0, 0.1,  0.1,  0.2,  0.4,  0.6,  0.8,  0.8,  0.8]  },
        lifeExpectancy:      { decided: [0, 0.02, 0.05, 0.10, 0.15, 0.20, 0.30, 0.30, 0.30], pessimist: [0, 0.01, 0.02, 0.05, 0.08, 0.10, 0.15, 0.15, 0.15] },
        climateMigrations:   { decided: [0, -0.1,-0.2, -0.3, -0.5, -0.7, -0.8, -0.8, -0.8], pessimist: [0, 0,   -0.1, -0.2, -0.3, -0.4, -0.5, -0.5, -0.5]  },
      },
    },
  },

  // ─── dec-24 — Décarbonation fret lourd, maritime et aérien ───────────────
  {
    id: 'dec-24',
    sessionId: 4,
    number: '24',
    status: 'active',
    implementationLag: 6,
    title: 'Décarbonation du fret lourd, du transport maritime et de l\'aviation',
    description: `Le transport maritime et l'aviation représentent ensemble **~2,5 % des émissions mondiales** mais leur décarbonation est techniquement difficile (longues distances, forte densité énergétique requise). Le GIEC AR6 WGIII identifie les carburants alternatifs — **ammoniac vert, méthanol vert, SAF (Sustainable Aviation Fuel)** — comme la voie principale. Cette décision établit des mandats de mélange progressifs (10 % de carburants bas carbone d'ici 2030, 50 % d'ici 2040, 100 % d'ici 2050) pour le maritime international et l'aviation, et finance la construction d'infrastructures de bunkering vert dans les 50 principaux ports mondiaux.`,
    options: [
      { id: 'pour',   label: 'Pour',       color: '#00ff88', bgClass: 'bg-eb-green/10',  borderClass: 'border-eb-green/20' },
      { id: 'contre', label: 'Contre',     color: '#ff5050', bgClass: 'bg-red-500/10',   borderClass: 'border-red-500/20'  },
      { id: 'abst',   label: 'Abstention', color: '#475569', bgClass: 'bg-slate-700/30', borderClass: 'border-slate-600/30'},
    ],
    votes: { pour: 341, contre: 267, abst: 142 },
    consensusThreshold: 67,
    deadline: '2026-03-15T18:00:00Z',
    resources: [
      {
        title: 'GIEC AR6 WGIII — Chapitre 10 : Fret longue distance',
        excerpt: 'Les carburants à zéro émission (ammoniac, méthanol, hydrogène) sont techniquement matures pour le maritime. Le défi est la disponibilité et le coût, pas la technologie.',
        url: 'https://www.ipcc.ch/report/ar6/wg3/',
      },
      {
        title: 'OMI — Stratégie révisée de réduction des GES 2023',
        excerpt: 'L\'Organisation Maritime Internationale vise des émissions zéro nettes pour le secteur maritime international d\'ici 2050 et une réduction de 20 % d\'ici 2030.',
        url: 'https://www.imo.org/',
      },
      {
        title: 'OACI — Long-Term Aspirational Goal — Net Zero 2050',
        excerpt: 'L\'aviation civile internationale s\'est engagée à atteindre la neutralité carbone nette d\'ici 2050, avec les SAF comme principale solution à court terme.',
        url: 'https://www.icao.int/',
      },
    ],
    projectedImpact: {
      emissionsReductionGtCO2yr: 0.8,
      tempReductionC2100: 0.04,
      fullEffectYear: 2060,
      uncertaintyScore: 4,
    },
    prospectiveNarratives: {
      optimistic: {
        horizon: '+10 ans',
        label: 'Scénario Optimiste',
        colorClass: 'text-eb-green',
        borderClass: 'border-eb-green/30',
        text: 'Dans 10 ans, **15 % de la flotte maritime mondiale** fonctionne à l\'ammoniac vert ou au méthanol vert. Les SAF représentent **8 %** du kérosène consommé dans l\'aviation civile. Vingt ports majeurs (Rotterdam, Singapour, Shanghai) disposent d\'infrastructures de ravitaillement en carburant vert. Les surcoûts sont partiellement absorbés par la taxe carbone maritime internationale.',
      },
      moderate: {
        horizon: '+20 ans',
        label: 'Scénario Modéré',
        colorClass: 'text-yellow-400',
        borderClass: 'border-yellow-500/30',
        text: 'Dans 20 ans, la transition progresse mais les coûts élevés des carburants alternatifs ont freiné l\'adoption au-delà des routes sous réglementation stricte. Le maritime atteint **35 %** de carburants verts, l\'aviation **18 %**. La demande mondiale de fret aérien a continué de croître, compensant partiellement les gains d\'efficacité. La réduction nette atteint **–0,5 GtCO₂/an**.',
      },
      pessimistic: {
        horizon: '+50 ans',
        label: 'Scénario Pessimiste',
        colorClass: 'text-red-400',
        borderClass: 'border-red-500/30',
        text: 'Dans 50 ans, la compétition entre l\'ammoniac vert pour le maritime et l\'hydrogène vert pour l\'industrie a créé des tensions d\'approvisionnement. L\'aviation a multiplié par 2,5 son trafic depuis 2024, annulant les gains de l\'efficacité et des SAF. Le bénéfice climatique net reste à **–0,03°C** malgré les mandats.',
      },
    },
    projections: {
      labels: [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074],
      co2: {
        baseline:  [37.4, 39,   40.5, 42,   45.1, 49.2, 54,   58,   63],
        decided:   [37.4, 39,   40.5, 42,   45.0, 48.9, 53.5, 57.3, 62.2],
        pessimist: [37.4, 39,   40.5, 42,   45.05,49.05,53.7, 57.6, 62.5],
      },
      temperature: {
        baseline:  [1.4, 1.5,  1.6,  1.72, 1.95, 2.2,  2.6,  3.0,  3.5],
        decided:   [1.4, 1.5,  1.6,  1.72, 1.95, 2.19, 2.58, 2.97, 3.46],
        pessimist: [1.4, 1.5,  1.6,  1.72, 1.95, 2.20, 2.59, 2.98, 3.47],
      },
      energyMix: {
        autres: { decided: [0, 0, 0, 0, 0.5, 1.5, 3.0, 4.0, 5.0], pessimist: [0, 0, 0, 0, 0.2, 0.8, 1.5, 2.0, 2.5] },
        oil:    { decided: [0, 0, 0, 0, -0.3,-0.8,-1.5,-2.0,-2.5], pessimist: [0, 0, 0, 0, -0.1,-0.4,-0.8,-1.0,-1.2] },
      },
    },
    prerequisites: {
      policiesRequired: ['dec-18'],
    },
  },

  // ─── dec-25 — Électrification chaleur industrielle ────────────────────────
  {
    id: 'dec-25',
    sessionId: 4,
    number: '25',
    status: 'active',
    implementationLag: 4,
    title: 'Électrification de la chaleur industrielle et pompes à chaleur haute température',
    description: `La chaleur industrielle représente **~20 % des émissions mondiales** de GES. La majorité des procédés industriels nécessitant moins de **200°C** (chimie fine, agroalimentaire, blanchisseries, séchage) peuvent être électrifiés via des **pompes à chaleur haute température** (rendement 2 à 5 fois supérieur à la résistance électrique). Pour les procédés à haute température (acier, ciment, verre), l'arc électrique et le plasma sont des alternatives en développement. Cette décision finance la conversion électrique de **30 % des procédés thermiques industriels** d'ici 2040 via des subventions à la conversion et des prêts bonifiés.`,
    options: [
      { id: 'pour',   label: 'Pour',       color: '#00ff88', bgClass: 'bg-eb-green/10',  borderClass: 'border-eb-green/20' },
      { id: 'contre', label: 'Contre',     color: '#ff5050', bgClass: 'bg-red-500/10',   borderClass: 'border-red-500/20'  },
      { id: 'abst',   label: 'Abstention', color: '#475569', bgClass: 'bg-slate-700/30', borderClass: 'border-slate-600/30'},
    ],
    votes: { pour: 403, contre: 214, abst: 118 },
    consensusThreshold: 67,
    deadline: '2026-03-15T18:00:00Z',
    resources: [
      {
        title: 'GIEC AR6 WGIII — Chapitre 11 : Industrie',
        excerpt: 'L\'électrification de la chaleur industrielle basse et moyenne température est économiquement viable dès aujourd\'hui pour de nombreux procédés, avec un coût de réduction inférieur à 50 $/tCO₂.',
        url: 'https://www.ipcc.ch/report/ar6/wg3/',
      },
      {
        title: 'AIE — Electrification of Heat in Industrial Processes 2022',
        excerpt: 'Les pompes à chaleur haute température peuvent couvrir 20 % de la demande de chaleur industrielle mondiale, soit 1,5 GtCO₂/an de réduction potentielle.',
        url: 'https://www.iea.org/',
      },
      {
        title: 'Heat Pump Association — Industrial Heat Pump Technology 2023',
        excerpt: 'Les pompes à chaleur industrielles atteignent désormais des températures de 160°C. Le marché croît de 25 % par an dans les pays pionniers (Danemark, Pays-Bas, Allemagne).',
        url: 'https://www.heatpumps.org.uk/',
      },
    ],
    projectedImpact: {
      emissionsReductionGtCO2yr: 1.5,
      tempReductionC2100: 0.06,
      fullEffectYear: 2060,
      uncertaintyScore: 3,
    },
    prospectiveNarratives: {
      optimistic: {
        horizon: '+10 ans',
        label: 'Scénario Optimiste',
        colorClass: 'text-eb-green',
        borderClass: 'border-eb-green/30',
        text: 'Dans 10 ans, **8 000 pompes à chaleur industrielles haute température** sont opérationnelles dans l\'Union européenne, au Japon et en Corée du Sud. L\'industrie agroalimentaire européenne a réduit ses émissions thermiques de **38 %**. Les séchoirs à biomasse et papeteries fonctionnent à l\'électricité renouvelable. Le coût moyen de la chaleur électrique est inférieur à celui du gaz naturel dans les zones à forte pénétration renouvelable.',
      },
      moderate: {
        horizon: '+20 ans',
        label: 'Scénario Modéré',
        colorClass: 'text-yellow-400',
        borderClass: 'border-yellow-500/30',
        text: 'Dans 20 ans, l\'électrification couvre **20 %** de la chaleur industrielle mondiale. La transition est rapide pour les températures inférieures à 100°C mais lente pour les procédés haute température (verre, ciment, métallurgie). La dépendance résiduelle au gaz naturel persiste pour la chaleur process à haute température. Réduction nette : **–1,0 GtCO₂/an**.',
      },
      pessimistic: {
        horizon: '+50 ans',
        label: 'Scénario Pessimiste',
        colorClass: 'text-red-400',
        borderClass: 'border-red-500/30',
        text: 'Dans 50 ans, les procédés industriels haute température (>500°C) résistent toujours à l\'électrification par manque de solutions commerciales matures. La croissance industrielle dans les pays émergents compense les gains obtenus dans les pays de l\'OCDE. La réduction nette reste positive mais insuffisante : **–0,04°C**.',
      },
    },
    projections: {
      labels: [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074],
      co2: {
        baseline:  [37.4, 39,   40.5, 42,   45.1, 49.2, 54,   58,   63],
        decided:   [37.4, 39,   40.5, 41.8, 44.6, 48.3, 52.7, 56.5, 61.4],
        pessimist: [37.4, 39,   40.5, 41.9, 44.8, 48.7, 53.2, 57.0, 61.9],
      },
      temperature: {
        baseline:  [1.4, 1.5,  1.6,  1.72, 1.95, 2.2,  2.6,  3.0,  3.5],
        decided:   [1.4, 1.5,  1.6,  1.71, 1.93, 2.16, 2.54, 2.93, 3.42],
        pessimist: [1.4, 1.5,  1.6,  1.72, 1.94, 2.18, 2.57, 2.96, 3.45],
      },
      energyMix: {
        solar: { decided: [0, 0, 0, 0.3, 1.0, 2.5, 4.0, 5.0, 5.5], pessimist: [0, 0, 0, 0.1, 0.5, 1.2, 2.0, 2.5, 3.0] },
        gas:   { decided: [0, 0, 0,-0.2,-0.5,-0.9,-1.3,-1.5,-1.6], pessimist: [0, 0, 0,-0.1,-0.3,-0.5,-0.8,-1.0,-1.1] },
      },
    },
    prerequisites: {
      policiesRequired: ['dec-08'],
    },
  },

  // ─── dec-26 — Capture et utilisation du carbone (CCU) ────────────────────
  {
    id: 'dec-26',
    sessionId: 4,
    number: '26',
    status: 'active',
    implementationLag: 6,
    title: 'Capture et utilisation du carbone (CCU) dans le ciment et la chimie',
    description: `Les industries du **ciment** (~8 % des émissions mondiales) et de la **chimie** (~4 %) génèrent des émissions dites "incontournables" — liées à des réactions chimiques fondamentales, pas seulement à la combustion. La capture et utilisation du carbone (CCU) transforme le CO₂ capturé en matières premières (méthanol, e-fuels, agrégats minéraux). Le GIEC AR6 WGIII évalue le potentiel de la CCU industrielle à **0,3 à 1,3 GtCO₂/an** d'ici 2050. Cette décision finance la démonstration de 50 projets CCU industriels et établit un marché de crédits carbone certifiés pour le CO₂ utilisé.`,
    options: [
      { id: 'pour',   label: 'Pour',       color: '#00ff88', bgClass: 'bg-eb-green/10',  borderClass: 'border-eb-green/20' },
      { id: 'contre', label: 'Contre',     color: '#ff5050', bgClass: 'bg-red-500/10',   borderClass: 'border-red-500/20'  },
      { id: 'abst',   label: 'Abstention', color: '#475569', bgClass: 'bg-slate-700/30', borderClass: 'border-slate-600/30'},
    ],
    votes: { pour: 287, contre: 298, abst: 175 },
    consensusThreshold: 67,
    deadline: '2026-03-15T18:00:00Z',
    resources: [
      {
        title: 'GIEC AR6 WGIII — Chapitre 11 : Émissions industrielles incontournables',
        excerpt: 'La CCU peut traiter une partie des émissions incontournables du ciment et de la chimie, mais son bilan carbone net dépend de l\'énergie utilisée pour la capture et la conversion.',
        url: 'https://www.ipcc.ch/report/ar6/wg3/',
      },
      {
        title: 'Global CCS Institute — Status of CCS 2023',
        excerpt: '41 projets CCS/CCU sont en opération dans le monde, capturant 50 MtCO₂/an. Le potentiel technique est 100 fois supérieur aux capacités actuelles.',
        url: 'https://www.globalccsinstitute.com/',
      },
      {
        title: 'Cembureau — Carbon Neutrality Roadmap 2050',
        excerpt: 'Le CCS/CCU est indispensable pour neutraliser les 60 % d\'émissions du ciment liées à la décarbonatation du calcaire, irréductibles par l\'efficacité ou le combustible.',
        url: 'https://cembureau.eu/',
      },
    ],
    projectedImpact: {
      emissionsReductionGtCO2yr: 0.5,
      tempReductionC2100: 0.03,
      fullEffectYear: 2060,
      uncertaintyScore: 4,
    },
    prospectiveNarratives: {
      optimistic: {
        horizon: '+10 ans',
        label: 'Scénario Optimiste',
        colorClass: 'text-eb-green',
        borderClass: 'border-eb-green/30',
        text: 'Dans 10 ans, **25 cimenteries** opèrent avec capture de carbone intégrée en Europe, au Japon et en Amérique du Nord. Le CO₂ capturé est valorisé en béton minéralisé et en méthanol de synthèse. Le coût de production du ciment bas carbone n\'est supérieur que de **15 %** au ciment conventionnel. Un standard ISO de "ciment zéro-carbone certifié" est adopté.',
      },
      moderate: {
        horizon: '+20 ans',
        label: 'Scénario Modéré',
        colorClass: 'text-yellow-400',
        borderClass: 'border-yellow-500/30',
        text: 'Dans 20 ans, la CCU ciment/chimie capture **200 MtCO₂/an** — significatif mais en deçà du potentiel. Les contraintes d\'approvisionnement en électricité bas carbone pour la capture limitent le déploiement dans les pays à mix électrique encore carboné. La réduction nette atteint **–0,3 GtCO₂/an**.',
      },
      pessimistic: {
        horizon: '+50 ans',
        label: 'Scénario Pessimiste',
        colorClass: 'text-red-400',
        borderClass: 'border-red-500/30',
        text: 'Dans 50 ans, la CCU a peiné à sortir du stade de la démonstration à grande échelle dans les pays émergents, qui produisent 70 % du ciment mondial. Le marché des crédits CCU a souffert de problèmes de certification et de double comptage. Le bénéfice climatique net reste à **–0,02°C**.',
      },
    },
    projections: {
      labels: [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074],
      co2: {
        baseline:  [37.4, 39,   40.5, 42,   45.1, 49.2, 54,   58,   63],
        decided:   [37.4, 39,   40.5, 42,   45.0, 49.0, 53.6, 57.5, 62.4],
        pessimist: [37.4, 39,   40.5, 42,   45.05,49.1, 53.8, 57.7, 62.6],
      },
      temperature: {
        baseline:  [1.4, 1.5,  1.6,  1.72, 1.95, 2.2,  2.6,  3.0,  3.5],
        decided:   [1.4, 1.5,  1.6,  1.72, 1.95, 2.20, 2.58, 2.97, 3.46],
        pessimist: [1.4, 1.5,  1.6,  1.72, 1.95, 2.20, 2.59, 2.98, 3.47],
      },
    },
    prerequisites: {
      policiesRequired: ['dec-11'],
    },
  },

  // ─── dec-27 — Sobriété énergétique et modes de vie ────────────────────────
  {
    id: 'dec-27',
    sessionId: 4,
    number: '27',
    status: 'active',
    implementationLag: 2,
    title: 'Sobriété énergétique et changements de modes de vie',
    description: `Le GIEC AR6 WGIII consacre pour la première fois un chapitre entier aux **changements de modes de vie et de comportements** comme option de mitigation. L'alimentation bas carbone, la réduction des voyages en avion, la diminution de la surface habitable, le partage de biens et la réduction du gaspillage alimentaire ont un potentiel cumulé de **1,5 à 2,5 GtCO₂/an** d'ici 2030. Cette décision propose des politiques incitant la sobriété : taxation des comportements carbonés, subvention aux mobilités douces, labels nutritionnels carbone, campagnes éducatives et réforme des normes sociales.`,
    options: [
      { id: 'pour',   label: 'Pour',       color: '#00ff88', bgClass: 'bg-eb-green/10',  borderClass: 'border-eb-green/20' },
      { id: 'contre', label: 'Contre',     color: '#ff5050', bgClass: 'bg-red-500/10',   borderClass: 'border-red-500/20'  },
      { id: 'abst',   label: 'Abstention', color: '#475569', bgClass: 'bg-slate-700/30', borderClass: 'border-slate-600/30'},
    ],
    votes: { pour: 467, contre: 312, abst: 201 },
    consensusThreshold: 67,
    deadline: '2026-03-15T18:00:00Z',
    resources: [
      {
        title: 'GIEC AR6 WGIII — Chapitre 5 : Demande, services et changements sociaux',
        excerpt: 'Des changements de comportement dans les pays à hauts revenus pourraient réduire les émissions de 40 à 70 % d\'ici 2050, sans réduction de bien-être subjectif.',
        url: 'https://www.ipcc.ch/report/ar6/wg3/',
      },
      {
        title: 'Oxfam — Carbon Inequality Report 2023',
        excerpt: 'Les 10 % les plus riches de la population mondiale sont responsables de 48 % des émissions mondiales. Des politiques de sobriété ciblées sur les hauts revenus ont un fort potentiel.',
        url: 'https://www.oxfam.org/',
      },
      {
        title: 'Shift Project — Décarboner la mobilité 2023',
        excerpt: 'La réduction du trafic aérien dans les pays riches (notamment les vols court-courrier substituables au train) représente un des leviers les plus rapides et les moins coûteux.',
        url: 'https://theshiftproject.org/',
      },
    ],
    projectedImpact: {
      emissionsReductionGtCO2yr: 1.5,
      tempReductionC2100: 0.06,
      fullEffectYear: 2050,
      uncertaintyScore: 3,
    },
    prospectiveNarratives: {
      optimistic: {
        horizon: '+10 ans',
        label: 'Scénario Optimiste',
        colorClass: 'text-eb-green',
        borderClass: 'border-eb-green/30',
        text: 'Dans 10 ans, les régimes alimentaires ont évolué : la consommation de viande rouge a baissé de **28 %** dans les pays de l\'OCDE. Le nombre de passagers aériens court-courrier recule de **22 %** grâce à la taxation et au développement du train. Le label "empreinte carbone" est obligatoire sur tous les produits en Europe. Les émissions liées à la demande des ménages riches baissent de **18 %**.',
      },
      moderate: {
        horizon: '+20 ans',
        label: 'Scénario Modéré',
        colorClass: 'text-yellow-400',
        borderClass: 'border-yellow-500/30',
        text: 'Dans 20 ans, la sobriété progresse mais se heurte à des inégalités structurelles : les ménages modestes ont peu de marge de sobriété, tandis que les plus aisés compensent leurs efforts par d\'autres consommations. La réduction nette atteint **–1,0 GtCO₂/an** — moins que le potentiel théorique, mais avec d\'importants co-bénéfices santé.',
      },
      pessimistic: {
        horizon: '+50 ans',
        label: 'Scénario Pessimiste',
        colorClass: 'text-red-400',
        borderClass: 'border-red-500/30',
        text: 'Dans 50 ans, les campagnes de sobriété ont buté sur l\'effet rebond systémique : les économies réalisées ont été réinvesties en nouvelles consommations. La croissance de la classe moyenne mondiale a amplifié la consommation globale. Le bénéfice climatique net reste positif (**–0,04°C**) mais les co-bénéfices santé et qualité de vie dans les zones pionnières sont substantiels.',
      },
    },
    projections: {
      labels: [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074],
      co2: {
        baseline:  [37.4, 39,   40.5, 42,   45.1, 49.2, 54,   58,   63],
        decided:   [37.4, 38.9, 40.2, 41.4, 44.2, 48.0, 52.5, 56.5, 61.5],
        pessimist: [37.4, 38.95,40.35,41.7, 44.6, 48.5, 53.1, 57.1, 62.1],
      },
      temperature: {
        baseline:  [1.4, 1.5,  1.6,  1.72, 1.95, 2.2,  2.6,  3.0,  3.5],
        decided:   [1.4, 1.49, 1.58, 1.69, 1.91, 2.14, 2.53, 2.92, 3.41],
        pessimist: [1.4, 1.50, 1.59, 1.71, 1.94, 2.17, 2.56, 2.95, 3.44],
      },
      societal: {
        foodSecurity:      { decided: [0, 0.1,  0.3,  0.5,  0.8,  1.2,  1.5,  1.5,  1.5],  pessimist: [0, 0,    0.1,  0.2,  0.4,  0.6,  0.8,  0.8,  0.8]  },
        whoHealthIndex:    { decided: [0, 0.1,  0.2,  0.4,  0.7,  1.0,  1.3,  1.3,  1.3],  pessimist: [0, 0,    0.1,  0.2,  0.4,  0.6,  0.8,  0.8,  0.8]  },
        giniCoefficient:   { decided: [0,-0.001,-0.002,-0.003,-0.004,-0.005,-0.006,-0.006,-0.006], pessimist: [0, 0,-0.001,-0.001,-0.002,-0.003,-0.004,-0.004,-0.004] },
        wealthConcentration:{ decided: [0,-0.2,-0.4, -0.6, -0.9, -1.2, -1.5, -1.5, -1.5], pessimist: [0,-0.1,-0.2, -0.3, -0.5, -0.7, -0.9, -0.9, -0.9]  },
        climateMigrations: { decided: [0,-0.1,-0.2,  -0.4, -0.6, -0.9, -1.2, -1.2, -1.2], pessimist: [0, 0,  -0.1, -0.2, -0.4, -0.5, -0.7, -0.7, -0.7]  },
      },
    },
  },

  // ─── dec-28 — Finance climatique internationale ───────────────────────────
  {
    id: 'dec-28',
    sessionId: 4,
    number: '28',
    status: 'active',
    implementationLag: 2,
    title: 'Finance climatique internationale : 100 Mds$/an vers les pays en développement',
    description: `La promesse de **100 milliards de dollars par an** de financements climatiques faite par les pays développés en 2009 (Accord de Copenhague) n'a jamais été pleinement tenue. Le Nouveau Cadre de Finance Climatique Quantifié (NCQG) fixe désormais l'objectif à **300 Mds$/an** d'ici 2035. Le GIEC AR6 souligne que sans financement adéquat, les pays en développement — responsables de moins d'1 tonne de CO₂ par habitant — ne peuvent pas accélérer leur transition. Cette décision entérine et opérationnalise un mécanisme contraignant de transfert de capitaux bas carbone.`,
    options: [
      { id: 'pour',   label: 'Pour',       color: '#00ff88', bgClass: 'bg-eb-green/10',  borderClass: 'border-eb-green/20' },
      { id: 'contre', label: 'Contre',     color: '#ff5050', bgClass: 'bg-red-500/10',   borderClass: 'border-red-500/20'  },
      { id: 'abst',   label: 'Abstention', color: '#475569', bgClass: 'bg-slate-700/30', borderClass: 'border-slate-600/30'},
    ],
    votes: { pour: 523, contre: 241, abst: 136 },
    consensusThreshold: 67,
    deadline: '2026-03-15T18:00:00Z',
    resources: [
      {
        title: 'GIEC AR6 WGIII — Chapitre 13 : Finance internationale et coopération',
        excerpt: 'Le flux de capitaux vers les pays en développement est 3 à 6 fois inférieur aux besoins estimés pour leurs trajectoires de développement bas carbone.',
        url: 'https://www.ipcc.ch/report/ar6/wg3/',
      },
      {
        title: 'UNFCCC — NCQG New Collective Quantified Goal on Climate Finance',
        excerpt: 'COP29 (Bakou, 2024) a adopté un objectif de 300 Mds$/an de financements publics et de 1 300 Mds$/an de financements totaux d\'ici 2035.',
        url: 'https://unfccc.int/',
      },
      {
        title: 'Overseas Development Institute — Climate Finance Tracker 2023',
        excerpt: 'Chaque dollar de finance climatique publique mobilise 2 à 5 dollars de capitaux privés. Le levier est crucial pour l\'ampleur de la transition.',
        url: 'https://odi.org/',
      },
    ],
    projectedImpact: {
      emissionsReductionGtCO2yr: 1.0,
      tempReductionC2100: 0.05,
      fullEffectYear: 2050,
      uncertaintyScore: 3,
    },
    prospectiveNarratives: {
      optimistic: {
        horizon: '+10 ans',
        label: 'Scénario Optimiste',
        colorClass: 'text-eb-green',
        borderClass: 'border-eb-green/30',
        text: 'Dans 10 ans, **280 Mds$** de financements climatiques sont acheminés annuellement vers les pays en développement via des mécanismes transparents et contraignants. L\'Afrique subsaharienne installe **150 GW** de solaire décentralisé, sautant l\'étape des réseaux centralisés fossiles. Trente pays à faibles revenus ont atteint **50 %** de renouvelables dans leur mix électrique.',
      },
      moderate: {
        horizon: '+20 ans',
        label: 'Scénario Modéré',
        colorClass: 'text-yellow-400',
        borderClass: 'border-yellow-500/30',
        text: 'Dans 20 ans, les financements climatiques ont permis des transitions accélérées dans **40 pays** à revenus intermédiaires. Mais les pays les plus pauvres (PMA) restent sous-financés, faute de capacité d\'absorption institutionnelle. La réduction nette atteint **–0,7 GtCO₂/an**. Les co-bénéfices développement (accès à l\'énergie, emploi) sont considérables.',
      },
      pessimistic: {
        horizon: '+50 ans',
        label: 'Scénario Pessimiste',
        colorClass: 'text-red-400',
        borderClass: 'border-red-500/30',
        text: 'Dans 50 ans, une partie des financements a été détournée ou mal allouée. La conditionnalité excessive imposée par les pays donateurs a freiné les décaissements. Les pays en développement, dont les émissions représentent la majorité de la croissance mondiale des émissions, ont suivi des trajectoires partiellement fossiles. Réduction nette : **–0,03°C** malgré les montants engagés.',
      },
    },
    projections: {
      labels: [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074],
      co2: {
        baseline:  [37.4, 39,    40.5, 42,   45.1, 49.2, 54,   58,   63],
        decided:   [37.4, 38.95, 40.3, 41.6, 44.4, 48.2, 53.0, 57.0, 62.0],
        pessimist: [37.4, 38.98, 40.4, 41.8, 44.7, 48.6, 53.3, 57.3, 62.3],
      },
      temperature: {
        baseline:  [1.4, 1.5,  1.6,  1.72, 1.95, 2.2,  2.6,  3.0,  3.5],
        decided:   [1.4, 1.50, 1.59, 1.70, 1.92, 2.15, 2.54, 2.94, 3.43],
        pessimist: [1.4, 1.50, 1.60, 1.71, 1.94, 2.18, 2.57, 2.96, 3.46],
      },
      societal: {
        foodSecurity:    { decided: [0, 0.1, 0.3, 0.6,  1.0,  1.5,  2.0,  2.0,  2.0],  pessimist: [0, 0,    0.1,  0.3,  0.5,  0.8,  1.0,  1.0,  1.0]  },
        waterAccess:     { decided: [0, 0.1, 0.3, 0.5,  0.9,  1.3,  1.5,  1.5,  1.5],  pessimist: [0, 0,    0.1,  0.3,  0.5,  0.7,  1.0,  1.0,  1.0]  },
        educationAccess: { decided: [0, 0.1, 0.2, 0.4,  0.7,  1.0,  1.3,  1.3,  1.3],  pessimist: [0, 0,    0.1,  0.2,  0.4,  0.6,  0.8,  0.8,  0.8]  },
        lifeExpectancy:  { decided: [0, 0.05,0.1, 0.2,  0.35, 0.5,  0.7,  0.7,  0.7],  pessimist: [0, 0.02, 0.05, 0.1,  0.2,  0.3,  0.4,  0.4,  0.4]  },
        climateMigrations:{ decided: [0,-0.1,-0.3,-0.5,-0.8, -1.2, -1.5, -1.5, -1.5], pessimist: [0, 0,   -0.1, -0.3, -0.5, -0.7, -0.9, -0.9, -0.9]  },
      },
    },
  },

  // ─── dec-29 — Écosystèmes côtiers ────────────────────────────────────────
  {
    id: 'dec-29',
    sessionId: 4,
    number: '29',
    status: 'active',
    implementationLag: 2,
    title: 'Protection et restauration des écosystèmes côtiers (mangroves, herbiers, zones humides)',
    description: `Les écosystèmes côtiers — **mangroves, herbiers marins (seagrasses), marais salants** — séquestrent du carbone à des taux jusqu'à **5 fois supérieurs** aux forêts terrestres et le stockent dans les sédiments pour des millénaires. On parle de **carbone bleu**. Ces écosystèmes sont également des remparts contre les tempêtes, des nurseries pour la pêche et des refuges de biodiversité. Pourtant, 50 % des mangroves mondiales ont disparu depuis 1950. Cette décision finance la protection de **100 % des mangroves restantes** et la restauration de **5 millions d'hectares** d'ici 2040.`,
    options: [
      { id: 'pour',   label: 'Pour',       color: '#00ff88', bgClass: 'bg-eb-green/10',  borderClass: 'border-eb-green/20' },
      { id: 'contre', label: 'Contre',     color: '#ff5050', bgClass: 'bg-red-500/10',   borderClass: 'border-red-500/20'  },
      { id: 'abst',   label: 'Abstention', color: '#475569', bgClass: 'bg-slate-700/30', borderClass: 'border-slate-600/30'},
    ],
    votes: { pour: 612, contre: 98, abst: 64 },
    consensusThreshold: 67,
    deadline: '2026-03-15T18:00:00Z',
    resources: [
      {
        title: 'GIEC AR6 WGII — Chapitre 3 : Océans et zones côtières',
        excerpt: 'Les écosystèmes côtiers (carbone bleu) séquestrent 0,4 à 1,4 GtCO₂/an à l\'échelle mondiale. Leur destruction libère du carbone stocké depuis des siècles.',
        url: 'https://www.ipcc.ch/report/ar6/wg2/',
      },
      {
        title: 'IUCN — Blue Carbon Initiative 2023',
        excerpt: 'Les mangroves, herbiers et marais côtiers couvrent moins de 1 % de la superficie océanique mais représentent 14 % du carbone organique séquestré dans les océans.',
        url: 'https://www.iucn.org/resources/issues-brief/blue-carbon',
      },
      {
        title: 'Nature Conservancy — Mangrove Restoration Potential Map',
        excerpt: '68 % des côtes mondiales dégradées ont un potentiel de restauration des mangroves. Le coût de restauration est de 1 500 à 8 000 $/ha — très inférieur au coût des dommages climatiques évités.',
        url: 'https://www.nature.org/',
      },
    ],
    projectedImpact: {
      emissionsReductionGtCO2yr: 0.5,
      tempReductionC2100: 0.03,
      fullEffectYear: 2050,
      uncertaintyScore: 2,
    },
    prospectiveNarratives: {
      optimistic: {
        horizon: '+10 ans',
        label: 'Scénario Optimiste',
        colorClass: 'text-eb-green',
        borderClass: 'border-eb-green/30',
        text: 'Dans 10 ans, **100 % des mangroves existantes** sont sous protection légale internationale. 2 millions d\'hectares sont restaurés en Asie du Sud-Est, en Afrique de l\'Ouest et en Amérique centrale. Les herbiers marins dans les zones marines protégées ont augmenté de **35 %**. Les récifs coralliens adjacents bénéficient de la réduction de l\'eutrophisation. Les communautés côtières constatent une résilience accrue aux tempêtes.',
      },
      moderate: {
        horizon: '+20 ans',
        label: 'Scénario Modéré',
        colorClass: 'text-yellow-400',
        borderClass: 'border-yellow-500/30',
        text: 'Dans 20 ans, la restauration couvre **3,5 millions d\'hectares** mais la pression de l\'aquaculture intensive et du développement côtier continue de menacer les mangroves dans plusieurs pays. L\'élévation du niveau de la mer compromet la restauration dans les zones les plus exposées. La séquestration nette atteint **–0,35 GtCO₂/an**.',
      },
      pessimistic: {
        horizon: '+50 ans',
        label: 'Scénario Pessimiste',
        colorClass: 'text-red-400',
        borderClass: 'border-red-500/30',
        text: 'Dans 50 ans, l\'élévation du niveau de la mer de 60 à 100 cm a submergé une partie des zones restaurées. La pression démographique côtière dans les pays tropicaux a repris son grignotage des mangroves malgré les protections. Le carbone bleu ne représente qu\'une fraction du potentiel initial : **–0,02°C**.',
      },
    },
    projections: {
      labels: [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074],
      co2: {
        baseline:  [37.4, 39,    40.5, 42,   45.1, 49.2, 54,   58,   63],
        decided:   [37.4, 38.95, 40.4, 41.8, 44.8, 48.8, 53.5, 57.5, 62.5],
        pessimist: [37.4, 38.98, 40.45,41.9, 44.9, 48.9, 53.65,57.65,62.65],
      },
      temperature: {
        baseline:  [1.4, 1.5,  1.6,  1.72, 1.95, 2.2,  2.6,  3.0,  3.5],
        decided:   [1.4, 1.50, 1.60, 1.72, 1.94, 2.19, 2.58, 2.98, 3.47],
        pessimist: [1.4, 1.50, 1.60, 1.72, 1.94, 2.20, 2.59, 2.99, 3.48],
      },
      forest: {
        baseline:  [58.0, 57.5, 57.0, 56.5, 55.3, 53.5, 50.5, 47.5, 43.5],
        decided:   [58.0, 57.6, 57.2, 56.8, 55.8, 54.1, 51.2, 48.2, 44.2],
        pessimist: [58.0, 57.5, 57.1, 56.6, 55.5, 53.8, 50.8, 47.8, 43.8],
      },
      societal: {
        foodSecurity:    { decided: [0, 0.1, 0.2, 0.3, 0.5, 0.8, 1.0, 1.0, 1.0], pessimist: [0, 0,   0.1, 0.2, 0.3, 0.5, 0.7, 0.7, 0.7] },
        waterTensions:   { decided: [0,-0.1,-0.2,-0.3,-0.5,-0.7,-0.9,-0.9,-0.9], pessimist: [0, 0,  -0.1,-0.2,-0.3,-0.5,-0.6,-0.6,-0.6] },
        climateMigrations:{ decided: [0,-0.1,-0.2,-0.3,-0.5,-0.8,-1.0,-1.0,-1.0], pessimist: [0, 0,  -0.1,-0.2,-0.3,-0.5,-0.7,-0.7,-0.7] },
      },
    },
    prerequisites: {
      policiesRequired: ['dec-03'],
    },
  },

  // ─── dec-30 — Réduction N₂O agricole et méthane bétail ────────────────────
  {
    id: 'dec-30',
    sessionId: 4,
    number: '30',
    status: 'active',
    implementationLag: 2,
    title: 'Réduction du N₂O agricole et des émissions entériques du bétail',
    description: `L'agriculture est responsable de **~10 % des émissions mondiales** de GES, dont une grande part provient des **émissions entériques** (méthane produit par la fermentation digestive des ruminants) et du **protoxyde d'azote (N₂O)** issu des engrais azotés. Ces gaz ont un pouvoir de réchauffement 28 à 265 fois supérieur au CO₂. Le GIEC AR6 évalue le potentiel de réduction à **1,0 à 1,5 GtCO₂e/an** d'ici 2050 grâce aux **additifs alimentaires** (Bovaer, algues rouges), aux nouvelles formulations d'engrais et aux pratiques agricoles de précision.`,
    options: [
      { id: 'pour',   label: 'Pour',       color: '#00ff88', bgClass: 'bg-eb-green/10',  borderClass: 'border-eb-green/20' },
      { id: 'contre', label: 'Contre',     color: '#ff5050', bgClass: 'bg-red-500/10',   borderClass: 'border-slate-600/30'},
      { id: 'abst',   label: 'Abstention', color: '#475569', bgClass: 'bg-slate-700/30', borderClass: 'border-slate-600/30'},
    ],
    votes: { pour: 456, contre: 187, abst: 122 },
    consensusThreshold: 67,
    deadline: '2026-03-15T18:00:00Z',
    resources: [
      {
        title: 'GIEC AR6 WGIII — Chapitre 7 : Agriculture, forêts et utilisation des terres',
        excerpt: 'Les pratiques agricoles améliorées, les additifs alimentaires pour bovins et la gestion optimisée des engrais peuvent réduire les émissions agricoles de 30 à 40 % d\'ici 2050.',
        url: 'https://www.ipcc.ch/report/ar6/wg3/',
      },
      {
        title: 'FAO — Reducing enteric methane for improving food security and livelihoods',
        excerpt: 'Le méthane entérique représente 14,5 % des émissions mondiales de GES. L\'additif Bovaer réduit les émissions de méthane bovines de 30 % avec des effets positifs sur la productivité.',
        url: 'https://www.fao.org/',
      },
      {
        title: 'Science — 3-NOP additive reduces methane emissions 26-30% (2021)',
        excerpt: 'L\'additif alimentaire 3-nitrooxypropanol, approuvé en Europe en 2022, réduit les émissions entériques des bovins laitiers de 26 à 30 % sans impact sur la production laitière.',
        url: 'https://www.science.org/',
      },
    ],
    projectedImpact: {
      emissionsReductionGtCO2yr: 1.0,
      tempReductionC2100: 0.04,
      fullEffectYear: 2050,
      uncertaintyScore: 2,
    },
    prospectiveNarratives: {
      optimistic: {
        horizon: '+10 ans',
        label: 'Scénario Optimiste',
        colorClass: 'text-eb-green',
        borderClass: 'border-eb-green/30',
        text: 'Dans 10 ans, **60 %** du bétail bovin dans les pays de l\'OCDE reçoit des additifs alimentaires réducteurs de méthane. Les engrais à inhibiteurs de nitrification sont obligatoires pour les grandes exploitations en Europe et en Amérique du Nord. Les émissions agricoles de GES ont baissé de **18 %** par rapport à 2024. Le méthane atmosphérique commence à se stabiliser.',
      },
      moderate: {
        horizon: '+20 ans',
        label: 'Scénario Modéré',
        colorClass: 'text-yellow-400',
        borderClass: 'border-yellow-500/30',
        text: 'Dans 20 ans, les additifs se généralisent dans les pays développés mais restent peu accessibles aux éleveurs des pays à faibles revenus. La demande mondiale de viande bovine continue de croître dans les pays émergents. La réduction nette atteint **–0,7 GtCO₂e/an** — significative, mais compensée partiellement par la croissance du cheptel mondial.',
      },
      pessimistic: {
        horizon: '+50 ans',
        label: 'Scénario Pessimiste',
        colorClass: 'text-red-400',
        borderClass: 'border-red-500/30',
        text: 'Dans 50 ans, la résistance des filières agricoles et le lobbying des producteurs d\'engrais ont ralenti l\'adoption des nouvelles pratiques dans les économies émergentes. La croissance du cheptel mondial (+40 %) a annulé une grande partie des gains de rendement. La réduction nette reste positive (**–0,03°C**) mais l\'agriculture demeure un secteur d\'émissions net.',
      },
    },
    projections: {
      labels: [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074],
      co2: {
        baseline:  [37.4, 39,   40.5, 42,   45.1, 49.2, 54,   58,   63],
        decided:   [37.4, 38.9, 40.3, 41.6, 44.5, 48.4, 53.0, 57.0, 62.0],
        pessimist: [37.4, 38.95,40.4, 41.8, 44.8, 48.7, 53.3, 57.3, 62.3],
      },
      temperature: {
        baseline:  [1.4, 1.5,  1.6,  1.72, 1.95, 2.2,  2.6,  3.0,  3.5],
        decided:   [1.4, 1.49, 1.58, 1.70, 1.92, 2.16, 2.55, 2.95, 3.44],
        pessimist: [1.4, 1.50, 1.59, 1.71, 1.94, 2.18, 2.57, 2.97, 3.46],
      },
      societal: {
        foodSecurity:  { decided: [0, 0.1, 0.2, 0.4, 0.6, 0.9, 1.2, 1.2, 1.2], pessimist: [0, 0,   0.1, 0.2, 0.3, 0.5, 0.7, 0.7, 0.7] },
        waterTensions: { decided: [0,-0.1,-0.2,-0.3,-0.5,-0.7,-0.9,-0.9,-0.9], pessimist: [0, 0,  -0.1,-0.2,-0.3,-0.5,-0.6,-0.6,-0.6] },
        whoHealthIndex:{ decided: [0, 0.1, 0.2, 0.3, 0.5, 0.7, 0.9, 0.9, 0.9], pessimist: [0, 0,   0.1, 0.2, 0.3, 0.4, 0.5, 0.5, 0.5] },
      },
    },
    prerequisites: {
      policiesRequired: ['dec-02'],
    },
  },

  // ─── dec-31 — Méthane déchets solides et eaux usées ──────────────────────
  {
    id: 'dec-31',
    sessionId: 4,
    number: '31',
    status: 'active',
    implementationLag: 2,
    title: 'Captage du méthane des décharges et traitement des eaux usées',
    description: `Les déchets solides et les eaux usées sont responsables de **~3,2 % des émissions mondiales** de GES, principalement sous forme de méthane produit par décomposition anaérobie en décharge et en lagune. Ces émissions sont parmi les **moins coûteuses à réduire** : le biogaz capturé peut valoriser les décharges en sources d'énergie renouvelable. Le GIEC AR6 évalue le potentiel à **0,3 à 0,8 GtCO₂e/an** d'ici 2050. Cette décision mandate la mise en torchère ou la valorisation du méthane des 500 plus grandes décharges mondiales et le traitement aérobie des eaux usées industrielles dans les pays signataires.`,
    options: [
      { id: 'pour',   label: 'Pour',       color: '#00ff88', bgClass: 'bg-eb-green/10',  borderClass: 'border-eb-green/20' },
      { id: 'contre', label: 'Contre',     color: '#ff5050', bgClass: 'bg-red-500/10',   borderClass: 'border-red-500/20'  },
      { id: 'abst',   label: 'Abstention', color: '#475569', bgClass: 'bg-slate-700/30', borderClass: 'border-slate-600/30'},
    ],
    votes: { pour: 578, contre: 87, abst: 55 },
    consensusThreshold: 67,
    deadline: '2026-03-15T18:00:00Z',
    resources: [
      {
        title: 'GIEC AR6 WGIII — Chapitre 12 : Déchets',
        excerpt: 'Le captage du biogaz des décharges est une des options les moins coûteuses du portefeuille de mitigation, avec un coût souvent négatif quand le gaz est valorisé en énergie.',
        url: 'https://www.ipcc.ch/report/ar6/wg3/',
      },
      {
        title: 'PNUE — Global Methane Assessment 2021',
        excerpt: 'Réduire les émissions de méthane de 45 % d\'ici 2030 permettrait d\'éviter 0,3°C de réchauffement d\'ici 2045. Les décharges et eaux usées représentent 20 % des émissions anthropiques de méthane.',
        url: 'https://www.unep.org/resources/report/global-methane-assessment',
      },
      {
        title: 'Global Methane Initiative — Landfill Gas to Energy',
        excerpt: 'Un projet de valorisation biogaz en décharge génère en moyenne 1 à 5 MWe et réduit les émissions de 50 000 à 200 000 tCO₂e/an avec un retour sur investissement de 5 à 8 ans.',
        url: 'https://www.globalmethane.org/',
      },
    ],
    projectedImpact: {
      emissionsReductionGtCO2yr: 0.5,
      tempReductionC2100: 0.03,
      fullEffectYear: 2050,
      uncertaintyScore: 2,
    },
    prospectiveNarratives: {
      optimistic: {
        horizon: '+10 ans',
        label: 'Scénario Optimiste',
        colorClass: 'text-eb-green',
        borderClass: 'border-eb-green/30',
        text: 'Dans 10 ans, **350 des 500 plus grandes décharges mondiales** disposent d\'un système de captage et valorisation du biogaz, produisant **25 TWh/an** d\'électricité renouvelable. Le méthane atmosphérique d\'origine déchet recule de **12 %**. Les nouvelles décharges (où elles sont encore autorisées) intègrent le captage dès la conception. Les eaux usées industrielles traitées en aérobie dans 30 pays évitent **200 MtCO₂e/an**.',
      },
      moderate: {
        horizon: '+20 ans',
        label: 'Scénario Modéré',
        colorClass: 'text-yellow-400',
        borderClass: 'border-yellow-500/30',
        text: 'Dans 20 ans, le captage biogaz est généralisé dans les pays à revenus élevés et intermédiaires, mais les pays les moins avancés peinent à financer les infrastructures. La croissance des volumes de déchets dans les villes des pays émergents a créé de nouvelles décharges non équipées. La réduction nette atteint **–0,35 GtCO₂e/an**.',
      },
      pessimistic: {
        horizon: '+50 ans',
        label: 'Scénario Pessimiste',
        colorClass: 'text-red-400',
        borderClass: 'border-red-500/30',
        text: 'Dans 50 ans, l\'urbanisation rapide en Afrique et en Asie du Sud a multiplié les dépôts sauvages et les décharges informelles hors de tout système de captage. Le recyclage a progressé mais le volume total de déchets a doublé. La réduction nette reste positive (**–0,02°C**) grâce aux améliorations dans les pays développés, mais le potentiel global a été sous-exploité.',
      },
    },
    projections: {
      labels: [2024, 2026, 2028, 2030, 2034, 2040, 2050, 2060, 2074],
      co2: {
        baseline:  [37.4, 39,    40.5, 42,   45.1, 49.2, 54,   58,   63],
        decided:   [37.4, 38.95, 40.4, 41.8, 44.8, 48.8, 53.5, 57.5, 62.5],
        pessimist: [37.4, 38.98, 40.45,41.9, 44.95,48.95,53.65,57.65,62.65],
      },
      temperature: {
        baseline:  [1.4, 1.5,  1.6,  1.72, 1.95, 2.2,  2.6,  3.0,  3.5],
        decided:   [1.4, 1.50, 1.60, 1.72, 1.94, 2.19, 2.58, 2.98, 3.47],
        pessimist: [1.4, 1.50, 1.60, 1.72, 1.94, 2.20, 2.59, 2.99, 3.48],
      },
      societal: {
        waterAccess:       { decided: [0, 0.1, 0.2, 0.4, 0.6, 0.9, 1.2, 1.2, 1.2], pessimist: [0, 0,   0.1, 0.2, 0.4, 0.5, 0.7, 0.7, 0.7] },
        whoHealthIndex:    { decided: [0, 0.1, 0.2, 0.4, 0.6, 0.9, 1.2, 1.2, 1.2], pessimist: [0, 0,   0.1, 0.2, 0.4, 0.5, 0.7, 0.7, 0.7] },
        lifeExpectancy:    { decided: [0, 0.03,0.07,0.12,0.18,0.25,0.30,0.30,0.30], pessimist: [0, 0.01,0.03,0.06,0.10,0.15,0.20,0.20,0.20] },
        respiratoryDiseases:{ decided: [0,-0.1,-0.3,-0.5,-0.8,-1.2,-1.5,-1.5,-1.5], pessimist: [0,-0.05,-0.1,-0.2,-0.4,-0.6,-0.8,-0.8,-0.8] },
      },
    },
    prerequisites: {
      policiesRequired: ['dec-04'],
    },
  },
]

// Mock data

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

