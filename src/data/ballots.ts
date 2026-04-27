import type { DecisionBallot } from '@/types/index'

// ─── Scrutins de classement par préférence (méthode de Condorcet) ─────────────
//
// Chaque scrutin soumet exactement 3 décisions au vote.
// Les participants les classent de 1 (préféré) à 3 (moins préféré).
// Les compteurs pairwise ab/ba/ac/ca/bc/cb enregistrent,
// pour chaque paire, combien de votants ont placé A au-dessus de B, etc.
//
// L'historique des scrutins clôturés se construit exclusivement en jouant
// (appel à endRound() dans game.store.ts). Aucun scrutin n'est pré-clôturé.

export const ballots: DecisionBallot[] = [
  // ─── Scrutin 1 — ACTIF ───────────────────────────────────────────────────
  // Taxe carbone / Solaire+éolien / Gaz fluorés
  {
    id: 'ballot-42-01',
    sessionId: 1,
    decisionIds: ['dec-07', 'dec-08', 'dec-13'],
    pairwise: { ab: 0, ba: 0, ac: 0, ca: 0, bc: 0, cb: 0 },
    totalVoters: 0,
    deadline: '2024-05-31T18:00:00Z',
    status: 'active',
  },
]
