<template>
  <main class="max-w-screen-2xl mx-auto px-4 py-6 space-y-6" id="main-content" tabindex="-1">
    <!-- ─── En-tête ─────────────────────────────────────────────────────────── -->
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black text-white mb-1 flex items-center gap-2">
          <i class="fa fa-flask text-eb-cyan" aria-hidden="true"></i>
          {{ t('simulator.title') }}
        </h1>
        <p class="text-sm text-slate-400 max-w-2xl leading-relaxed">{{ t('simulator.intro') }}</p>
      </div>
      <div class="flex items-center gap-3 flex-wrap">
        <!-- Sélecteur d'horizon -->
        <fieldset class="flex items-center gap-2 border-0 p-0 m-0">
          <legend class="text-xs text-slate-500 float-left mr-2">
            <i class="fa fa-clock" aria-hidden="true"></i> {{ t('simulator.horizon_label') }} :
          </legend>
          <button
            v-for="h in horizons"
            :key="h.value"
            class="text-xs px-3 py-1.5 rounded-full border transition-all focus-visible:ring-2 focus-visible:ring-eb-cyan outline-none"
            :class="selectedHorizon === h.value
              ? 'bg-eb-cyan text-eb-dark border-eb-cyan font-bold'
              : 'bg-transparent text-slate-400 border-eb-border hover:border-eb-cyan/50'"
            :aria-pressed="selectedHorizon === h.value"
            @click="planetsStore.setHorizon(h.value)"
          >
            {{ h.label }}
          </button>
        </fieldset>
        <!-- Reset -->
        <button
          class="flex items-center gap-2 text-xs px-4 py-2 rounded-full border border-slate-600 text-slate-400 hover:border-red-500/50 hover:text-red-400 transition-all"
          :disabled="selectedMitigationPolicies.length === 0"
          :class="selectedMitigationPolicies.length === 0 ? 'opacity-40 cursor-not-allowed' : ''"
          @click="reset"
        >
          <i class="fa fa-rotate-left" aria-hidden="true"></i>
          {{ t('simulator.reset') }}
        </button>
      </div>
    </div>

    <!-- ─── Bandeau budget climatique ───────────────────────────────────────── -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">

      <EbCard extra-class="text-center !py-3 !px-4">
        <div class="text-xs text-slate-500 mb-1">{{ t('simulator.baseline_label', { year: selectedHorizon }) }}</div>
        <div class="text-2xl font-black text-red-400">+{{ baselineAtHorizon.toFixed(2) }}°C</div>
        <div class="text-xs text-slate-500 mt-0.5">{{ t('simulator.baseline_note') }}</div>
      </EbCard>

      <EbCard extra-class="text-center !py-3 !px-4" :glow-class="tempGlowClass">
        <div class="text-xs text-slate-500 mb-1">{{ t('simulator.decided_label', { year: selectedHorizon }) }}</div>
        <div class="text-2xl font-black" :class="tempDecidedColor">
          +{{ tempDecidedAtHorizon.toFixed(2) }}°C
        </div>
        <div class="text-xs mt-0.5" :class="tempDecidedColor">
          {{ tempDecidedLabel }}
        </div>
      </EbCard>

      <EbCard extra-class="text-center !py-3 !px-4">
        <div class="text-xs text-slate-500 mb-1">{{ t('simulator.co2_saved_label', { year: selectedHorizon }) }}</div>
        <div class="text-2xl font-black text-eb-green">
          {{ co2CumulativeSaved >= 0 ? '' : '-' }}{{ co2CumulativeSaved }} GtCO₂
        </div>
        <div class="text-xs text-slate-500 mt-0.5">{{ t('simulator.co2_saved_note') }}</div>
      </EbCard>

      <EbCard extra-class="text-center !py-3 !px-4">
        <div class="text-xs text-slate-500 mb-1">{{ t('simulator.reduction_label', { year: selectedHorizon }) }}</div>
        <div class="text-2xl font-black text-eb-cyan">
          {{ totalReductionAtHorizon >= 0 ? '' : '-' }}{{ totalReductionAtHorizon.toFixed(1) }} Gt/an
        </div>
        <div class="text-xs text-slate-500 mt-0.5">{{ t('simulator.reduction_note') }}</div>
      </EbCard>

    </div>

    <!-- ─── Réseau de politiques ────────────────────────────────────────────── -->
    <CollapsibleSection :title="t('simulator.catalogue_title')" icon="fa-list-check" color-class="text-slate-300">
      <PolicyNetworkGraph mode="simulation" />
    </CollapsibleSection>

    <!-- ─── Corps principal : 2 colonnes ───────────────────────────────────── -->
    <div class="grid grid-cols-1 xl:grid-cols-8 gap-4">

      <!-- ── Séquence ─────────────────────────────────────────────────────── -->
      <CollapsibleSection class="xl:col-span-3" :title="t('simulator.sequence_title')" icon="fa-arrow-down-1-9" color-class="text-slate-300">

        <template #header-extra>
          <button
            class="text-xs px-2.5 py-1 rounded-full border transition-all focus-visible:ring-2 focus-visible:ring-eb-cyan outline-none shrink-0"
            :class="includeGameBaseline
              ? 'bg-eb-green/10 text-eb-green border-eb-green/30 hover:bg-eb-green/20'
              : 'bg-transparent text-slate-400 border-slate-600 hover:border-eb-cyan/50 hover:text-slate-200'"
            :aria-pressed="includeGameBaseline"
            @click="toggleGameBaseline"
          >
            <i :class="['fa', includeGameBaseline ? 'fa-lock' : 'fa-unlock', 'mr-1']" aria-hidden="true"></i>
            {{ includeGameBaseline ? t('simulator.mode_game') : t('simulator.mode_free') }}
          </button>
        </template>

        <!-- État vide -->
        <div
          v-if="selectedMitigationPolicies.length === 0"
          class="border border-dashed border-eb-border rounded-card p-6 text-center text-slate-500 text-xs"
        >
          <i class="fa fa-hand-pointer text-2xl mb-2 block opacity-30" aria-hidden="true"></i>
          {{ t('simulator.empty_sequence') }}
        </div>

        <!-- Séquence ordonnée -->
        <TransitionGroup name="seq" tag="div" class="space-y-2">
          <div
            v-for="(dec, index) in selectedMitigationPolicies"
            :key="dec.id"
            class="bg-eb-card border border-eb-border rounded-card p-3"
          >
            <div class="flex items-center gap-2">
              <!-- Numéro d'ordre -->
              <span
                class="w-6 h-6 rounded-full border text-xs font-bold flex items-center justify-center shrink-0"
                :class="isLocked(dec.id)
                  ? 'bg-eb-green/10 border-eb-green/30 text-eb-green'
                  : 'bg-eb-mid border-eb-border text-eb-cyan'"
              >
                {{ index + 1 }}
              </span>

              <!-- Titre -->
              <p class="text-xs font-semibold text-slate-200 leading-snug flex-1 min-w-0 line-clamp-2">
                {{ dec.title }}
              </p>

              <!-- Actions -->
              <div class="flex flex-col gap-1 shrink-0">
                <button
                  class="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-slate-200 disabled:opacity-25 transition-colors"
                  :disabled="index === 0 || isLocked(dec.id)"
                  :aria-label="t('simulator.move_up')"
                  @click="moveUp(index)"
                >
                  <i class="fa fa-chevron-up text-xs" aria-hidden="true"></i>
                </button>
                <button
                  class="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-slate-200 disabled:opacity-25 transition-colors"
                  :disabled="index === selectedMitigationPolicies.length - 1 || isLocked(dec.id)"
                  :aria-label="t('simulator.move_down')"
                  @click="moveDown(index)"
                >
                  <i class="fa fa-chevron-down text-xs" aria-hidden="true"></i>
                </button>
              </div>

              <!-- Verrou ou bouton retirer -->
              <div class="w-5 h-5 flex items-center justify-center shrink-0">
                <i
                  v-if="isLocked(dec.id)"
                  class="fa fa-lock text-xs text-eb-green/60"
                  :aria-label="t('simulator.lock_aria')"
                  aria-hidden="false"
                ></i>
                <button
                  v-else
                  class="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-red-400 transition-colors"
                  :aria-label="t('simulator.remove_aria')"
                  @click="removeMitigationPolicy(dec.id)"
                >
                  <i class="fa fa-xmark text-xs" aria-hidden="true"></i>
                </button>
              </div>
            </div>

            <!-- Badges adoption + effet -->
            <div class="flex gap-1.5 mt-1.5 pl-8 flex-wrap">
              <span class="text-xs px-1.5 py-0.5 rounded bg-eb-mid border border-eb-border text-slate-400 font-mono">
                {{ t('simulator.adoption_label') }} {{ simulatorAdoptionYears[index] }}
              </span>
              <span class="text-xs px-1.5 py-0.5 rounded bg-eb-cyan/10 border border-eb-cyan/25 text-eb-cyan font-mono">
                → {{ t('simulator.effect_from', { year: simulatorEffectYears[index] }) }}
              </span>
            </div>

            <!-- Mini-stats -->
            <div class="flex gap-2 mt-1 pl-8 text-xs text-slate-500">
              <span class="text-eb-green">−{{ dec.projectedImpact['emissionsReductionGtCO2yr'] }} Gt/an</span>
              <span>·</span>
              <span class="text-eb-cyan">−{{ dec.projectedImpact['tempReductionC2100'] }}°C</span>
            </div>
          </div>
        </TransitionGroup>

        <!-- Note méthodologique -->
        <p v-if="selectedMitigationPolicies.length > 0" class="text-xs text-slate-600 mt-3 leading-relaxed">
          <i class="fa fa-circle-info mr-1" aria-hidden="true"></i>
          {{ t('simulator.additive_note') }}
        </p>
      </CollapsibleSection>

      <!-- ── Projections ───────────────────────────────────────────────────── -->
      <CollapsibleSection class="xl:col-span-5" :title="t('simulator.projections_title')" icon="fa-chart-line" color-class="text-slate-300">

        <SimProjectionCharts />

        <!-- Résumé par décision sélectionnée -->
        <EbCard v-if="selectedMitigationPolicies.length > 0">
          <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">
            {{ t('simulator.contribution_title') }}
          </h3>
          <div class="space-y-2">
            <div
              v-for="dec in selectedMitigationPolicies"
              :key="dec.id"
              class="flex items-center gap-2"
            >
              <div class="flex-1 min-w-0">
                <p class="text-xs text-slate-300 truncate">{{ dec.title }}</p>
              </div>
              <div class="flex gap-3 text-xs shrink-0">
                <span class="text-eb-green font-mono">−{{ dec.projectedImpact['emissionsReductionGtCO2yr'] }} Gt</span>
                <span class="text-eb-cyan font-mono">−{{ dec.projectedImpact['tempReductionC2100'] }}°C</span>
                <span :class="uncertaintyColor(dec.projectedImpact['uncertaintyScore'])" class="font-mono">
                  {{ uncertaintyShort(dec.projectedImpact['uncertaintyScore']) }}
                </span>
              </div>
            </div>

            <!-- Total -->
            <div class="border-t border-eb-border pt-2 flex items-center justify-between">
              <span class="text-xs text-slate-400 font-bold">{{ t('simulator.total_label') }}</span>
              <div class="flex gap-3 text-xs shrink-0">
                <span class="text-eb-green font-mono font-bold">−{{ totalReductionAtHorizon.toFixed(1) }} Gt/an</span>
                <span class="text-eb-cyan font-mono font-bold">
                  −{{ (baselineAtHorizon - tempDecidedAtHorizon).toFixed(2) }}°C vs. baseline
                </span>
              </div>
            </div>
          </div>
        </EbCard>

      </CollapsibleSection>
    </div>

  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useSimulationStore, SIM_LABELS, BASELINE_CO2, BASELINE_TEMP } from '@/store/simulation.store'
import { usePlanetsStore } from '@/store/planets.store'
import CollapsibleSection    from '@/components/layout/CollapsibleSection.vue'
import EbCard                from '@/components/layout/EbCard.vue'
import PolicyNetworkGraph    from '@/components/mitigationPolicies/PolicyNetworkGraph.vue'
import SimProjectionCharts   from '@/components/simulator/SimProjectionCharts.vue'

const { t } = useI18n()
const store = useSimulationStore()
const {
  selectedMitigationPolicies,
  effectiveLockedIds,
  includeGameBaseline,
  simulatorAdoptionYears,
  simulatorEffectYears,
  simCumulativeCo2,
  simCumulativeTemp,
} = storeToRefs(store)

const planetsStore = usePlanetsStore()
const { selectedHorizon } = storeToRefs(planetsStore)

const horizonIndex = computed<number>(() => {
  let last = 0
  for (let i = 0; i < SIM_LABELS.length; i++) {
    if (SIM_LABELS[i] <= selectedHorizon.value) last = i
  }
  return last
})

// Température baseline et scénario décidé à l'année de l'horizon
const baselineAtHorizon     = computed<number>(() => BASELINE_TEMP[horizonIndex.value])
const tempDecidedAtHorizon  = computed<number>(() => simCumulativeTemp.value[horizonIndex.value])

// Réduction annuelle modélisée à l'année de l'horizon (GtCO₂/an vs. baseline)
const totalReductionAtHorizon = computed<number>(() =>
  Math.round((BASELINE_CO2[horizonIndex.value] - simCumulativeCo2.value[horizonIndex.value]) * 10) / 10
)

// CO₂ cumulé évité de 2024 à l'horizon — intégrale trapèze sur les intervalles non-uniformes
const co2CumulativeSaved = computed<number>(() => {
  let total = 0
  for (let i = 0; i < horizonIndex.value; i++) {
    const dI    = BASELINE_CO2[i]   - simCumulativeCo2.value[i]
    const dNext = BASELINE_CO2[i+1] - simCumulativeCo2.value[i+1]
    const years = SIM_LABELS[i+1]   - SIM_LABELS[i]
    total += (dI + dNext) / 2 * years
  }
  return Math.round(total)
})

interface Horizon { value: number; label: string }
const horizons = computed<Horizon[]>(() => [
  { value: 2025, label: t('simulator.horizon_2025') },
  { value: 2040, label: t('simulator.horizon_2040') },
  { value: 2050, label: t('simulator.horizon_2050') },
  { value: 2100, label: t('simulator.horizon_2100') },
])

const { removeMitigationPolicy, moveUp, moveDown, reset, toggleGameBaseline } = store

// ─── Helpers UI ──────────────────────────────────────────────────────────────

function isLocked(id: string): boolean {
  return effectiveLockedIds.value.includes(id)
}

function uncertaintyColor(score: unknown): string {
  const n = Number(score)
  if (n === 1) return 'text-eb-green'
  if (n === 2) return 'text-yellow-400'
  return 'text-orange-400'
}

function uncertaintyShort(score: unknown): string {
  const n = Number(score)
  return ['', 'inc.↓', 'inc.~', 'inc.↑'][n] ?? 'inc.?'
}

// ─── Couleur dynamique température ───────────────────────────────────────────

// Couleur et label basés sur la trajectoire 2100 (objectif Paris = température finale, pas intermédiaire)
const tempDecidedColor = computed<string>(() => {
  const temp2100 = simCumulativeTemp.value[9]
  if (temp2100 <= 2) return 'text-eb-green'
  if (temp2100 <= 3) return 'text-yellow-400'
  return 'text-red-400'
})

const tempGlowClass = computed<string>(() => {
  if (simCumulativeTemp.value[9] <= 2) return 'shadow-[0_0_20px_rgba(0,255,136,0.15)]'
  return ''
})

const tempDecidedLabel = computed<string>(() => {
  const temp2100 = simCumulativeTemp.value[9]
  if (temp2100 <= 1.5) return t('simulator.temp_safe')
  if (temp2100 <= 2)   return t('simulator.temp_ok')
  if (temp2100 <= 3)   return t('simulator.temp_risk')
  return t('simulator.temp_critical')
})

</script>

<style scoped>
/* Animation de la liste séquence */
.seq-enter-active,
.seq-leave-active {
  transition: all 0.2s ease;
}
.seq-enter-from,
.seq-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}
.seq-move {
  transition: transform 0.2s ease;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
