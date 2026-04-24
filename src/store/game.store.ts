import { defineStore } from 'pinia'
import { ref } from 'vue'
import { GAME_CONFIG } from '@/config/game.config'
import { useMitigationPoliciesStore } from './mitigationPolicies.store'
import { useSimulationStore } from './simulation.store'

const YEAR_KEY = 'eb_game_year'

export const useGameStore = defineStore('game', () => {
  const stored = localStorage.getItem(YEAR_KEY)
  const currentYear = ref<number>(stored !== null ? parseInt(stored, 10) : 2024)

  function endRound(): void {
    const policiesStore = useMitigationPoliciesStore()
    const simulationStore = useSimulationStore()

    // 1. Clôturer le scrutin actif et récupérer l'ID du gagnant
    const winnerId = policiesStore.closeActiveBallot()

    // 2. Ajouter le gagnant à la simulation (sera verrouillé comme politique retenue)
    if (winnerId) {
      simulationStore.addMitigationPolicy(winnerId)
    }

    // 3. Créer un nouveau scrutin avec 3 politiques non validées aléatoires
    policiesStore.createNewBallot()

    // 4. Avancer l'année de jeu
    currentYear.value += GAME_CONFIG.grain
    localStorage.setItem(YEAR_KEY, String(currentYear.value))
  }

  return { currentYear, endRound }
})
