import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Decision, VoteOptionId, VotePcts, BlockchainState, ProspectiveNarrative } from '@/types/index'
import { DataService } from '@/services/data.service'
import { BlockchainService } from '@/services/blockchain.service'
import { LLMService } from '@/services/llm.service'

export const useDecisionsStore = defineStore('decisions', () => {
  const activeDecision = ref<Decision | null>(null)
  const history = ref<Decision[]>([])
  const userVote = ref<VoteOptionId | null>(null)
  const walletAddress = ref<string | null>(null)
  const isValidated = ref(false)
  const prospective = ref<Record<string, ProspectiveNarrative> | null>(null)
  const blockchainState = ref<BlockchainState | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const totalVotes = computed<number>(() => {
    if (!activeDecision.value) return 0
    const v = activeDecision.value.votes
    return v.pour + v.contre + v.abst
  })

  const votePcts = computed<VotePcts>(() => {
    if (!activeDecision.value || totalVotes.value === 0) return { pour: 0, contre: 0, abst: 0 }
    const v = activeDecision.value.votes
    const t = totalVotes.value
    return {
      pour:   Math.round((v.pour   / t) * 100),
      contre: Math.round((v.contre / t) * 100),
      abst:   Math.round((v.abst   / t) * 100),
    }
  })

  const consensusPct = computed<number>(() => votePcts.value.pour)

  const hasReachedConsensus = computed<boolean>(() => {
    if (!activeDecision.value) return false
    return consensusPct.value >= activeDecision.value.consensusThreshold
  })

  async function fetchAll(): Promise<void> {
    loading.value = true
    try {
      const [active, hist, chain] = await Promise.all([
        DataService.getActiveDecision(),
        DataService.getDecisionHistory(),
        DataService.getBlockchainState(),
      ])
      activeDecision.value = active
      history.value = hist
      blockchainState.value = chain
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erreur inconnue'
    } finally {
      loading.value = false
    }
  }

  async function connectWallet(): Promise<void> {
    try {
      walletAddress.value = await BlockchainService.connectWallet()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erreur wallet'
    }
  }

  function castVote(optionId: VoteOptionId): void {
    if (!activeDecision.value) return
    userVote.value = optionId
    activeDecision.value.votes[optionId] += 1
    // TODO: await BlockchainService.castVote(activeDecision.value.id, optionId)
  }

  async function validateDecision(): Promise<void> {
    if (!activeDecision.value) return
    isValidated.value = true
    activeDecision.value.status = 'validated'
    // TODO: await BlockchainService.validateDecision(activeDecision.value.id)
    prospective.value = await LLMService.generateProspective(activeDecision.value, {})
  }

  return {
    activeDecision, history, userVote, walletAddress, isValidated,
    prospective, blockchainState, loading, error,
    totalVotes, votePcts, consensusPct, hasReachedConsensus,
    fetchAll, connectWallet, castVote, validateDecision,
  }
})
