import { defineStore } from 'pinia'
import { ref } from 'vue'
import { GAME_CONFIG } from '@/config/game.config'
import { STORAGE_KEYS } from '@/config/storageKeys'
import { useMitigationPoliciesStore } from './mitigationPolicies.store'
import { useSimulationStore } from './simulation.store'
import { useTippingPointsStore } from './tippingPoints.store'

export type TurnPhase = 'discussion' | 'vote' | 'results'

function loadPhase(): TurnPhase {
  const stored = localStorage.getItem(STORAGE_KEYS.GAME_PHASE)
  if (stored === 'discussion' || stored === 'vote' || stored === 'results') return stored
  return 'discussion'
}

export const useGameStore = defineStore('game', () => {
  const stored = localStorage.getItem(STORAGE_KEYS.GAME_YEAR)
  const parsedYear = stored === null ? Number.NaN : Number.parseInt(stored, 10)
  const currentYear   = ref<number>(Number.isFinite(parsedYear) && parsedYear >= 2024 ? parsedYear : 2024)
  const sessionNumber = ref<number>(1)
  const gameOver      = ref<boolean>(currentYear.value >= 2100)
  const introVisible  = ref<boolean>(!localStorage.getItem(STORAGE_KEYS.INTRO_SEEN))
  const phase         = ref<TurnPhase>(loadPhase())

  function savePhase(): void {
    localStorage.setItem(STORAGE_KEYS.GAME_PHASE, phase.value)
  }

  // discussion → vote
  function startVote(): void {
    phase.value = 'vote'
    savePhase()
  }

  // vote → results : clôture le scrutin, ajoute le gagnant, vérifie les bascules
  function closeVote(): void {
    const policiesStore  = useMitigationPoliciesStore()
    const simulationStore = useSimulationStore()

    const winnerId = policiesStore.closeActiveBallot(currentYear.value)
    if (winnerId) simulationStore.addMitigationPolicy(winnerId)

    useTippingPointsStore().checkAndTrigger(currentYear.value)

    phase.value = 'results'
    savePhase()
  }

  // results → discussion : avance l'année, crée un nouveau scrutin
  function endRound(): void {
    const policiesStore = useMitigationPoliciesStore()

    currentYear.value += GAME_CONFIG.grain
    localStorage.setItem(STORAGE_KEYS.GAME_YEAR, String(currentYear.value))

    policiesStore.createNewBallot(currentYear.value)

    if (currentYear.value >= 2100 || !policiesStore.activeBallot) {
      gameOver.value = true
    }

    phase.value = 'discussion'
    savePhase()
  }

  function resetGame(): void {
    localStorage.removeItem(STORAGE_KEYS.GAME_YEAR)
    localStorage.removeItem(STORAGE_KEYS.POLICIES_STATE)
    localStorage.removeItem(STORAGE_KEYS.SIMULATION_SELECTED)
    localStorage.removeItem(STORAGE_KEYS.SIMULATION_BASELINE)
    localStorage.removeItem(STORAGE_KEYS.INTRO_SEEN)
    localStorage.removeItem(STORAGE_KEYS.GAME_PHASE)
    currentYear.value  = 2024
    sessionNumber.value = 1
    gameOver.value     = false
    introVisible.value = true
    phase.value        = 'discussion'
    useMitigationPoliciesStore().resetAll()
    useSimulationStore().resetAll()
    useTippingPointsStore().resetAll()
  }

  return { currentYear, sessionNumber, gameOver, introVisible, phase, startVote, closeVote, endRound, resetGame }
})
