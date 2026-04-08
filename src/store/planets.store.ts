import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { PlanetaryLimit, RadarData, LimitStatus } from '@/types/index'
import { DataService } from '@/services/data.service'

export const usePlanetsStore = defineStore('planets', () => {
  const limits = ref<PlanetaryLimit[]>([])
  const radarData = ref<RadarData | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const selectedHorizon = ref<number>(0)

  const limitById = computed(() => (id: string) => limits.value.find((l) => l.id === id))

  const limitsByStatus = computed<Record<LimitStatus, PlanetaryLimit[]>>(() => ({
    depasse:          limits.value.filter((l) => l.status === 'depasse'),
    zone_incertitude: limits.value.filter((l) => l.status === 'zone_incertitude'),
    safe:             limits.value.filter((l) => l.status === 'safe'),
  }))

  async function fetchAll(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const [limitsData, radar] = await Promise.all([
        DataService.getPlanetaryLimits(),
        DataService.getRadarData(),
      ])
      limits.value = limitsData
      radarData.value = radar
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erreur inconnue'
    } finally {
      loading.value = false
    }
  }

  function setHorizon(years: number): void {
    selectedHorizon.value = years
  }

  return { limits, radarData, loading, error, selectedHorizon, limitById, limitsByStatus, fetchAll, setHorizon }
})
