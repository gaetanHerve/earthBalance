<template>
  <EbCard extra-class="border-eb-cyan/30" glow-class="shadow-[0_0_15px_rgba(0,229,255,0.2)]">
    <!-- En-tête décision -->
    <div class="flex items-start justify-between gap-4 mb-4">
      <div>
        <div class="text-xs text-eb-cyan font-bold uppercase tracking-widest mb-1">
          Proposition #{{ decision.number }}
        </div>
        <h2 class="text-lg font-black text-white leading-tight">{{ decision.title }}</h2>
      </div>
      <span class="shrink-0 text-xs bg-eb-cyan/10 text-eb-cyan border border-eb-cyan/30 px-2 py-1 rounded-full flex items-center gap-1">
        <span class="w-1.5 h-1.5 rounded-full bg-eb-cyan animate-pulse-dot inline-block" aria-hidden="true"></span>
        En cours
      </span>
    </div>

    <!-- Description -->
    <p class="text-sm text-slate-400 mb-5 leading-relaxed">{{ decision.description }}</p>

    <!-- Sources documentaires -->
    <div v-if="decision.resources?.length" class="mb-5">
      <div class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
        <i class="fa fa-book-open mr-1" aria-hidden="true"></i> Documentation
      </div>
      <ul class="space-y-2">
        <li
          v-for="res in decision.resources"
          :key="res.url"
          class="bg-eb-mid rounded-lg p-3 border border-eb-border text-xs"
        >
          <a
            :href="res.url"
            target="_blank"
            rel="noopener noreferrer"
            class="text-eb-cyan font-semibold hover:underline focus-visible:ring-2 focus-visible:ring-eb-cyan rounded"
          >{{ res.title }}</a>
          <p class="text-slate-500 mt-1">{{ res.excerpt }}</p>
        </li>
      </ul>
    </div>

    <!-- Barres de vote -->
    <div class="space-y-3 mb-5" aria-label="Résultats du vote">
      <div v-for="opt in decision.options" :key="opt.id">
        <div class="flex justify-between text-xs mb-1">
          <span class="font-bold" :style="{ color: effectiveColor(opt) }">
            <i :class="optionIcon(opt.id)" aria-hidden="true"></i>
            {{ opt.label }}
          </span>
          <span class="font-bold" :style="{ color: effectiveColor(opt) }">{{ votePcts[opt.id] }}%</span>
        </div>
        <div class="bg-eb-border rounded-full h-3 overflow-hidden" role="progressbar" :aria-valuenow="votePcts[opt.id]" aria-valuemin="0" aria-valuemax="100">
          <div
            class="h-full rounded-full transition-all duration-700"
            :style="{ width: votePcts[opt.id] + '%', background: voteBarGradient(opt.id) }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Barre de consensus -->
    <div class="flex items-center gap-3 mb-5 text-xs">
      <div class="flex-1 bg-slate-800 rounded-full h-2 relative overflow-hidden">
        <div
          class="h-full rounded-full transition-all duration-700"
          :style="{ width: consensusPct + '%', background: 'linear-gradient(90deg,#00e5ff,#00ff88)' }"
        ></div>
        <div
          class="absolute top-0 h-full border-r-2 border-yellow-400 border-dashed"
          :style="{ left: decision.consensusThreshold + '%' }"
          aria-hidden="true"
        ></div>
      </div>
      <span class="text-yellow-400 font-bold whitespace-nowrap">Seuil : {{ decision.consensusThreshold }}%</span>
    </div>

    <!-- Compteurs de votes -->
    <div class="grid grid-cols-3 gap-3 mb-5 text-center" aria-label="Décompte des votes">
      <div v-for="opt in decision.options" :key="opt.id" :class="[opt.bgClass, 'border rounded-lg p-2', opt.borderClass]">
        <div class="text-xl font-black" :style="{ color: effectiveColor(opt) }">
          {{ decision.votes[opt.id].toLocaleString('fr-FR') }}
        </div>
        <div class="text-xs text-slate-500">{{ opt.label }}</div>
      </div>
    </div>

    <!-- Boutons de vote -->
    <div v-if="!userVote" class="flex gap-3 flex-wrap" role="group" aria-label="Voter">
      <button
        v-for="opt in decision.options"
        :key="opt.id"
        class="vote-btn flex items-center gap-1 px-5 py-2 rounded-xl font-bold text-sm border transition-all hover:scale-105 focus-visible:ring-2 focus-visible:ring-eb-cyan outline-none"
        :style="{ color: opt.color, borderColor: opt.color, backgroundColor: opt.bgClass.replace('bg-', 'rgba(').replace('/10', ',0.1)') }"
        :class="opt.bgClass"
        @click="$emit('vote', opt.id)"
      >
        {{ voteEmoji(opt.id) }} Voter {{ opt.label }}
      </button>
    </div>

    <!-- Feedback post-vote -->
    <div v-else class="flex items-center gap-2 text-xs text-slate-400 mt-2" role="status" aria-live="polite">
      <i class="fa fa-check-circle text-eb-green" aria-hidden="true"></i>
      Votre vote <strong class="text-eb-green">{{ labelForVote(userVote) }}</strong> a été enregistré.
      <span class="text-slate-500">(TODO: soumis à la blockchain)</span>
    </div>
  </EbCard>
</template>

<script setup lang="ts">
import type { Decision, VotePcts, VoteOptionId } from '@/types/index'
import EbCard from '@/components/layout/EbCard.vue'
import { useContrastMode } from '@/composables/useContrastMode'

const { highContrast } = useContrastMode()

// En mode fort contraste, #475569 (abst) n'est pas lisible sur fond sombre :
// on le remplace par #cbd5e1 (slate-300 = ratio ~9.6:1 sur #111827)
function effectiveColor(opt: { id: string; color: string }): string {
  if (highContrast.value && opt.id === 'abst') return '#cbd5e1'
  return opt.color
}

const props = defineProps<{
  decision:     Decision
  votePcts:     VotePcts
  consensusPct: number
  userVote:     VoteOptionId | null
}>()

defineEmits<{ vote: [optionId: VoteOptionId] }>()

function optionIcon(id: string): string {
  return ({ pour: 'fa fa-check', contre: 'fa fa-xmark', abst: 'fa fa-circle' } as Record<string, string>)[id] ?? 'fa fa-circle'
}

function voteEmoji(id: string): string {
  return ({ pour: '✅', contre: '❌', abst: '⚪' } as Record<string, string>)[id] ?? ''
}

function labelForVote(id: VoteOptionId): string {
  return props.decision.options.find((o: { id: string }) => o.id === id)?.label ?? id
}

function voteBarGradient(id: string): string {
  return ({
    pour:   'linear-gradient(90deg,#00ff88,#00cc66)',
    contre: 'linear-gradient(90deg,#ff5050,#cc2222)',
    abst:   '#475569',
  } as Record<string, string>)[id] ?? '#475569'
}
</script>
