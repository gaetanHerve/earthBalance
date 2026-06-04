export type HubNodeType = 'hub' | 'category' | 'indicator' | 'tipping'
export type HubChartType = NonNullable<HubNodeData['liveKey']> | 'energyMixBreakdown'
export type HubCategory = 'climat' | 'ecosystemes' | 'energie' | 'societal' | 'politiques'
export type HubEdgeType = 'hub-cat' | 'hierarchy' | 'tipping-link' | 'causal'

export interface HubNodeData {
  id:       string
  type:     HubNodeType
  category: HubCategory | null
  color:    string
  route:    string
  liveKey?: 'co2' | 'temp' | 'forest' | 'renewables' | 'food' | 'water'
  label?:   string
}

export interface HubEdgeData {
  id:          string
  source:      string
  target:      string
  edgeType:    HubEdgeType
  color?:      string
  causalType?: 'positive' | 'negative'
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
  { id: 'hub',            type: 'hub',       category: null,          color: '#00e5ff', route: '/' },

  // ── Catégories ──
  { id: 'cat-climat',     type: 'category',  category: 'climat',      color: '#00e5ff', route: '/dashboard' },
  { id: 'cat-ecosystemes',type: 'category',  category: 'ecosystemes', color: '#00ff88', route: '/limites-planetaires' },
  { id: 'cat-energie',    type: 'category',  category: 'energie',     color: '#fb923c', route: '/dashboard' },
  { id: 'cat-societal',   type: 'category',  category: 'societal',    color: '#a78bfa', route: '/dashboard' },

  // ── Indicateurs Climat ──
  { id: 'co2',       type: 'indicator', category: 'climat',      color: '#00e5ff', route: '/dashboard', liveKey: 'co2' },
  { id: 'temp',      type: 'indicator', category: 'climat',      color: '#00e5ff', route: '/dashboard', liveKey: 'temp' },
  { id: 'sea-level', type: 'indicator', category: 'climat',      color: '#00e5ff', route: '/dashboard' },

  // ── Indicateurs Écosystèmes ──
  { id: 'forest',      type: 'indicator', category: 'ecosystemes', color: '#00ff88', route: '/dashboard',          liveKey: 'forest' },
  { id: 'biodiversity',type: 'indicator', category: 'ecosystemes', color: '#00ff88', route: '/limites-planetaires' },

  // ── Indicateurs Énergie ──
  { id: 'energy-mix', type: 'indicator', category: 'energie',   color: '#fb923c', route: '/dashboard', liveKey: 'renewables' },
  { id: 'resources',  type: 'indicator', category: 'energie',   color: '#fb923c', route: '/dashboard' },

  // ── Indicateurs Sociétal ──
  { id: 'food',      type: 'indicator', category: 'societal',   color: '#a78bfa', route: '/dashboard', liveKey: 'food' },
  { id: 'water',     type: 'indicator', category: 'societal',   color: '#a78bfa', route: '/dashboard', liveKey: 'water' },
  { id: 'health',    type: 'indicator', category: 'societal',   color: '#a78bfa', route: '/dashboard' },
  { id: 'inequality',type: 'indicator', category: 'societal',   color: '#a78bfa', route: '/dashboard' },
  { id: 'conflicts', type: 'indicator', category: 'societal',   color: '#a78bfa', route: '/dashboard' },

  // ── Points de bascule (niveau 3) ──
  { id: 'tp-permafrost', type: 'tipping', category: 'climat',      color: '#ff5050', route: '/bascules' },
  { id: 'tp-coral',      type: 'tipping', category: 'climat',      color: '#ff5050', route: '/bascules' },
  { id: 'tp-arctic',     type: 'tipping', category: 'climat',      color: '#ff5050', route: '/bascules' },
  { id: 'tp-amazon',     type: 'tipping', category: 'ecosystemes', color: '#ff5050', route: '/bascules' },
  { id: 'tp-amoc',       type: 'tipping', category: 'climat',      color: '#ff5050', route: '/bascules' },
]

// ─── Arêtes statiques ─────────────────────────────────────────────────────────

export const HUB_EDGES: HubEdgeData[] = [
  // Hub → Catégories
  { id: 'e-hub-climat',   source: 'hub', target: 'cat-climat',      edgeType: 'hub-cat', color: '#00e5ff' },
  { id: 'e-hub-eco',      source: 'hub', target: 'cat-ecosystemes', edgeType: 'hub-cat', color: '#00ff88' },
  { id: 'e-hub-energie',  source: 'hub', target: 'cat-energie',     edgeType: 'hub-cat', color: '#fb923c' },
  { id: 'e-hub-societal', source: 'hub', target: 'cat-societal',    edgeType: 'hub-cat', color: '#a78bfa' },

  // Catégorie → Indicateurs Climat
  { id: 'e-cl-co2',  source: 'cat-climat', target: 'co2',       edgeType: 'hierarchy', color: '#00e5ff' },
  { id: 'e-cl-temp', source: 'cat-climat', target: 'temp',      edgeType: 'hierarchy', color: '#00e5ff' },
  { id: 'e-cl-sea',  source: 'cat-climat', target: 'sea-level', edgeType: 'hierarchy', color: '#00e5ff' },

  // Catégorie → Indicateurs Écosystèmes
  { id: 'e-eco-forest', source: 'cat-ecosystemes', target: 'forest',       edgeType: 'hierarchy', color: '#00ff88' },
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

  // Tipping ← indicateurs déclencheurs
  { id: 'e-tp-perm',   source: 'temp',   target: 'tp-permafrost', edgeType: 'tipping-link' },
  { id: 'e-tp-coral',  source: 'temp',   target: 'tp-coral',      edgeType: 'tipping-link' },
  { id: 'e-tp-arctic', source: 'temp',   target: 'tp-arctic',     edgeType: 'tipping-link' },
  { id: 'e-tp-amazon', source: 'forest', target: 'tp-amazon',     edgeType: 'tipping-link' },
  { id: 'e-tp-amoc',   source: 'temp',   target: 'tp-amoc',       edgeType: 'tipping-link' },

  // ─── Arêtes causales ─────────────────────────────────────────────────────────
  // Dérivées de systemicGraph.ts — uniquement les paires source+cible mappées sur des nœuds hub.
  // positive (aggravant) → #ff5050 · negative (bénéfique) → #00ff88
  { id: 'c-co2-temp',     source: 'co2',         target: 'temp',        edgeType: 'causal', causalType: 'positive', color: '#ff5050' },
  { id: 'c-temp-sea',     source: 'temp',        target: 'sea-level',   edgeType: 'causal', causalType: 'positive', color: '#ff5050' },
  { id: 'c-temp-forest',  source: 'temp',        target: 'forest',      edgeType: 'causal', causalType: 'positive', color: '#ff5050' },
  { id: 'c-temp-bio',     source: 'temp',        target: 'biodiversity',edgeType: 'causal', causalType: 'positive', color: '#ff5050' },
  { id: 'c-temp-food',    source: 'temp',        target: 'food',        edgeType: 'causal', causalType: 'positive', color: '#ff5050' },
  { id: 'c-temp-health',  source: 'temp',        target: 'health',      edgeType: 'causal', causalType: 'positive', color: '#ff5050' },
  { id: 'c-temp-conf',    source: 'temp',        target: 'conflicts',   edgeType: 'causal', causalType: 'positive', color: '#ff5050' },
  { id: 'c-forest-co2',   source: 'forest',      target: 'co2',         edgeType: 'causal', causalType: 'negative', color: '#00ff88' },
  { id: 'c-forest-bio',   source: 'forest',      target: 'biodiversity',edgeType: 'causal', causalType: 'negative', color: '#00ff88' },
  { id: 'c-forest-food',  source: 'forest',      target: 'food',        edgeType: 'causal', causalType: 'negative', color: '#00ff88' },
  { id: 'c-sea-food',     source: 'sea-level',   target: 'food',        edgeType: 'causal', causalType: 'positive', color: '#ff5050' },
  { id: 'c-sea-conf',     source: 'sea-level',   target: 'conflicts',   edgeType: 'causal', causalType: 'positive', color: '#ff5050' },
  { id: 'c-ren-co2',      source: 'energy-mix',  target: 'co2',         edgeType: 'causal', causalType: 'negative', color: '#00ff88' },
  { id: 'c-ren-res',      source: 'energy-mix',  target: 'resources',   edgeType: 'causal', causalType: 'positive', color: '#ff5050' },
  { id: 'c-res-co2',      source: 'resources',   target: 'co2',         edgeType: 'causal', causalType: 'positive', color: '#ff5050' },
  { id: 'c-res-bio',      source: 'resources',   target: 'biodiversity',edgeType: 'causal', causalType: 'positive', color: '#ff5050' },
  { id: 'c-res-conf',     source: 'resources',   target: 'conflicts',   edgeType: 'causal', causalType: 'positive', color: '#ff5050' },
  { id: 'c-bio-food',     source: 'biodiversity',target: 'food',        edgeType: 'causal', causalType: 'negative', color: '#00ff88' },
  { id: 'c-food-health',  source: 'food',        target: 'health',      edgeType: 'causal', causalType: 'negative', color: '#00ff88' },
  { id: 'c-food-ineq',    source: 'food',        target: 'inequality',  edgeType: 'causal', causalType: 'negative', color: '#00ff88' },
  { id: 'c-water-food',   source: 'water',       target: 'food',        edgeType: 'causal', causalType: 'negative', color: '#00ff88' },
  { id: 'c-water-health', source: 'water',       target: 'health',      edgeType: 'causal', causalType: 'negative', color: '#00ff88' },
  { id: 'c-water-conf',   source: 'water',       target: 'conflicts',   edgeType: 'causal', causalType: 'negative', color: '#00ff88' },
  { id: 'c-ineq-health',  source: 'inequality',  target: 'health',      edgeType: 'causal', causalType: 'positive', color: '#ff5050' },
  { id: 'c-ineq-food',    source: 'inequality',  target: 'food',        edgeType: 'causal', causalType: 'positive', color: '#ff5050' },
  { id: 'c-ineq-conf',    source: 'inequality',  target: 'conflicts',   edgeType: 'causal', causalType: 'positive', color: '#ff5050' },
  { id: 'c-ineq-ren',     source: 'inequality',  target: 'energy-mix',  edgeType: 'causal', causalType: 'positive', color: '#ff5050' },
  { id: 'c-health-ineq',  source: 'health',      target: 'inequality',  edgeType: 'causal', causalType: 'negative', color: '#00ff88' },
]
