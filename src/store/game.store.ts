import { defineStore } from 'pinia'
import { ref } from 'vue'
import { GAME_CONFIG } from '@/config/game.config'
import { STORAGE_KEYS } from '@/config/storageKeys'
import { useMitigationPoliciesStore } from './mitigationPolicies.store'
import { useSimulationStore } from './simulation.store'

export const useGameStore = defineStore('game', () => {
  const stored = localStorage.getItem(STORAGE_KEYS.GAME_YEAR)
  const parsedYear = stored !== null ? parseInt(stored, 10) : NaN
  const currentYear    = ref<number>(Number.isFinite(parsedYear) && parsedYear >= 2024 ? parsedYear : 2024)
  const sessionNumber  = ref<number>(1)

  function resetGame(): void {
    localStorage.removeItem(STORAGE_KEYS.GAME_YEAR)
    localStorage.removeItem(STORAGE_KEYS.POLICIES_STATE)
    localStorage.removeItem(STORAGE_KEYS.SIMULATION_SELECTED)
    localStorage.removeItem(STORAGE_KEYS.SIMULATION_BASELINE)
    window.location.reload()
  }

  function endRound(): void {
    const policiesStore = useMitigationPoliciesStore()
    const simulationStore = useSimulationStore()

    // 1. Clôturer le scrutin actif et récupérer l'ID du gagnant
    const winnerId = policiesStore.closeActiveBallot(currentYear.value)

    // 2. Ajouter le gagnant à la simulation (sera verrouillé comme politique retenue)
    if (winnerId) {
      simulationStore.addMitigationPolicy(winnerId)
    }

    // 3. Avancer l'année de jeu
    currentYear.value += GAME_CONFIG.grain
    localStorage.setItem(STORAGE_KEYS.GAME_YEAR, String(currentYear.value))

    // 4. Créer un nouveau scrutin — deadline au 31 déc. de la nouvelle année courante
    policiesStore.createNewBallot(currentYear.value)
  }

  return { currentYear, sessionNumber, endRound, resetGame }
})
