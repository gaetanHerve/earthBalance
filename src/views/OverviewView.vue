<template>
  <main
    id="main-content"
    tabindex="-1"
    class="relative overflow-hidden"
    :style="{ height: 'calc(100svh - 64px)' }"
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
      class="absolute bottom-4 left-4 flex flex-col gap-1.5 bg-eb-dark/80 border border-eb-border rounded-xl p-3"
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

    <!-- Hint zoom bascules (haut droite) -->
    <transition name="fade">
      <div
        v-if="!loading && !tippingVisible"
        class="absolute top-4 right-4 text-[11px] text-slate-500 bg-eb-dark/70 border border-eb-border rounded-full px-3 py-1.5 pointer-events-none"
        style="backdrop-filter: blur(4px);"
        aria-hidden="true"
      >
        <i class="fa fa-magnifying-glass-plus mr-1" aria-hidden="true" />
        {{ t('overview.zoom_hint') }}
      </div>
    </transition>

    <!-- Panneau latéral -->
    <transition name="panel">
      <aside
        v-if="selectedNode"
        class="absolute inset-x-0 bottom-0 max-h-[55%] sm:max-h-none sm:inset-x-auto sm:right-0 sm:top-0 sm:bottom-0 sm:w-72 overflow-y-auto"
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
                {{ locale === 'fr' ? selectedNode.label : selectedNode.labelEn }}
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
                {{ locale === 'fr' ? selectedNode.liveUnit : selectedNode.liveUnitEn }}
              </span>
            </p>
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

          <!-- Politiques validées (catégorie Politiques) -->
          <div v-if="selectedNode.id === 'cat-politiques'" class="space-y-1.5">
            <p class="text-[10px] uppercase tracking-wider text-slate-500">{{ t('overview.validated_policies') }}</p>
            <div v-if="validatedPolicies.length === 0" class="text-xs text-slate-600 italic">
              {{ t('overview.no_validated_policies') }}
            </div>
            <div
              v-for="p in validatedPolicies"
              :key="p.id"
              class="text-xs px-2 py-1 rounded border border-eb-green/30 bg-eb-green/5 text-eb-green truncate"
            >
              <i class="fa fa-check mr-1" aria-hidden="true" />{{ p.title }}
            </div>
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import cytoscape from 'cytoscape'
import type { Core, NodeSingular } from 'cytoscape'
import { useGameStore } from '@/store/game.store'
import { useSimulationStore } from '@/store/simulation.store'
import { useMitigationPoliciesStore } from '@/store/mitigationPolicies.store'
import { useTippingPointsStore } from '@/store/tippingPoints.store'
import { SIM_LABELS } from '@/config/simulation.config'
import { interpolateAtYear } from '@/utils/timeSeries'
import { HUB_NODES, HUB_EDGES, type HubNodeData, type HubCategory } from '@/data/hubGraph'
import earthGlobeUrl from '@/assets/earth-globe-2.png'

const { t, locale } = useI18n()

const gameStore      = useGameStore()
const simStore       = useSimulationStore()
const policiesStore  = useMitigationPoliciesStore()
const tpStore        = useTippingPointsStore()

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

// ─── Politiques validées ───────────────────────────────────────────────────────
const validatedPolicies = computed(() =>
  policiesStore.validatedPolicyIds
    .map(id => policiesStore.getMitigationPolicy(id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined)
)

// ─── Labels catégories ────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'climat',      color: '#00e5ff', label: computed(() => t('overview.cat_climat'))     },
  { id: 'ecosystemes', color: '#00ff88', label: computed(() => t('overview.cat_ecosystemes')) },
  { id: 'energie',     color: '#fb923c', label: computed(() => t('overview.cat_energie'))    },
  { id: 'societal',    color: '#a78bfa', label: computed(() => t('overview.cat_societal'))   },
  { id: 'politiques',  color: '#fbbf24', label: computed(() => t('overview.cat_politiques')) },
] as const

function categoryLabel(cat: HubCategory | null): string {
  if (!cat) return ''
  const found = CATEGORIES.find(c => c.id === cat)
  return found ? found.label.value : cat
}

// ─── Nœuds politiques (dynamiques) ────────────────────────────────────────────
function buildPolicyNodes(): cytoscape.ElementDefinition[] {
  const ballotIds = policiesStore.activeBallot?.decisionIds ?? []
  const validatedIds = new Set(policiesStore.validatedPolicyIds)
  const shown = new Set<string>()

  return [...policiesStore.validatedPolicyIds, ...ballotIds].flatMap((id) => {
    if (shown.has(id)) return []
    shown.add(id)
    const policy = policiesStore.getMitigationPolicy(id)
    if (!policy) return []
    const truncated = policy.title.slice(0, 40) + (policy.title.length > 40 ? '…' : '')
    return [
      {
        data: {
          id:       `pol-${id}`,
          type:     'policy',
          category: 'politiques',
          color:    '#fbbf24',
          status:   validatedIds.has(id) ? 'validated' : 'candidate',
          label:    truncated,
          labelEn:  truncated,
          route:    `/mitigation-policies/${id}`,
          policyId: id,
        },
      },
      { data: { id: `e-pol-${id}`, source: 'cat-politiques', target: `pol-${id}`, edgeType: 'hierarchy', color: '#fbbf24' } },
    ]
  })
}

// ─── Style Cytoscape ──────────────────────────────────────────────────────────
const CY_STYLE: cytoscape.StylesheetStyle[] = [
  {
    selector: 'node[type="hub"]',
    // shadow-* not in @types/cytoscape but supported at runtime
    style: {
      'width': 80, 'height': 80,
      'background-color': '#00ff88',
      'background-image': earthGlobeUrl,
      'background-fit': 'cover',
      'background-clip': 'node',
      'border-width': 0,
      'label': '',
      'shadow-blur': 28, 'shadow-color': '#00e5ff',
      'shadow-offset-x': 0, 'shadow-offset-y': 0, 'shadow-opacity': 0.6,
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
      'shadow-blur': 16, 'shadow-color': 'data(color)',
      'shadow-offset-x': 0, 'shadow-offset-y': 0, 'shadow-opacity': 0.45,
    } as unknown as cytoscape.Css.Node,
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
      'shadow-blur': 10, 'shadow-color': 'data(color)',
      'shadow-offset-x': 0, 'shadow-offset-y': 0, 'shadow-opacity': 0.28,
    } as unknown as cytoscape.Css.Node,
  },
  {
    selector: 'node[type="policy"]',
    style: {
      'width': 22, 'height': 22,
      'background-color': '#fbbf24',
      'background-opacity': 0.1,
      'border-width': 1.5, 'border-color': '#fbbf24',
      'label': 'data(label)',
      'color': '#94a3b8',
      'font-size': 8,
      'text-valign': 'bottom', 'text-margin-y': 4,
      'text-halign': 'center',
      'text-wrap': 'wrap', 'text-max-width': '80px',
    },
  },
  {
    selector: 'node[type="policy"][status="validated"]',
    style: {
      'border-color': '#00ff88', 'border-width': 2, 'background-opacity': 0.15,
      'shadow-blur': 10, 'shadow-color': '#00ff88',
      'shadow-offset-x': 0, 'shadow-offset-y': 0, 'shadow-opacity': 0.35,
    } as unknown as cytoscape.Css.Node,
  },
  {
    selector: 'node[type="tipping"]',
    style: {
      'display': 'none',
      'shape': 'diamond',
      'width': 22, 'height': 22,
      'background-color': '#ff5050',
      'background-opacity': 0.12,
      'border-width': 1.5, 'border-color': '#ff5050',
      'border-style': 'dashed',
      'label': 'data(label)',
      'color': '#ff5050',
      'font-size': 8,
      'text-valign': 'bottom', 'text-margin-y': 4,
      'text-halign': 'center',
      'text-wrap': 'wrap', 'text-max-width': '64px',
      'shadow-blur': 6, 'shadow-color': '#ff5050',
      'shadow-offset-x': 0, 'shadow-offset-y': 0, 'shadow-opacity': 0.2,
    } as unknown as cytoscape.Css.Node,
  },
  {
    selector: 'node[type="tipping"][triggered="1"]',
    style: {
      'background-opacity': 0.35, 'border-style': 'solid', 'border-width': 2,
      'shadow-blur': 20, 'shadow-opacity': 0.75,
    } as unknown as cytoscape.Css.Node,
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
      'display': 'none',
      'width': 1.5,
      'line-color': 'rgba(255,80,80,0.5)',
      'line-style': 'dashed',
      'curve-style': 'bezier',
      'target-arrow-shape': 'triangle',
      'target-arrow-color': 'rgba(255,80,80,0.5)',
      'arrow-scale': 0.7,
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
        label: locale.value === 'fr' ? n.label : n.labelEn,
        triggered: tpStore.triggered[n.id] ? '1' : '0',
      },
    })),
    ...HUB_EDGES.map(e => ({ data: { ...e } })),
    ...buildPolicyNodes(),
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

  // Zoom → afficher/masquer niveau 3
  cy.on('zoom', () => {
    const z = cy!.zoom()
    const show = z > 1.4
    if (show !== tippingVisible.value) {
      tippingVisible.value = show
      cy!.nodes('[type="tipping"]').style('display', show ? 'element' : 'none')
      cy!.edges('[edgeType="tipping-link"]').style('display', show ? 'element' : 'none')
    }
  })

  // Clic nœud → panneau
  cy.on('tap', 'node', (evt) => {
    const node = evt.target as NodeSingular
    const data = node.data() as HubNodeData & { policyId?: string }

    // Trouver le nœud dans HUB_NODES ou le reconstruire pour les politiques
    if (data.type === ('policy' as string)) {
      selectedNode.value = {
        id:       data.id,
        type:     'indicator',
        category: 'politiques',
        color:    '#fbbf24',
        label:    data.label,
        labelEn:  data.labelEn,
        route:    data.route,
      }
    } else {
      selectedNode.value = HUB_NODES.find(n => n.id === data.id) ?? null
    }

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

// ─── Sync triggered tipping nodes ─────────────────────────────────────────────
watch(
  () => tpStore.triggered,
  (triggered) => {
    if (!cy) return
    for (const id of Object.keys(triggered)) {
      cy.nodes(`[id="${id}"]`).data('triggered', '1')
    }
  },
  { deep: true },
)

// ─── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(() => { nextTick(initCy) })
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
