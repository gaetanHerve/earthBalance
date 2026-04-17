import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Decision, DecisionBallot, PairwiseVotes } from '@/types/index'
import { decisions as allDecisions } from '@/data/decisions'
import { ballots as ballotData } from '@/data/ballots'
import { condorcetWinner, bordaScores, resolveWinner, rankingToPairwiseDelta } from '@/utils/condorcet'

// ─── Types internes ───────────────────────────────────────────────────────────

export type RankPosition = 0 | 1 | 2  // 0 = 1er choix, 1 = 2e, 2 = 3e
export type RankingState = [string | null, string | null, string | null]

export interface BallotResult {
  hasCycle: boolean
  method: 'condorcet' | 'borda'
  winnerIdx: 0 | 1 | 2
  winnerDecision: Decision
  bordaScores: [number, number, number]
  pairwise: PairwiseVotes
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useDecisionsStore = defineStore('decisions', () => {

  // Index des décisions par ID
  const decisionIndex = Object.fromEntries(allDecisions.map(d => [d.id, d]))

  // Scrutins (état réactif — clonés pour permettre la mutation locale)
  const ballots = ref<DecisionBallot[]>(ballotData.map(b => ({
    ...b,
    pairwise: { ...b.pairwise },
  })))

  // Scrutin actif
  const activeBallot = computed<DecisionBallot | null>(() =>
    ballots.value.find(b => b.status === 'active') ?? null
  )

  // Scrutins clôturés (du plus récent au plus ancien)
  const closedBallots = computed<DecisionBallot[]>(() =>
    ballots.value.filter(b => b.status === 'closed').slice().reverse()
  )

  // Décisions candidates du scrutin actif
  const activeCandidates = computed<[Decision, Decision, Decision] | null>(() => {
    if (!activeBallot.value) return null
    const [a, b, c] = activeBallot.value.decisionIds
    const da = decisionIndex[a]
    const db = decisionIndex[b]
    const dc = decisionIndex[c]
    if (!da || !db || !dc) return null
    return [da, db, dc]
  })

  // Classement en cours de l'utilisateur
  // ranking[0] = ID de la décision placée en 1er choix, etc.  (null = position vide)
  const ranking = ref<RankingState>([null, null, null])
  const hasVoted = ref(false)

  const isRankingComplete = computed<boolean>(() =>
    ranking.value.every(v => v !== null)
  )

  // Position attribuée à une décision dans le classement courant (null = non classée)
  function getRankOf(decisionId: string): RankPosition | null {
    const idx = ranking.value.indexOf(decisionId)
    return idx === -1 ? null : idx as RankPosition
  }

  // Attribue (ou déplace) une décision à une position donnée
  function setRank(decisionId: string, position: RankPosition): void {
    const r: RankingState = [...ranking.value]
    // Retirer ce candidat de toute position précédente
    for (let i = 0; i < 3; i++) if (r[i] === decisionId) r[i] = null
    // Déplacer l'éventuel occupant de la cible
    const displaced = r[position]
    if (displaced !== null) {
      const freeSlot = r.findIndex((v, i) => v === null && i !== position)
      if (freeSlot !== -1) r[freeSlot] = displaced
      else r[position] = null  // plus de place : on efface simplement
    }
    r[position] = decisionId
    ranking.value = r
  }

  // Soumet le classement : incrémente les compteurs pairwise du scrutin actif
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
  }

  // Calcule le résultat complet d'un scrutin (null si aucun vote)
  function getBallotResult(ballot: DecisionBallot): BallotResult | null {
    if (ballot.totalVoters === 0) return null

    const hasCycle   = condorcetWinner(ballot.pairwise) === null
    const { winner: winnerIdx, method } = resolveWinner(ballot.pairwise)
    const winnerDecision = decisionIndex[ballot.decisionIds[winnerIdx]]
    if (!winnerDecision) return null

    return {
      hasCycle,
      method,
      winnerIdx,
      winnerDecision,
      bordaScores: bordaScores(ballot.pairwise),
      pairwise: ballot.pairwise,
    }
  }

  function getDecision(id: string): Decision | undefined {
    return decisionIndex[id]
  }

  return {
    ballots,
    activeBallot,
    closedBallots,
    activeCandidates,
    ranking,
    hasVoted,
    isRankingComplete,
    getRankOf,
    setRank,
    submitRanking,
    getBallotResult,
    getDecision,
  }
})
