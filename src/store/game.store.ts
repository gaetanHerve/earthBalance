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
  const currentYear   = ref<number>(Number.isFinite(parsedYear) && parsedYear >= 2025 ? parsedYear : 2025)
  const sessionNumber = ref<number>(1)
  const gameOver      = ref<boolean>(currentYear.value >= 2100)
  const introVisible  = ref<boolean>(!localStorage.getItem(STORAGE_KEYS.INTRO_SEEN))
  const rulesVisible  = ref<boolean>(false)
  const phase         = ref<TurnPhase>(loadPhase())

  function savePhase(): void {
    localStorage.setItem(STORAGE_KEYS.GAME_PHASE, phase.value)
  }

  // discussion → vote : crée le bulletin depuis les propositions si aucun scrutin actif
  function startVote(): void {
    const policiesStore = useMitigationPoliciesStore()
    if (!policiesStore.activeBallot) {
      policiesStore.createBallotFromProposals(currentYear.value)
    }
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

  // results → discussion : avance l'année, efface les propositions
  function endRound(): void {
    const policiesStore = useMitigationPoliciesStore()

    currentYear.value += GAME_CONFIG.grain
    localStorage.setItem(STORAGE_KEYS.GAME_YEAR, String(currentYear.value))

    policiesStore.clearProposals()

    if (currentYear.value >= 2100) {
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
    localStorage.removeItem(STORAGE_KEYS.BALLOT_PROPOSALS)
    currentYear.value  = 2025
    sessionNumber.value = 1
    gameOver.value     = false
    introVisible.value = true
    rulesVisible.value = false
    phase.value        = 'discussion'
    useMitigationPoliciesStore().resetAll()
    useSimulationStore().resetAll()
    useTippingPointsStore().resetAll()
  }

  return { currentYear, sessionNumber, gameOver, introVisible, rulesVisible, phase, startVote, closeVote, endRound, resetGame }
})
