<template>
  <main class="max-w-screen-xl mx-auto px-4 py-6 space-y-8" id="main-content" tabindex="-1">

    <div>
      <h1 class="text-2xl font-black text-white mb-1">Décisions Collectives</h1>
      <p class="text-sm text-slate-400 leading-relaxed">
        Votez sur les propositions soumises à la communauté. Chaque décision validée au-dessus du seuil de consensus
        est inscrite dans le registre EarthChain et influence les projections des indicateurs planétaires.
      </p>
    </div>

    <!-- Décision active -->
    <section v-if="activeDecision" aria-labelledby="active-decision-title">
      <SectionTitle id="active-decision-title" title="Décision en Cours" icon="fa-vote-yea" color-class="text-eb-cyan" />

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

    <!-- Analyse prospective -->
    <ProspectivePanel
      v-if="activeDecision"
      :visible="isValidated"
      :decision="activeDecision"
      :final-consensus="consensusPct"
      :validated-hash="blockchainState?.lastHash ?? '0x…'"
      :validated-block="(blockchainState?.blocksValidated ?? 1847) + 1"
    />

    <!-- Historique -->
    <section v-if="history.length" aria-labelledby="history-title">
      <SectionTitle id="history-title" title="Historique des Décisions" icon="fa-clock-rotate-left" color-class="text-slate-400" />

      <div class="space-y-3">
        <EbCard
          v-for="dec in history"
          :key="dec.id"
          extra-class="flex flex-wrap items-center justify-between gap-4"
        >
          <div>
            <div class="text-xs text-slate-500 mb-0.5">Proposition #{{ dec.number }}</div>
            <div class="text-sm font-bold text-slate-200">{{ dec.title }}</div>
          </div>
          <div class="flex items-center gap-3">
            <div class="flex gap-2 text-xs">
              <span class="text-eb-green font-bold">✅ Pour : {{ dec.votes.pour }}</span>
              <span class="text-red-400 font-bold">❌ Contre : {{ dec.votes.contre }}</span>
              <span class="text-slate-400 font-bold">⚪ Abst : {{ dec.votes.abst }}</span>
            </div>
            <span
              class="text-xs px-2 py-0.5 rounded-full font-bold"
              :class="dec.status === 'validated'
                ? 'bg-green-900/40 text-eb-green border border-green-700/30'
                : 'bg-red-900/40 text-red-400 border border-red-700/30'"
            >
              {{ dec.status === 'validated' ? '✓ Validée' : 'Rejetée' }}
            </span>
          </div>
        </EbCard>
      </div>
    </section>

  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useDecisionsStore } from '@/store/decisions.store'

import SectionTitle    from '@/components/layout/SectionTitle.vue'
import EbCard          from '@/components/layout/EbCard.vue'
import VoteCard        from '@/components/decisions/VoteCard.vue'
import BlockchainPanel from '@/components/decisions/BlockchainPanel.vue'
import ProspectivePanel from '@/components/decisions/ProspectivePanel.vue'

const store = useDecisionsStore()
const {
  activeDecision, history, userVote, walletAddress, isValidated, blockchainState,
  votePcts, consensusPct, hasReachedConsensus,
} = storeToRefs(store)

onMounted(() => store.fetchAll())

import type { VoteOptionId } from '@/types/index'
function onVote(optionId: VoteOptionId): void { store.castVote(optionId) }
async function onValidate() { await store.validateDecision() }
function connectWallet() { store.connectWallet() }
</script>
