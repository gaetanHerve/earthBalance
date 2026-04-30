import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { EcologicalCharts, SocietalIndicators, TickerItem, GlobalStats } from '@/types/index'
import { DataService } from '@/services/data.service'

export const useDashboardStore = defineStore('dashboard', () => {
  const ecologicalCharts = ref<EcologicalCharts | null>(null)
  const societalIndicators = ref<SocietalIndicators | null>(null)
  const tickerItems = ref<TickerItem[]>([])
  const globalStats = ref<GlobalStats | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const visibleWidgets = ref<string[]>(
    (JSON.parse(localStorage.getItem('eb_visible_widgets') ?? 'null') as string[] | null) ?? [
      'co2', 'temperature', 'forest', 'seaLevel', 'energyMix', 'resources',
    ]
  )

  function toggleWidget(widgetId: string): void {
    const idx = visibleWidgets.value.indexOf(widgetId)
    if (idx === -1) {
      visibleWidgets.value.push(widgetId)
    } else {
      visibleWidgets.value.splice(idx, 1)
    }
    localStorage.setItem('eb_visible_widgets', JSON.stringify(visibleWidgets.value))
  }

  async function fetchAll(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const [eco, societal, ticker, stats] = await Promise.all([
        DataService.getEcologicalCharts(),
        DataService.getSocietalIndicators(),
        DataService.getTickerItems(),
        DataService.getGlobalStats(),
      ])
      ecologicalCharts.value = eco
      societalIndicators.value = societal
      tickerItems.value = ticker
      globalStats.value = stats
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erreur inconnue'
    } finally {
      loading.value = false
    }
  }

  return {
    ecologicalCharts, societalIndicators, tickerItems, globalStats,
    loading, error, visibleWidgets,
    fetchAll, toggleWidget,
  }
})
