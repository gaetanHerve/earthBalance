import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { TIPPING_POINTS } from '@/data/tippingPoints'
import { STORAGE_KEYS } from '@/config/storageKeys'
import { SIM_LABELS } from '@/config/simulation.config'
import { useSimulationStore } from '@/store/simulation.store'
import { interpolateAtYear } from '@/utils/timeSeries'

type TriggerRecord = Record<string, { year: number }>
type OffsetKey = 'deltaTemp' | 'deltaCo2Ppm' | 'deltaForest' | 'deltaBiodiversityRatio' | 'deltaAcidificationRatio' | 'deltaWaterRatio' | 'deltaExtremes'

function resolveVariable(variable: string, currentYear: number, simStore: ReturnType<typeof useSimulationStore>): number {
  if (variable === 'forest') return interpolateAtYear(currentYear, SIM_LABELS, simStore.cumulativeForest)
  return interpolateAtYear(currentYear, SIM_LABELS, simStore.cumulativeTemp)
}

const ZERO_SERIES = Object.freeze(SIM_LABELS.map(() => 0))

export const useTippingPointsStore = defineStore('tippingPoints', () => {

  // ── État persisté ──────────────────────────────────────────────────────────

  function loadTriggered(): TriggerRecord {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.TIPPING_STATE)
      return raw ? (JSON.parse(raw) as TriggerRecord) : {}
    } catch {
      return {}
    }
  }

  const triggered       = ref<TriggerRecord>(loadTriggered())
  const pendingModalIds = ref<string[]>([])
  const enabled         = ref<boolean>(false)

  watch(triggered, val => {
    localStorage.setItem(STORAGE_KEYS.TIPPING_STATE, JSON.stringify(val))
  }, { deep: true })

  // ── Offsets injectés dans simulation.store ──────────────────────────────────

  function sumAtYear(year: number, key: OffsetKey): number {
    return Object.entries(triggered.value).reduce((sum, [id, { year: trigYear }]) => {
      if (year < trigYear) return sum
      const tp = TIPPING_POINTS.find(t => t.id === id)
      return sum + (tp?.[key] ?? 0)
    }, 0)
  }

  function buildOffset(key: OffsetKey): number[] {
    if (!enabled.value) return ZERO_SERIES as number[]
    return SIM_LABELS.map(year => sumAtYear(year, key))
  }

  const tempOffset                = computed<number[]>(() => buildOffset('deltaTemp'))
  const co2PpmOffset              = computed<number[]>(() => buildOffset('deltaCo2Ppm'))
  const forestOffset              = computed<number[]>(() => buildOffset('deltaForest'))
  const biodiversityRatioOffset   = computed<number[]>(() => buildOffset('deltaBiodiversityRatio'))
  const acidificationRatioOffset  = computed<number[]>(() => buildOffset('deltaAcidificationRatio'))
  const waterRatioOffset          = computed<number[]>(() => buildOffset('deltaWaterRatio'))
  const extremesOffset            = computed<number[]>(() => buildOffset('deltaExtremes'))

  // ── Déclenchement + cascade ─────────────────────────────────────────────────

  function checkAndTrigger(currentYear: number): string[] {
    if (!enabled.value) return []

    // useSimulationStore() appelé ici (lazy) — pattern Pinia pour dépendances circulaires.
    const simStore = useSimulationStore()

    const newlyTriggered: string[] = []
    let changed = true

    while (changed) {
      changed = false
      for (const tp of TIPPING_POINTS) {
        if (triggered.value[tp.id]) continue
        const value = resolveVariable(tp.trigger.variable, currentYear, simStore)
        const thresholdCrossed = tp.trigger.comparison === '>' ? value > tp.trigger.threshold : value < tp.trigger.threshold
        if (!thresholdCrossed) continue

        if (tp.probabilistic && tp.collapseProb) {
          // Déclenchement probabiliste : évaluer la probabilité à la température courante
          const currentTemp = resolveVariable('temp', currentYear, simStore)
          const prob = tp.collapseProb(currentTemp)
          if (Math.random() >= prob) continue
        }

        triggered.value = { ...triggered.value, [tp.id]: { year: currentYear } }
        newlyTriggered.push(tp.id)
        pendingModalIds.value = [...pendingModalIds.value, tp.id]
        changed = true
        break
      }
    }

    return newlyTriggered
  }

  // ── Getters ────────────────────────────────────────────────────────────────

  const triggeredList = computed(() =>
    TIPPING_POINTS
      .filter(tp => !!triggered.value[tp.id])
      .map(tp => ({ ...tp, year: triggered.value[tp.id].year }))
      .sort((a, b) => a.year - b.year),
  )

  const hasAny = computed(() => triggeredList.value.length > 0)

  // ── Modale ─────────────────────────────────────────────────────────────────

  function dismissModal(): void {
    pendingModalIds.value = pendingModalIds.value.slice(1)
  }

  // ── Reset ──────────────────────────────────────────────────────────────────

  function resetAll(): void {
    triggered.value       = {}
    pendingModalIds.value = []
  }

  function toggleEnabled(): void {
    enabled.value = !enabled.value
  }

  return {
    triggered,
    pendingModalIds,
    enabled,
    tempOffset,
    co2PpmOffset,
    forestOffset,
    biodiversityRatioOffset,
    acidificationRatioOffset,
    waterRatioOffset,
    extremesOffset,
    triggeredList,
    hasAny,
    checkAndTrigger,
    dismissModal,
    resetAll,
    toggleEnabled,
  }
})
