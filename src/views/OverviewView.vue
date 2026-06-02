<template>
  <div
    class="flex flex-col"
    :class="mode === 'graph' ? 'overflow-hidden' : ''"
    :style="mode === 'graph' ? { height: 'calc(100svh - 64px)' } : {}"
  >

    <!-- Sélecteur de vue -->
    <fieldset class="flex justify-end items-center gap-1 px-3 py-1.5 shrink-0 border-b border-eb-border/40 bg-eb-dark">
      <legend class="sr-only">{{ t('overview.view_toggle_aria') }}</legend>
      <button
        :aria-pressed="mode === 'graph'"
        class="flex items-center gap-1.5 text-xs px-3 py-1 rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-eb-cyan outline-none"
        :class="mode === 'graph' ? 'bg-eb-border text-white' : 'text-slate-500 hover:text-slate-300'"
        @click="setMode('graph')"
      >
        <i class="fa fa-circle-nodes text-[10px]" aria-hidden="true" />
        {{ t('overview.view_graph') }}
      </button>
      <button
        :aria-pressed="mode === 'dashboard'"
        class="flex items-center gap-1.5 text-xs px-3 py-1 rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-eb-cyan outline-none"
        :class="mode === 'dashboard' ? 'bg-eb-border text-white' : 'text-slate-500 hover:text-slate-300'"
        @click="setMode('dashboard')"
      >
        <i class="fa fa-gauge-high text-[10px]" aria-hidden="true" />
        {{ t('overview.view_dashboard') }}
      </button>
    </fieldset>

    <!-- Vue graphe -->
    <main
      v-if="mode === 'graph'"
      id="main-content"
      tabindex="-1"
      class="relative flex-1 min-h-0 overflow-hidden"
      :aria-label="t('overview.aria_main')"
    >

    <!-- Cytoscape container -->
    <div ref="cyContainer" class="w-full h-full bg-[#070c16]" aria-hidden="true" />
    <p class="sr-only">{{ t('overview.aria_graph') }}</p>

    <!-- Loading -->
    <div
      v-if="loading"
      class="absolute inset-0 flex items-center justify-center bg-[#070c16]"
    >
      <span class="text-sm text-slate-500 animate-pulse">{{ t('common.loading_chart') }}</span>
    </div>

    <!-- Légende catégories (bas gauche) -->
    <div
      v-if="!loading"
      class="absolute top-4 left-4 flex flex-col gap-1.5 bg-eb-dark/80 border border-eb-border rounded-xl p-3"
      style="backdrop-filter: blur(6px);"
      aria-hidden="true"
    >
      <span class="text-[10px] uppercase tracking-widest text-slate-600 font-semibold mb-0.5">{{ t('overview.legend') }}</span>
      <div v-for="cat in CATEGORIES" :key="cat.id" class="flex items-center gap-2 text-xs">
        <span class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ background: cat.color }" />
        <span class="text-slate-400">{{ cat.label }}</span>
      </div>
      <div class="flex items-center gap-2 text-xs border-t border-eb-border/50 pt-1.5 mt-0.5">
        <span class="w-2.5 h-2.5 rounded-full shrink-0 border-2 border-dashed border-red-500" style="background: transparent;" />
        <span class="text-red-400">{{ t('overview.legend_tipping') }}</span>
      </div>
    </div>

    <!-- Panneau latéral -->
    <transition name="panel">
      <aside
        v-if="selectedNode"
        class="absolute inset-x-0 bottom-0 max-h-[55%] sm:max-h-none sm:inset-x-auto sm:right-0 sm:top-0 sm:bottom-0 sm:w-1/4 overflow-y-auto"
        style="background: rgba(10,15,30,0.96); backdrop-filter: blur(8px); border-left: 1px solid #1f2d3d;"
        :aria-label="t('overview.panel_aria')"
      >
        <!-- Fermer -->
        <button
          ref="closeBtn"
          class="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full text-slate-500 hover:text-white hover:bg-white/10 transition-colors z-10"
          :aria-label="t('overview.panel_close')"
          @click="clearSelection"
        >
          <i class="fa fa-times text-sm" aria-hidden="true" />
        </button>

        <div class="p-5 pr-10 space-y-4">

          <!-- En-tête nœud -->
          <div class="flex items-start gap-3">
            <span
              class="mt-0.5 w-3 h-3 rounded-full shrink-0"
              :style="{ background: selectedNode.color }"
              aria-hidden="true"
            />
            <div>
              <p class="text-[10px] uppercase tracking-wider mb-0.5" :style="{ color: selectedNode.color }">
                {{ categoryLabel(selectedNode.category) }}
              </p>
              <h2 class="text-sm font-bold text-white leading-snug">
                {{ t('hub.nodes.' + selectedNode.id + '.label') }}
              </h2>
            </div>
          </div>

          <!-- Valeur live (indicateurs avec liveKey) -->
          <div
            v-if="selectedNode.liveKey && liveValue(selectedNode.liveKey) !== null"
            class="rounded-lg border border-eb-border bg-eb-mid p-3"
          >
            <p class="text-[10px] uppercase tracking-wider text-slate-500 mb-1">{{ t('overview.value_at_year', { year: gameStore.currentYear }) }}</p>
            <p class="text-xl font-black tabular-nums" :style="{ color: selectedNode.color }">
              {{ liveValue(selectedNode.liveKey) }}
              <span class="text-xs font-normal text-slate-400 ml-1">
                {{ t('hub.nodes.' + selectedNode.id + '.unit') }}
              </span>
            </p>
          </div>

          <!-- Graphes de projection -->
          <div
            v-for="ct in panelCharts"
            :key="ct"
            class="rounded-lg border border-eb-border bg-eb-mid p-3"
          >
            <HubNodeChart
              :chart-type="ct"
              :aria-label="t('hub.nodes.' + selectedNode.id + '.label')"
            />
          </div>

          <!-- Statut point de bascule -->
          <div v-if="selectedNode.type === 'tipping'" class="rounded-lg border p-3"
            :class="isTippingTriggered(selectedNode.id)
              ? 'border-red-700/50 bg-red-950/20'
              : 'border-eb-border bg-eb-mid'"
          >
            <p class="text-xs font-semibold" :class="isTippingTriggered(selectedNode.id) ? 'text-red-400' : 'text-slate-400'">
              <i :class="isTippingTriggered(selectedNode.id) ? 'fa fa-circle-radiation' : 'fa fa-circle-check'" aria-hidden="true" class="mr-1.5" />
              {{ isTippingTriggered(selectedNode.id) ? t('overview.tp_triggered') : t('overview.tp_safe') }}
            </p>
            <p v-if="isTippingTriggered(selectedNode.id)" class="text-[11px] text-slate-500 mt-1">
              {{ t('overview.tp_triggered_year', { year: tpStore.triggered[selectedNode.id]?.year }) }}
            </p>
          </div>

          <!-- CTA naviguer -->
          <router-link
            v-if="selectedNode.route && selectedNode.type !== 'hub'"
            :to="selectedNode.route"
            class="flex items-center justify-between w-full px-4 py-2.5 rounded-lg border transition-all text-xs font-semibold focus-visible:ring-2 focus-visible:ring-eb-cyan outline-none"
            :style="{
              borderColor: selectedNode.color + '50',
              color: selectedNode.color,
              background: selectedNode.color + '10',
            }"
          >
            {{ t('overview.go_to_page') }}
            <i class="fa fa-arrow-right text-[10px]" aria-hidden="true" />
          </router-link>

        </div>
      </aside>
    </transition>

    </main>

    <!-- Vue tableau de bord -->
    <DashboardView v-else />

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import cytoscape from 'cytoscape'
import type { Core, NodeSingular } from 'cytoscape'
import { useGameStore } from '@/store/game.store'
import { useSimulationStore } from '@/store/simulation.store'
import { STORAGE_KEYS } from '@/config/storageKeys'
import DashboardView from '@/views/DashboardView.vue'
import { useTippingPointsStore } from '@/store/tippingPoints.store'
import { SIM_LABELS } from '@/config/simulation.config'
import { interpolateAtYear } from '@/utils/timeSeries'
import { HUB_NODES, HUB_EDGES, type HubNodeData, type HubCategory, type HubChartType } from '@/data/hubGraph'
import earthGlobeUrl from '@/assets/earth-globe-2.png'
import HubNodeChart from '@/components/charts/HubNodeChart.vue'

const { t, locale } = useI18n()

const gameStore = useGameStore()
const simStore  = useSimulationStore()
const tpStore   = useTippingPointsStore()

// ─── Mode graphe / tableau de bord ────────────────────────────────────────────

type ViewMode = 'graph' | 'dashboard'
const savedMode = localStorage.getItem(STORAGE_KEYS.OVERVIEW_MODE) as ViewMode | null
const mode = ref<ViewMode>(savedMode === 'dashboard' ? 'dashboard' : 'graph')

function setMode(m: ViewMode): void {
  mode.value = m
  localStorage.setItem(STORAGE_KEYS.OVERVIEW_MODE, m)
}

watch(mode, (newMode) => {
  if (newMode === 'graph') {
    loading.value = true
    nextTick(initCy)
  } else {
    cy?.destroy()
    cy = null
    loading.value = true
  }
})

// ─── Refs ──────────────────────────────────────────────────────────────────────
const cyContainer  = ref<HTMLDivElement | null>(null)
const closeBtn     = ref<HTMLButtonElement | null>(null)
const loading      = ref(true)
const tippingVisible = ref(false)
let cy: Core | null = null

// ─── Sélection ─────────────────────────────────────────────────────────────────
const selectedNode = ref<HubNodeData | null>(null)

function clearSelection(): void {
  selectedNode.value = null
  cy?.nodes().removeClass('dimmed highlighted')
}

// ─── Données live ──────────────────────────────────────────────────────────────
function liveValue(key: HubNodeData['liveKey']): string | null {
  const year = gameStore.currentYear
  switch (key) {
    case 'co2':
      return interpolateAtYear(year, SIM_LABELS, simStore.cumulativeCo2).toFixed(1)
    case 'temp':
      return '+' + interpolateAtYear(year, SIM_LABELS, simStore.cumulativeTemp).toFixed(2)
    case 'forest':
      return interpolateAtYear(year, SIM_LABELS, simStore.cumulativeForest).toFixed(1)
    case 'renewables': {
      const mix = simStore.cumulativeEnergyMix
      const r = interpolateAtYear(year, SIM_LABELS, mix['solar'])
             + interpolateAtYear(year, SIM_LABELS, mix['wind'])
             + interpolateAtYear(year, SIM_LABELS, mix['hydro'])
             + interpolateAtYear(year, SIM_LABELS, mix['nuclear'])
      return r.toFixed(1)
    }
    case 'food':
      return interpolateAtYear(year, SIM_LABELS, simStore.cumulativeFoodSecurity).toFixed(1)
    case 'water':
      return interpolateAtYear(year, SIM_LABELS, simStore.cumulativeWaterAccess).toFixed(1)
    default:
      return null
  }
}

function isTippingTriggered(id: string): boolean {
  return !!tpStore.triggered[id]
}

// ─── Graphes du panneau latéral ───────────────────────────────────────────────

const PANEL_CHARTS: Partial<Record<string, HubChartType[]>> = {
  'energy-mix': ['renewables', 'energyMixBreakdown'],
}

const panelCharts = computed<HubChartType[]>(() => {
  if (!selectedNode.value) return []
  const override = PANEL_CHARTS[selectedNode.value.id]
  if (override) return override
  return selectedNode.value.liveKey ? [selectedNode.value.liveKey] : []
})

// ─── Labels catégories ────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'climat',      color: '#00e5ff', label: computed(() => t('overview.cat_climat'))     },
  { id: 'ecosystemes', color: '#00ff88', label: computed(() => t('overview.cat_ecosystemes')) },
  { id: 'energie',     color: '#fb923c', label: computed(() => t('overview.cat_energie'))    },
  { id: 'societal',    color: '#a78bfa', label: computed(() => t('overview.cat_societal'))   },
] as const

function categoryLabel(cat: HubCategory | null): string {
  if (!cat) return ''
  const found = CATEGORIES.find(c => c.id === cat)
  return found ? found.label.value : cat
}

// ─── Style Cytoscape ──────────────────────────────────────────────────────────
const CY_STYLE: cytoscape.StylesheetStyle[] = [
  {
    selector: 'node[type="hub"]',
    style: {
      'width': 80, 'height': 80,
      'background-color': '#00ff88',
      'background-image': earthGlobeUrl,
      'background-fit': 'cover',
      'background-clip': 'node',
      'border-width': 0,
      'label': '',
    } as unknown as cytoscape.Css.Node,
  },
  {
    selector: 'node[type="category"]',
    style: {
      'width': 52, 'height': 52,
      'background-color': 'data(color)',
      'background-opacity': 0.12,
      'border-width': 2.5, 'border-color': 'data(color)',
      'label': 'data(label)',
      'color': 'data(color)',
      'font-size': 10, 'font-weight': 700,
      'text-valign': 'bottom', 'text-margin-y': 8,
      'text-halign': 'center',
    },
  },
  {
    selector: 'node[type="indicator"]',
    style: {
      'width': 32, 'height': 32,
      'background-color': 'data(color)',
      'background-opacity': 0.08,
      'border-width': 1.5, 'border-color': 'data(color)',
      'label': 'data(label)',
      'color': '#94a3b8',
      'font-size': 9,
      'text-valign': 'bottom', 'text-margin-y': 5,
      'text-halign': 'center',
      'text-wrap': 'wrap', 'text-max-width': '72px',
    },
  },
  {
    selector: 'node[type="tipping"]',
    style: {
      'shape': 'diamond',
      'width': 18, 'height': 18,
      'z-index': 10,
      'background-color': '#ff5050',
      'background-opacity': 0.06,
      'border-width': 1, 'border-color': '#ff5050',
      'border-style': 'dashed',
      'label': 'data(label)',
      'color': '#ff5050',
      'font-size': 7,
      'text-valign': 'bottom', 'text-margin-y': 4,
      'text-halign': 'center',
      'text-wrap': 'wrap', 'text-max-width': '64px',
      'text-background-color': '#070c16',
      'text-background-opacity': 0.8,
      'text-background-padding': '2px',
    } as unknown as cytoscape.Css.Node,
  },
  {
    selector: 'node[type="tipping"][triggered="1"]',
    style: {
      'background-opacity': 0.35,
      'border-style': 'solid',
      'border-width': 2,
      'font-size': 8,
      'color': '#ff5050',
    },
  },
  {
    selector: 'edge[edgeType="hub-cat"]',
    style: {
      'width': 2.5,
      'line-color': 'data(color)',
      'opacity': 0.45,
      'curve-style': 'bezier',
      'target-arrow-shape': 'none',
    },
  },
  {
    selector: 'edge[edgeType="hierarchy"]',
    style: {
      'width': 1.5,
      'line-color': 'data(color)',
      'opacity': 0.2,
      'curve-style': 'bezier',
      'target-arrow-shape': 'none',
    },
  },
  {
    selector: 'edge[edgeType="tipping-link"]',
    style: {
      'width': 1,
      'line-color': 'rgba(255,80,80,0.25)',
      'line-style': 'dashed',
      'opacity': 0.18,
      'curve-style': 'bezier',
      'target-arrow-shape': 'triangle',
      'target-arrow-color': 'rgba(255,80,80,0.25)',
      'arrow-scale': 0.6,
    },
  },
  {
    selector: 'node.dimmed',
    style: { 'opacity': 0.12 },
  },
  {
    selector: 'node.highlighted, edge.highlighted',
    style: { 'opacity': 1 },
  },
  {
    selector: 'node:selected',
    style: { 'overlay-opacity': 0.08, 'overlay-color': '#fff' },
  },
]

// ─── Init Cytoscape ───────────────────────────────────────────────────────────
function initCy(): void {
  if (!cyContainer.value) return

  const staticElements: cytoscape.ElementDefinition[] = [
    ...HUB_NODES.map(n => ({
      data: {
        ...n,
        label: t('hub.nodes.' + n.id + '.label'),
        triggered: tpStore.triggered[n.id] ? '1' : '0',
      },
    })),
    ...HUB_EDGES.map(e => ({ data: { ...e } })),
  ]

  cy = cytoscape({
    container: cyContainer.value,
    elements:  staticElements,
    style:     CY_STYLE,
    layout: {
      name: 'cose',
      idealEdgeLength: 110,
      nodeRepulsion:   9000,
      gravity:         0.3,
      numIter:         800,
      animate:         false,
      fit:             true,
      padding:         50,
      randomize:       false,
    },
    minZoom: 0.3,
    maxZoom: 4,
    userZoomingEnabled: true,
    userPanningEnabled: true,
    boxSelectionEnabled: false,
    selectionType: 'single',
    autoungrabify: false,
  })

  loading.value = false

  // Disperser les tipping points autour de leur indicateur parent
  // Les 4 nœuds connectés à "temp" seraient superposés sans dispersion angulaire
  const hubPos = cy.nodes('[type="hub"]').first().position()
  const tippingGroups = new Map<string, string[]>()
  HUB_EDGES.filter(e => e.edgeType === 'tipping-link').forEach(e => {
    if (!tippingGroups.has(e.source)) tippingGroups.set(e.source, [])
    tippingGroups.get(e.source)!.push(e.target)
  })
  tippingGroups.forEach((ids, sourceId) => {
    const sp = cy!.nodes(`[id="${sourceId}"]`).first().position()
    const dx   = sp.x - hubPos.x
    const dy   = sp.y - hubPos.y
    const base = Math.atan2(dy, dx)
    const n      = ids.length
    const spread = n > 1 ? Math.PI / 3 : 0
    ids.forEach((id, i) => {
      const angle = n > 1 ? base + spread * (2 * i / (n - 1) - 1) : base
      cy!.nodes(`[id="${id}"]`).first().position({ x: sp.x + Math.cos(angle) * 105, y: sp.y + Math.sin(angle) * 105 })
    })
  })
  cy.fit(undefined, 50)

  startPulseForTriggered()

  // Zoom → rendre les arêtes tipping-link plus visibles au-delà du seuil
  cy.on('zoom', () => {
    const show = cy!.zoom() > 1.4
    if (show !== tippingVisible.value) {
      tippingVisible.value = show
      cy!.edges('[edgeType="tipping-link"]').style('opacity', show ? 0.55 : 0.18)
    }
  })

  // Clic nœud → panneau
  cy.on('tap', 'node', (evt) => {
    const node = evt.target as NodeSingular
    const data = node.data() as HubNodeData

    selectedNode.value = HUB_NODES.find(n => n.id === data.id) ?? null

    // Highlight
    cy!.nodes().addClass('dimmed')
    cy!.nodes().removeClass('highlighted')
    node.removeClass('dimmed').addClass('highlighted')
    node.neighborhood('node').removeClass('dimmed').addClass('highlighted')

    nextTick(() => closeBtn.value?.focus())
  })

  // Clic fond → désélection
  cy.on('tap', (evt) => {
    if (evt.target === cy) clearSelection()
  })
}

// ─── Animation pulse pour les tipping points déclenchés ───────────────────────

function animateNodePulse(node: cytoscape.NodeSingular): void {
  if (!cy || node.data('triggered') !== '1') return
  node.animate(
    { style: { 'border-width': 3, 'background-opacity': 0.55 } },
    {
      duration: 700,
      easing: 'ease-in-out-sine',
      complete: () => node.animate(
        { style: { 'border-width': 1.5, 'background-opacity': 0.2 } },
        {
          duration: 700,
          easing: 'ease-in-out-sine',
          complete: () => animateNodePulse(node),
        },
      ),
    },
  )
}

function startPulseForTriggered(): void {
  if (!cy) return
  cy.nodes('[type="tipping"][triggered="1"]').forEach(node => {
    if (!node.data('pulsing')) {
      node.data('pulsing', '1')
      animateNodePulse(node)
    }
  })
}

// ─── Sync labels au changement de locale ──────────────────────────────────────
watch(locale, () => {
  if (!cy) return
  HUB_NODES.forEach(n => {
    cy!.nodes(`[id="${n.id}"]`).first().data('label', t('hub.nodes.' + n.id + '.label'))
  })
})

// ─── Sync triggered tipping nodes ─────────────────────────────────────────────
watch(
  () => tpStore.triggered,
  (triggered) => {
    if (!cy) return
    for (const id of Object.keys(triggered)) {
      cy.nodes(`[id="${id}"]`).data('triggered', '1')
    }
    startPulseForTriggered()
  },
  { deep: true },
)

// ─── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(() => { if (mode.value === 'graph') nextTick(initCy) })
onBeforeUnmount(() => { cy?.destroy(); cy = null })
</script>

<style scoped>
.panel-enter-active, .panel-leave-active { transition: transform 0.25s ease, opacity 0.25s ease; }
.panel-enter-from, .panel-leave-to { transform: translateX(100%); opacity: 0; }
@media (max-width: 639px) {
  .panel-enter-from, .panel-leave-to { transform: translateY(100%); }
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
