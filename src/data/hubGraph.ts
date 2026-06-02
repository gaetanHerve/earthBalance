export type HubNodeType = 'hub' | 'category' | 'indicator' | 'tipping'
export type HubChartType = NonNullable<HubNodeData['liveKey']> | 'energyMixBreakdown'
export type HubCategory = 'climat' | 'ecosystemes' | 'energie' | 'societal' | 'politiques'
export type HubEdgeType = 'hub-cat' | 'hierarchy' | 'tipping-link'

export interface HubNodeData {
  id:        string
  type:      HubNodeType
  category:  HubCategory | null
  label:     string
  labelEn:   string
  color:     string
  route:     string
  liveKey?:  'co2' | 'temp' | 'forest' | 'renewables' | 'food' | 'water'
  liveUnit?: string
  liveUnitEn?: string
}

export interface HubEdgeData {
  id:       string
  source:   string
  target:   string
  edgeType: HubEdgeType
  color?:   string
}

// ─── Palette catégories ───────────────────────────────────────────────────────
export const CATEGORY_COLORS: Record<HubCategory, string> = {
  climat:     '#00e5ff',
  ecosystemes:'#00ff88',
  energie:    '#fb923c',
  societal:   '#a78bfa',
  politiques: '#fbbf24',
}

// ─── Nœuds statiques ─────────────────────────────────────────────────────────

export const HUB_NODES: HubNodeData[] = [
  // Hub central
  { id: 'hub', type: 'hub', category: null, color: '#00e5ff',
    label: 'EarthBalance', labelEn: 'EarthBalance', route: '/' },

  // ── Catégories ──
  { id: 'cat-climat',     type: 'category', category: 'climat',     color: '#00e5ff',
    label: 'Climat',           labelEn: 'Climate',            route: '/dashboard' },
  { id: 'cat-ecosystemes',type: 'category', category: 'ecosystemes',color: '#00ff88',
    label: 'Écosystèmes',      labelEn: 'Ecosystems',         route: '/limites-planetaires' },
  { id: 'cat-energie',    type: 'category', category: 'energie',    color: '#fb923c',
    label: 'Énergie',          labelEn: 'Energy',             route: '/dashboard' },
  { id: 'cat-societal',   type: 'category', category: 'societal',   color: '#a78bfa',
    label: 'Sociétal',         labelEn: 'Societal',           route: '/dashboard' },
  // ── Indicateurs Climat ──
  { id: 'co2',      type: 'indicator', category: 'climat', color: '#00e5ff',
    label: 'CO₂ mondial',         labelEn: 'Global CO₂',
    route: '/dashboard', liveKey: 'co2', liveUnit: 'Gt/an', liveUnitEn: 'Gt/yr' },
  { id: 'temp',     type: 'indicator', category: 'climat', color: '#00e5ff',
    label: 'Température',          labelEn: 'Temperature',
    route: '/dashboard', liveKey: 'temp', liveUnit: '°C', liveUnitEn: '°C' },
  { id: 'sea-level',type: 'indicator', category: 'climat', color: '#00e5ff',
    label: 'Niveau des mers',      labelEn: 'Sea level',      route: '/dashboard' },

  // ── Indicateurs Écosystèmes ──
  { id: 'forest',      type: 'indicator', category: 'ecosystemes', color: '#00ff88',
    label: 'Forêts mondiales',    labelEn: 'Global forests',
    route: '/dashboard', liveKey: 'forest', liveUnit: '%', liveUnitEn: '%' },
  { id: 'limits',      type: 'indicator', category: 'ecosystemes', color: '#00ff88',
    label: 'Limites planétaires', labelEn: 'Planetary boundaries', route: '/limites-planetaires' },
  { id: 'biodiversity',type: 'indicator', category: 'ecosystemes', color: '#00ff88',
    label: 'Biodiversité',        labelEn: 'Biodiversity',          route: '/limites-planetaires' },

  // ── Indicateurs Énergie ──
  { id: 'energy-mix', type: 'indicator', category: 'energie', color: '#fb923c',
    label: 'Mix énergétique',     labelEn: 'Energy mix',
    route: '/dashboard', liveKey: 'renewables', liveUnit: '% renouvelables', liveUnitEn: '% renewables' },
  { id: 'resources',  type: 'indicator', category: 'energie', color: '#fb923c',
    label: 'Ressources naturelles',labelEn: 'Natural resources',    route: '/dashboard' },

  // ── Indicateurs Sociétal ──
  { id: 'food',      type: 'indicator', category: 'societal', color: '#a78bfa',
    label: 'Sécurité alimentaire',labelEn: 'Food security',
    route: '/dashboard', liveKey: 'food', liveUnit: '/100', liveUnitEn: '/100' },
  { id: 'water',     type: 'indicator', category: 'societal', color: '#a78bfa',
    label: 'Accès à l\'eau',      labelEn: 'Water access',
    route: '/dashboard', liveKey: 'water', liveUnit: '%', liveUnitEn: '%' },
  { id: 'health',    type: 'indicator', category: 'societal', color: '#a78bfa',
    label: 'Santé globale',        labelEn: 'Global health',         route: '/dashboard' },
  { id: 'inequality',type: 'indicator', category: 'societal', color: '#a78bfa',
    label: 'Inégalités',           labelEn: 'Inequality',            route: '/dashboard' },
  { id: 'conflicts', type: 'indicator', category: 'societal', color: '#a78bfa',
    label: 'Tensions géopolitiques',labelEn: 'Geopolitical tensions',route: '/dashboard' },

  // ── Points de bascule (niveau 3 — zoom) ──
  { id: 'tp-permafrost', type: 'tipping', category: 'climat', color: '#ff5050',
    label: 'Pergélisol',          labelEn: 'Permafrost',      route: '/bascules' },
  { id: 'tp-coral',     type: 'tipping', category: 'climat', color: '#ff5050',
    label: 'Coraux',              labelEn: 'Coral reefs',     route: '/bascules' },
  { id: 'tp-arctic',    type: 'tipping', category: 'climat', color: '#ff5050',
    label: 'Banquise arctique',   labelEn: 'Arctic sea ice',  route: '/bascules' },
  { id: 'tp-amazon',    type: 'tipping', category: 'ecosystemes', color: '#ff5050',
    label: 'Amazonie',            labelEn: 'Amazon',          route: '/bascules' },
  { id: 'tp-amoc',      type: 'tipping', category: 'climat', color: '#ff5050',
    label: 'AMOC',                labelEn: 'AMOC',            route: '/bascules' },
]

// ─── Arêtes statiques ─────────────────────────────────────────────────────────

export const HUB_EDGES: HubEdgeData[] = [
  // Hub → Catégories
  { id: 'e-hub-climat',      source: 'hub', target: 'cat-climat',      edgeType: 'hub-cat', color: '#00e5ff' },
  { id: 'e-hub-eco',         source: 'hub', target: 'cat-ecosystemes', edgeType: 'hub-cat', color: '#00ff88' },
  { id: 'e-hub-energie',     source: 'hub', target: 'cat-energie',     edgeType: 'hub-cat', color: '#fb923c' },
  { id: 'e-hub-societal',    source: 'hub', target: 'cat-societal',    edgeType: 'hub-cat', color: '#a78bfa' },
  // Catégorie → Indicateurs Climat
  { id: 'e-cl-co2',       source: 'cat-climat', target: 'co2',       edgeType: 'hierarchy', color: '#00e5ff' },
  { id: 'e-cl-temp',      source: 'cat-climat', target: 'temp',      edgeType: 'hierarchy', color: '#00e5ff' },
  { id: 'e-cl-sea',       source: 'cat-climat', target: 'sea-level', edgeType: 'hierarchy', color: '#00e5ff' },

  // Catégorie → Indicateurs Écosystèmes
  { id: 'e-eco-forest', source: 'cat-ecosystemes', target: 'forest',       edgeType: 'hierarchy', color: '#00ff88' },
  { id: 'e-eco-limits', source: 'cat-ecosystemes', target: 'limits',       edgeType: 'hierarchy', color: '#00ff88' },
  { id: 'e-eco-bio',    source: 'cat-ecosystemes', target: 'biodiversity', edgeType: 'hierarchy', color: '#00ff88' },

  // Catégorie → Indicateurs Énergie
  { id: 'e-en-mix', source: 'cat-energie', target: 'energy-mix', edgeType: 'hierarchy', color: '#fb923c' },
  { id: 'e-en-res', source: 'cat-energie', target: 'resources',  edgeType: 'hierarchy', color: '#fb923c' },

  // Catégorie → Indicateurs Sociétal
  { id: 'e-soc-food',   source: 'cat-societal', target: 'food',       edgeType: 'hierarchy', color: '#a78bfa' },
  { id: 'e-soc-water',  source: 'cat-societal', target: 'water',      edgeType: 'hierarchy', color: '#a78bfa' },
  { id: 'e-soc-health', source: 'cat-societal', target: 'health',     edgeType: 'hierarchy', color: '#a78bfa' },
  { id: 'e-soc-ineq',   source: 'cat-societal', target: 'inequality', edgeType: 'hierarchy', color: '#a78bfa' },
  { id: 'e-soc-conf',   source: 'cat-societal', target: 'conflicts',  edgeType: 'hierarchy', color: '#a78bfa' },

  // Tipping ← indicateurs déclencheurs (niveau 3)
  { id: 'e-tp-perm',   source: 'temp',   target: 'tp-permafrost', edgeType: 'tipping-link' },
  { id: 'e-tp-coral',  source: 'temp',   target: 'tp-coral',      edgeType: 'tipping-link' },
  { id: 'e-tp-arctic', source: 'temp',   target: 'tp-arctic',     edgeType: 'tipping-link' },
  { id: 'e-tp-amazon', source: 'forest', target: 'tp-amazon',     edgeType: 'tipping-link' },
  { id: 'e-tp-amoc',   source: 'temp',   target: 'tp-amoc',       edgeType: 'tipping-link' },
]
