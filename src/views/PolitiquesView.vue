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
          v-for="(decision, idx) in localizedCandidates"
          :key="decision.id"
          class="rounded-xl border p-4 flex flex-col gap-3 transition-all"
          :class="getRankOf(decision.id) !== null
            ? 'border-eb-cyan/50 bg-eb-cyan/5'
            : 'border-eb-border bg-eb-mid/40'"
          :aria-label="t('policies.candidate_aria', { n: idx + 1, title: decision.title })"
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
              −{{ impactVal(decision, 'tempReductionC2100') }}°C {{ t('policies.in_2100') }}
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
            :aria-label="t('policies.rank_aria', { title: decision.title })"
          >
            <button
              v-for="(label, pos) in rankButtons"
              :key="pos"
              class="flex-1 text-xs py-1.5 rounded-lg border font-bold transition-all focus-visible:ring-2 focus-visible:ring-eb-cyan outline-none"
              :class="!canVote
                ? 'bg-transparent text-slate-600 border-slate-800 cursor-not-allowed opacity-40'
                : getRankOf(decision.id) === pos
                  ? 'bg-eb-cyan text-eb-dark border-eb-cyan'
                  : 'bg-transparent text-slate-400 border-eb-border hover:border-eb-cyan/50 hover:text-slate-200'"
              :disabled="!canVote"
              :aria-pressed="getRankOf(decision.id) === pos"
              @click="onRankClick(decision.id, pos)"
            >
              {{ label }}
            </button>
          </div>

          <!-- Rang choisi (après vote) -->
          <div v-else class="mt-auto text-xs text-slate-500 text-center">
            {{ t('policies.your_choice') }} : <strong class="text-white">{{ rankLabelSafe(decision.id) || '—' }}</strong>
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
          :class="isRankingComplete && canVote
            ? 'bg-eb-cyan text-eb-dark hover:bg-cyan-300'
            : 'bg-eb-dark text-slate-600 border border-eb-border cursor-not-allowed'"
          :disabled="!isRankingComplete || !canVote"
          @click="submitRanking"
        >
          <i class="fa fa-paper-plane mr-1.5" aria-hidden="true"></i>
          {{ t('policies.submit') }}
        </button>
      </div>

      <!-- Résultats du scrutin actif (après premier vote) -->
      <template v-if="activeBallot.totalVoters > 0 && localizedCandidates && activeResult">
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
              <div class="font-bold text-white text-sm">{{ localizedPolicy(activeResult.winnerPolicy).title }}</div>
            </div>
          </div>

          <!-- Scores de Borda si cycle -->
          <div
            v-if="activeResult.hasCycle && localizedCandidates"
            class="p-3 rounded-lg border border-yellow-700/30 bg-yellow-900/10 mb-4"
          >
            <div class="text-xs font-bold text-yellow-400 mb-2">{{ t('policies.borda_scores_title') }}</div>
            <div class="flex gap-6">
              <div v-for="(d, i) in localizedCandidates" :key="d.id" class="text-xs">
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
            v-if="localizedCandidates"
            :ballot="activeBallot"
            :candidates="localizedCandidates"
          />
        </div>
      </template>
      <div v-else-if="hasVoted" class="mt-4 text-sm text-slate-500 italic text-center">
        {{ t('policies.first_voter') }}
      </div>
    </CollapsibleSection>

    <!-- ─── Réseau de politiques ─────────────────────────────────────────── -->
    <CollapsibleSection :title="t('network.mode_game')" icon="fa-diagram-project" color-class="text-eb-cyan">
      <PolicyNetworkGraph mode="game" />
    </CollapsibleSection>

    <!-- ─── Projections climatiques ─────────────────────────────────────── -->
    <CollapsibleSection :title="t('simulator.projections_title')" icon="fa-chart-line" color-class="text-eb-cyan" :default-open="false">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <!-- Graphique CO₂ -->
        <EbCard>
          <div class="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div>
              <h3 class="text-sm font-bold text-slate-200">{{ t('simulator.co2_chart_title') }}</h3>
              <p class="text-xs text-slate-500">{{ t('simulator.co2_chart_sub') }}</p>
            </div>
            <div class="flex gap-3 text-xs text-slate-400">
              <span class="flex items-center gap-1.5">
                <svg width="20" height="8" aria-hidden="true" class="shrink-0">
                  <line x1="0" y1="4" x2="20" y2="4" stroke="#64748b" stroke-width="2"/>
                  <circle cx="10" cy="4" r="3" fill="#64748b"/>
                </svg>
                {{ t('simulator.legend_baseline') }}
              </span>
              <span class="flex items-center gap-1.5">
                <svg width="20" height="8" aria-hidden="true" class="shrink-0">
                  <line x1="0" y1="4" x2="20" y2="4" stroke="#00ff88" stroke-width="2"/>
                  <polygon points="10,1 13.5,7 6.5,7" fill="#00ff88"/>
                </svg>
                {{ t('simulator.legend_decided') }}
              </span>
              <span class="flex items-center gap-1.5">
                <svg width="20" height="8" aria-hidden="true" class="shrink-0">
                  <line x1="0" y1="4" x2="20" y2="4" stroke="#f87171" stroke-width="2"/>
                  <rect x="7" y="1" width="6" height="6" fill="#f87171"/>
                </svg>
                {{ t('simulator.legend_pessimist') }}
              </span>
            </div>
          </div>
          <LineChart
            canvas-id="policies-co2-chart"
            :labels="SIM_LABELS"
            :datasets="co2Datasets"
            :show-legend="false"
            :height="180"
            :y-min="15"
            :y-max="75"
            :current-year="gameStore.currentYear"
            :aria-label="t('simulator.aria_co2')"
          />
        </EbCard>

        <!-- Graphique Température -->
        <EbCard>
          <div class="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div>
              <h3 class="text-sm font-bold text-slate-200">{{ t('simulator.temp_chart_title') }}</h3>
              <p class="text-xs text-slate-500">{{ t('simulator.temp_chart_sub') }}</p>
            </div>
            <div class="flex gap-3 text-xs text-slate-400">
              <span class="flex items-center gap-1.5">
                <svg width="20" height="8" aria-hidden="true" class="shrink-0">
                  <line x1="0" y1="4" x2="20" y2="4" stroke="#64748b" stroke-width="2"/>
                  <circle cx="10" cy="4" r="3" fill="#64748b"/>
                </svg>
                {{ t('simulator.legend_baseline') }}
              </span>
              <span class="flex items-center gap-1.5">
                <svg width="20" height="8" aria-hidden="true" class="shrink-0">
                  <line x1="0" y1="4" x2="20" y2="4" stroke="#00ff88" stroke-width="2"/>
                  <polygon points="10,1 13.5,7 6.5,7" fill="#00ff88"/>
                </svg>
                {{ t('simulator.legend_decided') }}
              </span>
              <span class="flex items-center gap-1.5">
                <svg width="20" height="8" aria-hidden="true" class="shrink-0">
                  <line x1="0" y1="4" x2="20" y2="4" stroke="#f87171" stroke-width="2"/>
                  <rect x="7" y="1" width="6" height="6" fill="#f87171"/>
                </svg>
                {{ t('simulator.legend_pessimist') }}
              </span>
            </div>
          </div>
          <LineChart
            canvas-id="policies-temp-chart"
            :labels="SIM_LABELS"
            :datasets="tempDatasets"
            :show-legend="false"
            :height="180"
            :y-min="1.2"
            :y-max="4.5"
            :current-year="gameStore.currentYear"
            :aria-label="t('simulator.aria_temp')"
          />
          <div class="flex gap-4 mt-2 text-xs text-slate-500">
            <span class="flex items-center gap-1.5">
              <svg width="20" height="4" aria-hidden="true" class="shrink-0">
                <line x1="0" y1="2" x2="20" y2="2" stroke="#facc15" stroke-width="2" stroke-dasharray="2 4" stroke-linecap="round"/>
              </svg>
              {{ t('simulator.threshold_paris') }}
            </span>
            <span class="flex items-center gap-1.5">
              <svg width="20" height="4" aria-hidden="true" class="shrink-0">
                <line x1="0" y1="2" x2="20" y2="2" stroke="#f97316" stroke-width="2" stroke-dasharray="8 4" stroke-linecap="round"/>
              </svg>
              {{ t('simulator.threshold_2c') }}
            </span>
          </div>
        </EbCard>

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
import { useSimulationStore, SIM_LABELS, BASELINE_CO2, BASELINE_TEMP } from '@/store/simulation.store'
import { useGameStore } from '@/store/game.store'
import { useLocalizedPolicies } from '@/composables/useLocalizedPolicies'
import CollapsibleSection  from '@/components/layout/CollapsibleSection.vue'
import LineChart            from '@/components/charts/LineChart.vue'
import EbCard               from '@/components/layout/EbCard.vue'
import PolicyNetworkGraph   from '@/components/mitigationPolicies/PolicyNetworkGraph.vue'
import type { RankPosition } from '@/store/mitigationPolicies.store'
import type { MitigationPolicy, DecisionBallot, ChartDataset } from '@/types/index'

// ─── i18n ─────────────────────────────────────────────────────────────────────

const { t, locale } = useI18n()
const { localizedPolicy } = useLocalizedPolicies()

// ─── Stores ───────────────────────────────────────────────────────────────────

const store = useMitigationPoliciesStore()
const simulationStore = useSimulationStore()
const gameStore = useGameStore()
const {
  activeBallot, activeCandidates, closedBallots,
  ranking, hasVoted, isRankingComplete,
} = storeToRefs(store)
const { getRankOf, setRank, submitRanking, getBallotResult, getMitigationPolicy } = store

// ─── Candidats localisés ──────────────────────────────────────────────────────

const localizedCandidates = computed(() =>
  activeCandidates.value?.map(localizedPolicy) as [MitigationPolicy, MitigationPolicy, MitigationPolicy] | null
)

// ─── Résultat du scrutin actif ────────────────────────────────────────────────

const activeResult = computed(() =>
  activeBallot.value ? getBallotResult(activeBallot.value) : null
)

// ─── Constantes UI ───────────────────────────────────────────────────────────

const canVote = computed(() => gameStore.phase === 'vote')
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
  const p = getMitigationPolicy(id ?? '')
  return p ? truncate(localizedPolicy(p).title, 30) : '—'
}

function impactVal(d: MitigationPolicy, key: string): number | undefined {
  return d.projectedImpact?.[key]
}

function getCandidatesFor(ballot: DecisionBallot): [MitigationPolicy, MitigationPolicy, MitigationPolicy] {
  return ballot.decisionIds.map(id => localizedPolicy(getMitigationPolicy(id)!)) as [MitigationPolicy, MitigationPolicy, MitigationPolicy]
}

function ballotMethod(ballot: DecisionBallot): string {
  return getBallotResult(ballot)?.method ?? 'condorcet'
}

function ballotHasCycle(ballot: DecisionBallot): boolean {
  return getBallotResult(ballot)?.hasCycle ?? false
}

function ballotWinner(ballot: DecisionBallot): MitigationPolicy | undefined {
  const p = getBallotResult(ballot)?.winnerPolicy
  return p ? localizedPolicy(p) : undefined
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
  return new Date(iso).toLocaleDateString(locale.value, { day: 'numeric', month: 'long', year: 'numeric' })
}

function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max) + '…' : s
}

// ─── Datasets graphiques projections ─────────────────────────────────────────

const { cumulativeCo2, cumulativeCo2Pessimist, cumulativeTemp, cumulativeTempPessimist } = storeToRefs(simulationStore)

const co2Datasets = computed<ChartDataset[]>(() => [
  {
    label: t('simulator.dataset_baseline'),
    data: [...BASELINE_CO2],
    borderColor: '#64748b',
    backgroundColor: 'rgba(100,116,139,0.05)',
    fill: false,
    tension: 0.4,
    pointRadius: 2,
  },
  {
    label: t('simulator.dataset_decided'),
    data: [...cumulativeCo2.value],
    borderColor: '#00ff88',
    backgroundColor: 'rgba(0,255,136,0.08)',
    fill: false,
    tension: 0.4,
    pointRadius: 3,
  },
  {
    label: t('simulator.dataset_pessimist'),
    data: [...cumulativeCo2Pessimist.value],
    borderColor: '#f87171',
    backgroundColor: 'rgba(248,113,113,0.05)',
    fill: false,
    tension: 0.4,
    pointRadius: 2,
  },
])

const tempDatasets = computed<ChartDataset[]>(() => [
  {
    label: t('simulator.dataset_baseline'),
    data: [...BASELINE_TEMP],
    borderColor: '#64748b',
    backgroundColor: 'transparent',
    fill: false,
    tension: 0.4,
    pointRadius: 2,
  },
  {
    label: t('simulator.dataset_decided'),
    data: [...cumulativeTemp.value],
    borderColor: '#00ff88',
    backgroundColor: 'rgba(0,255,136,0.08)',
    fill: false,
    tension: 0.4,
    pointRadius: 3,
  },
  {
    label: t('simulator.dataset_pessimist'),
    data: [...cumulativeTempPessimist.value],
    borderColor: '#f87171',
    backgroundColor: 'transparent',
    fill: false,
    tension: 0.4,
    pointRadius: 2,
  },
  {
    label: t('simulator.threshold_paris'),
    data: SIM_LABELS.map(() => 1.5),
    borderColor: '#facc15',
    backgroundColor: 'transparent',
    fill: false,
    tension: 0,
    borderDash: [2, 4],
    pointRadius: 0,
  },
  {
    label: t('simulator.threshold_2c'),
    data: SIM_LABELS.map(() => 2),
    borderColor: '#f97316',
    backgroundColor: 'transparent',
    fill: false,
    tension: 0,
    borderDash: [8, 4],
    pointRadius: 0,
  },
])

// ─── Composant inline : matrice pairwise ─────────────────────────────────────

const PairwiseMatrix = defineComponent({
  name: 'PairwiseMatrix',
  props: {
    ballot:     { type: Object as PropType<DecisionBallot>, required: true },
    candidates: { type: Array as unknown as PropType<[MitigationPolicy, MitigationPolicy, MitigationPolicy]>, required: true },
  },
  setup(props: { ballot: DecisionBallot; candidates: [MitigationPolicy, MitigationPolicy, MitigationPolicy] }) {
    const { t: pt } = useI18n()
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
              title: total > 0 ? pt('policies.pairwise_voters', { count: v }) : '',
              class: `px-1.5 py-1.5 text-center text-xs font-bold ${wins ? 'text-eb-green bg-eb-green/10' : 'text-red-400 bg-red-500/5'} rounded`,
            }, total > 0 ? `${pct}%` : '—')
          }),
        ])
      )

      return h('div', { class: 'overflow-x-auto min-w-0' },
        h('table', {
          class: 'w-full text-xs border-separate border-spacing-0.5',
          'aria-label': pt('policies.pairwise_aria'),
        }, [
          h('caption', { class: 'sr-only' }, pt('policies.pairwise_caption')),
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
