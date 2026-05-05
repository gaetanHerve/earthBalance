import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { EcologicalCharts, SocietalIndicators, TickerItem, GlobalStats, TimeSeries } from '@/types/index'
import { DataService } from '@/services/data.service'
import { STORAGE_KEYS } from '@/config/storageKeys'

const DEFAULT_WIDGETS = ['co2', 'temperature', 'forest', 'seaLevel', 'extremes', 'energyMix', 'resources']

function loadVisibleWidgets(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VISIBLE_WIDGETS)
    if (!raw) return DEFAULT_WIDGETS
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : DEFAULT_WIDGETS
  } catch {
    return DEFAULT_WIDGETS
  }
}

export const useDashboardStore = defineStore('dashboard', () => {
  const ecologicalCharts    = ref<EcologicalCharts | null>(null)
  const societalIndicators  = ref<SocietalIndicators | null>(null)
  const tickerItems         = ref<TickerItem[]>([])
  const globalStats         = ref<GlobalStats | null>(null)
  const populationTimeSeries = ref<TimeSeries | null>(null)
  const loading = ref(false)
  const error   = ref<string | null>(null)

  const visibleWidgets = ref<string[]>(loadVisibleWidgets())

  function toggleWidget(widgetId: string): void {
    const idx = visibleWidgets.value.indexOf(widgetId)
    if (idx === -1) {
      visibleWidgets.value.push(widgetId)
    } else {
      visibleWidgets.value.splice(idx, 1)
    }
    localStorage.setItem(STORAGE_KEYS.VISIBLE_WIDGETS, JSON.stringify(visibleWidgets.value))
  }

  async function fetchAll(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const [eco, societal, ticker, stats, population] = await Promise.all([
        DataService.getEcologicalCharts(),
        DataService.getSocietalIndicators(),
        DataService.getTickerItems(),
        DataService.getGlobalStats(),
        DataService.getPopulationTimeSeries(),
      ])
      ecologicalCharts.value    = eco
      societalIndicators.value  = societal
      tickerItems.value         = ticker
      globalStats.value         = stats
      populationTimeSeries.value = population
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erreur inconnue'
    } finally {
      loading.value = false
    }
  }

  return {
    ecologicalCharts, societalIndicators, tickerItems, globalStats, populationTimeSeries,
    loading, error, visibleWidgets,
    fetchAll, toggleWidget,
  }
})
