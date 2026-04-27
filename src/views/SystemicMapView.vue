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
        <span class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ background: CATEGORY_COLORS[cat.id] }"></span>
        {{ t(`systemic_map.cat_${cat.id}`) }}
      </button>

      <!-- Edge legend -->
      <div class="flex items-center gap-3 border-l border-eb-border pl-3 ml-1 shrink-0">
        <span class="flex items-center gap-1.5 text-xs text-slate-400">
          <svg width="20" height="4" aria-hidden="true"><line x1="0" y1="2" x2="20" y2="2" stroke="#ff5050" stroke-width="2" stroke-dasharray="4 1"/><polygon points="18,0 20,2 18,4" fill="#ff5050"/></svg>
          {{ t('systemic_map.edge_positive') }}
        </span>
        <span class="flex items-center gap-1.5 text-xs text-slate-400">
          <svg width="20" height="4" aria-hidden="true"><line x1="0" y1="2" x2="20" y2="2" stroke="#00ff88" stroke-width="2" stroke-dasharray="4 1"/><polygon points="18,0 20,2 18,4" fill="#00ff88"/></svg>
          {{ t('systemic_map.edge_negative') }}
        </span>
      </div>

      <button
        class="ml-auto text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1"
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
      <!-- Cytoscape container -->
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
          <!-- Close button -->
          <button
            @click="clearSelection"
            class="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
            :aria-label="t('systemic_map.close_panel')"
          >
            <i class="fa fa-times text-sm" aria-hidden="true"></i>
          </button>

          <div class="p-5 pr-10">

            <!-- Node panel -->
            <template v-if="selected.type === 'node'">
              <div class="flex items-start gap-2.5 mb-4">
                <span
                  class="w-3.5 h-3.5 rounded-full shrink-0 mt-0.5"
                  :style="{ background: selected.category ? CATEGORY_COLORS[selected.category] : '#fff' }"
                ></span>
                <div>
                  <p class="text-[10px] uppercase tracking-wider mb-0.5" :style="{ color: selected.category ? CATEGORY_COLORS[selected.category] : '#fff' }">
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

              <div class="text-xs border border-eb-border rounded-lg p-3">
                <div class="text-slate-400 font-medium mb-2">{{ t('systemic_map.connections') }}</div>
                <div class="space-y-1.5">
                  <div class="flex justify-between">
                    <span class="text-[#ff5050]">{{ t('systemic_map.outgoing_positive') }}</span>
                    <span class="font-mono text-slate-300">{{ selected.outPositive }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-[#00ff88]">{{ t('systemic_map.outgoing_negative') }}</span>
                    <span class="font-mono text-slate-300">{{ selected.outNegative }}</span>
                  </div>
                  <div class="flex justify-between border-t border-eb-border pt-1.5 mt-1.5">
                    <span class="text-slate-500">{{ t('systemic_map.incoming_count') }}</span>
                    <span class="font-mono text-slate-300">{{ selected.incoming }}</span>
                  </div>
                </div>
              </div>
            </template>

            <!-- Edge panel -->
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

const LAYOUT_OPTIONS = {
  name: 'cose',
  animate: true,
  animationDuration: 800,
  nodeRepulsion: 14000,
  idealEdgeLength: 130,
  edgeElasticity: 100,
  gravity: 0.8,
  numIter: 1200,
  fit: true,
  padding: 50,
  randomize: false,
}

// ─── State ────────────────────────────────────────────────────────────────────

const cyContainer = ref<HTMLDivElement | null>(null)
let cy: Core | null = null

const loading    = ref(true)
const showHint   = ref(true)
const visibleCategories = ref<Set<NodeCategory>>(new Set(['physical', 'ecosystem', 'societal']))

interface SelectedInfo {
  type: 'node' | 'edge'
  description:   string
  descriptionEn: string
  ipccRef:       string
  // node
  category?:    NodeCategory
  nodeLabel?:   string
  nodeLabelEn?: string
  outPositive?: number
  outNegative?: number
  incoming?:    number
  // edge
  edgeType?:      EdgeType
  sourceLabel?:   string
  sourceLabelEn?: string
  targetLabel?:   string
  targetLabelEn?: string
}

const selected = ref<SelectedInfo | null>(null)

const graphHeight = computed(() => {
  return 'calc(100vh - 260px)'
})

// ─── Cytoscape ────────────────────────────────────────────────────────────────

function buildElements() {
  return [
    ...systemicNodes.map(n => ({
      group: 'nodes' as const,
      data: { ...n.data },
    })),
    ...systemicEdges.map(e => ({
      group: 'edges' as const,
      data: { ...e.data },
    })),
  ]
}

function buildStylesheet(): cytoscape.StylesheetStyle[] {
  const nodeStyles: cytoscape.StylesheetStyle[] = (Object.keys(CATEGORY_COLORS) as NodeCategory[]).map(cat => ({
    selector: `node[category="${cat}"]`,
    style: {
      'background-color': CATEGORY_COLORS[cat],
      'border-color': CATEGORY_BORDER[cat],
    } as cytoscape.Css.Node,
  }))

  const edgeStyles: cytoscape.StylesheetStyle[] = (Object.keys(EDGE_COLORS) as EdgeType[]).map(type => ({
    selector: `edge[type="${type}"]`,
    style: {
      'line-color': EDGE_COLORS[type],
      'target-arrow-color': EDGE_COLORS[type],
    } as cytoscape.Css.Edge,
  }))

  return [
    {
      selector: 'node',
      style: {
        'width': 40,
        'height': 40,
        'border-width': 2,
        'label': 'data(label)',
        'color': '#e2e8f0',
        'font-size': '9px',
        'text-valign': 'bottom',
        'text-halign': 'center',
        'text-margin-y': 5,
        'text-wrap': 'wrap',
        'text-max-width': '80px',
        'font-family': 'Inter, sans-serif',
        'text-background-color': '#070c16',
        'text-background-opacity': 0.75,
        'text-background-padding': '2px',
        'text-background-shape': 'roundrectangle',
        'overlay-padding': 6,
      } as cytoscape.Css.Node,
    },
    ...nodeStyles,
    {
      selector: 'node:selected',
      style: {
        'border-width': 3.5,
        'border-color': '#ffffff',
        'width': 50,
        'height': 50,
        'font-size': '10px',
        'font-weight': 'bold',
      } as cytoscape.Css.Node,
    },
    {
      selector: 'edge',
      style: {
        'width': 1.5,
        'curve-style': 'bezier',
        'target-arrow-shape': 'triangle',
        'opacity': 0.65,
        'overlay-padding': 6,
      } as cytoscape.Css.Edge,
    },
    ...edgeStyles,
    {
      selector: 'edge:selected',
      style: {
        'width': 3,
        'opacity': 1,
      } as cytoscape.Css.Edge,
    },
    {
      selector: '.dimmed',
      style: {
        'opacity': 0.1,
      } as cytoscape.Css.Node & cytoscape.Css.Edge,
    },
  ]
}

function initCytoscape() {
  if (!cyContainer.value) return
  loading.value = true

  cy = cytoscape({
    container: cyContainer.value,
    elements: buildElements(),
    style: buildStylesheet(),
    layout: LAYOUT_OPTIONS,
    userZoomingEnabled: true,
    userPanningEnabled: true,
    boxSelectionEnabled: false,
    minZoom: 0.25,
    maxZoom: 3.5,
    wheelSensitivity: 0.25,
  })

  cy.ready(() => {
    loading.value = false
    syncLabels()
  })

  // Node tap
  cy.on('tap', 'node', (e) => {
    showHint.value = false
    const node = e.target as NodeSingular
    const d = node.data()
    const outEdges  = node.outgoers('edge')
    const inEdges   = node.incomers('edge')

    selected.value = {
      type: 'node',
      category:    d.category as NodeCategory,
      nodeLabel:   d.label,
      nodeLabelEn: d.labelEn,
      description:   d.description,
      descriptionEn: d.descriptionEn,
      ipccRef:       d.ipccRef,
      outPositive: outEdges.filter('[type="positive"]').length,
      outNegative: outEdges.filter('[type="negative"]').length,
      incoming:    inEdges.length,
    }

    cy!.elements().addClass('dimmed')
    node.removeClass('dimmed')
    node.neighborhood().removeClass('dimmed')
  })

  // Edge tap
  cy.on('tap', 'edge', (e) => {
    showHint.value = false
    const edge = e.target as EdgeSingular
    const d = edge.data()
    const srcId = edge.source().id()
    const tgtId = edge.target().id()
    const src   = systemicNodes.find(n => n.data.id === srcId)?.data
    const tgt   = systemicNodes.find(n => n.data.id === tgtId)?.data

    selected.value = {
      type: 'edge',
      edgeType:      d.type as EdgeType,
      description:   d.description,
      descriptionEn: d.descriptionEn,
      ipccRef:       d.ipccRef,
      sourceLabel:   src?.label   ?? srcId,
      sourceLabelEn: src?.labelEn ?? srcId,
      targetLabel:   tgt?.label   ?? tgtId,
      targetLabelEn: tgt?.labelEn ?? tgtId,
    }

    cy!.elements().addClass('dimmed')
    edge.removeClass('dimmed')
    edge.source().removeClass('dimmed')
    edge.target().removeClass('dimmed')
  })

  // Background tap — clear selection
  cy.on('tap', (e) => {
    if (e.target === cy) {
      clearSelection()
    }
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
    if (src) {
      node.data('label', locale.value === 'fr' ? src.data.label : src.data.labelEn)
    }
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
      const srcCat = (edge.source().data('category') as NodeCategory)
      const tgtCat = (edge.target().data('category') as NodeCategory)
      const show   = visible.has(srcCat) && visible.has(tgtCat)
      edge.style('display', show ? 'element' : 'none')
    })
  })
}

function resetLayout() {
  if (!cy) return
  cy.layout(LAYOUT_OPTIONS).run()
}

// ─── Watchers ─────────────────────────────────────────────────────────────────

watch(locale, () => {
  syncLabels()
})

// ─── Lifecycle ────────────────────────────────────────────────────────────────

onMounted(() => {
  initCytoscape()
})

onBeforeUnmount(() => {
  cy?.destroy()
})
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
</style>
