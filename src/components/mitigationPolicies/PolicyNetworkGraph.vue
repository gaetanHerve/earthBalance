<template>
  <div>
    <!-- Legend / hint bar -->
    <div class="flex flex-wrap items-center gap-3 mb-4 text-xs">
      <span
        class="px-2 py-0.5 rounded-full border text-[11px] font-semibold"
        :class="mode === 'simulation'
          ? 'border-eb-cyan/40 text-eb-cyan bg-eb-cyan/10'
          : 'border-eb-green/40 text-eb-green bg-eb-green/10'"
      >
        <i class="fa mr-1" :class="mode === 'simulation' ? 'fa-flask' : 'fa-gamepad'" aria-hidden="true"></i>
        {{ mode === 'simulation' ? t('network.mode_simulation') : t('network.mode_game') }}
      </span>

      <template v-if="selectedId">
        <span class="flex items-center gap-1.5 text-amber-400">
          <svg width="20" height="8" aria-hidden="true">
            <line x1="0" y1="4" x2="20" y2="4" stroke="#f59e0b" stroke-width="2" stroke-dasharray="5,3"/>
          </svg>
          {{ t('network.upstream_label') }}
        </span>
        <span class="flex items-center gap-1.5 text-eb-cyan">
          <svg width="20" height="8" aria-hidden="true">
            <line x1="0" y1="4" x2="20" y2="4" stroke="#00e5ff" stroke-width="2" stroke-dasharray="5,3"/>
          </svg>
          {{ t('network.downstream_label') }}
        </span>
        <button
          class="text-slate-500 hover:text-slate-300 transition-colors underline underline-offset-2"
          @click="selectedId = null"
        >
          {{ t('network.deselect_hint') }}
        </button>
      </template>
      <span v-else class="text-slate-500 italic">{{ t('network.click_hint') }}</span>
    </div>

    <!-- Grid + SVG overlay container -->
    <div ref="containerRef" class="relative">
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        <div
          v-for="policy in localizedPolicies"
          :key="policy.id"
          :data-policy-id="policy.id"
          class="rounded-xl border p-3 flex flex-col gap-2 cursor-pointer transition-all select-none focus-visible:ring-2 focus-visible:ring-eb-cyan outline-none"
          :class="cardClass(policy.id)"
          role="button"
          :tabindex="0"
          :aria-pressed="selectedId === policy.id"
          :aria-label="policy.title"
          @click="toggleSelect(policy.id)"
          @keydown.enter.prevent="toggleSelect(policy.id)"
          @keydown.space.prevent="toggleSelect(policy.id)"
        >
          <!-- Top row: number + badges -->
          <div class="flex items-start justify-between gap-1">
            <span class="text-[10px] text-slate-500 font-mono shrink-0">{{ policy.number }}</span>
            <div class="flex items-center gap-1 flex-wrap justify-end">
              <!-- Badge retenue ou effet différé -->
              <span
                v-if="policy.status === 'validated'"
                class="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide shrink-0 bg-green-900/40 text-eb-green border border-green-700/30"
              >
                {{ t('simulator.retained_badge') }}
              </span>
              <span
                v-else-if="(policy.implementationLag ?? 0) > 0"
                class="text-[9px] px-1.5 py-0.5 rounded font-mono shrink-0 bg-eb-cyan/10 border border-eb-cyan/25 text-eb-cyan"
              >
                → {{ t('simulator.effect_from', { year: gameStore.currentYear + (policy.implementationLag ?? 0) }) }}
              </span>
              <span
                v-else
                class="text-[9px] px-1.5 py-0.5 rounded font-mono shrink-0 bg-eb-cyan/10 border border-eb-cyan/25 text-eb-cyan"
              >
                → {{ t('simulator.effect_immediate') }}
              </span>
              <!-- Prereq lock indicator -->
              <span
                v-if="!prereqCheck(policy.id).met"
                class="text-amber-500 shrink-0"
                :title="t('prerequisites.locked_tooltip')"
                aria-hidden="true"
              >
                <i class="fa fa-lock text-[9px]"></i>
              </span>
              <!-- Simulation toggle button -->
              <button
                v-if="mode === 'simulation' && !isLocked(policy.id)"
                class="w-4 h-4 rounded-full border flex items-center justify-center text-[9px] shrink-0 transition-colors"
                :class="isSelected(policy.id)
                  ? 'border-eb-cyan bg-eb-cyan/20 text-eb-cyan'
                  : prereqCheck(policy.id).met
                    ? 'border-slate-600 text-slate-400 hover:border-eb-cyan/50'
                    : 'border-amber-800/50 text-amber-700 cursor-not-allowed'"
                :aria-label="isSelected(policy.id) ? t('simulator.remove_aria') : t('simulator.add_aria')"
                :disabled="!prereqCheck(policy.id).met"
                @click.stop="prereqCheck(policy.id).met && !isLocked(policy.id) && toggle(policy.id)"
              >
                <i :class="['fa', isSelected(policy.id) ? 'fa-minus' : 'fa-plus']" aria-hidden="true"></i>
              </button>
              <!-- Locked indicator in simulation mode -->
              <span
                v-if="mode === 'simulation' && isLocked(policy.id)"
                class="w-4 h-4 flex items-center justify-center text-eb-green/60 text-[9px] shrink-0"
                aria-hidden="true"
              >
                <i class="fa fa-lock"></i>
              </span>
            </div>
          </div>

          <!-- Title -->
          <p class="text-[11px] font-semibold text-slate-200 leading-snug line-clamp-3 flex-1">
            {{ policy.title }}
          </p>

          <!-- Impact chips -->
          <div class="flex flex-wrap gap-1">
            <span class="text-[9px] bg-eb-dark border border-eb-border rounded px-1.5 py-0.5 text-eb-green font-bold">
              −{{ policy.projectedImpact['emissionsReductionGtCO2yr'] }} Gt/an
            </span>
            <span class="text-[9px] bg-eb-dark border border-eb-border rounded px-1.5 py-0.5 text-eb-cyan font-bold">
              −{{ policyTempReductionAt2100(policy, policyAdoptionYearMap.get(policy.id) ?? gameStore.currentYear).toFixed(2) }}°C en 2100
            </span>
          </div>

          <!-- Lien détail -->
          <RouterLink
            :to="`/mitigation-policies/${policy.id}`"
            class="inline-flex items-center gap-1 text-[10px] text-slate-600 hover:text-eb-cyan transition-colors focus-visible:ring-2 focus-visible:ring-eb-cyan rounded outline-none"
            @click.stop
          >
            <i class="fa fa-circle-info" aria-hidden="true"></i>{{ t('simulator.detail_link') }}
          </RouterLink>
        </div>
      </div>

      <!-- SVG lines overlay -->
      <svg
        v-if="svgLinks.length > 0"
        class="absolute inset-0 overflow-visible pointer-events-none"
        :width="containerSize.width"
        :height="containerSize.height"
        aria-hidden="true"
      >
        <defs>
          <marker id="arrow-amber" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
            <path d="M0,0 L0,7 L7,3.5 z" fill="#f59e0b" opacity="0.8"/>
          </marker>
          <marker id="arrow-cyan" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
            <path d="M0,0 L0,7 L7,3.5 z" fill="#00e5ff" opacity="0.8"/>
          </marker>
        </defs>
        <line
          v-for="(link, i) in svgLinks"
          :key="i"
          :x1="link.x1"
          :y1="link.y1"
          :x2="link.x2"
          :y2="link.y2"
          :stroke="link.type === 'upstream' ? '#f59e0b' : '#00e5ff'"
          stroke-width="2"
          stroke-dasharray="6,4"
          :marker-end="link.type === 'upstream' ? 'url(#arrow-amber)' : 'url(#arrow-cyan)'"
          opacity="0.75"
        />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useSimulationStore, policyTempReductionAt2100 } from '@/store/simulation.store'
import { useGameStore } from '@/store/game.store'
import { usePrerequisites } from '@/composables/usePrerequisites'
import { useLocalizedPolicies } from '@/composables/useLocalizedPolicies'

const props = defineProps<{
  mode: 'game' | 'simulation'
}>()

const { t } = useI18n()
const { check: prereqCheck } = usePrerequisites()
const simStore = useSimulationStore()
const gameStore = useGameStore()
const { catalogue, selectedIds, effectiveLockedIds, policyAdoptionYearMap } = storeToRefs(simStore)
const { addMitigationPolicy, removeMitigationPolicy } = simStore
const { localizedPolicy } = useLocalizedPolicies()

const localizedPolicies = computed(() => catalogue.value.map(p => localizedPolicy(p)))

// ─── Dependency maps ──────────────────────────────────────────────────────────

const downstreamMap = computed(() => {
  const map = new Map<string, string[]>()
  for (const p of catalogue.value) {
    for (const reqId of p.prerequisites?.policiesRequired ?? []) {
      if (!map.has(reqId)) map.set(reqId, [])
      map.get(reqId)!.push(p.id)
    }
  }
  return map
})

// ─── Card selection ───────────────────────────────────────────────────────────

const selectedId = ref<string | null>(null)

function toggleSelect(id: string): void {
  selectedId.value = selectedId.value === id ? null : id
}

function isSelected(id: string): boolean {
  return selectedIds.value.includes(id)
}

function isLocked(id: string): boolean {
  return effectiveLockedIds.value.includes(id)
}

function toggle(id: string): void {
  if (isLocked(id)) return
  isSelected(id) ? removeMitigationPolicy(id) : addMitigationPolicy(id)
}

// ─── Card visual state ────────────────────────────────────────────────────────

function cardClass(id: string): string[] {
  if (selectedId.value === null) {
    if (isLocked(id)) return ['border-eb-green/30 bg-eb-green/5']
    if (!prereqCheck(id).met) return ['border-eb-border bg-eb-card opacity-40 cursor-default']
    if (props.mode === 'simulation' && isSelected(id)) return ['border-eb-cyan/40 bg-eb-cyan/10']
    return ['border-eb-border bg-eb-card hover:border-eb-cyan/30 hover:bg-eb-card/80']
  }

  if (id === selectedId.value) return ['border-white/60 bg-white/5 ring-1 ring-white/20 shadow-lg']

  const upIds   = catalogue.value.find(p => p.id === selectedId.value)?.prerequisites?.policiesRequired ?? []
  const downIds = downstreamMap.value.get(selectedId.value) ?? []

  if (upIds.includes(id))   return ['border-amber-500/60 bg-amber-900/20']
  if (downIds.includes(id)) return ['border-eb-cyan/60 bg-eb-cyan/10']
  return ['border-eb-border bg-eb-card opacity-25']
}

// ─── SVG link overlay ─────────────────────────────────────────────────────────

interface SvgLink {
  x1: number; y1: number
  x2: number; y2: number
  type: 'upstream' | 'downstream'
}

const svgLinks     = ref<SvgLink[]>([])
const containerRef = ref<HTMLElement | null>(null)
const containerSize = ref({ width: 0, height: 0 })

function getCardCenter(id: string): { x: number; y: number } | null {
  if (!containerRef.value) return null
  const el = containerRef.value.querySelector<HTMLElement>(`[data-policy-id="${id}"]`)
  if (!el) return null
  const elR  = el.getBoundingClientRect()
  const conR = containerRef.value.getBoundingClientRect()
  return {
    x: elR.left - conR.left + elR.width / 2,
    y: elR.top  - conR.top  + elR.height / 2,
  }
}

function updateLinks(): void {
  if (!containerRef.value) return
  const r = containerRef.value.getBoundingClientRect()
  containerSize.value = { width: r.width, height: containerRef.value.scrollHeight }

  if (!selectedId.value) { svgLinks.value = []; return }

  const policy = catalogue.value.find(p => p.id === selectedId.value)
  if (!policy) { svgLinks.value = []; return }

  const from = getCardCenter(selectedId.value)
  if (!from) return

  const links: SvgLink[] = []

  for (const reqId of policy.prerequisites?.policiesRequired ?? []) {
    const to = getCardCenter(reqId)
    if (to) links.push({ x1: from.x, y1: from.y, x2: to.x, y2: to.y, type: 'upstream' })
  }

  for (const depId of (downstreamMap.value.get(selectedId.value) ?? [])) {
    const to = getCardCenter(depId)
    if (to) links.push({ x1: from.x, y1: from.y, x2: to.x, y2: to.y, type: 'downstream' })
  }

  svgLinks.value = links
}

let ro: ResizeObserver | null = null

onMounted(() => {
  ro = new ResizeObserver(() => {
    nextTick(() => requestAnimationFrame(updateLinks))
  })
  if (containerRef.value) ro.observe(containerRef.value)
})

onUnmounted(() => ro?.disconnect())

watch(selectedId, () => {
  nextTick(() => requestAnimationFrame(updateLinks))
})
</script>
