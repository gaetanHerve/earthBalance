<template>
  <main class="max-w-screen-xl mx-auto px-4 py-6 space-y-8" id="main-content" tabindex="-1">

    <!-- Personnalisation des widgets -->
    <WidgetCustomizer :visible="visibleWidgets" @toggle="toggleWidget" />

    <!-- Indicateurs Écologiques -->
    <EcologicalIndicators
      v-if="ecologicalCharts"
      :eco="ecologicalCharts"
      :visible-widgets="visibleWidgets"
    />

    <!-- Indicateurs Sociétaux -->
    <SocietalIndicators
      v-if="societalIndicators"
      :soc="societalIndicators"
    />

    <!-- Scrutin collectif en cours (résumé) -->
    <section v-if="activeBallot" aria-labelledby="ballot-summary-title">
      <SectionTitle id="ballot-summary-title" title="Scrutin Collectif en Cours" icon="fa-vote-yea" color-class="text-eb-cyan" />

      <div class="rounded-xl border border-eb-cyan/30 bg-eb-mid/40 p-5 flex flex-col gap-4">
        <!-- Méta -->
        <div class="flex flex-wrap items-center gap-3 text-xs text-slate-500">
          <span class="flex items-center gap-1">
            <i class="fa fa-users text-eb-cyan" aria-hidden="true"></i>
            {{ activeBallot.totalVoters.toLocaleString('fr-FR') }} votants
          </span>
          <span class="flex items-center gap-1">
            <i class="fa fa-clock" aria-hidden="true"></i>
            Clôture : {{ formatDeadline(activeBallot.deadline) }}
          </span>
          <span v-if="hasVoted" class="flex items-center gap-1 text-eb-green font-bold">
            <i class="fa fa-circle-check" aria-hidden="true"></i>
            Votre classement a été enregistré
          </span>
        </div>

        <!-- 3 candidats (aperçu) -->
        <div v-if="activeCandidates" class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div
            v-for="(decision, idx) in activeCandidates"
            :key="decision.id"
            class="rounded-lg border border-eb-border bg-eb-dark/60 p-3"
          >
            <div class="text-xs text-slate-500 font-mono mb-1">Candidat {{ idx + 1 }}</div>
            <div class="text-sm font-bold text-white line-clamp-2 leading-snug">{{ decision.title }}</div>
          </div>
        </div>

        <!-- CTA -->
        <div class="flex justify-end">
          <RouterLink
            to="/decisions"
            class="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-eb-cyan text-eb-dark font-bold text-sm hover:bg-cyan-300 transition-colors focus-visible:ring-2 focus-visible:ring-eb-cyan outline-none"
          >
            <i class="fa fa-arrow-right" aria-hidden="true"></i>
            {{ hasVoted ? 'Voir les résultats' : 'Participer au scrutin' }}
          </RouterLink>
        </div>
      </div>
    </section>

  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import { useDashboardStore }  from '@/store/dashboard.store'
import { useDecisionsStore }  from '@/store/decisions.store'

import SectionTitle         from '@/components/layout/SectionTitle.vue'
import WidgetCustomizer     from '@/components/dashboard/WidgetCustomizer.vue'
import EcologicalIndicators from '@/components/dashboard/EcologicalIndicators.vue'
import SocietalIndicators   from '@/components/dashboard/SocietalIndicators.vue'

const dashStore      = useDashboardStore()
const decisionsStore = useDecisionsStore()

const { ecologicalCharts, societalIndicators, visibleWidgets } = storeToRefs(dashStore)
const { activeBallot, activeCandidates, hasVoted } = storeToRefs(decisionsStore)

onMounted(() => dashStore.fetchAll())

function toggleWidget(id: string): void {
  dashStore.toggleWidget(id)
}

function formatDeadline(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>
