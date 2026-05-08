import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSimulationStore } from '@/store/simulation.store'
import { useMitigationPoliciesStore } from '@/store/mitigationPolicies.store'
import { useGameStore } from '@/store/game.store'
import { mitigationPolicies } from '@/data/mitigationPolicies'
import { interpolateAtYear } from '@/utils/timeSeries'
import { SIM_LABELS } from '@/config/simulation.config'
import type { MitigationPolicy } from '@/types/index'

export interface PrerequisiteResult {
  met:     boolean
  reasons: string[]   // i18n-formatted strings explaining unmet prerequisites
}

export function usePrerequisites() {
  const { t } = useI18n()
  const simStore     = useSimulationStore()
  const policiesStore = useMitigationPoliciesStore()
  const gameStore    = useGameStore()

  // Valeurs absolues courantes interpolées à l'année de jeu
  const currentTemp = computed<number>(() =>
    interpolateAtYear(gameStore.currentYear, SIM_LABELS, simStore.cumulativeTemp)
  )

  const currentForest = computed<number>(() =>
    interpolateAtYear(gameStore.currentYear, SIM_LABELS, simStore.cumulativeForest)
  )

  const policyById = new Map<string, MitigationPolicy>(
    mitigationPolicies.map(p => [p.id, p])
  )

  function check(policyId: string): PrerequisiteResult {
    const policy = policyById.get(policyId)
    if (!policy?.prerequisites) return { met: true, reasons: [] }

    const { policiesRequired, policiesExcluded, indicators } = policy.prerequisites
    const metIds = new Set([
      ...policiesStore.validatedPolicyIds,
      ...simStore.selectedIds,
    ])
    const reasons: string[] = []

    // Politiques requises
    for (const reqId of policiesRequired ?? []) {
      if (!metIds.has(reqId)) {
        const reqPolicy = policyById.get(reqId)
        reasons.push(t('prerequisites.policy_required', {
          title: reqPolicy?.title ?? reqId,
        }))
      }
    }

    // Politiques incompatibles
    for (const exclId of policiesExcluded ?? []) {
      if (metIds.has(exclId)) {
        const exclPolicy = policyById.get(exclId)
        reasons.push(t('prerequisites.policy_excluded', {
          title: exclPolicy?.title ?? exclId,
        }))
      }
    }

    // Indicateurs
    for (const ind of indicators ?? []) {
      if (ind.key === 'temp') {
        const val = currentTemp.value
        if (ind.max !== undefined && val > ind.max) {
          reasons.push(t('prerequisites.temp_max', {
            max: ind.max.toFixed(1),
            current: val.toFixed(2),
          }))
        }
        if (ind.min !== undefined && val < ind.min) {
          reasons.push(t('prerequisites.temp_min', {
            min: ind.min.toFixed(1),
            current: val.toFixed(2),
          }))
        }
      }

      if (ind.key === 'forest') {
        const val = currentForest.value
        if (ind.min !== undefined && val < ind.min) {
          reasons.push(t('prerequisites.forest_min', {
            min: ind.min.toFixed(1),
            current: val.toFixed(1),
          }))
        }
        if (ind.max !== undefined && val > ind.max) {
          reasons.push(t('prerequisites.forest_max', {
            max: ind.max.toFixed(1),
            current: val.toFixed(1),
          }))
        }
      }
    }

    return { met: reasons.length === 0, reasons }
  }

  return { check, currentTemp, currentForest }
}
