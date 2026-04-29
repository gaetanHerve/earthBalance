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
    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <ChartSkeleton v-for="i in 5" :key="i"
        :class="i === 1 ? 'col-span-1 md:col-span-2' : ''"
        :height="220"
      />
    </div>

    <!-- Indicateurs Sociétaux -->
    <SocietalIndicators
      v-if="societalIndicators"
      :soc="societalIndicators"
    />
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ChartSkeleton v-for="i in 4" :key="i" :height="180" />
    </div>

    <!-- Extrêmes climatiques -->
    <section aria-labelledby="extremes-title">
      <SectionTitle id="extremes-title" :title="t('dashboard.extremes_section')" icon="fa-bolt" color-class="text-orange-400" />
      <ExtremeEventsWidget />
    </section>

    <!-- Scrutin collectif en cours -->
    <section v-if="activeBallot" aria-labelledby="ballot-summary-title">
      <SectionTitle id="ballot-summary-title" :title="t('dashboard.ballot_section')" icon="fa-vote-yea" color-class="text-eb-cyan" />
      <BallotWidget />
    </section>

  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'

import { useDashboardStore }          from '@/store/dashboard.store'
import { useMitigationPoliciesStore } from '@/store/mitigationPolicies.store'

import SectionTitle         from '@/components/layout/SectionTitle.vue'
import WidgetCustomizer     from '@/components/dashboard/WidgetCustomizer.vue'
import EcologicalIndicators from '@/components/dashboard/EcologicalIndicators.vue'
import SocietalIndicators   from '@/components/dashboard/SocietalIndicators.vue'
import BallotWidget           from '@/components/dashboard/BallotWidget.vue'
import ExtremeEventsWidget   from '@/components/dashboard/ExtremeEventsWidget.vue'
import ChartSkeleton        from '@/components/charts/ChartSkeleton.vue'

const { t } = useI18n()
const dashStore               = useDashboardStore()
const mitigationPoliciesStore = useMitigationPoliciesStore()

const { ecologicalCharts, societalIndicators, visibleWidgets } = storeToRefs(dashStore)
const { activeBallot } = storeToRefs(mitigationPoliciesStore)

onMounted(() => dashStore.fetchAll())

function toggleWidget(id: string): void {
  dashStore.toggleWidget(id)
}
</script>
