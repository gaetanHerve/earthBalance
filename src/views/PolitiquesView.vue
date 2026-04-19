<template>
  <main class="max-w-screen-xl mx-auto px-4 py-6 space-y-10" id="main-content" tabindex="-1">

    <!-- En-tête -->
    <div>
      <h1 class="text-2xl font-black text-white mb-1">{{ t('policies.title') }}</h1>
      <p class="text-sm text-slate-400 leading-relaxed max-w-3xl">{{ t('policies.intro') }}</p>
    </div>

    <!-- ─── Scrutin actif ──────────────────────────────────────────────────── -->
    <CollapsibleSection v-if="activeBallot" :title="t('policies.active_ballot_title')" icon="fa-vote-yea" color-class="text-eb-cyan">
      <template #header-extra>
        <span class="text-xs text-slate-500 mr-1">
          <i class="fa fa-clock mr-1" aria-hidden="true"></i>
          {{ t('policies.deadline_slot') }} : {{ formatDeadline(activeBallot.deadline) }}
        </span>
      </template>

      <!-- Instructions -->
      <p v-if="!hasVoted" class="text-sm text-slate-400 mb-4">
        {{ t('policies.instructions_novote', { r1: t('policies.r1'), r2: t('policies.r2'), r3: t('policies.r3') }) }}
      </p>
      <p v-else class="text-sm text-eb-green mb-4">
        <i class="fa fa-circle-check mr-1" aria-hidden="true"></i>
        {{ t('policies.ranked_done') }}
      </p>

      <!-- 3 cartes candidates -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6" role="group" :aria-label="t('policies.candidates_aria')">
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
              {{ decision.status === 'validated' ? t('policies.status_validated') : t('policies.status_active') }}
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

          <!-- Lien détail -->
          <RouterLink
            :to="`/mitigation-policies/${decision.id}`"
            class="mt-1 self-end text-xs text-slate-500 hover:text-eb-cyan transition-colors focus-visible:ring-2 focus-visible:ring-eb-cyan rounded outline-none"
          >
            <i class="fa fa-circle-info mr-1" aria-hidden="true"></i>{{ t('policies.detail_link') }}
          </RouterLink>
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
          {{ t('policies.submit') }}
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
                  {{ t('policies.condorcet_winner') }}
                </template>
                <template v-else>
                  {{ t('policies.cycle_detected') }}
                </template>
              </div>
              <div class="font-bold text-white text-sm">{{ activeResult.winnerPolicy.title }}</div>
            </div>
          </div>

          <!-- Scores de Borda si cycle -->
          <div
            v-if="activeResult.hasCycle && activeCandidates"
            class="p-3 rounded-lg border border-yellow-700/30 bg-yellow-900/10 mb-4"
          >
            <div class="text-xs font-bold text-yellow-400 mb-2">{{ t('policies.borda_scores_title') }}</div>
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
        {{ t('policies.first_voter') }}
      </div>
    </CollapsibleSection>

    <!-- ─── Historique des scrutins clôturés ──────────────────────────────── -->
    <CollapsibleSection v-if="closedBallots.length" :title="t('policies.closed_ballots_title')" icon="fa-clock-rotate-left" color-class="text-slate-400">
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
              {{ t('policies.closed_meta', { date: formatDeadline(ballot.deadline), count: ballot.totalVoters }) }}
            </span>
            <span
              class="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
              :class="ballotMethod(ballot) === 'borda'
                ? 'bg-yellow-900/40 text-yellow-400 border border-yellow-700/30'
                : 'bg-cyan-900/40 text-eb-cyan border border-cyan-700/30'"
            >
              {{ ballotMethod(ballot) === 'borda' ? t('policies.borda_method') : t('policies.condorcet_method') }}
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
                  {{ t('policies.policy_retained') }}
                  <span v-if="ballotHasCycle(ballot)" class="text-yellow-400">
                    ({{ t('policies.cycle_note') }})
                  </span>
                </div>
                <RouterLink
                  v-if="ballotWinner(ballot)"
                  :to="`/mitigation-policies/${ballotWinnerId(ballot)}`"
                  class="text-sm font-bold text-white leading-snug hover:text-eb-cyan transition-colors"
                >
                  {{ ballotWinner(ballot)?.title }}
                </RouterLink>
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
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useMitigationPoliciesStore } from '@/store/mitigationPolicies.store'
import CollapsibleSection from '@/components/layout/CollapsibleSection.vue'
import type { RankPosition } from '@/store/mitigationPolicies.store'
import type { MitigationPolicy, DecisionBallot } from '@/types/index'

// ─── i18n ─────────────────────────────────────────────────────────────────────

const { t } = useI18n()

// ─── Store ────────────────────────────────────────────────────────────────────

const store = useMitigationPoliciesStore()
const {
  activeBallot, activeCandidates, closedBallots,
  ranking, hasVoted, isRankingComplete,
} = storeToRefs(store)
const { getRankOf, setRank, submitRanking, getBallotResult, getMitigationPolicy } = store

// ─── Résultat du scrutin actif ────────────────────────────────────────────────

const activeResult = computed(() =>
  activeBallot.value ? getBallotResult(activeBallot.value) : null
)

// ─── Constantes UI ───────────────────────────────────────────────────────────

const rankButtons = computed(() => [t('policies.r1'), t('policies.r2'), t('policies.r3')] as const)

// ─── Helpers template (évitent ! et as TypeName dans le template) ─────────────

function rankLabel(pos: RankPosition): string {
  return rankButtons.value[pos]
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
  return id ? truncate(getMitigationPolicy(id)?.title ?? '', 30) : '—'
}

function impactVal(d: MitigationPolicy, key: string): number | undefined {
  return d.projectedImpact?.[key]
}

function getCandidatesFor(ballot: DecisionBallot): [MitigationPolicy, MitigationPolicy, MitigationPolicy] {
  return ballot.decisionIds.map(id => getMitigationPolicy(id)!) as [MitigationPolicy, MitigationPolicy, MitigationPolicy]
}

function ballotMethod(ballot: DecisionBallot): string {
  return getBallotResult(ballot)?.method ?? 'condorcet'
}

function ballotHasCycle(ballot: DecisionBallot): boolean {
  return getBallotResult(ballot)?.hasCycle ?? false
}

function ballotWinner(ballot: DecisionBallot): MitigationPolicy | undefined {
  return getBallotResult(ballot)?.winnerPolicy
}

function ballotWinnerImpact(ballot: DecisionBallot, key: string): number | undefined {
  return getBallotResult(ballot)?.winnerPolicy.projectedImpact?.[key]
}

function ballotWinnerId(ballot: DecisionBallot): string {
  const result = getBallotResult(ballot)
  if (!result) return ''
  return ballot.decisionIds[result.winnerIdx]
}

function shortName(d: MitigationPolicy): string {
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
    candidates: { type: Array as unknown as PropType<[MitigationPolicy, MitigationPolicy, MitigationPolicy]>, required: true },
  },
  setup(props: { ballot: DecisionBallot; candidates: [MitigationPolicy, MitigationPolicy, MitigationPolicy] }) {
    // Label long pour les titres de ligne, court pour les colonnes
    function rowLabel(d: MitigationPolicy): string {
      const words = d.title.split(' ')
      return words.slice(0, 3).join(' ') + (words.length > 3 ? '…' : '')
    }
    function colLabel(d: MitigationPolicy): string {
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

      const rows = candidates.map((d: MitigationPolicy, i: number) =>
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
