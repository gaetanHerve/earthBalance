<template>
  <main class="max-w-screen-xl mx-auto px-4 py-6 space-y-10" id="main-content" tabindex="-1">

    <!-- En-tête -->
    <div>
      <h1 class="text-2xl font-black text-white mb-1">Décisions Collectives</h1>
      <p class="text-sm text-slate-400 leading-relaxed max-w-3xl">
        Chaque scrutin soumet trois politiques climatiques au vote de la communauté.
        Classez-les de votre première à votre troisième préférence.
        Le gagnant est déterminé par la <strong class="text-eb-cyan">méthode de Condorcet</strong> :
        la politique qui bat toutes les autres en comparaisons directes.
        En cas de cycle, un <strong class="text-yellow-400">score de Borda</strong> départage.
      </p>
    </div>

    <!-- ─── Scrutin actif ──────────────────────────────────────────────────── -->
    <CollapsibleSection v-if="activeBallot" title="Scrutin en cours" icon="fa-vote-yea" color-class="text-eb-cyan">
      <template #header-extra>
        <span class="text-xs text-slate-500 mr-1">
          <i class="fa fa-clock mr-1" aria-hidden="true"></i>
          Clôture : {{ formatDeadline(activeBallot.deadline) }}
        </span>
      </template>

      <!-- Instructions -->
      <p v-if="!hasVoted" class="text-sm text-slate-400 mb-4">
        Attribuez les positions <strong class="text-white">1er</strong>,
        <strong class="text-white">2e</strong> et
        <strong class="text-white">3e</strong> aux trois politiques ci-dessous,
        puis soumettez votre classement.
      </p>
      <p v-else class="text-sm text-eb-green mb-4">
        <i class="fa fa-circle-check mr-1" aria-hidden="true"></i>
        Votre classement a été enregistré. Résultats mis à jour en temps réel.
      </p>

      <!-- 3 cartes candidates -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6" role="group" aria-label="Candidats du scrutin">
        <article
          v-for="(decision, idx) in activeCandidates"
          :key="decision.id"
          class="rounded-xl border p-4 flex flex-col gap-3 transition-all"
          :class="getRankOf(decision.id) !== null
            ? 'border-eb-cyan/50 bg-eb-cyan/5'
            : 'border-eb-border bg-eb-mid/40'"
          :aria-label="`Candidat ${idx + 1} : ${decision.title}`"
        >
          <!-- Badge rang actuel -->
          <div class="flex items-start justify-between gap-2">
            <span class="text-xs text-slate-500 font-mono">{{ decision.number }}</span>
            <span
              v-if="getRankOf(decision.id) !== null"
              class="text-xs font-black px-2 py-0.5 rounded-full bg-eb-cyan text-eb-dark"
              aria-live="polite"
            >
              {{ rankLabelSafe(decision.id) }}
            </span>
          </div>

          <!-- Titre -->
          <h3 class="text-sm font-bold text-white leading-snug line-clamp-3">{{ decision.title }}</h3>

          <!-- Indicateurs clés -->
          <div class="flex flex-wrap gap-2 text-xs">
            <span
              v-if="impactVal(decision, 'emissionsReductionGtCO2yr')"
              class="bg-eb-dark border border-eb-border rounded px-2 py-0.5 text-eb-green font-bold"
            >
              −{{ impactVal(decision, 'emissionsReductionGtCO2yr') }} GtCO₂/an
            </span>
            <span
              v-if="impactVal(decision, 'tempReductionC2100')"
              class="bg-eb-dark border border-eb-border rounded px-2 py-0.5 text-eb-cyan font-bold"
            >
              −{{ impactVal(decision, 'tempReductionC2100') }}°C en 2100
            </span>
            <span
              class="bg-eb-dark border border-eb-border rounded px-2 py-0.5"
              :class="decision.status === 'validated' ? 'text-eb-green' : 'text-yellow-400'"
            >
              {{ decision.status === 'validated' ? '✓ Validée' : '⏳ Active' }}
            </span>
          </div>

          <!-- Boutons de rang (1er / 2e / 3e) -->
          <div
            v-if="!hasVoted"
            class="flex gap-2 mt-auto"
            role="group"
            :aria-label="`Classer ${decision.title}`"
          >
            <button
              v-for="(label, pos) in rankButtons"
              :key="pos"
              class="flex-1 text-xs py-1.5 rounded-lg border font-bold transition-all focus-visible:ring-2 focus-visible:ring-eb-cyan outline-none"
              :class="getRankOf(decision.id) === pos
                ? 'bg-eb-cyan text-eb-dark border-eb-cyan'
                : 'bg-transparent text-slate-400 border-eb-border hover:border-eb-cyan/50 hover:text-slate-200'"
              :aria-pressed="getRankOf(decision.id) === pos"
              @click="onRankClick(decision.id, pos)"
            >
              {{ label }}
            </button>
          </div>

          <!-- Rang choisi (après vote) -->
          <div v-else class="mt-auto text-xs text-slate-500 text-center">
            Votre choix : <strong class="text-white">{{ rankLabelSafe(decision.id) || '—' }}</strong>
          </div>
        </article>
      </div>

      <!-- Résumé du classement + bouton soumettre -->
      <div v-if="!hasVoted" class="flex flex-wrap items-center gap-4 p-4 rounded-xl border border-eb-border bg-eb-mid/30">
        <div class="flex gap-4 flex-wrap text-sm">
          <span v-for="(label, pos) in rankButtons" :key="pos" class="flex items-center gap-1.5">
            <span class="text-slate-500">{{ label }} :</span>
            <span class="font-bold" :class="ranking[pos] ? 'text-white' : 'text-slate-600'">
              {{ getDecisionTitleAt(pos) }}
            </span>
          </span>
        </div>
        <button
          class="ml-auto px-5 py-2 rounded-lg font-bold text-sm transition-all focus-visible:ring-2 focus-visible:ring-eb-cyan outline-none"
          :class="isRankingComplete
            ? 'bg-eb-cyan text-eb-dark hover:bg-cyan-300'
            : 'bg-eb-dark text-slate-600 border border-eb-border cursor-not-allowed'"
          :disabled="!isRankingComplete"
          @click="submitRanking"
        >
          <i class="fa fa-paper-plane mr-1.5" aria-hidden="true"></i>
          Soumettre mon classement
        </button>
      </div>

      <!-- Résultats du scrutin actif (après premier vote) -->
      <template v-if="activeBallot.totalVoters > 0 && activeCandidates && activeResult">
        <div class="mt-6">
          <!-- Bandeau gagnant -->
          <div
            class="flex items-center gap-3 p-3 rounded-lg border mb-4"
            :class="activeResult.method === 'borda'
              ? 'border-yellow-700/40 bg-yellow-900/20'
              : 'border-eb-green/40 bg-eb-green/10'"
          >
            <i
              class="fa fa-trophy text-sm"
              :class="activeResult.method === 'borda' ? 'text-yellow-400' : 'text-eb-green'"
              aria-hidden="true"
            ></i>
            <div>
              <div class="text-xs text-slate-400">
                <template v-if="activeResult.method === 'condorcet'">
                  Gagnant de Condorcet — bat toutes les autres politiques en duel direct
                </template>
                <template v-else>
                  Cycle détecté — gagnant désigné par score de Borda
                </template>
              </div>
              <div class="font-bold text-white text-sm">{{ activeResult.winnerDecision.title }}</div>
            </div>
          </div>

          <!-- Scores de Borda si cycle -->
          <div
            v-if="activeResult.hasCycle && activeCandidates"
            class="p-3 rounded-lg border border-yellow-700/30 bg-yellow-900/10 mb-4"
          >
            <div class="text-xs font-bold text-yellow-400 mb-2">Scores de Borda (victoires pairwise cumulées)</div>
            <div class="flex gap-6">
              <div v-for="(d, i) in activeCandidates" :key="d.id" class="text-xs">
                <span class="text-slate-400">{{ shortName(d) }} : </span>
                <span
                  class="font-bold"
                  :class="i === activeResult.winnerIdx ? 'text-yellow-300' : 'text-slate-300'"
                >{{ activeResult.bordaScores[i] }}</span>
              </div>
            </div>
          </div>

          <!-- Matrice pairwise -->
          <PairwiseMatrix
            v-if="activeCandidates"
            :ballot="activeBallot"
            :candidates="activeCandidates"
          />
        </div>
      </template>
      <div v-else-if="hasVoted" class="mt-4 text-sm text-slate-500 italic text-center">
        Vous êtes le premier votant — résultats disponibles dès le deuxième vote.
      </div>
    </CollapsibleSection>

    <!-- ─── Historique des scrutins clôturés ──────────────────────────────── -->
    <CollapsibleSection v-if="closedBallots.length" title="Scrutins Clôturés" icon="fa-clock-rotate-left" color-class="text-slate-400">
      <div class="space-y-6">
        <article
          v-for="ballot in closedBallots"
          :key="ballot.id"
          class="rounded-xl border border-eb-border bg-eb-mid/30"
        >
          <!-- En-tête -->
          <div class="px-4 py-3 bg-eb-dark/50 border-b border-eb-border flex flex-wrap items-center gap-3 rounded-t-xl overflow-hidden">
            <span class="text-xs text-slate-500 font-mono">{{ ballot.id }}</span>
            <span class="text-xs text-slate-500">
              Clôturé le {{ formatDeadline(ballot.deadline) }} — {{ ballot.totalVoters }} votants
            </span>
            <span
              class="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
              :class="ballotMethod(ballot) === 'borda'
                ? 'bg-yellow-900/40 text-yellow-400 border border-yellow-700/30'
                : 'bg-cyan-900/40 text-eb-cyan border border-cyan-700/30'"
            >
              {{ ballotMethod(ballot) === 'borda' ? '⚠ Borda (cycle)' : '✓ Condorcet' }}
            </span>
          </div>

          <div class="p-4">
            <!-- Gagnant -->
            <div v-if="ballotWinner(ballot)" class="mb-4 flex items-start gap-3">
              <div class="mt-0.5 w-7 h-7 rounded-full bg-eb-green/20 border border-eb-green/40 flex items-center justify-center flex-shrink-0">
                <i class="fa fa-trophy text-eb-green text-xs" aria-hidden="true"></i>
              </div>
              <div>
                <div class="text-xs text-slate-500 mb-0.5">
                  Politique retenue
                  <span v-if="ballotHasCycle(ballot)" class="text-yellow-400">
                    (cycle Condorcet — départage Borda)
                  </span>
                </div>
                <div class="text-sm font-bold text-white leading-snug">
                  {{ ballotWinner(ballot)?.title }}
                </div>
                <div class="flex flex-wrap gap-2 mt-1.5 text-xs">
                  <span
                    v-if="ballotWinnerImpact(ballot, 'emissionsReductionGtCO2yr')"
                    class="bg-eb-dark border border-eb-border rounded px-2 py-0.5 text-eb-green font-bold"
                  >
                    −{{ ballotWinnerImpact(ballot, 'emissionsReductionGtCO2yr') }} GtCO₂/an
                  </span>
                  <span
                    v-if="ballotWinnerImpact(ballot, 'tempReductionC2100')"
                    class="bg-eb-dark border border-eb-border rounded px-2 py-0.5 text-eb-cyan font-bold"
                  >
                    −{{ ballotWinnerImpact(ballot, 'tempReductionC2100') }}°C en 2100
                  </span>
                </div>
              </div>
            </div>

            <!-- Matrice pairwise -->
            <PairwiseMatrix
              :ballot="ballot"
              :candidates="getCandidatesFor(ballot)"
            />
          </div>
        </article>
      </div>
    </CollapsibleSection>

  </main>
</template>

<script setup lang="ts">
import { computed, defineComponent, h } from 'vue'
import type { PropType } from 'vue'
import { storeToRefs } from 'pinia'
import { useDecisionsStore } from '@/store/decisions.store'
import CollapsibleSection from '@/components/layout/CollapsibleSection.vue'
import type { RankPosition } from '@/store/decisions.store'
import type { Decision, DecisionBallot } from '@/types/index'

// ─── Store ────────────────────────────────────────────────────────────────────

const store = useDecisionsStore()
const {
  activeBallot, activeCandidates, closedBallots,
  ranking, hasVoted, isRankingComplete,
} = storeToRefs(store)
const { getRankOf, setRank, submitRanking, getBallotResult, getDecision } = store

// ─── Résultat du scrutin actif ────────────────────────────────────────────────

const activeResult = computed(() =>
  activeBallot.value ? getBallotResult(activeBallot.value) : null
)

// ─── Constantes UI ───────────────────────────────────────────────────────────

const rankButtons = ['1er', '2e', '3e'] as const

// ─── Helpers template (évitent ! et as TypeName dans le template) ─────────────

function rankLabel(pos: RankPosition): string {
  return rankButtons[pos]
}

function rankLabelSafe(decisionId: string): string {
  const pos = getRankOf(decisionId)
  return pos !== null ? rankLabel(pos) : ''
}

function onRankClick(decisionId: string, pos: number): void {
  setRank(decisionId, pos as RankPosition)
}

function getDecisionTitleAt(pos: number): string {
  const id = ranking.value[pos]
  return id ? truncate(getDecision(id)?.title ?? '', 30) : '—'
}

function impactVal(d: Decision, key: string): number | undefined {
  return d.projectedImpact?.[key]
}

function getCandidatesFor(ballot: DecisionBallot): [Decision, Decision, Decision] {
  return ballot.decisionIds.map(id => getDecision(id)!) as [Decision, Decision, Decision]
}

function ballotMethod(ballot: DecisionBallot): string {
  return getBallotResult(ballot)?.method ?? 'condorcet'
}

function ballotHasCycle(ballot: DecisionBallot): boolean {
  return getBallotResult(ballot)?.hasCycle ?? false
}

function ballotWinner(ballot: DecisionBallot): Decision | undefined {
  return getBallotResult(ballot)?.winnerDecision
}

function ballotWinnerImpact(ballot: DecisionBallot, key: string): number | undefined {
  return getBallotResult(ballot)?.winnerDecision.projectedImpact?.[key]
}

function shortName(d: Decision): string {
  const words = d.title.split(' ')
  return words.slice(0, 4).join(' ') + (words.length > 4 ? '…' : '')
}

function formatDeadline(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max) + '…' : s
}

// ─── Composant inline : matrice pairwise ─────────────────────────────────────

const PairwiseMatrix = defineComponent({
  name: 'PairwiseMatrix',
  props: {
    ballot:     { type: Object as PropType<DecisionBallot>, required: true },
    candidates: { type: Array as unknown as PropType<[Decision, Decision, Decision]>, required: true },
  },
  setup(props: { ballot: DecisionBallot; candidates: [Decision, Decision, Decision] }) {
    // Label long pour les titres de ligne, court pour les colonnes
    function rowLabel(d: Decision): string {
      const words = d.title.split(' ')
      return words.slice(0, 3).join(' ') + (words.length > 3 ? '…' : '')
    }
    function colLabel(d: Decision): string {
      const words = d.title.split(' ')
      return words.slice(0, 2).join(' ') + (words.length > 2 ? '…' : '')
    }

    return () => {
      const { ballot, candidates } = props
      const p = ballot.pairwise
      const total = ballot.totalVoters

      const matrix: (number | null)[][] = [
        [null, p.ab, p.ac],
        [p.ba, null, p.bc],
        [p.ca, p.cb, null],
      ]

      const rows = candidates.map((d: Decision, i: number) =>
        h('tr', { key: d.id }, [
          h('th', {
            scope: 'row',
            title: d.title,
            class: 'text-left pr-2 py-1.5 text-xs text-slate-400 font-normal max-w-[5rem] truncate',
          }, rowLabel(d)),
          ...candidates.map((_, j) => {
            if (i === j) return h('td', { key: j, class: 'px-1.5 py-1.5 text-center text-slate-600 text-xs' }, '—')
            const v = matrix[i][j] as number
            const vOpp = matrix[j][i] as number
            const pct = total > 0 ? Math.round((v / total) * 100) : 0
            const wins = v > vOpp
            return h('td', {
              key: j,
              title: total > 0 ? `${v} votants` : '',
              class: `px-1.5 py-1.5 text-center text-xs font-bold ${wins ? 'text-eb-green bg-eb-green/10' : 'text-red-400 bg-red-500/5'} rounded`,
            }, total > 0 ? `${pct}%` : '—')
          }),
        ])
      )

      return h('div', { class: 'overflow-x-auto min-w-0' },
        h('table', {
          class: 'w-full text-xs border-separate border-spacing-0.5',
          'aria-label': 'Matrice des comparaisons directes',
        }, [
          h('caption', { class: 'sr-only' }, 'Ligne préférée à colonne : pourcentage de votants'),
          h('thead', {}, [
            h('tr', {}, [
              h('th', { class: 'pr-2 py-1 text-left text-slate-600 font-normal text-xs' }, '↓ / →'),
              ...candidates.map((d, j) =>
                h('th', {
                  key: j,
                  scope: 'col',
                  title: d.title,
                  class: 'px-1.5 py-1 text-xs text-slate-500 font-normal text-center max-w-[4rem] truncate',
                }, colLabel(d))
              ),
            ]),
          ]),
          h('tbody', {}, rows),
        ])
      )
    }
  },
})
</script>
