<template>
  <main class="max-w-screen-xl mx-auto px-4 py-6 space-y-4" id="main-content" tabindex="-1">

    <!-- Header -->
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black text-white mb-1">{{ t('systemic_map.title') }}</h1>
        <p class="text-sm text-slate-400 max-w-2xl leading-relaxed">{{ t('systemic_map.intro') }}</p>
      </div>
    </div>

    <!-- Controls -->
    <div class="flex flex-wrap items-center gap-3">
      <span class="text-xs text-slate-500 uppercase tracking-wider shrink-0">{{ t('systemic_map.filter') }}</span>

      <!-- Category filters — avec forme SVG par catégorie -->
      <button
        v-for="cat in CATEGORIES"
        :key="cat.id"
        @click="toggleCategory(cat.id)"
        class="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150"
        :style="{
          borderColor: CATEGORY_COLORS[cat.id],
          color: visibleCategories.has(cat.id) ? CATEGORY_COLORS[cat.id] : '#64748b',
          backgroundColor: visibleCategories.has(cat.id) ? CATEGORY_COLORS[cat.id] + '18' : 'transparent',
          opacity: visibleCategories.has(cat.id) ? '1' : '0.5',
        }"
        :aria-pressed="visibleCategories.has(cat.id)"
      >
        <svg width="13" height="13" aria-hidden="true" class="shrink-0">
          <ellipse cx="6.5" cy="6.5" rx="5.5" ry="5.5"
            :fill="CATEGORY_COLORS[cat.id] + 'bb'"
            :stroke="CATEGORY_BORDER[cat.id]" stroke-width="1.5"/>
        </svg>
        {{ t(`systemic_map.cat_${cat.id}`) }}
      </button>

      <!-- Légende arêtes -->
      <div class="flex items-center gap-4 border-l border-eb-border pl-3 ml-1 shrink-0">
        <span class="flex items-center gap-2 text-xs text-slate-400">
          <svg width="26" height="10" aria-hidden="true">
            <line x1="1" y1="5" x2="20" y2="5" stroke="#ff5050" stroke-width="1.5" stroke-dasharray="5 2.5"/>
            <polygon points="19,2.5 25,5 19,7.5" fill="#ff5050"/>
          </svg>
          {{ t('systemic_map.edge_positive') }}
        </span>
        <span class="flex items-center gap-2 text-xs text-slate-400">
          <svg width="26" height="10" aria-hidden="true">
            <line x1="1" y1="5" x2="20" y2="5" stroke="#00ff88" stroke-width="1.5"/>
            <polyline points="19,2.5 25,5 19,7.5" fill="none" stroke="#00ff88" stroke-width="1.5"/>
          </svg>
          {{ t('systemic_map.edge_negative') }}
        </span>
      </div>

      <button
        class="ml-auto text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1.5"
        @click="resetLayout"
        :title="t('systemic_map.reset_layout')"
      >
        <i class="fa fa-arrows-rotate" aria-hidden="true"></i>
        {{ t('systemic_map.reset_layout') }}
      </button>
    </div>

    <!-- Graph area -->
    <div
      class="relative border border-eb-border rounded-xl overflow-hidden bg-[#070c16]"
      :style="{ height: graphHeight }"
    >
      <div ref="cyContainer" class="w-full h-full" :aria-label="t('systemic_map.graph_aria')" role="img"></div>

      <!-- Hint -->
      <transition name="fade">
        <div
          v-if="showHint"
          class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-eb-dark/80 border border-eb-border rounded-full px-4 py-2 text-xs text-slate-400 pointer-events-none whitespace-nowrap"
        >
          <i class="fa fa-hand-pointer mr-1.5" aria-hidden="true"></i>
          {{ t('systemic_map.hint') }}
        </div>
      </transition>

      <!-- Loading -->
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-[#070c16]">
        <span class="text-sm text-slate-500 animate-pulse">{{ t('common.loading_chart') }}</span>
      </div>

      <!-- Info panel -->
      <transition name="panel">
        <aside
          v-if="selected"
          class="absolute right-0 top-0 bottom-0 w-80 bg-eb-dark/96 border-l border-eb-border overflow-y-auto"
          style="backdrop-filter: blur(8px);"
          role="complementary"
          :aria-label="t('systemic_map.panel_aria')"
        >
          <button
            @click="clearSelection"
            class="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full text-slate-500 hover:text-white hover:bg-white/10 transition-colors z-10"
            :aria-label="t('systemic_map.close_panel')"
          >
            <i class="fa fa-times text-sm" aria-hidden="true"></i>
          </button>

          <div class="p-5 pr-10">

            <!-- ── Panneau nœud ── -->
            <template v-if="selected.type === 'node'">

              <div class="flex items-start gap-2.5 mb-4">
                <!-- Forme SVG correspondant à la catégorie -->
                <span class="w-3.5 h-3.5 rounded-full shrink-0 mt-0.5" :style="{ background: selected.category ? CATEGORY_COLORS[selected.category] : '#fff' }"></span>
                <div>
                  <p
                    class="text-[10px] uppercase tracking-wider mb-0.5"
                    :style="{ color: selected.category ? CATEGORY_COLORS[selected.category] : '#fff' }"
                  >
                    {{ selected.category ? t(`systemic_map.cat_${selected.category}`) : '' }}
                  </p>
                  <h2 class="text-sm font-bold text-white leading-tight">
                    {{ locale === 'fr' ? selected.nodeLabel : selected.nodeLabelEn }}
                  </h2>
                </div>
              </div>

              <p class="text-xs text-slate-400 leading-relaxed mb-4">
                {{ locale === 'fr' ? selected.description : selected.descriptionEn }}
              </p>

              <div class="text-xs bg-eb-mid rounded-lg p-3 border border-eb-border mb-4">
                <span class="text-slate-500 uppercase tracking-wider text-[10px]">{{ t('systemic_map.ipcc_ref') }}</span>
                <p class="text-slate-300 mt-1 font-mono text-[11px]">{{ selected.ipccRef }}</p>
              </div>

              <!-- Compteurs de connexions -->
              <div class="text-xs border border-eb-border rounded-lg p-3 mb-4">
                <div class="text-slate-400 font-medium mb-2">{{ t('systemic_map.connections') }}</div>
                <div class="space-y-1.5">
                  <div class="flex justify-between items-center">
                    <span class="flex items-center gap-1.5">
                      <svg width="16" height="6" aria-hidden="true"><line x1="0" y1="3" x2="13" y2="3" stroke="#ff5050" stroke-width="1.2" stroke-dasharray="4 2"/><polygon points="12,1 16,3 12,5" fill="#ff5050"/></svg>
                      <span class="text-[#ff5050]">{{ t('systemic_map.outgoing_positive') }}</span>
                    </span>
                    <span class="font-mono text-slate-300">{{ selected.outPositive }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="flex items-center gap-1.5">
                      <svg width="16" height="6" aria-hidden="true"><line x1="0" y1="3" x2="13" y2="3" stroke="#00ff88" stroke-width="1.2"/><polyline points="12,1 16,3 12,5" fill="none" stroke="#00ff88" stroke-width="1.2"/></svg>
                      <span class="text-[#00ff88]">{{ t('systemic_map.outgoing_negative') }}</span>
                    </span>
                    <span class="font-mono text-slate-300">{{ selected.outNegative }}</span>
                  </div>
                  <div class="flex justify-between border-t border-eb-border pt-1.5 mt-1.5">
                    <span class="text-slate-500">{{ t('systemic_map.incoming_count') }}</span>
                    <span class="font-mono text-slate-300">{{ selected.incoming }}</span>
                  </div>
                </div>
              </div>

              <!-- Liste des relations (repliables) -->
              <div v-if="selected.connectedEdges?.length">
                <div class="text-xs text-slate-400 font-medium mb-2">{{ t('systemic_map.conn_list_title') }}</div>
                <div class="space-y-1.5">
                  <details
                    v-for="edge in selected.connectedEdges"
                    :key="edge.id"
                    class="conn-item text-xs border border-eb-border rounded-lg overflow-hidden"
                  >
                    <summary class="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-white/5 transition-colors">
                      <!-- Direction -->
                      <span class="font-mono text-slate-500 shrink-0 w-3 text-center">
                        {{ edge.direction === 'out' ? '→' : '←' }}
                      </span>
                      <!-- Type arête : icône + couleur -->
                      <span
                        class="shrink-0 font-bold w-3 text-center"
                        :class="edge.edgeType === 'positive' ? 'text-red-400' : 'text-green-400'"
                      >{{ edge.edgeType === 'positive' ? '↑' : '↓' }}</span>
                      <!-- Nom du nœud lié -->
                      <span class="text-slate-300 leading-tight flex-1 min-w-0 truncate">
                        {{ locale === 'fr' ? edge.otherLabel : edge.otherLabelEn }}
                      </span>
                      <i class="fa fa-chevron-down conn-chevron text-slate-600 text-[9px] shrink-0" aria-hidden="true"></i>
                    </summary>
                    <div class="px-3 pb-3 pt-2 border-t border-eb-border bg-eb-mid/40">
                      <p class="text-slate-400 leading-relaxed mb-2">
                        {{ locale === 'fr' ? edge.description : edge.descriptionEn }}
                      </p>
                      <p class="font-mono text-[10px] text-slate-600">{{ edge.ipccRef }}</p>
                    </div>
                  </details>
                </div>
              </div>

            </template>

            <!-- ── Panneau arête ── -->
            <template v-else-if="selected.type === 'edge'">
              <div
                class="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full border mb-4"
                :class="selected.edgeType === 'positive'
                  ? 'border-red-700/50 bg-red-900/15 text-red-400'
                  : 'border-green-700/50 bg-green-900/15 text-green-400'"
              >
                <span>{{ selected.edgeType === 'positive' ? '↑' : '↓' }}</span>
                {{ selected.edgeType === 'positive' ? t('systemic_map.edge_label_positive') : t('systemic_map.edge_label_negative') }}
              </div>

              <div class="flex items-center gap-2 text-xs mb-4 p-3 border border-eb-border rounded-lg bg-eb-mid">
                <span class="font-semibold text-white">{{ locale === 'fr' ? selected.sourceLabel : selected.sourceLabelEn }}</span>
                <i
                  class="fa fa-arrow-right shrink-0"
                  :style="{ color: selected.edgeType ? EDGE_COLORS[selected.edgeType] : '#fff' }"
                  aria-hidden="true"
                ></i>
                <span class="font-semibold text-white">{{ locale === 'fr' ? selected.targetLabel : selected.targetLabelEn }}</span>
              </div>

              <p class="text-xs text-slate-400 leading-relaxed mb-4">
                {{ locale === 'fr' ? selected.description : selected.descriptionEn }}
              </p>

              <div class="text-xs bg-eb-mid rounded-lg p-3 border border-eb-border">
                <span class="text-slate-500 uppercase tracking-wider text-[10px]">{{ t('systemic_map.ipcc_ref') }}</span>
                <p class="text-slate-300 mt-1 font-mono text-[11px]">{{ selected.ipccRef }}</p>
              </div>
            </template>

          </div>
        </aside>
      </transition>
    </div>

  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import cytoscape from 'cytoscape'
import type { Core, NodeSingular, EdgeSingular } from 'cytoscape'
import {
  systemicNodes, systemicEdges,
  CATEGORY_COLORS, CATEGORY_BORDER, EDGE_COLORS,
  type NodeCategory, type EdgeType,
} from '@/data/systemicGraph'

const { t, locale } = useI18n()

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES: { id: NodeCategory }[] = [
  { id: 'physical' },
  { id: 'ecosystem' },
  { id: 'societal' },
]

// Style de ligne + forme de flèche par type d'arête — discriminant non-colorimétrique
const EDGE_LINE_STYLE: Record<EdgeType, string>   = { positive: 'dashed', negative: 'solid' }
const EDGE_ARROW_SHAPE: Record<EdgeType, string>  = { positive: 'triangle', negative: 'vee' }

// ─── Layout preset ────────────────────────────────────────────────────────────
// Trois zones causales (gauche→droite, haut→bas) :
//   • Haut-gauche  : sources d'émissions (fossil, renewable, land, resources)
//   • Haut-centre  : variables atmosphériques (ghg, temperature, acid, sea_level)
//   • Centre       : tampons écosystémiques (forest, freshwater, biodiversity)
//   • Bas-droite   : indicateurs sociétaux
// Les nœuds les plus connectés (food_security, temperature) occupent
// des positions charnières entre zones ; les terminaux peu connectés
// (permafrost, geopolitical, migration) sont en périphérie.

const PRESET_POSITIONS: Record<string, { x: number; y: number }> = {
  // ── Sources / Énergie (haut-gauche) ──────────────────────────────────────
  permafrost:    { x:  80, y:   0 },
  fossil_energy: { x:   0, y: 110 },
  renewable:     { x:   0, y: 230 },
  land_use:      { x:   0, y: 370 },
  resources:     { x:   0, y: 480 },

  // ── Atmosphère (haut-centre) ──────────────────────────────────────────────
  ghg:           { x: 260, y:  90 },
  temperature:   { x: 430, y:  40 },
  ocean_acid:    { x: 310, y: 210 },
  sea_level:     { x: 610, y:  40 },

  // ── Tampons écosystémiques (centre) ──────────────────────────────────────
  biodiversity:  { x: 270, y: 340 },
  forest:        { x: 590, y: 210 },
  freshwater:    { x: 470, y: 230 },

  // ── Sociétal (bas-droite) ─────────────────────────────────────────────────
  water_access:  { x: 380, y: 440 },
  food_security: { x: 530, y: 420 },
  health:        { x: 700, y: 340 },
  inequality:    { x: 470, y: 550 },
  migration:     { x: 650, y: 530 },
  geopolitical:  { x: 780, y: 450 },
}

const LAYOUT_OPTIONS = {
  name: 'preset' as const,
  positions: (node: NodeSingular) => PRESET_POSITIONS[node.id()] ?? { x: 400, y: 300 },
  fit: true,
  padding: 70,
  animate: true,
  animationDuration: 600,
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface EdgeListItem {
  id:            string
  direction:     'out' | 'in'
  edgeType:      EdgeType
  otherLabel:    string
  otherLabelEn:  string
  description:   string
  descriptionEn: string
  ipccRef:       string
}

interface SelectedInfo {
  type: 'node' | 'edge'
  description:   string
  descriptionEn: string
  ipccRef:       string
  // nœud
  category?:       NodeCategory
  nodeLabel?:      string
  nodeLabelEn?:    string
  outPositive?:    number
  outNegative?:    number
  incoming?:       number
  connectedEdges?: EdgeListItem[]
  // arête
  edgeType?:      EdgeType
  sourceLabel?:   string
  sourceLabelEn?: string
  targetLabel?:   string
  targetLabelEn?: string
}

// ─── State ────────────────────────────────────────────────────────────────────

const cyContainer = ref<HTMLDivElement | null>(null)
let cy: Core | null = null

const loading    = ref(true)
const showHint   = ref(true)
const visibleCategories = ref<Set<NodeCategory>>(new Set(['physical', 'ecosystem', 'societal']))
const selected   = ref<SelectedInfo | null>(null)

const graphHeight = computed(() => 'calc(100vh - 260px)')

// ─── Cytoscape ────────────────────────────────────────────────────────────────

function computeDegrees(): Record<string, number> {
  const deg: Record<string, number> = {}
  systemicNodes.forEach(n => { deg[n.data.id] = 0 })
  systemicEdges.forEach(e => {
    deg[e.data.source] = (deg[e.data.source] ?? 0) + 1
    deg[e.data.target] = (deg[e.data.target] ?? 0) + 1
  })
  return deg
}

function buildElements() {
  const degrees = computeDegrees()
  return [
    ...systemicNodes.map(n => ({
      group: 'nodes' as const,
      data: { ...n.data, degree: degrees[n.data.id] ?? 1 },
    })),
    ...systemicEdges.map(e => ({ group: 'edges' as const, data: { ...e.data } })),
  ]
}

function buildStylesheet(): cytoscape.StylesheetStyle[] {
  const nodeStyles: cytoscape.StylesheetStyle[] = (Object.keys(CATEGORY_COLORS) as NodeCategory[]).map(cat => ({
    selector: `node[category="${cat}"]`,
    style: {
      'background-color': CATEGORY_COLORS[cat],
      'border-color':     CATEGORY_BORDER[cat],
    } as cytoscape.Css.Node,
  }))

  const edgeStyles: cytoscape.StylesheetStyle[] = (Object.keys(EDGE_COLORS) as EdgeType[]).map(type => ({
    selector: `edge[type="${type}"]`,
    style: {
      'line-color':          EDGE_COLORS[type],
      'target-arrow-color':  EDGE_COLORS[type],
      'line-style':          EDGE_LINE_STYLE[type],
      'target-arrow-shape':  EDGE_ARROW_SHAPE[type],
    } as cytoscape.Css.Edge,
  }))

  return [
    {
      selector: 'node',
      style: {
        'width':             'mapData(degree, 2, 12, 30, 68)',
        'height':            'mapData(degree, 2, 12, 30, 68)',
        'border-width':        2,
        'background-opacity':  0.82,
        'label':               'data(label)',
        'color':               '#e2e8f0',
        'font-size':         'mapData(degree, 2, 12, 8, 11)',
        'text-valign':         'bottom',
        'text-halign':         'center',
        'text-margin-y':       6,
        'text-wrap':           'wrap',
        'text-max-width':      '90px',
        'font-family':         'Inter, sans-serif',
        'text-background-color':   '#070c16',
        'text-background-opacity': 0.75,
        'text-background-padding': '2px',
        'text-background-shape':   'roundrectangle',
        'overlay-padding': 6,
      } as cytoscape.Css.Node,
    },
    ...nodeStyles,
    {
      selector: 'node:selected',
      style: {
        'border-width': 4,
        'border-color': '#ffffff',
        'font-weight':  'bold',
      } as cytoscape.Css.Node,
    },
    {
      selector: 'edge',
      style: {
        'width':              1.5,
        'curve-style':        'bezier',
        'line-dash-pattern':  [7, 3],
        'opacity':            0.70,
        'overlay-padding':    6,
      } as cytoscape.Css.Edge,
    },
    ...edgeStyles,
    {
      selector: 'edge:selected',
      style: { 'width': 3, 'opacity': 1 } as cytoscape.Css.Edge,
    },
    {
      selector: '.dimmed',
      style: { 'opacity': 0.10 } as cytoscape.Css.Node & cytoscape.Css.Edge,
    },
  ]
}

function buildEdgeList(node: NodeSingular): EdgeListItem[] {
  const items: EdgeListItem[] = []

  node.outgoers('edge').forEach(edge => {
    const ed  = edge.data()
    const tgt = systemicNodes.find(n => n.data.id === (edge as EdgeSingular).target().id())?.data
    items.push({
      id: ed.id, direction: 'out', edgeType: ed.type as EdgeType,
      otherLabel:    tgt?.label    ?? (edge as EdgeSingular).target().id(),
      otherLabelEn:  tgt?.labelEn  ?? (edge as EdgeSingular).target().id(),
      description:   ed.description,
      descriptionEn: ed.descriptionEn,
      ipccRef:       ed.ipccRef,
    })
  })

  node.incomers('edge').forEach(edge => {
    const ed  = edge.data()
    const src = systemicNodes.find(n => n.data.id === (edge as EdgeSingular).source().id())?.data
    items.push({
      id: ed.id, direction: 'in', edgeType: ed.type as EdgeType,
      otherLabel:    src?.label    ?? (edge as EdgeSingular).source().id(),
      otherLabelEn:  src?.labelEn  ?? (edge as EdgeSingular).source().id(),
      description:   ed.description,
      descriptionEn: ed.descriptionEn,
      ipccRef:       ed.ipccRef,
    })
  })

  // Sortant d'abord, puis entrant ; dans chaque groupe : positif avant négatif
  items.sort((a, b) => {
    if (a.direction !== b.direction) return a.direction === 'out' ? -1 : 1
    if (a.edgeType  !== b.edgeType)  return a.edgeType  === 'positive' ? -1 : 1
    return 0
  })

  return items
}

function initCytoscape() {
  if (!cyContainer.value) return
  loading.value = true

  cy = cytoscape({
    container: cyContainer.value,
    elements:  buildElements(),
    style:     buildStylesheet(),
    layout:    LAYOUT_OPTIONS,
    userZoomingEnabled:  true,
    userPanningEnabled:  true,
    boxSelectionEnabled: false,
    minZoom: 0.25,
    maxZoom: 3.5,
    wheelSensitivity: 0.25,
  })

  cy.ready(() => {
    loading.value = false
    syncLabels()
  })

  cy.on('tap', 'node', (e) => {
    showHint.value = false
    const node = e.target as NodeSingular
    const d    = node.data()

    selected.value = {
      type:          'node',
      category:      d.category     as NodeCategory,
      nodeLabel:     d.label,
      nodeLabelEn:   d.labelEn,
      description:   d.description,
      descriptionEn: d.descriptionEn,
      ipccRef:       d.ipccRef,
      outPositive:   node.outgoers('edge').filter('[type="positive"]').length,
      outNegative:   node.outgoers('edge').filter('[type="negative"]').length,
      incoming:      node.incomers('edge').length,
      connectedEdges: buildEdgeList(node),
    }

    cy!.elements().addClass('dimmed')
    node.removeClass('dimmed')
    node.neighborhood().removeClass('dimmed')
  })

  cy.on('tap', 'edge', (e) => {
    showHint.value = false
    const edge  = e.target as EdgeSingular
    const d     = edge.data()
    const srcId = edge.source().id()
    const tgtId = edge.target().id()
    const src   = systemicNodes.find(n => n.data.id === srcId)?.data
    const tgt   = systemicNodes.find(n => n.data.id === tgtId)?.data

    selected.value = {
      type:          'edge',
      edgeType:      d.type         as EdgeType,
      description:   d.description,
      descriptionEn: d.descriptionEn,
      ipccRef:       d.ipccRef,
      sourceLabel:   src?.label    ?? srcId,
      sourceLabelEn: src?.labelEn  ?? srcId,
      targetLabel:   tgt?.label    ?? tgtId,
      targetLabelEn: tgt?.labelEn  ?? tgtId,
    }

    cy!.elements().addClass('dimmed')
    edge.removeClass('dimmed')
    edge.source().removeClass('dimmed')
    edge.target().removeClass('dimmed')
  })

  cy.on('tap', (e) => {
    if (e.target === cy) clearSelection()
  })
}

function clearSelection() {
  selected.value = null
  cy?.elements().removeClass('dimmed')
  cy?.elements(':selected').unselect()
}

function syncLabels() {
  if (!cy) return
  cy.nodes().forEach(node => {
    const id  = node.id()
    const src = systemicNodes.find(n => n.data.id === id)
    if (src) node.data('label', locale.value === 'fr' ? src.data.label : src.data.labelEn)
  })
}

function toggleCategory(cat: NodeCategory) {
  const s = new Set(visibleCategories.value)
  if (s.has(cat)) {
    if (s.size === 1) return
    s.delete(cat)
  } else {
    s.add(cat)
  }
  visibleCategories.value = s
  applyFilter()
}

function applyFilter() {
  if (!cy) return
  const visible = visibleCategories.value
  cy.batch(() => {
    cy!.nodes().forEach(node => {
      const cat = node.data('category') as NodeCategory
      node.style('display', visible.has(cat) ? 'element' : 'none')
    })
    cy!.edges().forEach(edge => {
      const srcCat = edge.source().data('category') as NodeCategory
      const tgtCat = edge.target().data('category') as NodeCategory
      edge.style('display', visible.has(srcCat) && visible.has(tgtCat) ? 'element' : 'none')
    })
  })
}

function resetLayout() {
  cy?.layout(LAYOUT_OPTIONS).run()
}

// ─── Watchers ─────────────────────────────────────────────────────────────────

watch(locale, () => {
  syncLabels()
  // Mettre à jour les labels dans le panneau si un nœud est sélectionné
  if (selected.value?.type === 'node' && selected.value.connectedEdges) {
    selected.value.connectedEdges.forEach(item => {
      const src = systemicNodes.find(n => n.data.label === item.otherLabel || n.data.labelEn === item.otherLabelEn)
      if (src) {
        item.otherLabel   = src.data.label
        item.otherLabelEn = src.data.labelEn
      }
    })
  }
})

// ─── Lifecycle ────────────────────────────────────────────────────────────────

onMounted(initCytoscape)
onBeforeUnmount(() => cy?.destroy())
</script>

<style scoped>
.panel-enter-active,
.panel-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.panel-enter-from,
.panel-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Chevron dans les <details> repliables */
.conn-item .conn-chevron {
  transition: transform 0.15s ease;
}
.conn-item[open] .conn-chevron {
  transform: rotate(180deg);
}

/* Masque le marqueur natif du <summary> */
.conn-item summary {
  list-style: none;
}
.conn-item summary::-webkit-details-marker {
  display: none;
}
</style>
