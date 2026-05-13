import { describe, it, expect } from 'vitest'
import type { PairwiseVotes } from '@/types/index'
import { condorcetWinner, bordaScores, resolveWinner, rankingToPairwiseDelta } from '@/utils/condorcet'

describe('condorcetWinner', () => {
  it('returns 0 when A beats B and C', () => {
    const p: PairwiseVotes = { ab: 3, ba: 1, ac: 3, ca: 1, bc: 2, cb: 2 }
    expect(condorcetWinner(p)).toBe(0)
  })

  it('returns 1 when B beats A and C', () => {
    const p: PairwiseVotes = { ab: 1, ba: 3, ac: 2, ca: 2, bc: 3, cb: 1 }
    expect(condorcetWinner(p)).toBe(1)
  })

  it('returns 2 when C beats A and B', () => {
    const p: PairwiseVotes = { ab: 2, ba: 2, ac: 1, ca: 3, bc: 1, cb: 3 }
    expect(condorcetWinner(p)).toBe(2)
  })

  it('returns null on a cycle (A > B > C > A)', () => {
    const p: PairwiseVotes = { ab: 3, ba: 1, ac: 1, ca: 3, bc: 3, cb: 1 }
    expect(condorcetWinner(p)).toBeNull()
  })
})

describe('bordaScores', () => {
  it('computes [ab+ac, ba+bc, ca+cb] for each candidate', () => {
    const p: PairwiseVotes = { ab: 3, ba: 1, ac: 2, ca: 2, bc: 3, cb: 1 }
    expect(bordaScores(p)).toEqual([5, 4, 3])
  })
})

describe('resolveWinner', () => {
  it('uses condorcet when there is a clear winner', () => {
    const p: PairwiseVotes = { ab: 3, ba: 1, ac: 3, ca: 1, bc: 2, cb: 2 }
    const result = resolveWinner(p)
    expect(result.winner).toBe(0)
    expect(result.method).toBe('condorcet')
  })

  it('falls back to borda on a cycle', () => {
    // A > B (4-2), B > C (4-2), C > A (4-2): cycle, all borda scores equal → first wins
    const p: PairwiseVotes = { ab: 4, ba: 2, ac: 2, ca: 4, bc: 4, cb: 2 }
    const result = resolveWinner(p)
    expect(result.method).toBe('borda')
  })
})

describe('rankingToPairwiseDelta', () => {
  const ids: [string, string, string] = ['pol-a', 'pol-b', 'pol-c']

  it('generates correct delta when ranking matches ballot order (A > B > C)', () => {
    const delta = rankingToPairwiseDelta(['pol-a', 'pol-b', 'pol-c'], ids)
    expect(delta).toEqual({ ab: 1, ba: 0, ac: 1, ca: 0, bc: 1, cb: 0 })
  })

  it('generates correct delta for reverse order (C > B > A)', () => {
    const delta = rankingToPairwiseDelta(['pol-c', 'pol-b', 'pol-a'], ids)
    expect(delta).toEqual({ ab: 0, ba: 1, ac: 0, ca: 1, bc: 0, cb: 1 })
  })

  it('generates correct delta when C ranked first (C > A > B)', () => {
    const delta = rankingToPairwiseDelta(['pol-c', 'pol-a', 'pol-b'], ids)
    // A > B → ab:1, C > A → ca:1, C > B → cb:1
    expect(delta).toEqual({ ab: 1, ba: 0, ac: 0, ca: 1, bc: 0, cb: 1 })
  })
})
