export type NodeCategory = 'physical' | 'ecosystem' | 'societal'
export type EdgeType    = 'positive' | 'negative'

export interface SysNode {
  data: {
    id:            string
    label:         string
    labelEn:       string
    category:      NodeCategory
    description:   string
    descriptionEn: string
    ipccRef:       string
  }
}

export interface SysEdge {
  data: {
    id:            string
    source:        string
    target:        string
    type:          EdgeType
    description:   string
    descriptionEn: string
    ipccRef:       string
  }
}

export interface FeedbackLoop {
  id:          string
  label:       string
  labelEn:     string
  nodeIds:     string[]
  edgeIds:     string[]
  color:       string
  severity:    'critical' | 'high' | 'moderate'
  warning?:    boolean
}

export const feedbackLoops: FeedbackLoop[] = [
  {
    id: 'permafrost_loop',
    label: '⚠ Pergélisol', labelEn: '⚠ Permafrost',
    nodeIds: ['temperature', 'permafrost', 'ghg'],
    edgeIds: ['temp_perm', 'perm_ghg', 'ghg_temp'],
    color: '#ff5050', severity: 'critical', warning: true,
  },
  {
    id: 'forest_carbon_loop',
    label: 'Forêt-Carbone', labelEn: 'Forest-Carbon',
    nodeIds: ['temperature', 'forest', 'ghg'],
    edgeIds: ['temp_forest', 'forest_ghg', 'ghg_temp'],
    color: '#00ff88', severity: 'high',
  },
  {
    id: 'extremes_forest_loop',
    label: 'Extrêmes-Forêts', labelEn: 'Extremes-Forests',
    nodeIds: ['extreme_events', 'forest', 'ghg'],
    edgeIds: ['ext_forest', 'forest_ghg', 'ghg_ext'],
    color: '#fb923c', severity: 'high',
  },
  {
    id: 'health_inequality_loop',
    label: 'Santé-Inégalités', labelEn: 'Health-Inequality',
    nodeIds: ['health', 'inequality'],
    edgeIds: ['ineq_health', 'health_ineq'],
    color: '#00e5ff', severity: 'moderate',
  },
  {
    id: 'geo_migration_loop',
    label: 'Géopolitique-Migration', labelEn: 'Geopolitics-Migration',
    nodeIds: ['migration', 'geopolitical'],
    edgeIds: ['mig_geo', 'geo_mig'],
    color: '#a78bfa', severity: 'moderate',
  },
]

export const CATEGORY_COLORS: Record<NodeCategory, string> = {
  physical:  '#fb923c',
  ecosystem: '#00ff88',
  societal:  '#00e5ff',
}

export const CATEGORY_BORDER: Record<NodeCategory, string> = {
  physical:  '#c2410c',
  ecosystem: '#00cc6a',
  societal:  '#00b8cc',
}

export const EDGE_COLORS: Record<EdgeType, string> = {
  positive: '#ff5050',
  negative: '#00ff88',
}

// ─── Nœuds ───────────────────────────────────────────────────────────────────

export const systemicNodes: SysNode[] = [

  // ── Physique / Écologique ──────────────────────────────────────────────────
  {
    data: {
      id: 'ghg', label: 'Émissions de GES', labelEn: 'GHG Emissions',
      category: 'physical',
      description:   'Émissions mondiales de gaz à effet de serre (CO₂, méthane, N₂O), principal moteur du changement climatique anthropique.',
      descriptionEn: 'Global greenhouse gas emissions (CO₂, methane, N₂O), the primary driver of anthropogenic climate change.',
      ipccRef: 'AR6 WGI SPM A.1',
    },
  },
  {
    data: {
      id: 'temperature', label: 'Élévation de la température mondiale', labelEn: 'Global Temperature Rise',
      category: 'physical',
      description:   "Anomalie de température de surface mondiale par rapport à l'ère pré-industrielle. Nœud central du système climatique.",
      descriptionEn: 'Global surface temperature anomaly relative to pre-industrial levels. Central node of the climate system.',
      ipccRef: 'AR6 WGI SPM B.1',
    },
  },
  {
    data: {
      id: 'sea_level', label: 'Élévation du niveau des mers', labelEn: 'Sea Level Rise',
      category: 'physical',
      description:   "Élévation du niveau moyen des mers due à la dilatation thermique et à la fonte des glaces continentales.",
      descriptionEn: 'Mean sea level rise due to thermal expansion and continental ice melt.',
      ipccRef: 'AR6 WGI SPM B.5',
    },
  },
  {
    data: {
      id: 'ocean_acid', label: 'Acidification des océans', labelEn: 'Ocean Acidification',
      category: 'physical',
      description:   "Baisse du pH des océans due à l'absorption du CO₂ atmosphérique, menaçant les écosystèmes marins calcifiants.",
      descriptionEn: 'Decrease in ocean pH due to atmospheric CO₂ absorption, threatening calcareous marine ecosystems.',
      ipccRef: 'AR6 WGI Ch.3',
    },
  },
  {
    data: {
      id: 'forest', label: 'Forêts primaires', labelEn: 'Primary Forests',
      category: 'physical',
      description:   'Couverture mondiale en forêts primaires intactes, puits de carbone majeur et réservoir de biodiversité irremplaçable.',
      descriptionEn: 'Global intact primary forest cover, a major carbon sink and irreplaceable biodiversity reservoir.',
      ipccRef: 'AR6 WGII Ch.2',
    },
  },
  {
    data: {
      id: 'permafrost', label: 'Pergélisol arctique', labelEn: 'Arctic Permafrost',
      category: 'physical',
      description:   "⚠ Point de basculement critique — Sols gelés stockant d'immenses réservoirs de méthane et CO₂. Leur dégel libère ces GES de façon irréversible.",
      descriptionEn:   '⚠ Critical tipping point — Frozen soils storing immense reservoirs of methane and CO₂. Their thaw releases these GHGs irreversibly.',
      ipccRef: 'AR6 WGI Ch.5',
    },
  },
  {
    data: {
      id: 'freshwater', label: 'Eau douce continentale', labelEn: 'Continental Freshwater',
      category: 'physical',
      description:   'Disponibilité des ressources en eau douce (nappes phréatiques, glaciers, précipitations) — sous pression croissante du réchauffement.',
      descriptionEn: 'Availability of freshwater resources (groundwater, glaciers, precipitation) — under growing pressure from warming.',
      ipccRef: 'AR6 WGII Ch.4',
    },
  },
  {
    data: {
      id: 'fossil_energy', label: 'Énergies fossiles', labelEn: 'Fossil Fuels',
      category: 'physical',
      description:   'Production et consommation de combustibles fossiles (charbon, pétrole, gaz), responsables de ~75 % des émissions mondiales de GES.',
      descriptionEn: 'Production and consumption of fossil fuels (coal, oil, gas), responsible for ~75% of global GHG emissions.',
      ipccRef: 'AR6 WGIII Ch.6',
    },
  },
  {
    data: {
      id: 'renewable', label: 'Énergies renouvelables', labelEn: 'Renewable Energies',
      category: 'physical',
      description:   'Production d\'énergie à partir de sources renouvelables (solaire, éolien, hydraulique). Levier majeur de décarbonation — mais avec une demande accrue en minéraux critiques.',
      descriptionEn: 'Energy from renewable sources (solar, wind, hydro). A major decarbonisation lever — but with increased demand for critical minerals.',
      ipccRef: 'AR6 WGIII Ch.6',
    },
  },

  {
    data: {
      id: 'extreme_events', label: 'Extrêmes climatiques', labelEn: 'Climate Extremes',
      category: 'physical',
      description:   'Fréquence et intensité croissantes des événements extrêmes : vagues de chaleur, précipitations extrêmes, sécheresses, cyclones tropicaux et événements composites.',
      descriptionEn: 'Growing frequency and intensity of extreme events: heat waves, extreme precipitation, droughts, tropical cyclones and compound events.',
      ipccRef: 'AR6 WGI Ch.11',
    },
  },

  // ── Écosystèmes ───────────────────────────────────────────────────────────
  {
    data: {
      id: 'biodiversity', label: 'Intégrité de la biosphère', labelEn: 'Biosphere Integrity',
      category: 'ecosystem',
      description:   "Diversité et abondance des espèces et des écosystèmes. Limite planétaire déjà très largement dépassée — le taux d'extinction actuel est 100 à 1 000 × le taux naturel.",
      descriptionEn: 'Diversity and abundance of species and ecosystems. Planetary boundary already far exceeded — current extinction rate is 100 to 1,000× the natural rate.',
      ipccRef: 'AR6 WGII Ch.2',
    },
  },
  {
    data: {
      id: 'land_use', label: "Changement d'utilisation des terres", labelEn: 'Land Use Change',
      category: 'ecosystem',
      description:   'Transformation des écosystèmes naturels par l\'agriculture, l\'élevage et l\'urbanisation. Première cause de déforestation et de perte de biodiversité.',
      descriptionEn: 'Transformation of natural ecosystems by agriculture, livestock and urbanisation. Primary cause of deforestation and biodiversity loss.',
      ipccRef: 'AR6 WGIII Ch.7',
    },
  },
  {
    data: {
      id: 'resources', label: 'Extraction de ressources', labelEn: 'Resource Extraction',
      category: 'ecosystem',
      description:   'Extraction mondiale de ressources naturelles (minéraux, biomasse, combustibles fossiles). En croissance continue depuis 1970, désormais > 90 Gt/an.',
      descriptionEn: 'Global extraction of natural resources (minerals, biomass, fossil fuels). Continuously growing since 1970, now > 90 Gt/year.',
      ipccRef: 'AR6 WGIII Ch.5',
    },
  },

  // ── Sociétal ──────────────────────────────────────────────────────────────
  {
    data: {
      id: 'food_security', label: 'Sécurité alimentaire', labelEn: 'Food Security',
      category: 'societal',
      description:   'Accès physique et économique à une alimentation suffisante, saine et nutritive. Indicateur synthétique des pressions sur les systèmes alimentaires mondiaux.',
      descriptionEn: 'Physical and economic access to sufficient, safe and nutritious food. Synthetic indicator of pressures on global food systems.',
      ipccRef: 'AR6 WGII Ch.5',
    },
  },
  {
    data: {
      id: 'water_access', label: 'Accès eau potable', labelEn: 'Water Access',
      category: 'societal',
      description:   'Part de la population mondiale disposant d\'un accès à une eau potable sûre et à des services d\'assainissement de base.',
      descriptionEn: 'Share of the global population with access to safe drinking water and basic sanitation services.',
      ipccRef: 'AR6 WGII Ch.4',
    },
  },
  {
    data: {
      id: 'health', label: 'Santé globale', labelEn: 'Global Health',
      category: 'societal',
      description:   'État de santé des populations mondiales : mortalité, maladies vectorielles et respiratoires, malnutrition. Amplificateur des inégalités existantes.',
      descriptionEn: 'Health status of global populations: mortality, vector-borne and respiratory diseases, malnutrition. An amplifier of existing inequalities.',
      ipccRef: 'AR6 WGII Ch.7',
    },
  },
  {
    data: {
      id: 'inequality', label: 'Inégalités', labelEn: 'Inequality',
      category: 'societal',
      description:   'Inégalités économiques et sociales mondiales (Gini, concentration de richesse, accès à l\'éducation). Les impacts climatiques creusent structurellement les inégalités.',
      descriptionEn: 'Global economic and social inequalities (Gini, wealth concentration, education access). Climate impacts structurally deepen inequalities.',
      ipccRef: 'AR6 WGII Ch.16',
    },
  },
  {
    data: {
      id: 'geopolitical', label: 'Tensions géopolitiques', labelEn: 'Geopolitical Tensions',
      category: 'societal',
      description:   'Conflits pour les ressources, instabilité politique et tensions entre États amplifiés par les pressions climatiques. Facteur de fragilisation des capacités d\'action collective.',
      descriptionEn: 'Resource conflicts, political instability and inter-state tensions amplified by climate pressures. A factor undermining collective action capacity.',
      ipccRef: 'AR6 WGII Ch.16',
    },
  },
  {
    data: {
      id: 'migration', label: 'Migrations climatiques', labelEn: 'Climate Migration',
      category: 'societal',
      description:   'Déplacements de populations causés par les impacts climatiques (inondations, sécheresses, montée des eaux, conflits). Jusqu\'à 1,2 milliard de personnes à risque d\'ici 2050.',
      descriptionEn: 'Population displacement caused by climate impacts (floods, droughts, sea level rise, conflicts). Up to 1.2 billion people at risk by 2050.',
      ipccRef: 'AR6 WGII Ch.7',
    },
  },
]

// ─── Arêtes ──────────────────────────────────────────────────────────────────

export const systemicEdges: SysEdge[] = [

  // GES →
  { data: { id: 'ghg_temp',    source: 'ghg',         target: 'temperature',  type: 'positive', description: "Les GES piègent le rayonnement infrarouge terrestre, augmentant la température moyenne mondiale.", descriptionEn: "GHGs trap outgoing infrared radiation, increasing the global mean temperature.", ipccRef: 'AR6 WGI SPM A.1' } },
  { data: { id: 'ghg_acid',    source: 'ghg',         target: 'ocean_acid',   type: 'positive', description: "L'absorption du CO₂ par les océans forme de l'acide carbonique, abaissant leur pH (acidification).", descriptionEn: "Ocean absorption of CO₂ forms carbonic acid, lowering pH (acidification).", ipccRef: 'AR6 WGI Ch.3' } },

  // Température →
  { data: { id: 'temp_sea',    source: 'temperature', target: 'sea_level',    type: 'positive', description: "La dilatation thermique des océans et la fonte des glaces polaires élèvent le niveau de la mer.", descriptionEn: "Thermal expansion of oceans and polar ice melt raise sea levels.", ipccRef: 'AR6 WGI SPM B.5' } },
  { data: { id: 'temp_fresh',  source: 'temperature', target: 'freshwater',   type: 'positive', description: "Le réchauffement intensifie les sécheresses et perturbe le cycle hydrologique, réduisant les ressources en eau douce dans de nombreuses régions.", descriptionEn: "Warming intensifies droughts and disrupts the hydrological cycle, reducing freshwater resources in many regions.", ipccRef: 'AR6 WGII Ch.4' } },
  { data: { id: 'temp_forest', source: 'temperature', target: 'forest',       type: 'positive', description: "Les vagues de chaleur et les sécheresses amplifient les incendies de forêt et le dépérissement forestier (dieback).", descriptionEn: "Heatwaves and droughts amplify wildfires and forest dieback.", ipccRef: 'AR6 WGII Ch.2' } },
  { data: { id: 'temp_bio',    source: 'temperature', target: 'biodiversity', type: 'positive', description: "Le réchauffement dépasse les capacités d'adaptation de nombreuses espèces, provoquant des extinctions en masse et des déplacements d'aires de répartition.", descriptionEn: "Warming exceeds the adaptive capacity of many species, causing mass extinctions and range shifts.", ipccRef: 'AR6 WGII Ch.2' } },
  { data: { id: 'temp_food',   source: 'temperature', target: 'food_security',type: 'positive', description: "Le stress thermique sur les cultures, la multiplication des événements extrêmes et les perturbations hydrologiques réduisent les rendements agricoles mondiaux.", descriptionEn: "Heat stress on crops, multiplication of extreme events and hydrological disruptions reduce global agricultural yields.", ipccRef: 'AR6 WGII Ch.5' } },
  { data: { id: 'temp_health', source: 'temperature', target: 'health',       type: 'positive', description: "Le réchauffement amplifie les maladies vectorielles (paludisme, dengue), les coups de chaleur et la mortalité cardiovasculaire.", descriptionEn: "Warming amplifies vector-borne diseases (malaria, dengue), heat strokes and cardiovascular mortality.", ipccRef: 'AR6 WGII Ch.7' } },
  { data: { id: 'temp_perm',   source: 'temperature', target: 'permafrost',   type: 'positive', description: "L'élévation des températures dans les régions arctiques dégèle le pergélisol — processus qui s'emballe au-delà d'environ 2°C.", descriptionEn: "Rising temperatures in Arctic regions thaw permafrost — a process that accelerates beyond approximately 2°C.", ipccRef: 'AR6 WGI Ch.5' } },
  { data: { id: 'temp_geo',    source: 'temperature', target: 'geopolitical', type: 'positive', description: "Les chocs climatiques (sécheresses, inondations, vagues de chaleur) alimentent l'instabilité politique et les conflits pour les ressources.", descriptionEn: "Climate shocks (droughts, floods, heatwaves) fuel political instability and resource conflicts.", ipccRef: 'AR6 WGII Ch.16' } },

  // Pergélisol → GES (boucle de rétroaction critique)
  { data: { id: 'perm_ghg',   source: 'permafrost',   target: 'ghg',          type: 'positive', description: "⚠ Boucle amplificatrice irréversible — La fonte du pergélisol libère du méthane et du CO₂ stockés depuis des millénaires, amplifiant le réchauffement qui déclenche davantage de fonte.", descriptionEn: "⚠ Irreversible amplifying loop — Permafrost thaw releases millennia-old methane and CO₂, amplifying the warming that triggers further thaw.", ipccRef: 'AR6 WGI Ch.5' } },

  // Forêts →
  { data: { id: 'forest_ghg',   source: 'forest', target: 'ghg',          type: 'negative', description: "Les forêts primaires absorbent environ 2,6 GtCO₂/an. Leur préservation constitue un puits de carbone naturel irremplaçable.", descriptionEn: "Primary forests absorb approximately 2.6 GtCO₂/year. Their preservation is an irreplaceable natural carbon sink.", ipccRef: 'AR6 WGIII Ch.7' } },
  { data: { id: 'forest_fresh', source: 'forest', target: 'freshwater',   type: 'negative', description: "Les forêts régulent le cycle hydrologique, protègent les bassins versants et maintiennent la recharge des nappes phréatiques.", descriptionEn: "Forests regulate the hydrological cycle, protect watersheds and maintain groundwater recharge.", ipccRef: 'AR6 WGII Ch.4' } },
  { data: { id: 'forest_bio',   source: 'forest', target: 'biodiversity', type: 'negative', description: "Les forêts tropicales abritent environ 50 % de la biodiversité mondiale. Leur dégradation entraîne des extinctions en cascade.", descriptionEn: "Tropical forests harbour approximately 50% of global biodiversity. Their degradation triggers cascade extinctions.", ipccRef: 'AR6 WGII Ch.2' } },
  { data: { id: 'forest_food',  source: 'forest', target: 'food_security',type: 'negative', description: "Les forêts fournissent des services écosystémiques essentiels à l'agriculture : pollinisation, régulation des précipitations, fertilité des sols.", descriptionEn: "Forests provide essential ecosystem services for agriculture: pollination, rainfall regulation, soil fertility.", ipccRef: 'AR6 WGII Ch.5' } },

  // Acidification →
  { data: { id: 'acid_bio',  source: 'ocean_acid', target: 'biodiversity', type: 'positive', description: "L'acidification dissout les squelettes calcaires des coraux, mollusques et échinodermes, dévastant les écosystèmes marins.", descriptionEn: "Acidification dissolves the calcareous skeletons of corals, molluscs and echinoderms, devastating marine ecosystems.", ipccRef: 'AR6 WGII Ch.3' } },
  { data: { id: 'acid_food', source: 'ocean_acid', target: 'food_security',type: 'positive', description: "Le déclin des pêcheries marines dû à l'acidification menace la sécurité alimentaire de plus de 3 milliards de personnes.", descriptionEn: "Decline in marine fisheries due to acidification threatens the food security of over 3 billion people.", ipccRef: 'AR6 WGII Ch.5' } },

  // Niveau des mers →
  { data: { id: 'sea_mig',  source: 'sea_level', target: 'migration',     type: 'positive', description: "La submersion côtière et l'intensification des cyclones forcent les déplacements de populations — jusqu'à 1 milliard de personnes à risque.", descriptionEn: "Coastal submersion and intensifying cyclones force population displacement — up to 1 billion people at risk.", ipccRef: 'AR6 WGII Ch.7' } },
  { data: { id: 'sea_food', source: 'sea_level', target: 'food_security', type: 'positive', description: "L'intrusion saline dans les terres agricoles côtières réduit les surfaces cultivables et la productivité des exploitations.", descriptionEn: "Saltwater intrusion into coastal agricultural land reduces arable area and farm productivity.", ipccRef: 'AR6 WGII Ch.5' } },
  { data: { id: 'sea_geo',  source: 'sea_level', target: 'geopolitical',  type: 'positive', description: "La disparition de territoires côtiers génère des litiges de souveraineté et des crises migratoires régionales (Pacifique, Bengale, deltas).", descriptionEn: "Disappearance of coastal territories generates sovereignty disputes and regional migration crises (Pacific, Bengal, deltas).", ipccRef: 'AR6 WGII Ch.16' } },

  // Énergie fossile →
  { data: { id: 'fossil_ghg',    source: 'fossil_energy', target: 'ghg',         type: 'positive', description: "La combustion des énergies fossiles est la source de ~75 % des émissions mondiales de GES (CO₂, méthane des fuites).", descriptionEn: "Combustion of fossil fuels is the source of ~75% of global GHG emissions (CO₂, methane leaks).", ipccRef: 'AR6 WGIII Ch.6' } },
  { data: { id: 'fossil_health', source: 'fossil_energy', target: 'health',      type: 'positive', description: "La pollution aux particules fines (PM2.5) due aux combustibles fossiles cause environ 7 millions de décès prématurés par an.", descriptionEn: "Fine particle (PM2.5) pollution from fossil fuels causes approximately 7 million premature deaths per year.", ipccRef: 'AR6 WGII Ch.7' } },
  { data: { id: 'fossil_geo',    source: 'fossil_energy', target: 'geopolitical',type: 'positive', description: "La dépendance aux hydrocarbures génère des conflits géopolitiques (contrôle des ressources, financement de régimes autoritaires).", descriptionEn: "Dependence on hydrocarbons generates geopolitical conflicts (resource control, funding of authoritarian regimes).", ipccRef: 'AR6 WGII Ch.16' } },

  // Renouvelables →
  { data: { id: 'ren_ghg', source: 'renewable', target: 'ghg',       type: 'negative', description: "Le remplacement des combustibles fossiles par les renouvelables réduit directement les émissions de GES du secteur énergétique.", descriptionEn: "Replacing fossil fuels with renewables directly reduces GHG emissions from the energy sector.", ipccRef: 'AR6 WGIII Ch.6' } },
  { data: { id: 'ren_res', source: 'renewable', target: 'resources', type: 'positive', description: "Le déploiement massif de panneaux solaires, éoliennes et batteries augmente la demande en minéraux critiques (lithium, cobalt, cuivre, terres rares).", descriptionEn: "Massive deployment of solar panels, wind turbines and batteries increases demand for critical minerals (lithium, cobalt, copper, rare earths).", ipccRef: 'AR6 WGIII Ch.5' } },

  // Usage des terres →
  { data: { id: 'land_forest', source: 'land_use', target: 'forest',       type: 'positive', description: "L'expansion agricole, l'élevage extensif et l'urbanisation sont la première cause de déforestation (environ 10 millions d'hectares/an).", descriptionEn: "Agricultural expansion, extensive livestock and urbanisation are the primary cause of deforestation (approximately 10 million hectares/year).", ipccRef: 'AR6 WGIII Ch.7' } },
  { data: { id: 'land_ghg',    source: 'land_use', target: 'ghg',          type: 'positive', description: "Le changement d'affectation des terres (déforestation, drainage des tourbières) représente environ 23 % des émissions mondiales de GES.", descriptionEn: "Land use change (deforestation, peatland drainage) accounts for approximately 23% of global GHG emissions.", ipccRef: 'AR6 WGIII Ch.7' } },
  { data: { id: 'land_bio',    source: 'land_use', target: 'biodiversity', type: 'positive', description: "La fragmentation et la destruction des habitats naturels est la principale cause d'extinction des espèces à l'échelle mondiale.", descriptionEn: "Fragmentation and destruction of natural habitats is the primary cause of species extinction globally.", ipccRef: 'AR6 WGII Ch.2' } },
  { data: { id: 'land_food',   source: 'land_use', target: 'food_security',type: 'positive', description: "L'agriculture intensive augmente la production alimentaire à court terme, mais dégrade les sols et les écosystèmes qui la soutiennent à long terme.", descriptionEn: "Intensive agriculture increases food production in the short term but degrades the soils and ecosystems that sustain it in the long term.", ipccRef: 'AR6 WGII Ch.5' } },

  // Extraction de ressources →
  { data: { id: 'res_ghg', source: 'resources', target: 'ghg',          type: 'positive', description: "L'extraction et la transformation des ressources naturelles (ciment, acier, aluminium, plastiques) représente environ 25 % des émissions industrielles mondiales.", descriptionEn: "Extraction and processing of natural resources (cement, steel, aluminium, plastics) accounts for approximately 25% of global industrial emissions.", ipccRef: 'AR6 WGIII Ch.5' } },
  { data: { id: 'res_bio', source: 'resources', target: 'biodiversity', type: 'positive', description: "L'exploitation minière, la surpêche et l'extraction forestière détruisent des habitats critiques et réduisent la biodiversité locale et mondiale.", descriptionEn: "Mining, overfishing and logging destroy critical habitats and reduce local and global biodiversity.", ipccRef: 'AR6 WGII Ch.2' } },
  { data: { id: 'res_geo', source: 'resources', target: 'geopolitical', type: 'positive', description: "La compétition pour les ressources stratégiques (terres rares pour la transition, eau, terres agricoles) est un facteur croissant de tensions géopolitiques.", descriptionEn: "Competition for strategic resources (rare earths for the transition, water, agricultural land) is a growing factor of geopolitical tensions.", ipccRef: 'AR6 WGII Ch.16' } },

  // Biodiversité →
  { data: { id: 'bio_food',  source: 'biodiversity', target: 'food_security', type: 'negative', description: "La biodiversité fournit des services essentiels à l'agriculture : pollinisation (30 % de la production alimentaire mondiale), régulation des ravageurs, fertilité des sols.", descriptionEn: "Biodiversity provides essential services to agriculture: pollination (30% of global food production), pest regulation, soil fertility.", ipccRef: 'AR6 WGII Ch.5' } },
  { data: { id: 'bio_fresh', source: 'biodiversity', target: 'freshwater',   type: 'negative', description: "Les écosystèmes aquatiques (zones humides, forêts ripariennes) régulent la qualité et la disponibilité de l'eau douce.", descriptionEn: "Aquatic ecosystems (wetlands, riparian forests) regulate freshwater quality and availability.", ipccRef: 'AR6 WGII Ch.4' } },

  // Eau douce →
  { data: { id: 'fresh_access', source: 'freshwater', target: 'water_access',  type: 'negative', description: "La disponibilité en eau douce conditionne directement l'accès à l'eau potable, notamment dans les régions arides et semi-arides.", descriptionEn: "Freshwater availability directly conditions access to drinking water, especially in arid and semi-arid regions.", ipccRef: 'AR6 WGII Ch.4' } },
  { data: { id: 'fresh_food',   source: 'freshwater', target: 'food_security', type: 'negative', description: "L'agriculture irriguée mobilise environ 70 % des prélèvements mondiaux en eau douce — sa disponibilité est critique pour la production alimentaire.", descriptionEn: "Irrigated agriculture mobilises approximately 70% of global freshwater withdrawals — its availability is critical for food production.", ipccRef: 'AR6 WGII Ch.5' } },

  // Sécurité alimentaire →
  { data: { id: 'food_health', source: 'food_security', target: 'health',      type: 'negative', description: "La sous-nutrition et la malnutrition affaiblissent les systèmes immunitaires et réduisent l'espérance de vie, notamment chez les enfants.", descriptionEn: "Undernutrition and malnutrition weaken immune systems and reduce life expectancy, especially in children.", ipccRef: 'AR6 WGII Ch.7' } },
  { data: { id: 'food_mig',    source: 'food_security', target: 'migration',   type: 'negative', description: "L'insécurité alimentaire est un facteur majeur de migration forcée — elle amplifie les pressions sur des régions déjà fragilisées.", descriptionEn: "Food insecurity is a major driver of forced migration — it amplifies pressures on already fragile regions.", ipccRef: 'AR6 WGII Ch.7' } },
  { data: { id: 'food_ineq',   source: 'food_security', target: 'inequality',  type: 'negative', description: "L'insécurité alimentaire touche disproportionnellement les populations pauvres, creusant les inégalités sociales et économiques.", descriptionEn: "Food insecurity disproportionately affects poor populations, deepening social and economic inequalities.", ipccRef: 'AR6 WGII Ch.16' } },

  // Accès eau →
  { data: { id: 'water_food',  source: 'water_access', target: 'food_security', type: 'negative', description: "L'accès à l'eau potable et à l'irrigation est indispensable à la production alimentaire et à la sécurité des ménages agricoles.", descriptionEn: "Access to drinking water and irrigation is essential for food production and agricultural household security.", ipccRef: 'AR6 WGII Ch.5' } },
  { data: { id: 'water_health',source: 'water_access', target: 'health',        type: 'negative', description: "L'accès à l'eau potable et à l'assainissement réduit drastiquement les maladies diarrhéiques, principal cause de mortalité infantile.", descriptionEn: "Access to safe water and sanitation drastically reduces diarrhoeal diseases, the primary cause of child mortality.", ipccRef: 'AR6 WGII Ch.7' } },
  { data: { id: 'water_geo',   source: 'water_access', target: 'geopolitical',  type: 'negative', description: "La raréfaction de l'eau douce alimente les tensions transfrontalières (fleuves partagés) et les conflits locaux pour les ressources hydriques.", descriptionEn: "Freshwater scarcity fuels cross-border tensions (shared rivers) and local conflicts over water resources.", ipccRef: 'AR6 WGII Ch.16' } },

  // Inégalités →
  { data: { id: 'ineq_health', source: 'inequality', target: 'health',       type: 'positive', description: "Les inégalités socio-économiques limitent l'accès aux soins, à la nutrition et aux conditions de vie saines — elles amplifient tous les autres risques sanitaires.", descriptionEn: "Socio-economic inequalities limit access to healthcare, nutrition and healthy living conditions — they amplify all other health risks.", ipccRef: 'AR6 WGII Ch.7' } },
  { data: { id: 'ineq_food',   source: 'inequality', target: 'food_security',type: 'positive', description: "Les inégalités économiques privent les populations les plus vulnérables d'un accès suffisant à l'alimentation, même lorsque la production mondiale est suffisante.", descriptionEn: "Economic inequalities deprive the most vulnerable populations of adequate food access, even when global production is sufficient.", ipccRef: 'AR6 WGII Ch.5' } },
  { data: { id: 'ineq_geo',    source: 'inequality', target: 'geopolitical', type: 'positive', description: "Les inégalités extrêmes alimentent le ressentiment social, l'instabilité politique et les conflits internes et internationaux.", descriptionEn: "Extreme inequalities fuel social resentment, political instability and internal and international conflicts.", ipccRef: 'AR6 WGII Ch.16' } },
  { data: { id: 'ineq_mig',    source: 'inequality', target: 'migration',    type: 'positive', description: "Les inégalités économiques entre et au sein des pays sont un moteur structurel des migrations internationales et internes.", descriptionEn: "Economic inequalities between and within countries are a structural driver of international and internal migration.", ipccRef: 'AR6 WGII Ch.7' } },
  { data: { id: 'ineq_ren',    source: 'inequality', target: 'renewable',    type: 'positive', description: "Les inégalités réduisent la capacité des populations et des États pauvres à investir dans la transition énergétique — frein structurel à la décarbonation.", descriptionEn: "Inequalities reduce the capacity of poor populations and states to invest in the energy transition — a structural barrier to decarbonisation.", ipccRef: 'AR6 WGIII Ch.13' } },

  // Santé →
  { data: { id: 'health_ineq', source: 'health', target: 'inequality', type: 'negative', description: "Une mauvaise santé réduit la productivité économique et aggrave la pauvreté, créant une boucle de rétroaction inégalités-santé.", descriptionEn: "Poor health reduces economic productivity and worsens poverty, creating an inequality-health feedback loop.", ipccRef: 'AR6 WGII Ch.7' } },

  // Migrations →
  { data: { id: 'mig_geo',  source: 'migration', target: 'geopolitical', type: 'positive', description: "Les flux migratoires massifs créent des pressions politiques dans les pays d'accueil et alimentent les crispations identitaires et populistes.", descriptionEn: "Massive migratory flows create political pressures in host countries and fuel identity tensions and populism.", ipccRef: 'AR6 WGII Ch.16' } },
  { data: { id: 'mig_ineq', source: 'migration', target: 'inequality',   type: 'positive', description: "Les migrations climatiques affectent disproportionnellement les plus vulnérables, aggravant les inégalités dans les pays d'accueil et d'origine.", descriptionEn: "Climate migration disproportionately affects the most vulnerable, worsening inequalities in both host and origin countries.", ipccRef: 'AR6 WGII Ch.16' } },

  // Tensions géopolitiques →
  { data: { id: 'geo_mig', source: 'geopolitical', target: 'migration', type: 'positive', description: "Les conflits armés et l'instabilité politique sont des causes directes de déplacement forcé de populations — boucle géopolitique-migration.", descriptionEn: "Armed conflicts and political instability are direct causes of forced population displacement — a geopolitics-migration feedback loop.", ipccRef: 'AR6 WGII Ch.7' } },

  // → Extrêmes climatiques (entrants)
  { data: { id: 'ghg_ext',  source: 'ghg',         target: 'extreme_events', type: 'positive', description: "L'attribution scientifique établit que les émissions de GES augmentent directement la fréquence et l'intensité des extrêmes (SPM B.2).", descriptionEn: "Scientific attribution establishes that GHG emissions directly increase the frequency and intensity of extremes (SPM B.2).", ipccRef: 'AR6 WGI SPM B.2' } },
  { data: { id: 'temp_ext', source: 'temperature',  target: 'extreme_events', type: 'positive', description: "Chaque +0,5°C de réchauffement multiplie la fréquence des extrêmes autrefois rares — effet non linéaire particulièrement marqué au-delà de 2°C.", descriptionEn: "Every +0.5°C of warming multiplies the frequency of once-rare extremes — a non-linear effect particularly marked beyond 2°C.", ipccRef: 'AR6 WGI Ch.11.1' } },
  { data: { id: 'sea_ext',  source: 'sea_level',    target: 'extreme_events', type: 'positive', description: "La montée du niveau marin amplifie les inondations côtières lors de tempêtes et cyclones, transformant des événements rares en événements fréquents.", descriptionEn: "Sea level rise amplifies coastal flooding during storms and cyclones, turning rare events into frequent ones.", ipccRef: 'AR6 WGI Ch.11.5' } },

  // Extrêmes climatiques →
  { data: { id: 'ext_food',  source: 'extreme_events', target: 'food_security', type: 'positive', description: "Les sécheresses, inondations et vagues de chaleur extrêmes détruisent les récoltes et perturbent les chaînes d'approvisionnement alimentaires mondiales.", descriptionEn: "Extreme droughts, floods and heat waves destroy harvests and disrupt global food supply chains.", ipccRef: 'AR6 WGII Ch.5' } },
  { data: { id: 'ext_water', source: 'extreme_events', target: 'water_access',  type: 'positive', description: "Les sécheresses réduisent la disponibilité en eau potable, tandis que les inondations contaminent les sources et détruisent les infrastructures de distribution.", descriptionEn: "Droughts reduce drinking water availability, while floods contaminate sources and destroy distribution infrastructure.", ipccRef: 'AR6 WGII Ch.4' } },
  { data: { id: 'ext_health',source: 'extreme_events', target: 'health',        type: 'positive', description: "Les vagues de chaleur causent des décès directs par hyperthermie ; les inondations propagent des maladies vectorielles et diarrhéiques ; les incendies dégradent la qualité de l'air.", descriptionEn: "Heat waves cause direct deaths by hyperthermia; floods spread vector-borne and diarrhoeal diseases; wildfires degrade air quality.", ipccRef: 'AR6 WGII Ch.7' } },
  { data: { id: 'ext_forest',source: 'extreme_events', target: 'forest',        type: 'positive', description: "Les incendies extrêmes, amplifiés par les sécheresses et les vagues de chaleur, sont devenus un moteur majeur de perte des forêts primaires.", descriptionEn: "Extreme wildfires, amplified by droughts and heat waves, have become a major driver of primary forest loss.", ipccRef: 'AR6 WGII Ch.2' } },
  { data: { id: 'ext_bio',   source: 'extreme_events', target: 'biodiversity',  type: 'positive', description: "Les événements extrêmes (blanchissement massif des coraux, incendies, tempêtes) dépassent les capacités de résilience et de migration des espèces.", descriptionEn: "Extreme events (mass coral bleaching, wildfires, storms) exceed species resilience and migration capacity.", ipccRef: 'AR6 WGII Ch.2' } },
  { data: { id: 'ext_mig',   source: 'extreme_events', target: 'migration',     type: 'positive', description: "Les catastrophes extrêmes (cyclones, inondations, sécheresses prolongées) sont un facteur croissant de déplacement forcé de populations.", descriptionEn: "Extreme disasters (cyclones, floods, prolonged droughts) are a growing driver of forced population displacement.", ipccRef: 'AR6 WGII Ch.7' } },
  { data: { id: 'ext_ineq',  source: 'extreme_events', target: 'inequality',    type: 'positive', description: "Les extrêmes climatiques frappent disproportionnellement les populations à faibles revenus et les pays du Sud, creusant les inégalités mondiales.", descriptionEn: "Climate extremes disproportionately affect low-income populations and Global South countries, deepening global inequalities.", ipccRef: 'AR6 WGII Ch.16' } },
]
