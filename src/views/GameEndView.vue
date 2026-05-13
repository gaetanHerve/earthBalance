<template>
  <main class="max-w-screen-2xl mx-auto px-4 py-6 space-y-8" id="main-content" tabindex="-1">

    <!-- Hero -->
    <div
      class="rounded-2xl border p-8 text-center"
      :class="{
        'border-eb-green/40 bg-eb-green/5':  score.overall === 'good',
        'border-amber-500/40 bg-amber-900/10': score.overall === 'warning',
        'border-red-600/40 bg-red-900/10':    score.overall === 'critical',
      }"
    >
      <h1 class="text-3xl font-black text-white mb-1">{{ t('bilan.title') }}</h1>
      <p class="text-slate-400 text-sm mb-8">{{ t('bilan.subtitle') }}</p>

      <!-- Overall verdict chip -->
      <div
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-base mb-8"
        :class="{
          'bg-eb-green/15 text-eb-green border border-eb-green/40':      score.overall === 'good',
          'bg-amber-500/15 text-amber-400 border border-amber-500/40':   score.overall === 'warning',
          'bg-red-500/15 text-red-400 border border-red-500/40':         score.overall === 'critical',
        }"
        role="status"
        :aria-label="overallLabel"
      >
        <i
          class="fas"
          :class="{
            'fa-circle-check':       score.overall === 'good',
            'fa-triangle-exclamation': score.overall === 'warning',
            'fa-circle-xmark':       score.overall === 'critical',
          }"
          aria-hidden="true"
        ></i>
        {{ overallLabel }}
      </div>

      <!-- Key figures -->
      <div class="flex flex-wrap justify-center gap-10">
        <div class="text-center">
          <div
            class="text-5xl font-black tabular-nums"
            :class="{
              'text-eb-green':  score.overall === 'good',
              'text-amber-400': score.overall === 'warning',
              'text-red-400':   score.overall === 'critical',
            }"
          >
            +{{ score.tempAt2100 }}&nbsp;°C
          </div>
          <div class="text-xs text-slate-500 mt-1 uppercase tracking-widest">{{ t('bilan.indicator_temp') }}</div>
        </div>
        <div class="text-center">
          <div
            class="text-5xl font-black tabular-nums"
            :class="{
              'text-eb-green':  score.tippingCount === 0,
              'text-amber-400': score.tippingCount > 0 && score.tippingCount <= 2,
              'text-red-400':   score.tippingCount > 2,
            }"
          >
            {{ score.tippingCount }}<span class="text-2xl text-slate-500">/5</span>
          </div>
          <div class="text-xs text-slate-500 mt-1 uppercase tracking-widest">{{ t('bilan.indicator_tipping') }}</div>
        </div>
      </div>
    </div>

    <!-- Narrative -->
    <EbCard>
      <h2 class="text-lg font-bold text-white mb-3">{{ t(`bilan.narrative_${narrativeId}_title`) }}</h2>
      <p class="text-slate-300 leading-relaxed text-sm">{{ t(`bilan.narrative_${narrativeId}_body`) }}</p>
    </EbCard>

    <!-- Pillars -->
    <div class="grid gap-4 lg:grid-cols-3">
      <EbCard
        v-for="pillar in score.pillars"
        :key="pillar.id"
        :extra-class="pillar.category === 'critical' ? 'border-red-700/60' : pillar.category === 'warning' ? 'border-amber-600/40' : 'border-eb-green/30'"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-bold text-white text-sm">
            <i class="fas mr-2" :class="pillarIcon(pillar.id)" aria-hidden="true"></i>
            {{ t(`bilan.pillar_${pillar.id}`) }}
          </h2>
          <span
            class="text-xs px-2 py-0.5 rounded-full font-semibold"
            :class="categoryChip(pillar.category)"
          >
            {{ t(`score.${pillar.category}`) }}
          </span>
        </div>

        <ul class="space-y-3" role="list">
          <li
            v-for="ind in pillar.indicators"
            :key="ind.id"
            class="flex items-start justify-between gap-3"
          >
            <span class="text-slate-400 text-xs leading-snug flex-1">{{ t(`bilan.indicator_${ind.id}`) }}</span>
            <div class="text-right shrink-0">
              <div class="font-mono font-bold text-sm" :class="categoryText(ind.category)">
                {{ ind.value }}{{ ind.unit }}
              </div>
              <div class="text-slate-600 text-[10px] tabular-nums">
                {{ t('bilan.vs_baseline') }} {{ ind.baseline }}{{ ind.unit }}
              </div>
            </div>
            <i
              class="fas text-xs mt-0.5 shrink-0"
              :class="{
                'fa-arrow-up text-eb-green':  ind.higherIsBetter && ind.category === 'good',
                'fa-arrow-down text-eb-green': !ind.higherIsBetter && ind.category === 'good',
                'fa-arrow-up text-amber-400':  ind.higherIsBetter && ind.category === 'warning',
                'fa-arrow-down text-amber-400': !ind.higherIsBetter && ind.category === 'warning',
                'fa-arrow-down text-red-400':  ind.higherIsBetter && ind.category === 'critical',
                'fa-arrow-up text-red-400':    !ind.higherIsBetter && ind.category === 'critical',
              }"
              :aria-label="ind.category"
            ></i>
          </li>
        </ul>
      </EbCard>
    </div>

    <!-- Adopted policies -->
    <EbCard>
      <h2 class="text-lg font-bold text-white mb-4">{{ t('bilan.policies_adopted') }}</h2>
      <p v-if="!adoptedPolicies.length" class="text-slate-500 text-sm italic">{{ t('bilan.policies_none') }}</p>
      <ol v-else class="space-y-2 list-decimal list-inside" role="list">
        <li
          v-for="pol in adoptedPolicies"
          :key="pol.id"
          class="text-slate-300 text-sm flex items-baseline gap-2"
        >
          <router-link
            :to="`/mitigation-policies/${pol.id}`"
            class="hover:text-eb-cyan transition-colors focus-visible:ring-1 focus-visible:ring-eb-cyan rounded outline-none"
          >
            {{ pol.title }}
          </router-link>
          <span class="text-slate-600 text-xs tabular-nums shrink-0">({{ pol.year }})</span>
        </li>
      </ol>
    </EbCard>

  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import EbCard from '@/components/layout/EbCard.vue'
import { useSimulationStore } from '@/store/simulation.store'
import { useTippingPointsStore } from '@/store/tippingPoints.store'
import { useMitigationPoliciesStore } from '@/store/mitigationPolicies.store'
import { useLocalizedPolicies } from '@/composables/useLocalizedPolicies'
import { computeGameScore, narrativeKey, type ScoreCategory } from '@/utils/gameScore'

const { t } = useI18n()
const simStore    = useSimulationStore()
const tpStore     = useTippingPointsStore()
const polStore    = useMitigationPoliciesStore()
const { localizedPolicy } = useLocalizedPolicies()

const score = computed(() =>
  computeGameScore(
    {
      cumulativeTemp:                    simStore.cumulativeTemp,
      cumulativeTempPessimist:           simStore.cumulativeTempPessimist,
      cumulativeForest:                  simStore.cumulativeForest,
      cumulativeForestPessimist:         simStore.cumulativeForestPessimist,
      cumulativeEnergyMix:               simStore.cumulativeEnergyMix,
      cumulativeEnergyMixPessimist:      simStore.cumulativeEnergyMixPessimist,
      cumulativeFoodSecurity:            simStore.cumulativeFoodSecurity,
      cumulativeFoodSecurityPessimist:   simStore.cumulativeFoodSecurityPessimist,
      cumulativeWaterAccess:             simStore.cumulativeWaterAccess,
      cumulativeWaterAccessPessimist:    simStore.cumulativeWaterAccessPessimist,
      cumulativeWhoHealthIndex:          simStore.cumulativeWhoHealthIndex,
      cumulativeWhoHealthIndexPessimist: simStore.cumulativeWhoHealthIndexPessimist,
      cumulativeClimateMigrations:       simStore.cumulativeClimateMigrations,
      cumulativeClimateMigrationsPessimist: simStore.cumulativeClimateMigrationsPessimist,
      cumulativeGiniCoefficient:             simStore.cumulativeGiniCoefficient,
      cumulativeGiniCoefficientPessimist:    simStore.cumulativeGiniCoefficientPessimist,
    },
    tpStore.triggeredList.length,
  )
)

const narrativeId = computed(() => narrativeKey(score.value.tempAt2100))

const overallLabel = computed(() => {
  if (score.value.overall === 'good')     return t('bilan.overall_good')
  if (score.value.overall === 'warning')  return t('bilan.overall_warning')
  return t('bilan.overall_critical')
})

const adoptedPolicies = computed(() =>
  polStore.validatedPolicyMeta.map(meta => {
    const raw = polStore.getMitigationPolicy(meta.id)
    if (!raw) return null
    const loc = localizedPolicy(raw)
    return { id: meta.id, title: loc.title, year: meta.year }
  }).filter((p): p is { id: string; title: string; year: number } => p !== null)
)

function pillarIcon(id: string): string {
  if (id === 'climate')  return 'fa-leaf'
  if (id === 'societal') return 'fa-people-group'
  return 'fa-bolt'
}

function categoryChip(cat: ScoreCategory): string {
  if (cat === 'good')     return 'bg-eb-green/15 text-eb-green'
  if (cat === 'warning')  return 'bg-amber-500/15 text-amber-400'
  return 'bg-red-500/15 text-red-400'
}

function categoryText(cat: ScoreCategory): string {
  if (cat === 'good')     return 'text-eb-green'
  if (cat === 'warning')  return 'text-amber-400'
  return 'text-red-400'
}

</script>
