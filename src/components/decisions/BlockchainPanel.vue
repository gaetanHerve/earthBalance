<template>
  <EbCard>
    <div class="text-sm font-bold text-slate-200 flex items-center gap-2 mb-4">
      <i class="fa fa-link text-eb-cyan" aria-hidden="true"></i>
      Registre Blockchain
    </div>

    <!-- Données de la chaîne -->
    <div
      class="font-mono text-xs bg-eb-deep border border-eb-border rounded-lg p-3 space-y-2 mb-4"
      aria-label="État du registre blockchain"
    >
      <div class="flex justify-between items-center">
        <span class="text-slate-500">Dernier hash</span>
        <span class="text-eb-green" aria-live="polite">{{ chain?.lastHash ?? '0x…' }}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-slate-500">Blocs validés</span>
        <span class="text-eb-cyan font-bold" aria-live="polite">
          {{ chain?.blocksValidated?.toLocaleString('fr-FR') ?? '—' }}
        </span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-slate-500">Nœuds actifs</span>
        <span class="text-slate-300">{{ chain?.activeNodes ?? '—' }}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-slate-500">Dernier bloc</span>
        <span class="text-slate-300" aria-live="polite">il y a {{ secondsAgo }}s</span>
      </div>
    </div>

    <!-- Statut consensus -->
    <div
      class="text-center py-2 px-3 rounded-lg text-sm font-bold mb-4"
      :class="hasConsensus
        ? 'bg-green-900/30 text-eb-green border border-green-700/40'
        : 'bg-yellow-900/30 text-yellow-400 border border-yellow-700/40'"
      role="status"
      aria-live="polite"
    >
      <i :class="['fa', hasConsensus ? 'fa-check-circle' : 'fa-hourglass-half', 'mr-1']" aria-hidden="true"></i>
      {{ hasConsensus ? 'Consensus atteint' : 'En attente de consensus' }}
    </div>

    <!-- Métriques consensus -->
    <div class="text-xs text-slate-500 space-y-1 mb-4">
      <div class="flex justify-between">
        <span>Consensus requis</span>
        <span class="text-yellow-400 font-bold">{{ threshold }}%</span>
      </div>
      <div class="flex justify-between">
        <span>Consensus actuel</span>
        <span class="text-eb-green font-bold" aria-live="polite">{{ currentPct }}%</span>
      </div>
      <div class="flex justify-between">
        <span>Temps restant</span>
        <span class="text-eb-cyan font-bold" aria-live="polite">{{ countdown }}</span>
      </div>
    </div>

    <!-- Visualisation mini-blocs -->
    <div class="mb-4">
      <div class="text-xs text-slate-500 mb-2">Chaîne de blocs récents</div>
      <div class="flex gap-1 flex-wrap" aria-label="Blocs récents validés">
        <div
          v-for="(block, i) in recentBlocks"
          :key="i"
          class="w-7 h-7 rounded text-center text-xs font-mono flex items-center justify-center border"
          :class="block.valid
            ? 'bg-eb-green/20 border-eb-green/40 text-eb-green'
            : 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400'"
          :title="block.hash"
          :aria-label="`Bloc ${block.id} — ${block.valid ? 'validé' : 'en attente'}`"
        >
          {{ block.id }}
        </div>
      </div>
    </div>

    <!-- Connexion wallet -->
    <div class="mb-3">
      <div v-if="walletAddress" class="text-xs text-eb-green font-mono truncate" aria-live="polite">
        <i class="fa fa-wallet mr-1" aria-hidden="true"></i>
        {{ walletAddress }}
      </div>
      <button
        v-else
        class="w-full py-1.5 rounded-lg text-xs font-bold border border-eb-border text-slate-400 bg-eb-mid hover:border-eb-cyan/50 hover:text-eb-cyan transition-all focus-visible:ring-2 focus-visible:ring-eb-cyan outline-none mb-2"
        @click="$emit('connect-wallet')"
      >
        <i class="fa fa-wallet mr-1" aria-hidden="true"></i>
        Connecter un wallet (TODO)
      </button>
    </div>

    <!-- Bouton validation forcée (démo) -->
    <button
      class="w-full py-2 rounded-lg text-sm font-bold border border-eb-cyan/40 text-eb-cyan bg-eb-cyan/10 hover:bg-eb-cyan/20 transition-all focus-visible:ring-2 focus-visible:ring-eb-cyan outline-none"
      @click="$emit('validate')"
    >
      <i class="fa fa-gavel mr-1" aria-hidden="true"></i>
      Forcer la validation (démo)
    </button>
  </EbCard>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import EbCard from '@/components/layout/EbCard.vue'

import type { BlockchainState } from '@/types/index'

const props = withDefaults(defineProps<{
  chain:         BlockchainState | null
  threshold?:    number
  currentPct?:   number
  hasConsensus?: boolean
  walletAddress?:string | null
}>(), { threshold: 67, currentPct: 0, hasConsensus: false, walletAddress: null, chain: null })

defineEmits<{ validate: []; 'connect-wallet': [] }>()

const secondsAgo = ref<number>(8)
const countdown  = ref<string>('14:32')

let timer: ReturnType<typeof setInterval> | null = null
onMounted(() => {
  timer = setInterval(() => {
    secondsAgo.value = Math.floor(Math.random() * 15) + 1
  }, 3000)
})
onBeforeUnmount(() => { if (timer !== null) clearInterval(timer) })

const recentBlocks = computed(() => {
  const n = props.chain?.blocksValidated ?? 1847
  return Array.from({ length: 10 }, (_, i) => ({
    id: ((n - 9 + i) % 100).toString().padStart(2, '0'),
    hash: '0x' + Math.random().toString(16).slice(2, 6),
    valid: i < 9,
  }))
})
</script>
