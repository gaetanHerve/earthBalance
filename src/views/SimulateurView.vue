<template>
  <main class="max-w-screen-xl mx-auto px-4 py-6 space-y-6" id="main-content" tabindex="-1">
    <!-- ─── En-tête ─────────────────────────────────────────────────────────── -->
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black text-white mb-1 flex items-center gap-2">
          <i class="fa fa-flask text-eb-cyan" aria-hidden="true"></i>
          Simulateur de Politiques Climatiques
        </h1>
        <p class="text-sm text-slate-400 max-w-2xl leading-relaxed">
          Sélectionnez des politiques dans le catalogue, ordonnez-les selon vos priorités,
          et observez en temps réel leur impact cumulé sur le CO₂ atmosphérique et la température mondiale.
          Les projections sont calculées à partir des modèles d'impact GIEC AR6 (baseline SSP2-4.5).
        </p>
      </div>
      <button
        class="flex items-center gap-2 text-xs px-4 py-2 rounded-full border border-slate-600 text-slate-400 hover:border-red-500/50 hover:text-red-400 transition-all"
        :disabled="selectedMitigationPolicies.length === 0"
        :class="selectedMitigationPolicies.length === 0 ? 'opacity-40 cursor-not-allowed' : ''"
        @click="reset"
      >
        <i class="fa fa-rotate-left" aria-hidden="true"></i>
        Réinitialiser
      </button>
    </div>

    <!-- ─── Bandeau budget climatique ───────────────────────────────────────── -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">

      <EbCard extra-class="text-center !py-3 !px-4">
        <div class="text-xs text-slate-500 mb-1">Baseline 2074 (SSP2-4.5)</div>
        <div class="text-2xl font-black text-red-400">+3,5°C</div>
        <div class="text-xs text-slate-500 mt-0.5">sans action</div>
      </EbCard>

      <EbCard extra-class="text-center !py-3 !px-4" :glow-class="tempGlowClass">
        <div class="text-xs text-slate-500 mb-1">Scénario décidé 2074</div>
        <div class="text-2xl font-black" :class="tempDecidedColor">
          +{{ tempIn2074Decided.toFixed(2) }}°C
        </div>
        <div class="text-xs mt-0.5" :class="tempDecidedColor">
          {{ tempDecidedLabel }}
        </div>
      </EbCard>

      <EbCard extra-class="text-center !py-3 !px-4">
        <div class="text-xs text-slate-500 mb-1">CO₂ évité en 2050</div>
        <div class="text-2xl font-black text-eb-green">
          {{ co2SavedIn2050 > 0 ? '−' : '' }}{{ co2SavedIn2050 }} GtCO₂
        </div>
        <div class="text-xs text-slate-500 mt-0.5">vs. baseline annuel</div>
      </EbCard>

      <EbCard extra-class="text-center !py-3 !px-4">
        <div class="text-xs text-slate-500 mb-1">Réduction totale déclarée</div>
        <div class="text-2xl font-black text-eb-cyan">
          {{ totalAnnualReduction.toFixed(1) }} Gt/an
        </div>
        <div class="text-xs text-slate-500 mt-0.5">somme des politiques</div>
      </EbCard>

    </div>

    <!-- ─── Corps principal : 3 colonnes ───────────────────────────────────── -->
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-4">

      <!-- ── Catalogue ────────────────────────────────────────────────────── -->
      <CollapsibleSection class="xl:col-span-4" title="Catalogue de politiques" icon="fa-list-check" color-class="text-slate-300">

        <div class="space-y-2">
          <div
            v-for="dec in catalogue"
            :key="dec.id"
            class="rounded-card border p-3 transition-all select-none"
            :class="[
              isLocked(dec.id)
                ? 'bg-eb-green/5 border-eb-green/30 cursor-default'
                : isSelected(dec.id)
                  ? 'bg-eb-cyan/10 border-eb-cyan/40 cursor-pointer'
                  : 'bg-eb-card border-eb-border hover:border-eb-cyan/30 hover:bg-eb-card/80 cursor-pointer',
            ]"
            :role="isLocked(dec.id) ? 'listitem' : 'button'"
            :aria-pressed="isLocked(dec.id) ? undefined : isSelected(dec.id)"
            :tabindex="isLocked(dec.id) ? -1 : 0"
            @click="toggle(dec.id)"
            @keydown.enter.prevent="toggle(dec.id)"
            @keydown.space.prevent="toggle(dec.id)"
          >
            <div class="flex items-start justify-between gap-2">
              <!-- Info décision -->
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1.5 mb-1 flex-wrap">
                  <span
                    class="text-xs px-1.5 py-0.5 rounded font-bold uppercase tracking-wide"
                    :class="dec.status === 'validated'
                      ? 'bg-green-900/40 text-eb-green border border-green-700/30'
                      : 'bg-cyan-900/30 text-eb-cyan border border-cyan-700/30'"
                  >
                    {{ dec.status === 'validated' ? '✓ Retenue' : '● Active' }}
                  </span>
                  <span class="text-xs text-slate-500">#{{ dec.number }}</span>
                </div>
                <p class="text-xs font-semibold text-slate-200 leading-snug line-clamp-2">
                  {{ dec.title }}
                </p>
                <div class="flex gap-3 mt-1.5 text-xs text-slate-400">
                  <span class="text-eb-green font-bold">
                    −{{ dec.projectedImpact['emissionsReductionGtCO2yr'] }} GtCO₂/an
                  </span>
                  <span class="text-eb-cyan font-bold">
                    −{{ dec.projectedImpact['tempReductionC2100'] }}°C (2100)
                  </span>
                  <span :class="uncertaintyColor(dec.projectedImpact['uncertaintyScore'])">
                    {{ uncertaintyLabel(dec.projectedImpact['uncertaintyScore']) }}
                  </span>
                </div>
                <RouterLink
                  :to="`/mitigation-policies/${dec.id}`"
                  class="inline-flex items-center gap-1 mt-1.5 text-xs text-slate-600 hover:text-eb-cyan transition-colors focus-visible:ring-2 focus-visible:ring-eb-cyan rounded outline-none"
                  @click.stop
                >
                  <i class="fa fa-circle-info" aria-hidden="true"></i>Détail
                </RouterLink>
              </div>

              <!-- Toggle / verrou -->
              <div
                class="shrink-0 w-7 h-7 rounded-full border flex items-center justify-center text-xs"
                :class="isLocked(dec.id)
                  ? 'border-eb-green/40 bg-eb-green/10 text-eb-green'
                  : isSelected(dec.id)
                    ? 'border-eb-cyan bg-eb-cyan/20 text-eb-cyan'
                    : 'border-slate-600 text-slate-400'"
                :aria-label="isLocked(dec.id) ? 'Politique retenue — non retirable' : isSelected(dec.id) ? 'Retirer' : 'Ajouter'"
              >
                <i
                  :class="['fa', isLocked(dec.id) ? 'fa-lock' : isSelected(dec.id) ? 'fa-minus' : 'fa-plus']"
                  aria-hidden="true"
                ></i>
              </div>
            </div>
          </div>

          <p v-if="catalogue.length === 0" class="text-xs text-slate-500 text-center py-4">
            Aucune politique disponible
          </p>
        </div>
      </CollapsibleSection>

      <!-- ── Séquence ─────────────────────────────────────────────────────── -->
      <CollapsibleSection class="xl:col-span-3" title="Séquence choisie" icon="fa-arrow-down-1-9" color-class="text-slate-300">

        <!-- État vide -->
        <div
          v-if="selectedMitigationPolicies.length === 0"
          class="border border-dashed border-eb-border rounded-card p-6 text-center text-slate-500 text-xs"
        >
          <i class="fa fa-hand-pointer text-2xl mb-2 block opacity-30" aria-hidden="true"></i>
          Cliquez sur une politique du catalogue pour l'ajouter à la séquence.
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
                  :disabled="index === 0"
                  aria-label="Monter"
                  @click="moveUp(index)"
                >
                  <i class="fa fa-chevron-up text-xs" aria-hidden="true"></i>
                </button>
                <button
                  class="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-slate-200 disabled:opacity-25 transition-colors"
                  :disabled="index === selectedMitigationPolicies.length - 1"
                  aria-label="Descendre"
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
                  aria-label="Politique retenue — non retirable"
                  aria-hidden="false"
                ></i>
                <button
                  v-else
                  class="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-red-400 transition-colors"
                  aria-label="Retirer"
                  @click="removeMitigationPolicy(dec.id)"
                >
                  <i class="fa fa-xmark text-xs" aria-hidden="true"></i>
                </button>
              </div>
            </div>

            <!-- Mini-stats -->
            <div class="flex gap-2 mt-1.5 pl-8 text-xs text-slate-500">
              <span class="text-eb-green">−{{ dec.projectedImpact['emissionsReductionGtCO2yr'] }} Gt/an</span>
              <span>·</span>
              <span class="text-eb-cyan">−{{ dec.projectedImpact['tempReductionC2100'] }}°C</span>
              <span>·</span>
              <span>plein effet {{ dec.projectedImpact['fullEffectYear'] }}</span>
            </div>
          </div>
        </TransitionGroup>

        <!-- Note méthodologique -->
        <p v-if="selectedMitigationPolicies.length > 0" class="text-xs text-slate-600 mt-3 leading-relaxed">
          <i class="fa fa-circle-info mr-1" aria-hidden="true"></i>
          Cumul additif — interactions inter-politiques non modélisées dans ce POC.
          Les synergies (ex. charbon + ENR) ou antagonismes (ex. gaz de transition) peuvent
          modifier les projections de ±15 à 40%.
        </p>
      </CollapsibleSection>

      <!-- ── Projections ───────────────────────────────────────────────────── -->
      <CollapsibleSection class="xl:col-span-5 space-y-4" title="Projections cumulées" icon="fa-chart-line" color-class="text-slate-300">

        <!-- Graphique CO₂ -->
        <EbCard>
          <div class="flex items-center justify-between mb-3">
            <div>
              <h3 class="text-sm font-bold text-slate-200">Émissions CO₂ mondiales</h3>
              <p class="text-xs text-slate-500">GtCO₂/an — delta cumulé vs. SSP2-4.5</p>
            </div>
            <div class="flex gap-3 text-xs">
              <span class="flex items-center gap-1"><span class="w-3 h-0.5 bg-slate-500 inline-block rounded"></span>Baseline</span>
              <span class="flex items-center gap-1"><span class="w-3 h-0.5 bg-green-400 inline-block rounded"></span>Décidé</span>
              <span class="flex items-center gap-1"><span class="w-3 h-0.5 bg-red-400 inline-block rounded"></span>Pessimiste</span>
            </div>
          </div>
          <LineChart
            canvas-id="sim-co2-chart"
            :labels="SIM_LABELS"
            :datasets="co2Datasets"
            :height="180"
            :y-min="15"
            :y-max="70"
            aria-label="Projections émissions CO₂ cumulées"
          />
        </EbCard>

        <!-- Graphique Température -->
        <EbCard>
          <div class="flex items-center justify-between mb-3">
            <div>
              <h3 class="text-sm font-bold text-slate-200">Température mondiale (anomalie)</h3>
              <p class="text-xs text-slate-500">°C au-dessus du niveau préindustriel</p>
            </div>
            <div class="flex gap-3 text-xs">
              <span class="flex items-center gap-1"><span class="w-3 h-0.5 bg-slate-500 inline-block rounded"></span>Baseline</span>
              <span class="flex items-center gap-1"><span class="w-3 h-0.5 bg-green-400 inline-block rounded"></span>Décidé</span>
              <span class="flex items-center gap-1"><span class="w-3 h-0.5 bg-red-400 inline-block rounded"></span>Pessimiste</span>
            </div>
          </div>
          <LineChart
            canvas-id="sim-temp-chart"
            :labels="SIM_LABELS"
            :datasets="tempDatasets"
            :height="180"
            :y-min="1.2"
            :y-max="4.0"
            aria-label="Projections température mondiale cumulées"
          />
          <!-- Légende seuils -->
          <div class="flex gap-4 mt-2 text-xs text-slate-500">
            <span class="flex items-center gap-1">
              <span class="w-3 h-0.5 bg-yellow-400 inline-block rounded"></span>
              Seuil +1,5°C (Accord de Paris)
            </span>
            <span class="flex items-center gap-1">
              <span class="w-3 h-0.5 bg-orange-500 inline-block rounded"></span>
              Seuil +2°C
            </span>
          </div>
        </EbCard>

        <!-- Résumé par décision sélectionnée -->
        <EbCard v-if="selectedMitigationPolicies.length > 0">
          <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">
            Contribution individuelle (plein effet)
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
              <span class="text-xs text-slate-400 font-bold">Total cumulé</span>
              <div class="flex gap-3 text-xs shrink-0">
                <span class="text-eb-green font-mono font-bold">−{{ totalAnnualReduction.toFixed(1) }} Gt/an</span>
                <span class="text-eb-cyan font-mono font-bold">
                  −{{ (3.5 - tempIn2074Decided).toFixed(2) }}°C vs. baseline
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
import { storeToRefs } from 'pinia'
import { useSimulationStore, SIM_LABELS, BASELINE_CO2, BASELINE_TEMP } from '@/store/simulation.store'

import CollapsibleSection from '@/components/layout/CollapsibleSection.vue'
import EbCard             from '@/components/layout/EbCard.vue'
import LineChart    from '@/components/charts/LineChart.vue'

import type { ChartDataset } from '@/types/index'

const store = useSimulationStore()
const {
  catalogue,
  selectedMitigationPolicies,
  selectedIds,
  lockedIds,
  cumulativeCo2,
  cumulativeCo2Pessimist,
  cumulativeTemp,
  cumulativeTempPessimist,
  tempIn2074Decided,
  co2SavedIn2050,
  totalAnnualReduction,
} = storeToRefs(store)

const { addMitigationPolicy, removeMitigationPolicy, moveUp, moveDown, reset } = store

// ─── Helpers UI ──────────────────────────────────────────────────────────────

function isSelected(id: string): boolean {
  return selectedIds.value.includes(id)
}

function isLocked(id: string): boolean {
  return lockedIds.value.includes(id)
}

function toggle(id: string): void {
  if (isLocked(id)) return
  isSelected(id) ? removeMitigationPolicy(id) : addMitigationPolicy(id)
}

function uncertaintyColor(score: unknown): string {
  const n = Number(score)
  if (n === 1) return 'text-eb-green'
  if (n === 2) return 'text-yellow-400'
  return 'text-orange-400'
}

function uncertaintyLabel(score: unknown): string {
  const n = Number(score)
  if (n === 1) return 'incert. faible'
  if (n === 2) return 'incert. moyenne'
  return 'incert. haute'
}

function uncertaintyShort(score: unknown): string {
  const n = Number(score)
  return ['', 'inc.↓', 'inc.~', 'inc.↑'][n] ?? 'inc.?'
}

// ─── Couleur dynamique température ───────────────────────────────────────────

const tempDecidedColor = computed<string>(() => {
  const t = tempIn2074Decided.value
  if (t <= 2)   return 'text-eb-green'
  if (t <= 3)   return 'text-yellow-400'
  return 'text-red-400'
})

const tempGlowClass = computed<string>(() => {
  const t = tempIn2074Decided.value
  if (t <= 2) return 'shadow-[0_0_20px_rgba(0,255,136,0.15)]'
  return ''
})

const tempDecidedLabel = computed<string>(() => {
  const t = tempIn2074Decided.value
  if (t <= 1.5) return '≤ 1,5°C — Accord de Paris'
  if (t <= 2)   return '≤ 2°C — Objectif Paris'
  if (t <= 3)   return 'Trajectoire à haut risque'
  return 'Trajectoire critique'
})

// ─── Datasets graphiques ─────────────────────────────────────────────────────

// Ligne plate pour les seuils de température
function flatLine(val: number): number[] {
  return SIM_LABELS.map(() => val)
}

const co2Datasets = computed<ChartDataset[]>(() => [
  {
    label: 'Baseline SSP2-4.5',
    data: BASELINE_CO2,
    borderColor: '#64748b',
    backgroundColor: 'rgba(100,116,139,0.05)',
    fill: false,
    tension: 0.4,
    pointRadius: 2,
  },
  {
    label: 'Scénario décidé',
    data: cumulativeCo2.value,
    borderColor: '#00ff88',
    backgroundColor: 'rgba(0,255,136,0.08)',
    fill: false,
    tension: 0.4,
    pointRadius: 3,
  },
  {
    label: 'Scénario pessimiste',
    data: cumulativeCo2Pessimist.value,
    borderColor: '#f87171',
    backgroundColor: 'rgba(248,113,113,0.05)',
    fill: false,
    tension: 0.4,
    pointRadius: 2,
  },
])

const tempDatasets = computed<ChartDataset[]>(() => [
  {
    label: 'Baseline SSP2-4.5',
    data: BASELINE_TEMP,
    borderColor: '#64748b',
    backgroundColor: 'transparent',
    fill: false,
    tension: 0.4,
    pointRadius: 2,
  },
  {
    label: 'Scénario décidé',
    data: cumulativeTemp.value,
    borderColor: '#00ff88',
    backgroundColor: 'rgba(0,255,136,0.08)',
    fill: false,
    tension: 0.4,
    pointRadius: 3,
  },
  {
    label: 'Scénario pessimiste',
    data: cumulativeTempPessimist.value,
    borderColor: '#f87171',
    backgroundColor: 'transparent',
    fill: false,
    tension: 0.4,
    pointRadius: 2,
  },
  {
    label: '+1,5°C (Paris)',
    data: flatLine(1.5),
    borderColor: '#facc15',
    backgroundColor: 'transparent',
    fill: false,
    tension: 0,
    pointRadius: 0,
  },
  {
    label: '+2°C',
    data: flatLine(2),
    borderColor: '#f97316',
    backgroundColor: 'transparent',
    fill: false,
    tension: 0,
    pointRadius: 0,
  },
])
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
