<template>
  <div
    class="flex flex-col"
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
      class="relative"
      :style="{ height: `${graphHeightPx}px` }"
      :aria-label="t('overview.aria_main')"
    >

    <!-- Cytoscape container -->
    <div ref="cyContainer" class="w-full bg-[#070c16]" :style="{ height: `${graphHeightPx}px` }" aria-hidden="true" />
    <p class="sr-only">{{ t('overview.aria_graph') }}</p>

    <!-- Nœuds accessibles au clavier — triés par ordre de lecture (Y prioritaire, puis X) -->
    <div
      v-if="!loading"
      role="group"
      :aria-label="t('overview.aria_nodes_group')"
    >
      <button
        v-for="node in sortedAccessibleNodes"
        :key="node.id"
        class="graph-node-key-btn"
        @focus="highlightAccessibleNode(node.id)"
        @blur="unhighlightAccessibleNode(node.id)"
        @click="activateAccessibleNode(node.id)"
        @keydown.enter.prevent="activateAccessibleNode(node.id)"
        @keydown.space.prevent="activateAccessibleNode(node.id)"
      >{{ node.label }}</button>
    </div>

    <!-- Loading -->
    <div
      v-if="loading"
      class="absolute inset-0 flex items-center justify-center bg-[#070c16]"
    >
      <span class="text-sm text-slate-500 animate-pulse">{{ t('common.loading_chart') }}</span>
    </div>

    <!-- Légende catégories + contrôles (haut gauche) -->
    <div
      v-if="!loading"
      class="absolute top-4 left-4 right-4 sm:right-auto flex flex-col gap-1.5 bg-eb-dark/80 border border-eb-border rounded-xl p-2.5 sm:p-3 max-h-[calc(100%-1rem)] sm:max-h-none overflow-y-auto overscroll-contain"
      style="backdrop-filter: blur(6px);"
    >
      <!-- En-tête légende + bouton déplier/replier -->
      <div class="flex items-center justify-between gap-2">
        <span class="text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-600 font-semibold">{{ t('overview.legend') }}</span>
        <button
          class="w-5 h-5 flex items-center justify-center rounded text-slate-500 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-eb-cyan outline-none"
          :aria-label="legendExpanded ? t('overview.legend_collapse') : t('overview.legend_expand')"
          :aria-expanded="legendExpanded"
          @click="legendExpanded = !legendExpanded"
        >
          <i :class="legendExpanded ? 'fa fa-chevron-up' : 'fa fa-chevron-down'" class="text-[9px]" aria-hidden="true" />
        </button>
      </div>
      <!-- Marqueur invisible pour aligner la barre de contrôles avec ce header -->
      <span ref="legendHeader" aria-hidden="true" class="sr-only"></span>
      <!-- Corps de la légende -->
      <div v-show="legendExpanded" class="flex flex-col gap-1.5">
      <div class="grid grid-cols-1 sm:grid-cols-1 gap-x-3 gap-y-1">
        <div v-for="cat in CATEGORIES" :key="cat.id" class="flex items-center gap-2 text-[11px] sm:text-xs leading-tight">
          <span class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ background: cat.color }" aria-hidden="true" />
          <span class="text-slate-400">{{ cat.label }}</span>
        </div>
      </div>
      <div class="flex items-center gap-2 text-[11px] sm:text-xs border-t border-eb-border/50 pt-1.5 mt-0.5 leading-tight">
        <span class="w-2.5 h-2.5 rounded-full shrink-0 border-2 border-dashed border-red-500" style="background: transparent;" aria-hidden="true" />
        <span class="text-red-400">{{ t('overview.legend_tipping') }}</span>
      </div>
      <div class="border-t border-eb-border/50 pt-1.5 mt-0.5 grid grid-cols-2 sm:grid-cols-1 gap-x-3 gap-y-1">
        <div class="flex items-center gap-2 text-[11px] sm:text-xs leading-tight">
          <span class="w-5 shrink-0" style="height: 2px; background: repeating-linear-gradient(90deg, #ff5050 0, #ff5050 4px, transparent 4px, transparent 7px);" aria-hidden="true" />
          <span class="text-slate-400">{{ t('overview.legend_causal_positive') }}</span>
        </div>
        <div class="flex items-center gap-2 text-[11px] sm:text-xs leading-tight">
          <span class="w-5 shrink-0" style="background: #00ff88; height: 2px; border-radius: 1px;" aria-hidden="true" />
          <span class="text-slate-400">{{ t('overview.legend_causal_negative') }}</span>
        </div>
      </div>
      <!-- Toggle politiques validées -->
      <div class="border-t border-eb-border/50 pt-2 mt-0.5">
        <button
          class="w-full flex items-center gap-2 text-[11px] sm:text-xs px-1 py-0.5 rounded transition-colors focus-visible:ring-2 focus-visible:ring-eb-cyan outline-none"
          :class="showPolicies ? 'text-[#fbbf24]' : 'text-slate-400 hover:text-white'"
          :aria-pressed="showPolicies"
          @click="showPolicies = !showPolicies"
        >
          <i :class="showPolicies ? 'fa fa-toggle-on' : 'fa fa-toggle-off'" class="text-[13px] shrink-0" aria-hidden="true" />
          {{ t('overview.toggle_policies') }}
        </button>
      </div>

      <!-- Boucles de rétroaction -->
      <div class="border-t border-eb-border/50 pt-2 mt-0.5">
        <div class="flex items-center justify-between gap-2 mb-1">
          <span class="text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-600 font-semibold">
            {{ t('overview.feedback_loops_label') }}
          </span>
          <!-- Bouton accordéon visible uniquement sur mobile -->
          <button
            class="sm:hidden w-5 h-5 flex items-center justify-center rounded text-slate-500 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-eb-cyan outline-none"
            :aria-label="loopsExpanded ? t('overview.feedback_loops_collapse') : t('overview.feedback_loops_expand')"
            :aria-expanded="loopsExpanded"
            @click="loopsExpanded = !loopsExpanded"
          >
            <i :class="loopsExpanded ? 'fa fa-chevron-up' : 'fa fa-chevron-down'" class="text-[9px]" aria-hidden="true" />
          </button>
        </div>
        <div :class="loopsExpanded ? 'grid grid-cols-2 gap-1.5 sm:flex sm:flex-wrap' : 'hidden sm:flex sm:flex-wrap sm:gap-1.5'">
          <button
            v-for="loop in feedbackLoops"
            :key="loop.id"
            class="w-full sm:w-auto flex items-center justify-center gap-1 px-2 py-1 rounded-full text-[9px] sm:text-[10px] font-semibold border transition-all focus-visible:ring-2 focus-visible:ring-eb-cyan outline-none leading-none"
            :style="{
              borderColor: loop.color,
              color: activeLoopId === loop.id ? loop.color : '#64748b',
              backgroundColor: activeLoopId === loop.id ? loop.color + '18' : 'transparent',
              boxShadow: activeLoopId === loop.id ? `0 0 10px ${loop.color}40` : 'none',
              opacity: activeLoopId && activeLoopId !== loop.id ? '0.5' : '1',
            }"
            :aria-pressed="activeLoopId === loop.id"
            @click="toggleLoop(loop.id)"
          >
            <i class="fa fa-rotate text-[9px]" aria-hidden="true" />
            {{ locale === 'fr' ? loop.label : loop.labelEn }}
          </button>
        </div>
      </div>
      </div><!-- fin corps légende -->
    </div>

    <!-- Barre de contrôles zoom – centrée en haut du graphe, alignée avec l'en-tête légende -->
    <div
      v-if="!loading"
      class="absolute top-0 left-0 right-0 flex justify-center items-start z-10 pointer-events-none"
      :style="{ paddingTop: legendHeaderTop }"
    >
      <div class="flex items-center gap-1 pointer-events-auto bg-eb-dark/80 border border-eb-border rounded-lg px-2 py-1" style="backdrop-filter: blur(6px);">
        <button
          class="w-7 h-7 sm:w-6 sm:h-6 flex items-center justify-center rounded border border-eb-border text-slate-400 hover:text-white hover:border-slate-500 transition-colors focus-visible:ring-2 focus-visible:ring-eb-cyan outline-none"
          :aria-label="t('overview.zoom_out')"
          @click="zoomOut"
        >
          <i class="fa fa-minus text-[9px]" aria-hidden="true" />
        </button>
        <button
          class="w-7 h-7 sm:w-6 sm:h-6 flex items-center justify-center rounded border border-eb-border text-slate-400 hover:text-white hover:border-slate-500 transition-colors focus-visible:ring-2 focus-visible:ring-eb-cyan outline-none"
          :aria-label="t('overview.zoom_in')"
          @click="zoomIn"
        >
          <i class="fa fa-plus text-[9px]" aria-hidden="true" />
        </button>
        <button
          class="flex items-center gap-1 h-7 sm:h-6 px-2 rounded border border-eb-border text-slate-400 hover:text-white hover:border-slate-500 transition-colors focus-visible:ring-2 focus-visible:ring-eb-cyan outline-none text-[10px]"
          :aria-label="t('overview.reset_layout')"
          @click="resetLayout"
        >
          <i class="fa fa-compress text-[9px]" aria-hidden="true" />
          {{ t('overview.reset_layout') }}
        </button>
      </div>
    </div>

    <!-- Panneau latéral -->
    <transition name="panel" @after-enter="focusCloseBtn">
      <aside
        v-if="selectedNode"
        class="relative z-20 mt-2 border border-eb-border sm:mt-0 sm:absolute sm:right-0 sm:top-0 sm:bottom-0 sm:w-1/4 sm:border-t-0 sm:border-r-0"
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

        <div ref="panelContent" class="p-5 pr-10 space-y-4">

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
                {{ selectedNode.label ?? t('hub.nodes.' + selectedNode.id + '.label') }}
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

          <!-- Pour les indicateurs : description systémique + boucles + relations -->
          <template v-if="selectedNode.type === 'indicator'">
            <div
              v-if="systemicNodeForHub(selectedNode.id)"
              class="rounded-lg border border-eb-border bg-eb-mid p-3"
            >
              <p class="text-xs text-slate-400 leading-relaxed">
                {{ locale === 'fr' ? systemicNodeForHub(selectedNode.id)!.data.description : systemicNodeForHub(selectedNode.id)!.data.descriptionEn }}
              </p>
              <p class="font-mono text-[10px] text-slate-600 mt-2">
                {{ systemicNodeForHub(selectedNode.id)!.data.ipccRef }}
              </p>
            </div>

            <!-- Boucles de rétroaction du nœud -->
            <div
              v-if="systemicLoopsForHub(selectedNode.id).length"
              class="rounded-lg border border-eb-border bg-eb-mid p-3"
            >
              <p class="text-[10px] uppercase tracking-wider text-slate-500 mb-2">
                <i class="fa fa-rotate mr-1" aria-hidden="true" />
                {{ t('overview.feedback_loops_label') }}
              </p>
              <div class="flex flex-wrap gap-1.5">
                <button
                  v-for="loop in systemicLoopsForHub(selectedNode.id)"
                  :key="loop.id"
                  class="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold border transition-all focus-visible:ring-2 focus-visible:ring-eb-cyan outline-none"
                  :style="{
                    borderColor: loop.color,
                    color: activeLoopId === loop.id ? loop.color : '#64748b',
                    backgroundColor: activeLoopId === loop.id ? loop.color + '18' : 'transparent',
                    boxShadow: activeLoopId === loop.id ? `0 0 8px ${loop.color}40` : 'none',
                  }"
                  :aria-pressed="activeLoopId === loop.id"
                  @click="toggleLoop(loop.id)"
                >
                  <i class="fa fa-rotate text-[9px]" aria-hidden="true" />
                  {{ locale === 'fr' ? loop.label : loop.labelEn }}
                </button>
              </div>
            </div>

            <!-- Relations clés -->
            <div
              v-if="systemicEdgesForHub(selectedNode.id).length"
              class="rounded-lg border border-eb-border bg-eb-mid p-3"
            >
              <p class="text-[10px] uppercase tracking-wider text-slate-500 mb-2">
                {{ t('systemic_map.conn_list_title') }}
              </p>
              <div class="space-y-1.5">
                <details
                  v-for="edge in systemicEdgesForHub(selectedNode.id)"
                  :key="edge.id"
                  class="conn-item text-xs border border-eb-border rounded-lg overflow-hidden"
                >
                  <summary class="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-eb-cyan rounded-lg">
                    <span class="font-mono text-slate-500 shrink-0 w-3 text-center">{{ edge.direction === 'out' ? '→' : '←' }}</span>
                    <span
                      class="shrink-0 font-bold w-3 text-center"
                      :class="edge.edgeType === 'positive' ? 'text-red-400' : 'text-green-400'"
                    >{{ edge.edgeType === 'positive' ? '↑' : '↓' }}</span>
                    <span class="text-slate-300 leading-tight flex-1 min-w-0 truncate">
                      {{ locale === 'fr' ? edge.otherLabel : edge.otherLabelEn }}
                    </span>
                    <i class="fa fa-chevron-down conn-chevron text-slate-600 text-[9px] shrink-0" aria-hidden="true" />
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

          <!-- Pour les points de bascule / boucles de rétroaction : contenu i18n -->
          <template v-if="selectedNode.type === 'tipping' || selectedNode.type === 'feedback'">

            <!-- Description + effets + citation -->
            <div class="rounded-lg border border-eb-border bg-eb-mid p-3 space-y-2">
              <p class="text-xs text-slate-400 leading-relaxed">
                {{ t('tipping.' + tippingI18nKey(selectedNode.id) + '.description') }}
              </p>
              <div>
                <p class="text-[10px] uppercase tracking-wider text-slate-500 mb-1">
                  <i class="fa fa-bolt mr-1" style="color: #fb923c" aria-hidden="true" />
                  {{ t('tipping.effects_label') }}
                </p>
                <p class="text-[11px] text-slate-400 leading-relaxed">
                  {{ t('tipping.' + tippingI18nKey(selectedNode.id) + '.effects') }}
                </p>
              </div>
              <p class="font-mono text-[10px] text-slate-600 leading-snug italic">
                {{ t('tipping.' + tippingI18nKey(selectedNode.id) + '.quote') }}
              </p>
            </div>

            <!-- Seuil de déclenchement (points de bascule uniquement) -->
            <div
              v-if="selectedNode.type === 'tipping'"
              class="rounded-lg border border-eb-border bg-eb-mid p-3"
            >
              <p class="text-[10px] uppercase tracking-wider text-slate-500 mb-1">{{ t('tipping.trigger_label') }}</p>
              <p class="text-xs text-slate-300">{{ tippingThresholdLabel(selectedNode.id) }}</p>
            </div>

            <!-- Impacts modélisés sur les indicateurs -->
            <div
              v-if="tippingImpactsForNode(selectedNode.id).length"
              class="rounded-lg border border-eb-border bg-eb-mid p-3"
            >
              <p class="text-[10px] uppercase tracking-wider text-slate-500 mb-2">{{ t('overview.tp_impacts') }}</p>
              <div class="space-y-1.5">
                <div
                  v-for="impact in tippingImpactsForNode(selectedNode.id)"
                  :key="impact.id"
                  class="flex items-center gap-2 text-xs"
                >
                  <span class="font-mono text-slate-500 shrink-0">→</span>
                  <span
                    class="shrink-0 font-bold w-3 text-center"
                    :class="impact.causalType === 'positive' ? 'text-red-400' : 'text-green-400'"
                  >{{ impact.causalType === 'positive' ? '↑' : '↓' }}</span>
                  <span class="text-slate-300">{{ t('hub.nodes.' + impact.targetId + '.label') }}</span>
                </div>
              </div>
            </div>

            <!-- Boucles de rétroaction systémiques associées -->
            <div
              v-if="systemicLoopsForHub(selectedNode.id).length"
              class="rounded-lg border border-eb-border bg-eb-mid p-3"
            >
              <p class="text-[10px] uppercase tracking-wider text-slate-500 mb-2">
                <i class="fa fa-rotate mr-1" aria-hidden="true" />
                {{ t('overview.feedback_loops_label') }}
              </p>
              <div class="flex flex-wrap gap-1.5">
                <button
                  v-for="loop in systemicLoopsForHub(selectedNode.id)"
                  :key="loop.id"
                  class="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold border transition-all focus-visible:ring-2 focus-visible:ring-eb-cyan outline-none"
                  :style="{
                    borderColor: loop.color,
                    color: activeLoopId === loop.id ? loop.color : '#64748b',
                    backgroundColor: activeLoopId === loop.id ? loop.color + '18' : 'transparent',
                    boxShadow: activeLoopId === loop.id ? `0 0 8px ${loop.color}40` : 'none',
                  }"
                  :aria-pressed="activeLoopId === loop.id"
                  @click="toggleLoop(loop.id)"
                >
                  <i class="fa fa-rotate text-[9px]" aria-hidden="true" />
                  {{ locale === 'fr' ? loop.label : loop.labelEn }}
                </button>
              </div>
            </div>

          </template>

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
            {{ ctaLabel(selectedNode.route) }}
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
import { useDashboardStore } from '@/store/dashboard.store'
import { SIM_LABELS } from '@/config/simulation.config'
import { interpolateAtYear } from '@/utils/timeSeries'
import { HUB_NODES, HUB_EDGES, type HubNodeData, type HubCategory, type HubChartType } from '@/data/hubGraph'
import { TIPPING_POINTS } from '@/data/tippingPoints'
import { mitigationPolicies as ALL_POLICIES } from '@/data/mitigationPolicies'
import { useMitigationPoliciesStore } from '@/store/mitigationPolicies.store'
import { feedbackLoops, systemicNodes, systemicEdges, type FeedbackLoop } from '@/data/systemicGraph'
import earthGlobeUrl from '@/assets/earth-globe-2.png'
import HubNodeChart from '@/components/charts/HubNodeChart.vue'

const { t, locale } = useI18n()

const gameStore      = useGameStore()
const simStore       = useSimulationStore()
const tpStore        = useTippingPointsStore()
const dashboardStore = useDashboardStore()
const policiesStore  = useMitigationPoliciesStore()

const showPolicies = ref(false)
const legendExpanded = ref(true)
const loopsExpanded = ref(false)

// ─── Mode graphe / tableau de bord ────────────────────────────────────────────

type ViewMode = 'graph' | 'dashboard'
const savedMode = localStorage.getItem(STORAGE_KEYS.OVERVIEW_MODE) as ViewMode | null
const mode = ref<ViewMode>(savedMode === 'dashboard' ? 'dashboard' : 'graph')

function notifyOverviewModeChange(m: ViewMode): void {
  window.dispatchEvent(new CustomEvent<ViewMode>('eb-overview-mode', { detail: m }))
}

function setMode(m: ViewMode): void {
  mode.value = m
  localStorage.setItem(STORAGE_KEYS.OVERVIEW_MODE, m)
  notifyOverviewModeChange(m)
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
const panelContent = ref<HTMLDivElement | null>(null)
const legendHeader = ref<HTMLSpanElement | null>(null)
const loading      = ref(true)

// ─── Nœuds accessibles (ordre de lecture) ─────────────────────────────────────
interface AccessibleNode { id: string; label: string }
const sortedAccessibleNodes = ref<AccessibleNode[]>([])

function buildSortedNodes(): void {
  if (!cy) return
  const nodes = cy.nodes().filter((n: cytoscape.NodeSingular) => {
    const type = n.data('type') as string
    return type === 'hub' || type === 'category' || type === 'indicator' || type === 'tipping' || type === 'feedback'
  })
  sortedAccessibleNodes.value = (nodes as cytoscape.NodeCollection)
    .map((n: cytoscape.NodeSingular) => ({ id: n.id(), label: n.data('label') as string, pos: n.position() }))
    .sort((a, b) => {
      const dy = a.pos.y - b.pos.y
      return Math.abs(dy) > 5 ? dy : a.pos.x - b.pos.x
    })
    .map(({ id, label }) => ({ id, label }))
}

function highlightAccessibleNode(id: string): void {
  if (!cy) return
  cy.nodes().addClass('dimmed')
  cy.edges().addClass('dimmed')
  const node = cy.nodes(`[id="${id}"]`).first()
  node.removeClass('dimmed').addClass('highlighted')
  node.neighborhood('node').removeClass('dimmed').addClass('highlighted')
  node.connectedEdges().removeClass('dimmed').addClass('highlighted')
  // Fit directly on this node's neighborhood (selectedNode not yet set for keyboard focus)
  const neighborhood = node.closedNeighborhood()
  if (neighborhood.length) fitCollection(neighborhood)
  keepFocusInsideVisibleViewport()
}

function unhighlightAccessibleNode(_id: string): void {
  if (!cy || selectedNode.value) return
  cy.nodes().removeClass('dimmed highlighted')
  cy.edges().removeClass('dimmed highlighted')
}

function activateAccessibleNode(id: string): void {
  if (!cy) return
  selectedNode.value = HUB_NODES.find(n => n.id === id) ?? null
  if (!selectedNode.value) return
  cy.nodes().addClass('dimmed')
  cy.edges().addClass('dimmed')
  cy.nodes().removeClass('highlighted')
  cy.edges().removeClass('highlighted')
  const node = cy.nodes(`[id="${id}"]`).first()
  node.removeClass('dimmed').addClass('highlighted')
  node.neighborhood('node').removeClass('dimmed').addClass('highlighted')
  node.connectedEdges().removeClass('dimmed').addClass('highlighted')
  nextTick(() => closeBtn.value?.focus())
}

const tippingVisible = ref(false)
const graphHeightPx = ref(640)
let cy: Core | null = null
let panelResizeObserver: ResizeObserver | null = null

// Top offset for the zoom control bar: aligned with the legend header row
const legendHeaderTop = ref<string>('1rem')
function updateLegendHeaderTop(): void {
  if (!legendHeader.value || !cyContainer.value) return
  const containerTop = cyContainer.value.getBoundingClientRect().top
  const headerTop = legendHeader.value.getBoundingClientRect().top
  legendHeaderTop.value = `${Math.max(0, Math.round(headerTop - containerTop))}px`
}

function defaultGraphHeight(): number {
  const vh = window.innerHeight
  const isMobile = window.innerWidth < 640
  return isMobile ? Math.max(460, vh - 180) : Math.max(560, vh - 220)
}

// ─── Viewport dimensions (single read per paint pass) ────────────────────────
interface ViewportDimensions {
  visibleHeight: number
  visibleWidth:  number
  leftMargin:    number
  rightMargin:   number
  topMargin:     number
  bottomMargin:  number
}
function visibleViewport(): ViewportDimensions {
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize)
  const cw  = cyContainer.value?.clientWidth  ?? window.innerWidth
  const ch  = cyContainer.value?.clientHeight ?? window.innerHeight
  return {
    visibleHeight: Math.min(ch, defaultGraphHeight()),
    visibleWidth:  selectedNode.value && window.innerWidth >= 640 ? Math.round(cw * 0.75) : cw,
    leftMargin:    Math.round(2.5 * rem),
    rightMargin:   Math.round(3.5 * rem),
    topMargin:     Math.round(5   * rem),
    bottomMargin:  Math.round(2   * rem),
  }
}

function updateGraphHeight(): void {
  let target = defaultGraphHeight()
  if (selectedNode.value && panelContent.value) {
    // The panel includes sticky paddings, close button area and card spacing.
    target = Math.max(target, panelContent.value.scrollHeight + 40)
  }
  if (target !== graphHeightPx.value) graphHeightPx.value = target
}

function focusElementsForSelection(): cytoscape.CollectionReturnValue | null {
  if (!cy || !selectedNode.value) return null
  const focusNode = cy.nodes(`[id="${selectedNode.value.id}"]`).first()
  if (!focusNode.length) return null
  return focusNode.closedNeighborhood()
}

function panelOverflowPx(): number {
  if (!selectedNode.value || !panelContent.value) return 0
  return Math.max(0, panelContent.value.scrollHeight + 40 - defaultGraphHeight())
}

function panelOverflowRatio(): number {
  const baseHeight = defaultGraphHeight()
  if (baseHeight <= 0) return 0
  return Math.min(1.25, panelOverflowPx() / baseHeight)
}

function fitCollection(elements: cytoscape.CollectionReturnValue): void {
  if (!cy) return
  const bounds = elements.boundingBox()
  const span = Math.max(bounds.x2 - bounds.x1, bounds.y2 - bounds.y1)
  const basePadding = Math.max(120, Math.round(span * 0.28))
  const overflowRatio = panelOverflowRatio()
  const extraPadding = Math.round(Math.max(80, span * 0.22) * overflowRatio)
  cy.fit(elements, basePadding + extraPadding)
}

function fitViewportToCurrentFocus(): void {
  if (!cy) return
  const focusElements = focusElementsForSelection()
  if (focusElements && focusElements.length) {
    fitCollection(focusElements)
    return
  }
  cy.fit(undefined, 50)
}

function keepFocusInsideVisibleViewport(vp?: ViewportDimensions): void {
  if (!cy || !cyContainer.value) return
  const focusElements = focusElementsForSelection()
  if (!focusElements || !focusElements.length) return

  const { visibleHeight, visibleWidth, leftMargin, rightMargin, topMargin, bottomMargin } = vp ?? visibleViewport()
  const box = focusElements.renderedBoundingBox()

  // Horizontal corrections (independent, no conflict possible)
  if (box.x2 > visibleWidth - rightMargin) {
    cy.panBy({ x: -Math.ceil(box.x2 - (visibleWidth - rightMargin)), y: 0 })
  }
  if (box.x1 < leftMargin) {
    cy.panBy({ x: Math.ceil(leftMargin - box.x1), y: 0 })
  }

  // Vertical corrections: handle the case where focus is taller than available space
  const focusH = box.y2 - box.y1
  const availableH = visibleHeight - topMargin - bottomMargin
  if (focusH > availableH) {
    // Focus taller than visible area: prioritize top alignment
    if (box.y1 < topMargin) {
      cy.panBy({ x: 0, y: Math.ceil(topMargin - box.y1) })
    }
  } else {
    // Both ends can fit: fix bottom first, then top (top takes priority)
    if (box.y2 > visibleHeight - bottomMargin) {
      cy.panBy({ x: 0, y: -Math.ceil(box.y2 - (visibleHeight - bottomMargin)) })
    }
    const box2 = focusElements.renderedBoundingBox()
    if (box2.y1 < topMargin) {
      cy.panBy({ x: 0, y: Math.ceil(topMargin - box2.y1) })
    }
  }
}

function refreshCyAfterHeightChange(): void {
  if (!cy || !cyContainer.value) return
  const vp = visibleViewport()
  cy.resize()
  fitViewportToCurrentFocus()

  const overflowRatio = panelOverflowRatio()
  if (selectedNode.value && window.innerWidth >= 640 && overflowRatio > 0) {
    const panRatio = Math.min(0.22, 0.08 + overflowRatio * 0.12)
    cy.panBy({ x: -Math.round((cyContainer.value.clientWidth - vp.visibleWidth) / 2 + vp.visibleWidth * panRatio), y: 0 })
  }
  if (window.innerWidth < 640) {
    const { clientWidth: cw, clientHeight: ch } = cyContainer.value
    if (ch > cw * 1.3) cy.panBy({ x: 0, y: Math.round(ch * 0.12) })
  }
  keepFocusInsideVisibleViewport(vp)
}

watch(graphHeightPx, () => {
  nextTick(() => refreshCyAfterHeightChange())
})

watch(panelContent, (el) => {
  panelResizeObserver?.disconnect()
  if (!el) return
  panelResizeObserver = new ResizeObserver(() => {
    updateGraphHeight()
  })
  panelResizeObserver.observe(el)
  updateGraphHeight()
})

// ─── Sélection ─────────────────────────────────────────────────────────────────
const selectedNode = ref<HubNodeData | null>(null)
const activeLoopId = ref<string | null>(null)

watch(selectedNode, () => {
  nextTick(() => {
    updateGraphHeight()
    // watch(graphHeightPx) triggers refreshCyAfterHeightChange when height changes.
    // Only call it directly here when height stays the same (panel fits, no overflow change).
    if (!panelContent.value || panelContent.value.scrollHeight + 40 <= defaultGraphHeight()) {
      refreshCyAfterHeightChange()
    }
  })
})

function clearSelection(): void {
  selectedNode.value = null
  const previousLoop = activeLoopId.value ? feedbackLoops.find(loop => loop.id === activeLoopId.value) ?? null : null
  activeLoopId.value = null
  clearLoopHighlight(previousLoop)
  cy?.nodes().removeClass('dimmed highlighted')
  cy?.edges().removeClass('dimmed highlighted')
}

function focusCloseBtn(): void {
  closeBtn.value?.focus()
}

function ctaLabel(route: string): string {
  if (route.startsWith('/mitigation-policies/')) return t('overview.go_to_policy_detail')
  if (route === '/mitigation-policies') return t('overview.go_to_policies')
  const map: Record<string, string> = {
    '/dashboard':           t('overview.go_to_dashboard'),
    '/limites-planetaires': t('overview.go_to_limits'),
    '/bascules':            t('overview.go_to_tipping'),
  }
  return map[route] ?? t('overview.go_to_page')
}

// ─── Données systémiques pour le panel ──────────────────────────────────────
// Mapping inverse : hub ID → systemic ID
const HUB_TO_SYSTEMIC: Record<string, string> = {
  co2:          'ghg',
  temp:         'temperature',
  'sea-level':  'sea_level',
  extremes:     'extreme_events',
  forest:       'forest',
  biodiversity: 'biodiversity',
  'energy-mix': 'renewable',
  resources:    'resources',
  food:         'food_security',
  water:        'water_access',
  health:       'health',
  inequality:   'inequality',
  conflicts:    'geopolitical',
  'tp-permafrost': 'permafrost',
  'tp-coral':      'coral',
  'tp-arctic':     'arctic',
  'tp-amazon':     'amazon',
  'tp-amoc':       'amoc',
}

function systemicNodeForHub(hubId: string) {
  const sysId = HUB_TO_SYSTEMIC[hubId]
  if (!sysId) return null
  return systemicNodes.find(n => n.data.id === sysId) ?? null
}

function systemicLoopsForHub(hubId: string): FeedbackLoop[] {
  const sysId = HUB_TO_SYSTEMIC[hubId]
  if (!sysId) return []
  return feedbackLoops.filter(l => l.nodeIds.includes(sysId))
}

interface SysEdgeItem {
  id:            string
  direction:     'out' | 'in'
  edgeType:      'positive' | 'negative'
  otherLabel:    string
  otherLabelEn:  string
  description:   string
  descriptionEn: string
  ipccRef:       string
}

function systemicEdgesForHub(hubId: string): SysEdgeItem[] {
  const sysId = HUB_TO_SYSTEMIC[hubId]
  if (!sysId) return []
  const items: SysEdgeItem[] = []
  systemicEdges.forEach(e => {
    const isOut = e.data.source === sysId
    const isIn  = e.data.target === sysId
    if (!isOut && !isIn) return
    const otherId = isOut ? e.data.target : e.data.source
    const other   = systemicNodes.find(n => n.data.id === otherId)?.data
    items.push({
      id:            e.data.id,
      direction:     isOut ? 'out' : 'in',
      edgeType:      e.data.type,
      otherLabel:    other?.label    ?? otherId,
      otherLabelEn:  other?.labelEn  ?? otherId,
      description:   e.data.description,
      descriptionEn: e.data.descriptionEn,
      ipccRef:       e.data.ipccRef,
    })
  })
  items.sort((a, b) => {
    if (a.direction !== b.direction) return a.direction === 'out' ? -1 : 1
    if (a.edgeType  !== b.edgeType)  return a.edgeType  === 'positive' ? -1 : 1
    return 0
  })
  return items
}

// ─── Helpers pour les points de bascule / boucles de rétroaction ─────────────

function tippingI18nKey(hubId: string): string {
  if (hubId === 'tp-arctic') return 'feedback-arctic-albedo'
  return hubId
}

interface TippingImpactItem {
  id:         string
  targetId:   string
  causalType: 'positive' | 'negative'
  color:      string
}

function tippingImpactsForNode(nodeId: string): TippingImpactItem[] {
  return HUB_EDGES
    .filter(e => e.edgeType === 'tipping-impact' && e.source === nodeId)
    .map(e => ({
      id:         e.id,
      targetId:   e.target,
      causalType: (e.causalType ?? 'positive') as 'positive' | 'negative',
      color:      e.color ?? '#ff5050',
    }))
}

function tippingThresholdLabel(hubId: string): string {
  const tp = TIPPING_POINTS.find(p => p.id === hubId)
  if (!tp) return ''
  const { variable, threshold, comparison } = tp.trigger
  if (tp.probabilistic) {
    if (variable === 'temp') return `${t('tipping.trigger_from_probabilistic')} +${threshold}°C ${t('tipping.trigger_unit_temp')}`
    return `${t('tipping.trigger_from_probabilistic')} ${threshold}% ${t('tipping.trigger_unit_forest')}`
  }
  if (variable === 'temp') return `${comparison} +${threshold}°C ${t('tipping.trigger_unit_temp')}`
  return `${comparison} ${threshold}% ${t('tipping.trigger_unit_forest')}`
}

const SYSTEMIC_TO_HUB_NODE: Record<string, string> = {
  ghg: 'co2',
  temperature: 'temp',
  permafrost: 'tp-permafrost',
  coral: 'tp-coral',
  arctic: 'tp-arctic',
  amazon: 'tp-amazon',
  amoc: 'tp-amoc',
  forest: 'forest',
  biodiversity: 'biodiversity',
  health: 'health',
  inequality: 'inequality',
  geopolitical: 'conflicts',
  sea_level: 'sea-level',
  renewable: 'energy-mix',
  resources: 'resources',
  food_security: 'food',
  water_access: 'water',
}

const SYSTEMIC_TO_HUB_EDGE: Record<string, string> = {
  ghg_temp: 'c-co2-temp',
  temp_forest: 'c-temp-forest',
  forest_ghg: 'c-forest-co2',
  ineq_health: 'c-ineq-health',
  health_ineq: 'c-health-ineq',
}

function mappedLoopNodeIds(loop: FeedbackLoop): string[] {
  return loop.nodeIds
    .map(nodeId => SYSTEMIC_TO_HUB_NODE[nodeId])
    .filter((nodeId): nodeId is string => !!nodeId && !!cy?.getElementById(nodeId).length)
}

function mappedLoopEdgeIds(loop: FeedbackLoop): string[] {
  return loop.edgeIds
    .map(edgeId => SYSTEMIC_TO_HUB_EDGE[edgeId])
    .filter((edgeId): edgeId is string => !!edgeId && !!cy?.getElementById(edgeId).length)
}

function clearLoopHighlight(loop: FeedbackLoop | null): void {
  if (!cy || !loop) return
  mappedLoopNodeIds(loop).forEach(nodeId => {
    cy!.getElementById(nodeId).removeStyle('overlay-opacity overlay-color overlay-padding')
  })
  mappedLoopEdgeIds(loop).forEach(edgeId => {
    cy!.getElementById(edgeId).removeStyle('line-color target-arrow-color width opacity')
  })
}

function applyLoopHighlight(): void {
  if (!cy || !activeLoopId.value) return
  const loop = feedbackLoops.find(item => item.id === activeLoopId.value)
  if (!loop) return

  mappedLoopNodeIds(loop).forEach(nodeId => {
    cy!.getElementById(nodeId).style({
      'overlay-opacity': 0.28,
      'overlay-color': loop.color,
      'overlay-padding': 6,
    })
  })

  mappedLoopEdgeIds(loop).forEach(edgeId => {
    cy!.getElementById(edgeId).style({
      'line-color': loop.color,
      'target-arrow-color': loop.color,
      'width': 3.5,
      'opacity': 1,
    })
  })
}

function toggleLoop(loopId: string): void {
  if (!cy) return
  const previousLoop = activeLoopId.value ? feedbackLoops.find(loop => loop.id === activeLoopId.value) ?? null : null
  clearLoopHighlight(previousLoop)
  activeLoopId.value = activeLoopId.value === loopId ? null : loopId
  applyLoopHighlight()
}

// ─── Contrôles zoom ───────────────────────────────────────────────────────────
const ZOOM_FACTOR = 1.3

function zoomIn(): void {
  if (!cy) return
  cy.zoom({ level: Math.min(cy.zoom() * ZOOM_FACTOR, cy.maxZoom()), renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 } })
}

function zoomOut(): void {
  if (!cy) return
  cy.zoom({ level: Math.max(cy.zoom() / ZOOM_FACTOR, cy.minZoom()), renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 } })
}

// ─── Reset layout ─────────────────────────────────────────────────────────────
function resetLayout(): void {
  if (!cy || !cyContainer.value) return
  const positions = buildPositions(cyContainer.value.clientWidth, cyContainer.value.clientHeight)

  // Calcul des positions finales des tipping nodes (même logique qu'initCy)
  const hubPos = positions['hub']
  const tippingGroups = new Map<string, string[]>()
  HUB_EDGES.filter(e => e.edgeType === 'tipping-link').forEach(e => {
    if (!tippingGroups.has(e.source)) tippingGroups.set(e.source, [])
    tippingGroups.get(e.source)!.push(e.target)
  })
  tippingGroups.forEach((ids, sourceId) => {
    const sp = positions[sourceId]
    if (!sp) return
    const base = Math.atan2(sp.y - hubPos.y, sp.x - hubPos.x)
    const n      = ids.length
    const spread = n > 1 ? Math.PI / 3 : 0
    ids.forEach((id, i) => {
      const angle = n > 1 ? base + spread * (2 * i / (n - 1) - 1) : base
      positions[id] = { x: sp.x + Math.cos(angle) * 70, y: sp.y + Math.sin(angle) * 70 }
    })
  })

  cy.layout({
    name:              'preset',
    positions:         (node: cytoscape.NodeSingular) => positions[node.id()] ?? node.position(),
    animate:           true,
    animationDuration: 400,
    animationEasing:   'ease-in-out-sine',
    fit:               false,   // We handle fit manually against the visible viewport
    padding:           0,
  } as cytoscape.LayoutOptions).run()

  cy.one('layoutstop', () => {
    if (!cy || !cyContainer.value) return
    const cw = cyContainer.value.clientWidth
    const ch = cyContainer.value.clientHeight
    // Visible area: clamp height to viewport-based height, exclude side panel on desktop
    const visibleH = Math.min(ch, defaultGraphHeight())
    const visibleW = selectedNode.value && window.innerWidth >= 640
      ? Math.round(cw * 0.75)
      : cw
    const padding = Math.round(3 * parseFloat(getComputedStyle(document.documentElement).fontSize))
    cy!.fit(cy!.elements(), padding)
    // Shift pan so the graph is centred within the visible area, not the full canvas
    const panelOffsetX = selectedNode.value && window.innerWidth >= 640
      ? -Math.round((cw - visibleW) / 2)
      : 0
    const panelOffsetY = visibleH < ch
      ? -Math.round((ch - visibleH) / 2)
      : 0
    if (panelOffsetX !== 0 || panelOffsetY !== 0) cy!.panBy({ x: panelOffsetX, y: panelOffsetY })
    if (cw < 640 && ch > cw * 1.3) cy!.panBy({ x: 0, y: Math.round(ch * 0.12) })
  })
}

// ─── Politiques validées — nœuds et arêtes dynamiques ────────────────────────

const PROJ_TO_HUB: Record<string, string> = {
  co2:        'co2',
  temperature: 'temp',
  forest:     'forest',
  energyMix:  'energy-mix',
  resources:  'resources',
}

function buildPolicyElements(): cytoscape.ElementDefinition[] {
  if (!cy) return []
  const hubNode = cy.nodes('[id="hub"]').first()
  if (!hubNode.length) return []
  const hubPos = hubNode.position()

  const catClimat = cy.nodes('[id="cat-climat"]').first()
  const catR = catClimat.length
    ? Math.hypot(catClimat.position().x - hubPos.x, catClimat.position().y - hubPos.y)
    : 200
  const tempNode = cy.nodes('[id="temp"]').first()
  const catClimatPos = catClimat.length ? catClimat.position() : { x: hubPos.x, y: hubPos.y - catR }
  const indR = tempNode.length
    ? Math.hypot(tempNode.position().x - catClimatPos.x, tempNode.position().y - catClimatPos.y)
    : 100

  const polAngle  = Math.PI / 4  // bas-droite (45°)
  const catPolPos = { x: hubPos.x + Math.cos(polAngle) * catR, y: hubPos.y + Math.sin(polAngle) * catR }

  const validated = ALL_POLICIES.filter(p => policiesStore.validatedPolicyIds.includes(p.id))
  const n      = validated.length
  const spread = n > 1 ? Math.min(Math.PI * 0.7, (n - 1) * 0.5) : 0

  const policyElements = validated.flatMap((policy, i) => {
    const pAngle = n > 1 ? polAngle + spread * (2 * i / (n - 1) - 1) : polAngle
    const pPos   = { x: catPolPos.x + Math.cos(pAngle) * indR, y: catPolPos.y + Math.sin(pAngle) * indR }
    const proj   = policy.projections as Record<string, unknown>

    const projEdges = Object.entries(PROJ_TO_HUB)
      .filter(([projKey, hubId]) => proj[projKey] && cy?.nodes(`[id="${hubId}"]`).length)
      .map(([, hubId]) => ({ data: { id: `e-pi-${policy.id}-${hubId}`, source: policy.id, target: hubId, edgeType: 'policy-indicator' } }))

    const socEdges = proj['societal']
      ? ['food', 'water']
          .filter(hubId => cy?.nodes(`[id="${hubId}"]`).length)
          .map(hubId => ({ data: { id: `e-pi-${policy.id}-${hubId}`, source: policy.id, target: hubId, edgeType: 'policy-indicator' } }))
      : []

    return [
      { data: { id: policy.id, type: 'policy', color: '#fbbf24', label: policy.number, title: policy.title }, position: pPos },
      { data: { id: `e-pc-${policy.id}`, source: 'cat-politiques', target: policy.id, edgeType: 'policy-cat' } },
      ...projEdges,
      ...socEdges,
    ]
  })

  return [
    { data: { id: 'cat-politiques', type: 'policy-cat', color: '#fbbf24', label: t('overview.cat_politiques') }, position: catPolPos },
    { data: { id: 'e-hub-pol', source: 'hub', target: 'cat-politiques', edgeType: 'hub-cat', color: '#fbbf24' } },
    ...policyElements,
  ]
}

function removePolicyElements(): void {
  cy?.remove('[type="policy-cat"], [type="policy"], [id="e-hub-pol"]')
  cy?.remove('[edgeType="policy-cat"], [edgeType="policy-indicator"]')
}

watch(showPolicies, (show) => {
  if (!cy) return
  if (show) {
    cy.add(buildPolicyElements())
    fitViewportToCurrentFocus()
  } else {
    removePolicyElements()
    fitViewportToCurrentFocus()
  }
})

watch(
  () => policiesStore.validatedPolicyIds,
  () => {
    if (!showPolicies.value || !cy) return
    removePolicyElements()
    cy.add(buildPolicyElements())
  },
  { deep: true },
)

// ─── Données live ──────────────────────────────────────────────────────────────

function rawLiveValue(key: NonNullable<HubNodeData['liveKey']>): number {
  const year = gameStore.currentYear
  switch (key) {
    case 'co2':    return interpolateAtYear(year, SIM_LABELS, simStore.cumulativeCo2)
    case 'temp':   return interpolateAtYear(year, SIM_LABELS, simStore.cumulativeTemp)
    case 'forest': return interpolateAtYear(year, SIM_LABELS, simStore.cumulativeForest)
    case 'renewables': {
      const mix = simStore.cumulativeEnergyMix
      return interpolateAtYear(year, SIM_LABELS, mix['solar'])
           + interpolateAtYear(year, SIM_LABELS, mix['wind'])
           + interpolateAtYear(year, SIM_LABELS, mix['hydro'])
           + interpolateAtYear(year, SIM_LABELS, mix['nuclear'])
    }
    case 'food':  return interpolateAtYear(year, SIM_LABELS, simStore.cumulativeFoodSecurity)
    case 'water': return interpolateAtYear(year, SIM_LABELS, simStore.cumulativeWaterAccess)
    case 'extremes': {
      const ts = dashboardStore.ecologicalCharts?.extremes.timeSeries
      if (!ts) return 0
      const base   = interpolateAtYear(year, ts.years, ts.values)
      const offset = interpolateAtYear(year, SIM_LABELS, tpStore.extremesOffset)
      return base + offset
    }
  }
}

function liveValue(key: HubNodeData['liveKey']): string | null {
  if (!key) return null
  const v = rawLiveValue(key)
  return key === 'temp' ? '+' + v.toFixed(2) : v.toFixed(1)
}

// ─── Encodage visuel data-driven ───────────────────────────────────────────────

const SCORE_THRESHOLDS: Record<NonNullable<HubNodeData['liveKey']>, {
  safe: number; critical: number; direction: 'up-bad' | 'down-bad'
}> = {
  co2:        { safe: 38,  critical: 58,  direction: 'up-bad'   },
  temp:       { safe: 1.5, critical: 3,   direction: 'up-bad'   },
  forest:     { safe: 55,  critical: 40,  direction: 'down-bad' },
  renewables: { safe: 55,  critical: 15,  direction: 'down-bad' },
  food:       { safe: 62,  critical: 48,  direction: 'down-bad' },
  water:      { safe: 80,  critical: 62,  direction: 'down-bad' },
  extremes:   { safe: 3,   critical: 7,   direction: 'up-bad'   },
}

function nodeScore(key: NonNullable<HubNodeData['liveKey']>): number {
  const v = rawLiveValue(key)
  const { safe, critical, direction } = SCORE_THRESHOLDS[key]
  const raw = direction === 'up-bad'
    ? (v - safe)    / (critical - safe)
    : (safe - v)    / (safe - critical)
  return Math.max(0, Math.min(1, raw))
}

function categoryMaxScore(catNodeId: string): number {
  const catName = catNodeId.replace('cat-', '') as HubCategory
  const children = HUB_NODES.filter(n => n.category === catName && n.liveKey)
  if (children.length === 0) return 0
  return Math.max(...children.map(n => nodeScore(n.liveKey!)))
}

function applyNodeScores(): void {
  if (!cy || mode.value !== 'graph') return
  // Indicateurs — encodage direct
  HUB_NODES.filter(n => n.liveKey).forEach(n => {
    const score = nodeScore(n.liveKey!)
    cy!.nodes(`[id="${n.id}"]`).first().style({
      'border-width':       1.5 + score * 6.5,   // 1.5 → 8
      'background-opacity': 0.08 + score * 0.27,  // 0.08 → 0.35
    })
  })
  // Catégories — max score des enfants
  HUB_NODES.filter(n => n.type === 'category').forEach(n => {
    const score = categoryMaxScore(n.id)
    cy!.nodes(`[id="${n.id}"]`).first().style({
      'border-width':       2.5 + score * 4,     // 2.5 → 6.5
      'background-opacity': 0.20 + score * 0.15,  // 0.20 → 0.35
    })
  })
}

watch(
  [() => gameStore.currentYear, () => simStore.cumulativeCo2],
  () => {
    applyNodeScores()
    applyLoopHighlight()
  },
)

function isTippingTriggered(id: string): boolean {
  return !!tpStore.triggered[id]
}

// ─── Graphes du panneau latéral ───────────────────────────────────────────────

const PANEL_CHARTS: Partial<Record<string, HubChartType[]>> = {
  'energy-mix': ['renewables', 'energyMixBreakdown'],
  'sea-level':  ['sea-level'],
  health:       ['life-expectancy', 'respiratory-diseases', 'who-health-index'],
  inequality:   ['gini-coefficient', 'wealth-concentration', 'education-access'],
  conflicts:    ['resource-conflicts', 'water-tensions', 'climate-migrations'],
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
  if (cat === 'politiques') return t('overview.cat_politiques')
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
      'background-opacity': 0.20,
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
    selector: 'node[type="feedback"]',
    style: {
      'shape': 'ellipse',
      'width': 18, 'height': 18,
      'z-index': 10,
      'background-color': '#ff5050',
      'background-opacity': 0.0,
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
    selector: 'edge[edgeType="tipping-impact"]',
    style: {
      'width': 1,
      'line-color': 'data(color)',
      'line-style': 'solid',
      'opacity': 0.22,
      'curve-style': 'bezier',
      'target-arrow-shape': 'triangle',
      'target-arrow-color': 'data(color)',
      'arrow-scale': 0.6,
    },
  },
  {
    selector: 'edge[edgeType="causal"][causalType="positive"]',
    style: {
      'width': 1.8,
      'line-color': 'data(color)',
      'line-style': 'dashed',
      'opacity': 0.35,
      'curve-style': 'bezier',
      'target-arrow-shape': 'triangle',
      'target-arrow-color': 'data(color)',
      'arrow-scale': 0.7,
    },
  },
  {
    selector: 'edge[edgeType="causal"][causalType="negative"]',
    style: {
      'width': 1.8,
      'line-color': 'data(color)',
      'line-style': 'solid',
      'opacity': 0.35,
      'curve-style': 'bezier',
      'target-arrow-shape': 'triangle',
      'target-arrow-color': 'data(color)',
      'arrow-scale': 0.7,
    },
  },
  // ── Politiques ──
  {
    selector: 'node[type="policy-cat"]',
    style: {
      'width': 48, 'height': 48,
      'shape': 'roundrectangle',
      'background-color': '#fbbf24',
      'background-opacity': 0.2,
      'border-width': 2.5, 'border-color': '#fbbf24',
      'label': 'data(label)',
      'color': '#fbbf24',
      'font-size': 10, 'font-weight': 700,
      'text-valign': 'bottom', 'text-margin-y': 8,
      'text-halign': 'center',
    },
  },
  {
    selector: 'node[type="policy"]',
    style: {
      'width': 20, 'height': 20,
      'background-color': '#fbbf24',
      'background-opacity': 0.15,
      'border-width': 2, 'border-color': '#fbbf24',
      'label': 'data(label)',
      'color': '#fbbf24',
      'font-size': 8, 'font-weight': 700,
      'text-valign': 'center', 'text-halign': 'center',
    },
  },
  {
    selector: 'edge[edgeType="policy-cat"]',
    style: {
      'width': 1.5,
      'line-color': '#fbbf24',
      'opacity': 0.35,
      'curve-style': 'bezier',
      'target-arrow-shape': 'none',
    },
  },
  {
    selector: 'edge[edgeType="policy-indicator"]',
    style: {
      'width': 1,
      'line-color': '#fbbf24',
      'line-style': 'dotted',
      'opacity': 0.2,
      'curve-style': 'bezier',
      'target-arrow-shape': 'triangle',
      'target-arrow-color': '#fbbf24',
      'arrow-scale': 0.55,
    },
  },
  // ── États d'interaction — déclarés en dernier pour avoir la priorité sur tous les sélecteurs de type ──
  {
    selector: 'node.dimmed',
    style: { 'opacity': 0.12 },
  },
  {
    selector: 'edge.dimmed',
    style: { 'opacity': 0.05 },
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

// ─── Positions manuelles ──────────────────────────────────────────────────────
// Hub au centre, 4 catégories en croix, indicateurs en éventail autour de leur
// catégorie. Les tipping nodes sont initialisés sur leur déclencheur puis
// dispersés angulairement par le code post-layout.

const CAT_INDICATORS: Record<string, string[]> = {
  'cat-climat':      ['co2', 'temp', 'sea-level', 'extremes'],
  'cat-ecosystemes': ['forest', 'biodiversity'],
  'cat-energie':     ['energy-mix', 'resources'],
  'cat-societal':    ['food', 'water', 'health', 'inequality', 'conflicts'],
}

const CAT_ANGLES: Record<string, number> = {
  'cat-climat':      -Math.PI / 2,
  'cat-ecosystemes':  0,
  'cat-energie':      Math.PI / 2,
  'cat-societal':     Math.PI,
}

const TIPPING_TRIGGER: Record<string, string> = {
  'tp-permafrost': 'temp', 'tp-coral': 'temp',
  'tp-amazon':     'forest', 'tp-amoc': 'temp',
}

function buildPositions(w: number, h: number): Record<string, { x: number; y: number }> {
  // En portrait mobile, les rayons sont agrandis pour mieux exploiter la hauteur.
  // Le centrage vertical est géré après cy.fit() via panBy (voir initCy / resetLayout).
  const isMobilePortrait = w < 640 && h > w * 1.3
  const cx    = w / 2
  const cy    = h / 2
  const base  = Math.min(isMobilePortrait ? w * 0.9 : w, h)
  const CAT_R = base * (isMobilePortrait ? 0.38 : 0.20)
  const IND_R = base * (isMobilePortrait ? 0.22 : 0.11)

  const pos: Record<string, { x: number; y: number }> = {}
  pos['hub'] = { x: cx, y: cy }

  for (const [catId, angle] of Object.entries(CAT_ANGLES)) {
    pos[catId] = { x: cx + Math.cos(angle) * CAT_R, y: cy + Math.sin(angle) * CAT_R }
    const indicators = CAT_INDICATORS[catId] ?? []
    const n      = indicators.length
    const spread = n > 1 ? Math.min(Math.PI * 0.65, (n - 1) * 0.6) : 0
    indicators.forEach((id, i) => {
      const a = n > 1 ? angle + spread * (2 * i / (n - 1) - 1) : angle
      pos[id] = { x: pos[catId].x + Math.cos(a) * IND_R, y: pos[catId].y + Math.sin(a) * IND_R }
    })
  }

  for (const [tpId, triggerId] of Object.entries(TIPPING_TRIGGER)) {
    if (pos[triggerId]) pos[tpId] = { ...pos[triggerId] }
  }

  return pos
}

// ─── Init Cytoscape ───────────────────────────────────────────────────────────
function initCy(): void {
  if (!cyContainer.value) return

  const positions = buildPositions(cyContainer.value.clientWidth, cyContainer.value.clientHeight)

  const staticElements: cytoscape.ElementDefinition[] = [
    ...HUB_NODES.map(n => ({
      data: {
        ...n,
        label: t('hub.nodes.' + n.id + '.label'),
        triggered: tpStore.triggered[n.id] ? '1' : '0',
      },
      ...(positions[n.id] ? { position: positions[n.id] } : {}),
    })),
    ...HUB_EDGES.map(e => ({ data: { ...e } })),
  ]

  cy = cytoscape({
    container: cyContainer.value,
    elements:  staticElements,
    style:     CY_STYLE,
    layout: {
      name:    'preset',
      fit:     true,
      padding: 50,
    },
    minZoom: 0.3,
    maxZoom: 4,
    userZoomingEnabled: false,
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
      cy!.nodes(`[id="${id}"]`).first().position({ x: sp.x + Math.cos(angle) * 70, y: sp.y + Math.sin(angle) * 70 })
    })
  })
  cy.fit(undefined, 50)

  // Sur mobile portrait, décaler le graphe vers le bas pour le centrer
  // dans la zone visible sous la légende overlay (~26% de h).
  const { clientWidth: cw, clientHeight: ch } = cyContainer.value
  if (cw < 640 && ch > cw * 1.3) cy.panBy({ x: 0, y: Math.round(ch * 0.12) })

  startPulseForTriggered()
  applyNodeScores()
  applyLoopHighlight()
  buildSortedNodes()

  // Zoom → rendre les arêtes tipping-link plus visibles au-delà du seuil
  cy.on('zoom', () => {
    const show = cy!.zoom() > 1.4
    if (show !== tippingVisible.value) {
      tippingVisible.value = show
      cy!.edges('[edgeType="tipping-link"]').style('opacity', show ? 0.55 : 0.18)
      cy!.edges('[edgeType="tipping-impact"]').style('opacity', show ? 0.5 : 0.22)
    }
  })

  // Clic nœud → panneau
  cy.on('tap', 'node', (evt) => {
    const node = evt.target as NodeSingular
    const data = node.data() as Record<string, string>

    if (data['type'] === 'policy') {
      const policy = ALL_POLICIES.find(p => p.id === data['id'])
      selectedNode.value = policy
        ? { id: policy.id, type: 'indicator', category: 'politiques', color: '#fbbf24', route: `/mitigation-policies/${policy.id}`, label: policy.title }
        : null
    } else if (data['type'] === 'policy-cat') {
      selectedNode.value = { id: 'cat-politiques', type: 'category', category: 'politiques', color: '#fbbf24', route: '/mitigation-policies', label: t('overview.cat_politiques') }
    } else {
      selectedNode.value = HUB_NODES.find(n => n.id === data['id']) ?? null
    }

    // Highlight nœuds + arêtes
    cy!.nodes().addClass('dimmed')
    cy!.edges().addClass('dimmed')
    cy!.nodes().removeClass('highlighted')
    cy!.edges().removeClass('highlighted')
    node.removeClass('dimmed').addClass('highlighted')
    node.neighborhood('node').removeClass('dimmed').addClass('highlighted')
    node.connectedEdges().removeClass('dimmed').addClass('highlighted')
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
onMounted(() => {
  notifyOverviewModeChange(mode.value)
  updateGraphHeight()
  nextTick(updateLegendHeaderTop)
  window.addEventListener('resize', updateGraphHeight)
  if (mode.value === 'graph') nextTick(initCy)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateGraphHeight)
  panelResizeObserver?.disconnect()
  cy?.destroy()
  cy = null
})
</script>

<style scoped>
.panel-enter-active, .panel-leave-active { transition: transform 0.25s ease, opacity 0.25s ease; }
.panel-enter-from, .panel-leave-to { transform: translateX(100%); opacity: 0; }
@media (max-width: 639px) {
  .panel-enter-from, .panel-leave-to { transform: translateY(100%); }
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Relations systémiques repliables */
.conn-item .conn-chevron { transition: transform 0.15s ease; }
.conn-item[open] .conn-chevron { transform: rotate(180deg); }
.conn-item summary { list-style: none; }
.conn-item summary::-webkit-details-marker { display: none; }

/* Boutons accessibles des nœuds du graphe (skip-link pattern) */
.graph-node-key-btn {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
.graph-node-key-btn:focus {
  position: absolute;
  top: 0.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
  width: auto;
  height: auto;
  padding: 0.25rem 0.75rem;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
  background: #0a0f1e;
  border: 1px solid #00e5ff;
  color: #00e5ff;
  font-size: 0.75rem;
  border-radius: 0.5rem;
  outline: none;
  box-shadow: 0 0 0 2px #00e5ff;
}
</style>
