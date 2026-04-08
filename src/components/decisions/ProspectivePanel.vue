<template>
  <section v-if="visible" class="animate-fade-in-up">
    <SectionTitle title="Analyse Prospective — Décision Validée" icon="fa-chart-line" color-class="text-eb-green" />

    <!-- Badge validation -->
    <div
      class="flex items-center gap-3 mb-6 p-3 rounded-xl border border-eb-green/30 bg-gradient-to-r from-eb-green/10 to-eb-cyan/5"
      role="status"
      aria-live="polite"
    >
      <i class="fa fa-shield-check text-eb-green text-2xl" aria-hidden="true"></i>
      <div>
        <div class="font-black text-eb-green">Décision validée par la communauté</div>
        <div class="text-xs text-slate-400 font-mono mt-0.5">
          Hash : <span class="text-eb-cyan">{{ validatedHash }}</span> · Bloc #{{ validatedBlock }}
        </div>
      </div>
      <div class="ml-auto text-right">
        <div class="text-xs text-slate-500">Consensus atteint</div>
        <div class="text-eb-green font-black text-lg">{{ finalConsensus }}%</div>
      </div>
    </div>

    <!-- Graphiques de projection -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <EbCard>
        <div class="text-sm font-bold text-slate-200 mb-3">
          <i class="fa fa-smog text-red-400 mr-2" aria-hidden="true"></i>Projection CO₂ — Scénarios
        </div>
        <LineChart
          canvas-id="prospCO2Chart"
          :labels="decision.projections.labels"
          :datasets="co2Datasets"
          :height="200"
          :show-legend="true"
          aria-label="Projection des émissions CO₂ selon trois scénarios"
        />
      </EbCard>
      <EbCard>
        <div class="text-sm font-bold text-slate-200 mb-3">
          <i class="fa fa-thermometer-half text-orange-400 mr-2" aria-hidden="true"></i>Projection Température — Scénarios
        </div>
        <LineChart
          canvas-id="prospTempChart"
          :labels="decision.projections.labels"
          :datasets="tempDatasets"
          :height="200"
          :show-legend="true"
          aria-label="Projection de la température globale selon trois scénarios"
        />
      </EbCard>
    </div>

    <!-- Narratifs scénarios -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <EbCard
        v-for="(scenario, key) in narratives"
        :key="key"
        :extra-class="'border ' + scenario.borderClass"
      >
        <div class="text-xs font-bold uppercase tracking-widest mb-2" :class="scenario.colorClass">
          <i :class="['fa', scenarioIcon(key), 'mr-1']" aria-hidden="true"></i>
          {{ scenario.label }} — {{ scenario.horizon }}
        </div>
        <p class="text-sm text-slate-400 leading-relaxed" v-html="formatText(scenario.text)"></p>
      </EbCard>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import EbCard from '@/components/layout/EbCard.vue'
import SectionTitle from '@/components/layout/SectionTitle.vue'
import LineChart from '@/components/charts/LineChart.vue'

import type { Decision } from '@/types/index'

const props = withDefaults(defineProps<{
  visible?:        boolean
  decision:        Decision
  finalConsensus?: number
  validatedHash?:  string
  validatedBlock?: number
}>(), { visible: false, finalConsensus: 68, validatedHash: '0x…', validatedBlock: 1848 })

const narratives = computed(() => props.decision.prospectiveNarratives ?? {})

const co2Datasets = computed(() => {
  const p = props.decision.projections?.co2
  if (!p) return []
  return [
    { label: 'Scénario décidé',   data: p.decided,   borderColor: '#00ff88', backgroundColor: 'rgba(0,255,136,0.08)', fill: true },
    { label: 'Référence (BAU)',   data: p.baseline,  borderColor: '#ff5050', backgroundColor: 'rgba(255,80,80,0.05)',  fill: false },
    { label: 'Scénario pessimiste', data: p.pessimist, borderColor: '#fb923c', backgroundColor: 'transparent',         fill: false },
  ]
})

const tempDatasets = computed(() => {
  const p = props.decision.projections?.temperature
  if (!p) return []
  return [
    { label: 'Scénario décidé',   data: p.decided,   borderColor: '#00ff88', backgroundColor: 'rgba(0,255,136,0.08)', fill: true },
    { label: 'Référence (BAU)',   data: p.baseline,  borderColor: '#ff5050', backgroundColor: 'rgba(255,80,80,0.05)',  fill: false },
    { label: 'Scénario pessimiste', data: p.pessimist, borderColor: '#fb923c', backgroundColor: 'transparent',         fill: false },
  ]
})

function scenarioIcon(key: string): string {
  return ({ optimistic: 'fa-plus-circle', moderate: 'fa-chart-line', pessimistic: 'fa-minus-circle' } as Record<string, string>)[key] ?? 'fa-circle'
}

function formatText(text: string | undefined): string {
  return text?.replace(/\*\*(.+?)\*\*/g, '<strong class="text-slate-200">$1</strong>') ?? ''
}
</script>
