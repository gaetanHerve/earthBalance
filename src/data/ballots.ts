import type { DecisionBallot } from '@/types/index'

// ─── Scrutins de classement par préférence (méthode de Condorcet) ─────────────
//
// Chaque scrutin soumet exactement 3 décisions au vote.
// Les participants les classent de 1 (préféré) à 3 (moins préféré).
// Les compteurs pairwise ab/ba/ac/ca/bc/cb enregistrent,
// pour chaque paire, combien de votants ont placé A au-dessus de B, etc.
//
// Scrutins 2 à 5 sont clôturés avec des données simulées :
//   - Scrutin 2 : gagnant Condorcet = dec-42-05 (sortie du charbon)
//   - Scrutin 3 : gagnant Condorcet = dec-42-03 (arrêt déforestation)
//   - Scrutin 4 : CYCLE Condorcet → gagnant Borda = dec-42-04 (méthane)
//   - Scrutin 5 : gagnant Condorcet = dec-42-16 (restauration écosystèmes)

export const ballots: DecisionBallot[] = [
  // ─── Scrutin 1 — ACTIF ───────────────────────────────────────────────────
  // Taxe carbone / Solaire+éolien / Gaz fluorés
  {
    id: 'ballot-42-01',
    sessionId: 42,
    decisionIds: ['dec-42-07', 'dec-42-08', 'dec-42-13'],
    pairwise: { ab: 0, ba: 0, ac: 0, ca: 0, bc: 0, cb: 0 },
    totalVoters: 0,
    deadline: '2024-05-31T18:00:00Z',
    status: 'active',
  },

  // ─── Scrutin 2 — CLÔTURÉ — Gagnant Condorcet : dec-42-05 ─────────────────
  // Sortie du charbon (A) / Rénovation bâtiments (B) / Électrification transports (C)
  // A bat B (580:420), A bat C (620:380), B bat C (540:460) → A = Condorcet winner
  {
    id: 'ballot-42-02',
    sessionId: 42,
    decisionIds: ['dec-42-05', 'dec-42-09', 'dec-42-01'],
    pairwise: { ab: 580, ba: 420, ac: 620, ca: 380, bc: 540, cb: 460 },
    totalVoters: 1000,
    deadline: '2024-01-31T18:00:00Z',
    status: 'closed',
  },

  // ─── Scrutin 3 — CLÔTURÉ — Gagnant Condorcet : dec-42-03 ─────────────────
  // Arrêt déforestation (A) / Alimentation végétale (B) / Gaspillage alimentaire (C)
  // A bat B (510:490), A bat C (530:470), C bat B (520:480) → A = Condorcet winner
  {
    id: 'ballot-42-03',
    sessionId: 42,
    decisionIds: ['dec-42-03', 'dec-42-02', 'dec-42-14'],
    pairwise: { ab: 510, ba: 490, ac: 530, ca: 470, bc: 480, cb: 520 },
    totalVoters: 1000,
    deadline: '2024-02-15T18:00:00Z',
    status: 'closed',
  },

  // ─── Scrutin 4 — CLÔTURÉ — CYCLE → Gagnant Borda : dec-42-04 ────────────
  // Réduction méthane (A) / Économie circulaire (B) / Agroforesterie (C)
  // A bat B (560:440), C bat A (520:480), B bat C (580:420)
  // Cycle : A > B > C > A → Borda : A=1040, B=1020, C=940 → A wins
  {
    id: 'ballot-42-04',
    sessionId: 42,
    decisionIds: ['dec-42-04', 'dec-42-10', 'dec-42-15'],
    pairwise: { ab: 560, ba: 440, ac: 480, ca: 520, bc: 580, cb: 420 },
    totalVoters: 1000,
    deadline: '2024-03-15T18:00:00Z',
    status: 'closed',
  },

  // ─── Scrutin 5 — CLÔTURÉ — Gagnant Condorcet : dec-42-16 ────────────────
  // Restauration écosystèmes (A) / Nucléaire (B) / BECCS (C)
  // A bat B (680:320), A bat C (720:280), C bat B (570:430) → A = Condorcet winner
  {
    id: 'ballot-42-05',
    sessionId: 42,
    decisionIds: ['dec-42-16', 'dec-42-12', 'dec-42-17'],
    pairwise: { ab: 680, ba: 320, ac: 720, ca: 280, bc: 430, cb: 570 },
    totalVoters: 1000,
    deadline: '2024-04-01T18:00:00Z',
    status: 'closed',
  },
]
