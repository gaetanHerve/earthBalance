<template>
  <div v-if="activeBallot" class="rounded-xl border border-eb-cyan/30 bg-eb-mid/40 p-5 flex flex-col gap-5">

    <!-- Méta : votants · clôture · statut -->
    <div class="flex flex-wrap items-center gap-3 text-xs text-slate-500">
      <span class="flex items-center gap-1">
        <i class="fa fa-users text-eb-cyan" aria-hidden="true"></i>
        {{ activeBallot.totalVoters.toLocaleString(locale) }} {{ t('dashboard.voters') }}
      </span>
      <span class="flex items-center gap-1">
        <i class="fa fa-clock" aria-hidden="true"></i>
        {{ t('dashboard.deadline') }} : {{ formatDeadline(activeBallot.deadline) }}
      </span>
      <span v-if="hasVoted" class="flex items-center gap-1 text-eb-green font-bold">
        <i class="fa fa-circle-check" aria-hidden="true"></i>
        {{ t('dashboard.ranked_registered') }}
      </span>
    </div>

    <!-- Instructions / confirmation -->
    <p v-if="!hasVoted" class="text-sm text-slate-400 -mt-2">
      {{ t('policies.instructions_novote', { r1: t('policies.r1'), r2: t('policies.r2'), r3: t('policies.r3') }) }}
    </p>
    <p v-else class="text-sm text-eb-green -mt-2">
      <i class="fa fa-circle-check mr-1" aria-hidden="true"></i>
      {{ t('policies.ranked_done') }}
    </p>

    <!-- 3 cartes candidates avec boutons de rang -->
    <div
      v-if="localizedCandidates"
      class="grid grid-cols-1 sm:grid-cols-3 gap-3"
      role="group"
      :aria-label="t('policies.candidates_aria')"
    >
      <article
        v-for="(decision, idx) in localizedCandidates"
        :key="decision.id"
        class="rounded-xl border p-4 flex flex-col gap-3 transition-all"
        :class="getRankOf(decision.id) !== null
          ? 'border-eb-cyan/50 bg-eb-cyan/5'
          : 'border-eb-border bg-eb-dark/60'"
        :aria-label="t('policies.candidate_aria', { n: idx + 1, title: decision.title })"
      >
        <!-- Numéro + badge rang -->
        <div class="flex items-start justify-between gap-2">
          <span class="text-xs text-slate-500 font-mono">{{ decision.number }}</span>
          <span
            v-if="getRankOf(decision.id) !== null"
            class="text-xs font-black px-2 py-0.5 rounded-full bg-eb-cyan text-eb-dark"
            aria-live="polite"
          >{{ rankLabelSafe(decision.id) }}</span>
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
        </div>

        <!-- Boutons de rang -->
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
            :class="getRankOf(decision.id) === pos
              ? 'bg-eb-cyan text-eb-dark border-eb-cyan'
              : 'bg-transparent text-slate-400 border-eb-border hover:border-eb-cyan/50 hover:text-slate-200'"
            :aria-pressed="getRankOf(decision.id) === pos"
            @click="setRank(decision.id, pos as RankPosition)"
          >{{ label }}</button>
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
    <div
      v-if="!hasVoted"
      class="flex flex-wrap items-center gap-4 p-4 rounded-xl border border-eb-border bg-eb-mid/30"
    >
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

    <!-- Résultats (après vote, au moins un votant) -->
    <template v-if="activeBallot.totalVoters > 0 && localizedCandidates && activeResult">
      <!-- Bandeau gagnant -->
      <div
        class="flex items-center gap-3 p-3 rounded-lg border"
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
            <template v-if="activeResult.method === 'condorcet'">{{ t('policies.condorcet_winner') }}</template>
            <template v-else>{{ t('policies.cycle_detected') }}</template>
          </div>
          <div class="font-bold text-white text-sm">{{ localizedPolicy(activeResult.winnerPolicy).title }}</div>
        </div>
      </div>

      <!-- Scores de Borda si cycle -->
      <div
        v-if="activeResult.hasCycle && localizedCandidates"
        class="p-3 rounded-lg border border-yellow-700/30 bg-yellow-900/10"
      >
        <div class="text-xs font-bold text-yellow-400 mb-2">{{ t('policies.borda_scores_title') }}</div>
        <div class="flex gap-6">
          <div v-for="(d, i) in localizedCandidates" :key="d.id" class="text-xs">
            <span class="text-slate-400">{{ shortName(d) }} : </span>
            <span class="font-bold" :class="i === activeResult.winnerIdx ? 'text-yellow-300' : 'text-slate-300'">
              {{ activeResult.bordaScores[i] }}
            </span>
          </div>
        </div>
      </div>

      <!-- Matrice pairwise -->
      <PairwiseMatrix :ballot="activeBallot" :candidates="localizedCandidates" />
    </template>

    <div v-else-if="hasVoted" class="text-sm text-slate-500 italic text-center">
      {{ t('policies.first_voter') }}
    </div>

    <!-- Lien vers la page complète -->
    <div class="flex justify-end border-t border-eb-border/40 pt-4 -mb-1">
      <RouterLink
        to="/mitigation-policies"
        class="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-eb-cyan transition-colors focus-visible:ring-2 focus-visible:ring-eb-cyan rounded outline-none"
      >
        <i class="fa fa-arrow-up-right-from-square" aria-hidden="true"></i>
        {{ t('dashboard.see_full_page') }}
      </RouterLink>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h } from 'vue'
import type { PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { RouterLink } from 'vue-router'
import { useMitigationPoliciesStore } from '@/store/mitigationPolicies.store'
import { useLocalizedPolicies } from '@/composables/useLocalizedPolicies'
import type { RankPosition } from '@/store/mitigationPolicies.store'
import type { MitigationPolicy, DecisionBallot } from '@/types/index'

const { t, locale } = useI18n()
const { localizedPolicy } = useLocalizedPolicies()

const store = useMitigationPoliciesStore()
const {
  activeBallot, activeCandidates,
  ranking, hasVoted, isRankingComplete,
} = storeToRefs(store)
const { getRankOf, setRank, submitRanking, getBallotResult, getMitigationPolicy } = store

// ─── Candidats localisés ──────────────────────────────────────────────────────

const localizedCandidates = computed(() =>
  activeCandidates.value?.map(localizedPolicy) as [MitigationPolicy, MitigationPolicy, MitigationPolicy] | null
)

// ─── Résultat ─────────────────────────────────────────────────────────────────

const activeResult = computed(() =>
  activeBallot.value ? getBallotResult(activeBallot.value) : null
)

// ─── UI constants ─────────────────────────────────────────────────────────────

const rankButtons = computed(() => [t('policies.r1'), t('policies.r2'), t('policies.r3')] as const)

// ─── Helpers ─────────────────────────────────────────────────────────────────

function rankLabelSafe(id: string): string {
  const pos = getRankOf(id)
  return pos !== null ? rankButtons.value[pos] : ''
}

function getDecisionTitleAt(pos: number): string {
  const id = ranking.value[pos]
  const p = getMitigationPolicy(id ?? '')
  return p ? truncate(localizedPolicy(p).title, 28) : '—'
}

function impactVal(d: MitigationPolicy, key: string): number | undefined {
  return d.projectedImpact?.[key]
}

function shortName(d: MitigationPolicy): string {
  const words = d.title.split(' ')
  return words.slice(0, 4).join(' ') + (words.length > 4 ? '…' : '')
}

function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max) + '…' : s
}

function formatDeadline(iso: string): string {
  return new Date(iso).toLocaleDateString(locale.value, { day: 'numeric', month: 'long', year: 'numeric' })
}

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
          h('th', { scope: 'row', title: d.title, class: 'text-left pr-2 py-1.5 text-xs text-slate-400 font-normal max-w-[5rem] truncate' }, rowLabel(d)),
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
          h('thead', {}, [h('tr', {}, [
            h('th', { class: 'pr-2 py-1 text-left text-slate-600 font-normal text-xs' }, '↓ / →'),
            ...candidates.map((d, j) =>
              h('th', { key: j, scope: 'col', title: d.title, class: 'px-1.5 py-1 text-xs text-slate-500 font-normal text-center max-w-[4rem] truncate' }, colLabel(d))
            ),
          ])]),
          h('tbody', {}, rows),
        ])
      )
    }
  },
})
</script>
