import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useMitigationPoliciesStore } from '@/store/mitigationPolicies.store'
import { mitigationPolicies } from '@/data/mitigationPolicies'

// IDs of the 3 candidates in the initial active ballot (ballot-42-01)
const INITIAL_BALLOT_IDS = ['dec-07', 'dec-08', 'dec-13'] as const

// Three policy IDs not in the initial ballot for proposal tests
const [FREE_A, FREE_B, FREE_C] = mitigationPolicies
  .filter(p => !INITIAL_BALLOT_IDS.includes(p.id as typeof INITIAL_BALLOT_IDS[number]))
  .map(p => p.id)

describe('mitigationPolicies.store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  // ─── Proposals ────────────────────────────────────────────────────────────────

  describe('proposePolicy', () => {
    it('adds a policy to proposals', () => {
      const store = useMitigationPoliciesStore()
      store.proposePolicy(FREE_A)
      expect(store.ballotProposals).toContain(FREE_A)
    })

    it('ignores duplicate proposals', () => {
      const store = useMitigationPoliciesStore()
      store.proposePolicy(FREE_A)
      store.proposePolicy(FREE_A)
      expect(store.ballotProposals).toHaveLength(1)
    })

    it('caps proposals at 3', () => {
      const store = useMitigationPoliciesStore()
      const extra = mitigationPolicies.find(p => p.id !== FREE_A && p.id !== FREE_B && p.id !== FREE_C)!.id
      store.proposePolicy(FREE_A)
      store.proposePolicy(FREE_B)
      store.proposePolicy(FREE_C)
      store.proposePolicy(extra)
      expect(store.ballotProposals).toHaveLength(3)
      expect(store.ballotProposals).not.toContain(extra)
    })
  })

  describe('removeProposal', () => {
    it('removes an existing proposal', () => {
      const store = useMitigationPoliciesStore()
      store.proposePolicy(FREE_A)
      store.proposePolicy(FREE_B)
      store.removeProposal(FREE_A)
      expect(store.ballotProposals).not.toContain(FREE_A)
      expect(store.ballotProposals).toContain(FREE_B)
    })

    it('is a no-op for a non-existent proposal', () => {
      const store = useMitigationPoliciesStore()
      store.proposePolicy(FREE_A)
      store.removeProposal(FREE_B)
      expect(store.ballotProposals).toHaveLength(1)
    })
  })

  describe('clearProposals', () => {
    it('empties the proposal list', () => {
      const store = useMitigationPoliciesStore()
      store.proposePolicy(FREE_A)
      store.proposePolicy(FREE_B)
      store.clearProposals()
      expect(store.ballotProposals).toHaveLength(0)
    })
  })

  // ─── Ranking ──────────────────────────────────────────────────────────────────

  describe('setRank / isRankingComplete', () => {
    it('assigns a policy to a rank position', () => {
      const store = useMitigationPoliciesStore()
      store.setRank('dec-07', 0)
      expect(store.ranking[0]).toBe('dec-07')
    })

    it('clears the old position when a policy is moved', () => {
      const store = useMitigationPoliciesStore()
      store.setRank('dec-07', 0)
      store.setRank('dec-07', 2)
      expect(store.ranking[0]).toBeNull()
      expect(store.ranking[2]).toBe('dec-07')
    })

    it('displaces the incumbent to the newly freed slot', () => {
      const store = useMitigationPoliciesStore()
      store.setRank('dec-07', 0)
      store.setRank('dec-08', 1)
      store.setRank('dec-13', 2)
      // Moving dec-08 to pos 0 displaces dec-07 to pos 1 (the freed slot)
      store.setRank('dec-08', 0)
      expect(store.ranking).toEqual(['dec-08', 'dec-07', 'dec-13'])
    })

    it('is false when ranking is incomplete', () => {
      const store = useMitigationPoliciesStore()
      expect(store.isRankingComplete).toBe(false)
      store.setRank('dec-07', 0)
      expect(store.isRankingComplete).toBe(false)
    })

    it('is true when all 3 positions are filled', () => {
      const store = useMitigationPoliciesStore()
      store.setRank('dec-07', 0)
      store.setRank('dec-08', 1)
      store.setRank('dec-13', 2)
      expect(store.isRankingComplete).toBe(true)
    })
  })

  // ─── Voting ───────────────────────────────────────────────────────────────────

  describe('submitRanking', () => {
    it('increments totalVoters and sets hasVoted', () => {
      const store = useMitigationPoliciesStore()
      const ballot = store.activeBallot!
      store.setRank(ballot.decisionIds[0], 0)
      store.setRank(ballot.decisionIds[1], 1)
      store.setRank(ballot.decisionIds[2], 2)
      expect(ballot.totalVoters).toBe(0)
      store.submitRanking()
      expect(ballot.totalVoters).toBe(1)
      expect(store.hasVoted).toBe(true)
    })

    it('updates pairwise counts according to ranking order', () => {
      const store = useMitigationPoliciesStore()
      const ballot = store.activeBallot!
      // Rank: A (0) > B (1) > C (2) in ballot order
      store.setRank(ballot.decisionIds[0], 0)
      store.setRank(ballot.decisionIds[1], 1)
      store.setRank(ballot.decisionIds[2], 2)
      store.submitRanking()
      // A ranked above B and C, B ranked above C
      expect(ballot.pairwise.ab).toBe(1)
      expect(ballot.pairwise.ba).toBe(0)
      expect(ballot.pairwise.ac).toBe(1)
      expect(ballot.pairwise.ca).toBe(0)
      expect(ballot.pairwise.bc).toBe(1)
      expect(ballot.pairwise.cb).toBe(0)
    })

    it('does not allow voting twice', () => {
      const store = useMitigationPoliciesStore()
      const ballot = store.activeBallot!
      store.setRank(ballot.decisionIds[0], 0)
      store.setRank(ballot.decisionIds[1], 1)
      store.setRank(ballot.decisionIds[2], 2)
      store.submitRanking()
      store.submitRanking()
      expect(ballot.totalVoters).toBe(1)
    })
  })

  // ─── Ballot result ────────────────────────────────────────────────────────────

  describe('getBallotResult', () => {
    it('returns null when ballot has no votes', () => {
      const store = useMitigationPoliciesStore()
      const ballot = store.activeBallot!
      expect(store.getBallotResult(ballot)).toBeNull()
    })

    it('identifies the condorcet winner correctly', () => {
      const store = useMitigationPoliciesStore()
      const ballot = store.activeBallot!
      // Vote: A > B > C → A is Condorcet winner
      store.setRank(ballot.decisionIds[0], 0)
      store.setRank(ballot.decisionIds[1], 1)
      store.setRank(ballot.decisionIds[2], 2)
      store.submitRanking()
      const result = store.getBallotResult(ballot)
      expect(result).not.toBeNull()
      expect(result!.winnerIdx).toBe(0)
      expect(result!.method).toBe('condorcet')
      expect(result!.hasCycle).toBe(false)
      expect(result!.winnerPolicy.id).toBe(ballot.decisionIds[0])
    })
  })

  // ─── createBallotFromProposals ────────────────────────────────────────────────

  describe('createBallotFromProposals', () => {
    it('creates a ballot from 3 proposals with the proposed IDs', () => {
      const store = useMitigationPoliciesStore()
      store.proposePolicy(FREE_A)
      store.proposePolicy(FREE_B)
      store.proposePolicy(FREE_C)
      const countBefore = store.ballots.length
      store.createBallotFromProposals(2026)
      expect(store.ballots).toHaveLength(countBefore + 1)
      const created = store.ballots[store.ballots.length - 1]
      expect(created.status).toBe('active')
      expect(created.decisionIds).toEqual([FREE_A, FREE_B, FREE_C])
      expect(created.deadline).toBe('2026-12-31T23:59:59Z')
    })

    it('falls back to random selection when fewer than 3 proposals', () => {
      const store = useMitigationPoliciesStore()
      store.proposePolicy(FREE_A)  // only 1 proposal → fallback
      const countBefore = store.ballots.length
      store.createBallotFromProposals(2026)
      expect(store.ballots).toHaveLength(countBefore + 1)
      const created = store.ballots[store.ballots.length - 1]
      expect(created.decisionIds).toHaveLength(3)
    })

    it('resets ranking and hasVoted after ballot creation', () => {
      const store = useMitigationPoliciesStore()
      const ballot = store.activeBallot!
      store.setRank(ballot.decisionIds[0], 0)
      store.setRank(ballot.decisionIds[1], 1)
      store.setRank(ballot.decisionIds[2], 2)
      store.submitRanking()
      store.proposePolicy(FREE_A)
      store.proposePolicy(FREE_B)
      store.proposePolicy(FREE_C)
      store.createBallotFromProposals(2026)
      expect(store.ranking).toEqual([null, null, null])
      expect(store.hasVoted).toBe(false)
    })
  })
})
