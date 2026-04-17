import type { PairwiseVotes } from '@/types/index'

/**
 * Retourne l'index (0=A, 1=B, 2=C) du gagnant de Condorcet,
 * ou null s'il y a un cycle (paradoxe de Condorcet).
 */
export function condorcetWinner(p: PairwiseVotes): 0 | 1 | 2 | null {
  const aBeatsB = p.ab > p.ba
  const aBeatsC = p.ac > p.ca
  const bBeatsC = p.bc > p.cb

  if (aBeatsB && aBeatsC)   return 0  // A bat B et C
  if (!aBeatsB && bBeatsC)  return 1  // B bat A et C
  if (!aBeatsC && !bBeatsC) return 2  // C bat A et B
  return null                          // Cycle : A > B > C > A ou A > C > B > A
}

/**
 * Retourne les scores de Borda pour [A, B, C].
 * Score de Borda = somme des victoires pairwise (nombre de votants
 * plaçant ce candidat au-dessus de chacun des deux autres).
 */
export function bordaScores(p: PairwiseVotes): [number, number, number] {
  return [
    p.ab + p.ac,  // A
    p.ba + p.bc,  // B
    p.ca + p.cb,  // C
  ]
}

export type WinnerMethod = 'condorcet' | 'borda'

/**
 * Résolution complète : Condorcet en premier, Borda si cycle.
 */
export function resolveWinner(p: PairwiseVotes): { winner: 0 | 1 | 2; method: WinnerMethod } {
  const cw = condorcetWinner(p)
  if (cw !== null) return { winner: cw, method: 'condorcet' }

  const scores = bordaScores(p)
  const winner = scores.indexOf(Math.max(...scores)) as 0 | 1 | 2
  return { winner, method: 'borda' }
}

/**
 * Convertit un classement utilisateur [1er, 2e, 3e] (IDs) en incréments pairwise.
 * Retourne un delta PairwiseVotes à ajouter aux compteurs existants.
 */
export function rankingToPairwiseDelta(
  ranking: [string, string, string],
  decisionIds: [string, string, string],
): PairwiseVotes {
  // Position dans le ballot pour chaque décision
  const pos = (id: string) => decisionIds.indexOf(id)  // 0=A, 1=B, 2=C
  const userRank = (ballotIdx: number) =>
    [pos(ranking[0]), pos(ranking[1]), pos(ranking[2])].indexOf(ballotIdx)

  const delta: PairwiseVotes = { ab: 0, ba: 0, ac: 0, ca: 0, bc: 0, cb: 0 }

  // Paire A(0) vs B(1)
  if (userRank(0) < userRank(1)) delta.ab++; else delta.ba++;
  // Paire A(0) vs C(2)
  if (userRank(0) < userRank(2)) delta.ac++; else delta.ca++;
  // Paire B(1) vs C(2)
  if (userRank(1) < userRank(2)) delta.bc++; else delta.cb++;

  return delta
}
