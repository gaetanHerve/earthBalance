import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { MitigationPolicy, DecisionBallot, PairwiseVotes } from '@/types/index'
import { mitigationPolicies as allMitigationPolicies } from '@/data/mitigationPolicies'
import { ballots as ballotData } from '@/data/ballots'
import { condorcetWinner, bordaScores, resolveWinner, rankingToPairwiseDelta } from '@/utils/condorcet'
import { useGameStore } from '@/store/game.store'
import { STORAGE_KEYS } from '@/config/storageKeys'


// ─── Types internes ───────────────────────────────────────────────────────────

export type RankPosition = 0 | 1 | 2  // 0 = 1er choix, 1 = 2e, 2 = 3e
export type RankingState = [string | null, string | null, string | null]

export interface BallotResult {
  hasCycle: boolean
  method: 'condorcet' | 'borda'
  winnerIdx: 0 | 1 | 2
  winnerPolicy: MitigationPolicy
  bordaScores: [number, number, number]
  pairwise: PairwiseVotes
}

// ─── Persistence ──────────────────────────────────────────────────────────────

const STORAGE_KEY          = STORAGE_KEYS.POLICIES_STATE
const PROPOSALS_STORAGE_KEY = STORAGE_KEYS.BALLOT_PROPOSALS

export interface ValidatedPolicyMeta { id: string; year: number }

interface PersistedPoliciesState {
  validatedPolicyMeta: ValidatedPolicyMeta[]
  ballots: DecisionBallot[]
}

function loadPersistedState(): PersistedPoliciesState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    // Rétrocompatibilité : ancien format stockait validatedPolicyIds (string[])
    if (Array.isArray(parsed.validatedPolicyIds) && !parsed.validatedPolicyMeta) {
      return {
        validatedPolicyMeta: (parsed.validatedPolicyIds as string[]).map(id => ({ id, year: 2025 })),
        ballots: parsed.ballots ?? [],
      }
    }
    return parsed as PersistedPoliciesState
  } catch {
    return null
  }
}

function saveState(meta: ValidatedPolicyMeta[], ballots: DecisionBallot[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ validatedPolicyMeta: meta, ballots }))
}

function loadProposals(): string[] {
  try {
    const raw = localStorage.getItem(PROPOSALS_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

function saveProposals(proposals: string[]): void {
  if (proposals.length === 0) {
    localStorage.removeItem(PROPOSALS_STORAGE_KEY)
  } else {
    localStorage.setItem(PROPOSALS_STORAGE_KEY, JSON.stringify(proposals))
  }
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useMitigationPoliciesStore = defineStore('mitigationPolicies', () => {

  const saved = loadPersistedState()

  // Rôle admin : systématiquement true (pas d'identity provider pour le POC)
  const isAdmin = ref(true)

  const validatedPolicyMeta = ref<ValidatedPolicyMeta[]>(saved?.validatedPolicyMeta ?? [])

  // Vue dérivée : IDs seuls (rétrocompatibilité avec les composants existants)
  const validatedPolicyIds = computed<string[]>(() => validatedPolicyMeta.value.map(m => m.id))

  // Scrutins (clonés pour permettre la mutation locale, persistés)
  const ballots = ref<DecisionBallot[]>(
    saved?.ballots
      ? saved.ballots.map(b => ({ ...b, pairwise: { ...b.pairwise } }))
      : ballotData.map(b => ({ ...b, pairwise: { ...b.pairwise } }))
  )

  // Vue unifiée des politiques avec statuts à jour (runtime override)
  const allPoliciesWithRuntimeStatus = computed<MitigationPolicy[]>(() => {
    const validatedSet = new Set(validatedPolicyIds.value)
    return allMitigationPolicies.map(p =>
      validatedSet.has(p.id) ? { ...p, status: 'validated' as const } : p
    )
  })

  // Index des politiques par ID (avec statuts runtime)
  const policyIndex = computed<Record<string, MitigationPolicy>>(() =>
    Object.fromEntries(allPoliciesWithRuntimeStatus.value.map(d => [d.id, d]))
  )

  // Scrutin actif
  const activeBallot = computed<DecisionBallot | null>(() =>
    ballots.value.find(b => b.status === 'active') ?? null
  )

  // Scrutins clôturés (du plus récent au plus ancien)
  const closedBallots = computed<DecisionBallot[]>(() =>
    ballots.value.filter(b => b.status === 'closed').slice().reverse()
  )

  // Politiques candidates du scrutin actif
  const activeCandidates = computed<[MitigationPolicy, MitigationPolicy, MitigationPolicy] | null>(() => {
    if (!activeBallot.value) return null
    const [a, b, c] = activeBallot.value.decisionIds
    const da = policyIndex.value[a]
    const db = policyIndex.value[b]
    const dc = policyIndex.value[c]
    if (!da || !db || !dc) return null
    return [da, db, dc]
  })

  // Propositions de scrutin (max 3, persistées)
  const ballotProposals = ref<string[]>(loadProposals())

  function proposePolicy(id: string): void {
    if (ballotProposals.value.includes(id)) return
    if (ballotProposals.value.length >= 3) return
    ballotProposals.value = [...ballotProposals.value, id]
    saveProposals(ballotProposals.value)
  }

  function removeProposal(id: string): void {
    ballotProposals.value = ballotProposals.value.filter(p => p !== id)
    saveProposals(ballotProposals.value)
  }

  function clearProposals(): void {
    ballotProposals.value = []
    saveProposals([])
  }

  // Classement en cours de l'utilisateur
  const ranking = ref<RankingState>([null, null, null])
  const hasVoted = ref(false)

  const isRankingComplete = computed<boolean>(() =>
    ranking.value.every(v => v !== null)
  )

  function getRankOf(decisionId: string): RankPosition | null {
    const idx = ranking.value.indexOf(decisionId)
    return idx === -1 ? null : idx as RankPosition
  }

  function setRank(decisionId: string, position: RankPosition): void {
    const r: RankingState = [...ranking.value]
    for (let i = 0; i < 3; i++) if (r[i] === decisionId) r[i] = null
    const displaced = r[position]
    if (displaced !== null) {
      const freeSlot = r.findIndex((v, i) => v === null && i !== position)
      if (freeSlot !== -1) r[freeSlot] = displaced
      else r[position] = null
    }
    r[position] = decisionId
    ranking.value = r
  }

  function submitRanking(): void {
    if (!activeBallot.value || !isRankingComplete.value || hasVoted.value) return

    const ballot = activeBallot.value
    const userRanking = ranking.value as [string, string, string]
    const delta = rankingToPairwiseDelta(userRanking, ballot.decisionIds)

    ballot.pairwise.ab += delta.ab
    ballot.pairwise.ba += delta.ba
    ballot.pairwise.ac += delta.ac
    ballot.pairwise.ca += delta.ca
    ballot.pairwise.bc += delta.bc
    ballot.pairwise.cb += delta.cb
    ballot.totalVoters++

    hasVoted.value = true
    saveState(validatedPolicyMeta.value, ballots.value)
  }

  function getBallotResult(ballot: DecisionBallot): BallotResult | null {
    if (ballot.totalVoters === 0) return null

    const hasCycle   = condorcetWinner(ballot.pairwise) === null
    const { winner: winnerIdx, method } = resolveWinner(ballot.pairwise)
    const winnerPolicy = policyIndex.value[ballot.decisionIds[winnerIdx]]
    if (!winnerPolicy) return null

    return {
      hasCycle,
      method,
      winnerIdx,
      winnerPolicy,
      bordaScores: bordaScores(ballot.pairwise),
      pairwise: ballot.pairwise,
    }
  }

  // Clôture le scrutin actif, valide le gagnant et retourne son ID (null si aucun vote)
  // gameYear : année courante du jeu au moment du vote — enregistrée comme année d'adoption
  function closeActiveBallot(gameYear: number): string | null {
    const ballot = activeBallot.value
    if (!ballot) return null

    const result = getBallotResult(ballot)
    ballot.status = 'closed'

    let winnerId: string | null = null
    if (result) {
      winnerId = result.winnerPolicy.id
      if (!validatedPolicyIds.value.includes(winnerId)) {
        validatedPolicyMeta.value = [...validatedPolicyMeta.value, { id: winnerId, year: gameYear }]
      }
    }

    saveState(validatedPolicyMeta.value, ballots.value)
    return winnerId
  }

  // Crée un nouveau scrutin avec 3 politiques non validées choisies aléatoirement
  // gameYear : année courante du jeu — la deadline est fixée au 31 décembre de cette année
  function createNewBallot(gameYear: number): void {
    const validatedSet = new Set(validatedPolicyIds.value)
    const nonValidated = allMitigationPolicies.filter(p => !validatedSet.has(p.id))

    if (nonValidated.length < 3) return

    const shuffled = [...nonValidated].sort(() => Math.random() - 0.5)
    const [a, b, c] = shuffled.slice(0, 3)

    const nextNum = String(ballots.value.length + 1).padStart(2, '0')

    const gameStore = useGameStore()
    const newBallot: DecisionBallot = {
      id: `ballot-${gameStore.sessionNumber}-${nextNum}`,
      sessionId: gameStore.sessionNumber,
      decisionIds: [a.id, b.id, c.id],
      pairwise: { ab: 0, ba: 0, ac: 0, ca: 0, bc: 0, cb: 0 },
      totalVoters: 0,
      deadline: `${gameYear}-12-31T23:59:59Z`,
      status: 'active',
    }

    ballots.value = [...ballots.value, newBallot]

    // Réinitialiser l'état de vote de l'utilisateur
    ranking.value = [null, null, null]
    hasVoted.value = false

    saveState(validatedPolicyMeta.value, ballots.value)
  }

  // Crée un scrutin depuis les propositions (Option C) ou par fallback aléatoire (Option B)
  function createBallotFromProposals(gameYear: number): void {
    const validatedSet = new Set(validatedPolicyIds.value)
    let candidates: [string, string, string]

    if (ballotProposals.value.length === 3) {
      candidates = ballotProposals.value as [string, string, string]
    } else {
      const nonValidated = allMitigationPolicies.filter(p => !validatedSet.has(p.id))
      if (nonValidated.length < 3) return
      const shuffled = [...nonValidated].sort(() => Math.random() - 0.5)
      candidates = [shuffled[0].id, shuffled[1].id, shuffled[2].id]
    }

    const nextNum = String(ballots.value.length + 1).padStart(2, '0')
    const gameStore = useGameStore()
    const newBallot: DecisionBallot = {
      id: `ballot-${gameStore.sessionNumber}-${nextNum}`,
      sessionId: gameStore.sessionNumber,
      decisionIds: candidates,
      pairwise: { ab: 0, ba: 0, ac: 0, ca: 0, bc: 0, cb: 0 },
      totalVoters: 0,
      deadline: `${gameYear}-12-31T23:59:59Z`,
      status: 'active',
    }

    ballots.value = [...ballots.value, newBallot]
    ranking.value = [null, null, null]
    hasVoted.value = false
    saveState(validatedPolicyMeta.value, ballots.value)
  }

  function getMitigationPolicy(id: string): MitigationPolicy | undefined {
    return policyIndex.value[id]
  }

  function resetAll(): void {
    validatedPolicyMeta.value = []
    ballots.value = ballotData.map(b => ({ ...b, pairwise: { ...b.pairwise } }))
    ranking.value = [null, null, null]
    hasVoted.value = false
    clearProposals()
  }

  return {
    isAdmin,
    ballots,
    validatedPolicyMeta,
    validatedPolicyIds,
    activeBallot,
    closedBallots,
    activeCandidates,
    ballotProposals,
    ranking,
    hasVoted,
    isRankingComplete,
    getRankOf,
    setRank,
    submitRanking,
    getBallotResult,
    getMitigationPolicy,
    closeActiveBallot,
    createNewBallot,
    createBallotFromProposals,
    proposePolicy,
    removeProposal,
    clearProposals,
    resetAll,
  }
})
