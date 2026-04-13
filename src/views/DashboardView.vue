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

    <!-- Décision collective en cours -->
    <section v-if="activeDecision" aria-labelledby="decision-title">
      <SectionTitle id="decision-title" title="Décision Collective en Cours" icon="fa-vote-yea" color-class="text-eb-cyan" />

      <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div class="xl:col-span-2">
          <VoteCard
            :decision="activeDecision"
            :vote-pcts="votePcts"
            :consensus-pct="consensusPct"
            :user-vote="userVote"
            @vote="onVote"
          />
        </div>
        <BlockchainPanel
          :chain="blockchainState"
          :threshold="activeDecision.consensusThreshold"
          :current-pct="consensusPct"
          :has-consensus="hasReachedConsensus"
          :wallet-address="walletAddress"
          @validate="onValidate"
          @connect-wallet="connectWallet"
        />
      </div>
    </section>

    <!-- Analyse prospective (visible après validation) -->
    <ProspectivePanel
      v-if="activeDecision"
      :visible="isValidated"
      :decision="activeDecision"
      :final-consensus="consensusPct"
      :validated-hash="blockchainState?.lastHash ?? '0x…'"
      :validated-block="(blockchainState?.blocksValidated ?? 1847) + 1"
    />

  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import { useDashboardStore } from '@/store/dashboard.store'
import { useDecisionsStore } from '@/store/decisions.store'

import SectionTitle          from '@/components/layout/SectionTitle.vue'
import WidgetCustomizer      from '@/components/dashboard/WidgetCustomizer.vue'
import EcologicalIndicators  from '@/components/dashboard/EcologicalIndicators.vue'
import SocietalIndicators    from '@/components/dashboard/SocietalIndicators.vue'
import VoteCard              from '@/components/decisions/VoteCard.vue'
import BlockchainPanel       from '@/components/decisions/BlockchainPanel.vue'
import ProspectivePanel      from '@/components/decisions/ProspectivePanel.vue'

const dashStore      = useDashboardStore()
const decisionsStore = useDecisionsStore()

const { ecologicalCharts, societalIndicators, visibleWidgets } = storeToRefs(dashStore)
const {
  activeDecision, userVote, walletAddress, isValidated, blockchainState,
  votePcts, consensusPct, hasReachedConsensus,
} = storeToRefs(decisionsStore)

onMounted(async () => {
  await Promise.all([dashStore.fetchAll(), decisionsStore.fetchAll()])
})

import type { VoteOptionId } from '@/types/index'

function toggleWidget(id: string): void {
  dashStore.toggleWidget(id)
}

function onVote(optionId: VoteOptionId): void {
  decisionsStore.castVote(optionId)
}

async function onValidate() {
  await decisionsStore.validateDecision()
}

function connectWallet() {
  decisionsStore.connectWallet()
}
</script>
