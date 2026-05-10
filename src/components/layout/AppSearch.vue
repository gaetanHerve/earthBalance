<template>
  <div class="relative" ref="containerRef">

    <!-- Bouton déclencheur -->
    <button
      class="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border transition-all focus-visible:ring-2 focus-visible:ring-eb-cyan outline-none"
      :class="isOpen
        ? 'border-eb-cyan text-eb-cyan bg-eb-cyan/10'
        : 'border-eb-border text-slate-400 hover:border-eb-cyan/50 hover:text-slate-200'"
      :aria-expanded="isOpen"
      aria-controls="search-panel"
      :aria-label="t('search.open')"
      @click="toggle"
    >
      <i class="fa fa-magnifying-glass" aria-hidden="true"></i>
      <span>{{ t('search.label') }}</span>
    </button>

    <!-- Panneau de recherche -->
    <div
      v-show="isOpen"
      id="search-panel"
      role="search"
      :aria-label="t('search.panel_aria')"
      :class="['absolute top-full mt-2 w-80 bg-eb-mid border border-eb-border rounded-xl shadow-2xl z-50 overflow-hidden',
               align === 'left' ? 'left-0' : 'right-0']"
    >
      <!-- Input -->
      <div class="p-3 border-b border-eb-border">
        <label for="search-input" class="sr-only">
          {{ t('search.sr_label') }}
        </label>
        <div class="flex items-center gap-2">
          <i class="fa fa-magnifying-glass text-slate-500 shrink-0 text-xs" aria-hidden="true"></i>
          <input
            id="search-input"
            ref="inputRef"
            v-model="query"
            type="search"
            :placeholder="t('search.placeholder')"
            class="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-600 outline-none"
            autocomplete="off"
            role="combobox"
            :aria-expanded="results.length > 0"
            aria-owns="search-results"
            aria-autocomplete="list"
            :aria-activedescendant="focusedIndex >= 0 ? `search-result-${focusedIndex}` : undefined"
            @keydown.arrow-down.prevent="moveFocus(1)"
            @keydown.arrow-up.prevent="moveFocus(-1)"
            @keydown.enter.prevent="selectFocused"
            @keydown.escape="close"
          />
        </div>
      </div>

      <!-- Annonce live pour les lecteurs d'écran -->
      <div role="status" aria-live="polite" aria-atomic="true" class="sr-only">
        {{ liveAnnouncement }}
      </div>

      <!-- Résultats -->
      <ul
        v-if="results.length > 0"
        id="search-results"
        role="listbox"
        :aria-label="t('search.pages')"
        class="py-1 max-h-64 overflow-y-auto"
      >
        <li
          v-for="(result, i) in results"
          :id="`search-result-${i}`"
          :key="result.id"
          role="option"
          :aria-selected="i === focusedIndex"
          class="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors"
          :class="i === focusedIndex
            ? 'bg-eb-cyan/10 text-eb-cyan'
            : 'text-slate-300 hover:bg-eb-card'"
          @click="navigate(result)"
          @mouseenter="focusedIndex = i"
        >
          <i :class="['fa', result.icon, 'text-xs shrink-0']" aria-hidden="true"></i>
          <div class="min-w-0">
            <div class="text-sm font-semibold truncate">{{ result.label }}</div>
            <div class="text-xs text-slate-500 truncate">{{ result.description }}</div>
          </div>
        </li>
      </ul>

      <!-- Aucun résultat -->
      <div
        v-else-if="query.trim().length > 0"
        class="px-4 py-6 text-center text-sm text-slate-500"
        role="status"
      >
        <i class="fa fa-circle-xmark text-xl mb-2 block opacity-40" aria-hidden="true"></i>
        {{ t('search.no_results') }} « {{ query }} »
      </div>

      <!-- Suggestions initiales (panneau vide) -->
      <div v-else class="p-3">
        <p class="text-xs text-slate-600 mb-2 uppercase tracking-wider">{{ t('search.pages') }}</p>
        <ul class="list-none p-0 m-0 space-y-0.5">
          <li v-for="item in allItems" :key="item.id">
            <button
              class="flex items-center gap-2 text-xs text-slate-500 hover:text-eb-cyan transition-colors w-full text-left py-1 px-1 rounded focus-visible:ring-2 focus-visible:ring-eb-cyan outline-none"
              @click="navigate(item)"
            >
              <i :class="['fa', item.icon]" aria-hidden="true"></i>
              {{ item.label }}
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

interface SearchItem {
  id: string
  label: string
  description: string
  icon: string
  path: string
  keywords: string[]
}

const props = withDefaults(defineProps<{ align?: 'left' | 'right' }>(), { align: 'right' })
const { align } = props

const router = useRouter()
const { t } = useI18n()

const isOpen = ref(false)
const query = ref('')
const focusedIndex = ref(-1)
const containerRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const liveAnnouncement = ref('')

const allItems = computed<SearchItem[]>(() => [
  {
    id: 'dashboard',
    label: t('search.items.dashboard.label'),
    description: t('search.items.dashboard.description'),
    icon: 'fa-gauge-high',
    path: '/',
    keywords: ['dashboard', 'indicateurs', 'écologiques', 'sociétaux', 'accueil', 'graphiques', 'indicators', 'ecological'],
  },
  {
    id: 'limits',
    label: t('search.items.limits.label'),
    description: t('search.items.limits.description'),
    icon: 'fa-earth-europe',
    path: '/limites-planetaires',
    keywords: ['limites', 'planétaires', 'rockström', 'seuils', 'biodiversité', 'carbone', 'radar', 'limits', 'boundaries'],
  },
  {
    id: 'mitigationPolicies',
    label: t('search.items.policies.label'),
    description: t('search.items.policies.description'),
    icon: 'fa-vote-yea',
    path: '/mitigation-policies',
    keywords: ['politiques', 'décisions', 'vote', 'propositions', 'consensus', 'blockchain', 'gouvernance', 'policies', 'governance'],
  },
  {
    id: 'correlations',
    label: t('search.items.correlations.label'),
    description: t('search.items.correlations.description'),
    icon: 'fa-diagram-project',
    path: '/correlations',
    keywords: ['corrélations', 'comparaison', 'indicateurs', 'graphique', 'analyse', 'correlations', 'indicators'],
  },
  {
    id: 'simulateur',
    label: t('search.items.simulator.label'),
    description: t('search.items.simulator.description'),
    icon: 'fa-flask',
    path: '/simulateur',
    keywords: ['simulateur', 'politiques', 'climatiques', 'co2', 'température', 'giec', 'ssp', 'simulator', 'climate'],
  },
  {
    id: 'tipping-points',
    label: t('search.items.tipping_points.label'),
    description: t('search.items.tipping_points.description'),
    icon: 'fa-triangle-exclamation',
    path: '/bascules',
    keywords: ['bascules', 'tipping', 'points', 'seuils', 'permafrost', 'banquise', 'amazonie', 'thresholds'],
  },
  {
    id: 'systemic-map',
    label: t('search.items.systemic_map.label'),
    description: t('search.items.systemic_map.description'),
    icon: 'fa-share-nodes',
    path: '/carte-systemique',
    keywords: ['carte', 'systémique', 'graphe', 'causal', 'nœuds', 'interdépendances', 'systemic', 'map', 'graph'],
  },
  {
    id: 'end-game',
    label: t('search.items.end_game.label'),
    description: t('search.items.end_game.description'),
    icon: 'fa-flag-checkered',
    path: '/bilan-2100',
    keywords: ['bilan', '2100', 'fin', 'partie', 'résultats', 'portrait', 'end', 'game', 'results'],
  },
  {
    id: 'rules',
    label: t('search.items.rules.label'),
    description: t('search.items.rules.description'),
    icon: 'fa-circle-question',
    path: '/regles',
    keywords: ['règles', 'jeu', 'mécaniques', 'condorcet', 'tour', 'phases', 'vote', 'discussion', 'rules', 'how', 'play', 'mechanics'],
  },
])

const results = computed<SearchItem[]>(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return []
  return allItems.value.filter(item =>
    item.label.toLowerCase().includes(q) ||
    item.description.toLowerCase().includes(q) ||
    item.keywords.some(k => k.includes(q))
  )
})

watch(results, (newResults) => {
  focusedIndex.value = newResults.length > 0 ? 0 : -1
  if (query.value.trim()) {
    liveAnnouncement.value = newResults.length > 0
      ? t('search.live_found', newResults.length)
      : t('search.live_none')
  }
})

function toggle(): void {
  isOpen.value ? close() : open()
}

function open(): void {
  isOpen.value = true
  nextTick(() => inputRef.value?.focus())
}

function close(): void {
  isOpen.value = false
  query.value = ''
  focusedIndex.value = -1
  liveAnnouncement.value = ''
}

function moveFocus(direction: 1 | -1): void {
  if (results.value.length === 0) return
  const max = results.value.length - 1
  focusedIndex.value = Math.max(0, Math.min(max, focusedIndex.value + direction))
}

function selectFocused(): void {
  const item = results.value[focusedIndex.value]
  if (item) navigate(item)
}

function navigate(item: SearchItem): void {
  router.push(item.path)
  close()
}

function handleClickOutside(event: MouseEvent): void {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    close()
  }
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('mousedown', handleClickOutside))
</script>
